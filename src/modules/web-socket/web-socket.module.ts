import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessageModule } from '../messages/message.module';

@Module({
  imports: [MessageModule],
  providers: [ChatGateway],
})
export class WebSocketModule {}
