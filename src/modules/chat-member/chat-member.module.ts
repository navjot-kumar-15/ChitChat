import { Module } from '@nestjs/common';
import { ChatMemberController } from './controllers/chat-member.controller';
import { ChatMemberService } from './services/chat-member.service';

@Module({
  controllers: [ChatMemberController],
  providers: [ChatMemberService],
  exports: [ChatMemberService],
})
export class ChatMemberModule {}
