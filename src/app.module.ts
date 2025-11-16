import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './common/config/env.config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { HelpersModule } from './helpers/helpers.module';
import { ChatModule } from './modules/chat/chat.module';
import { ChatMemberModule } from './modules/chat-member/chat-member.module';
import { WebSocketModule } from './modules/web-socket/web-socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DatabaseModule,
    HelpersModule,
    AuthModule,
    UserModule,
    ChatModule,
    ChatMemberModule,
    WebSocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
