import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  Ack,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');
  private users = new Map<string, any>();

  afterInit() {
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    this.logger.verbose(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    const socketId = client.id;

    // Find which userId has this socketId
    for (const [userId, storedSocketId] of this.users.entries()) {
      if (storedSocketId === socketId) {
        this.users.delete(userId); // ← delete by userId (key)
        this.logger.log(
          `Disconnected & removed: userId=${userId}, socket=${socketId}`,
        );
        break;
      }
    }
  }

  // ────────────────────────────── Events ──────────────────────────────

  @SubscribeMessage('users')
  async handleAllUsers(
    @ConnectedSocket() client: Socket,
    @Ack() ack: (res: any) => void,
  ) {
    console.log(this.users);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { roomId: string; userId: string; username: string },
  ) {
    client.join(payload.roomId);
    let userId = payload.userId;

    this.users.set(userId, client.id);

    // Notify everyone in room (including sender)
    this.server.to(payload.roomId).emit('userJoined', {
      userId: payload.userId,
      username: payload.username,
      message: `${payload.username} joined the room`,
    });

    this.logger.log(`${payload.username} joined room: ${payload.roomId}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string },
  ) {
    client.leave(payload.roomId);

    const username = (client.data.user as any)?.username || 'Unknown';

    this.server.to(payload.roomId).emit('userLeft', {
      username,
      message: `${username} left the room`,
    });

    this.logger.log(`${username} manually left room: ${payload.roomId}`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody()
    payload: {
      roomId: string;
      message: string;
      userId: string;
      username: string;
    },
  ) {
    const newMessage = {
      id: Date.now().toString() + Math.random(), // better: use UUID in prod
      text: payload.message,
      userId: payload.userId,
      username: payload.username,
      timestamp: new Date(),
    };

    // This sends to ALL in room including sender (correct behavior)
    this.server.to(payload.roomId).emit('newMessage', newMessage);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { roomId: string; username: string; isTyping: boolean },
  ) {
    // Broadcast to room except sender
    client.to(payload.roomId).emit('userTyping', {
      username: payload.username,
      isTyping: payload.isTyping,
    });
  }
}
