import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessageModule } from '../messages/message.module';
import { UserModule } from '../user/user.module';
import { HelpersModule } from '../../helpers/helpers.module';

@Module({
  imports: [MessageModule, UserModule, HelpersModule],
  providers: [ChatGateway],
})
export class WebSocketModule {}
