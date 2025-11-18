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
import { Message, User } from '../../schemas';
import { MessageService } from '../messages/services/message.service';
import { UserService } from '../user/services/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: 'chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');
  private users = new Map<string, any>();

  constructor(
    private readonly messageService: MessageService,
    private userService: UserService,
  ) {}

  afterInit() {
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    this.logger.verbose(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    const socketId = client.id;
    console.log('users: ', this.users);

    // Find which userId has this socketId
    for (const [userId, storedSocketId] of this.users.entries()) {
      if (storedSocketId === socketId) {
        this.users.delete(userId);
        this.logger.log(
          `Disconnected & removed: userId=${userId}, socket=${socketId}`,
        );
        break;
      }
    }
  }

  // ────────────────────────────── Events ──────────────────────────────

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { chat_id: string; user_id: string },
  ) {
    client.join(payload.chat_id);
    let userId = payload.user_id;

    this.users.set(userId, client.id);

    // Notify everyone in room (including sender)
    this.server
      .to(payload.chat_id)
      .except(client.id)
      .emit('join-room', {
        user_id: payload.user_id,
        message: `${payload.user_id} joined the room`,
      });

    this.logger.log(`${payload.user_id} joined room: ${payload.chat_id}`);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chat_id: string; user_id: string },
  ) {
    const { user_id } = payload;
    client.leave(payload.chat_id);

    this.server.to(payload.chat_id).emit('userLeft', {
      user_id,
      message: `${user_id} left the room`,
    });

    this.logger.log(`${user_id} manually left room: ${payload.chat_id}`);
  }

  @SubscribeMessage('send-message')
  async handleMessage(
    @MessageBody()
    payload: {
      chat_id: string;
      content: string;
      sender_id: string;
    },
  ) {
    const new_message = await Message.create(payload);

    // This sends to ALL in room including sender (correct behavior)
    this.server.to(payload.chat_id).emit('send-message', payload);
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { chat_id: string; user_id: string; is_typing: boolean },
  ) {
    const { user_id } = payload;
    const is_user =
      await this.userService.get_user_by_id_or_throw_error(user_id);
    // Broadcast to room except sender
    client.to(payload.chat_id).except(client.id).emit('typing', {
      username: is_user.username,
      is_typing: payload.is_typing,
    });
  }
}
