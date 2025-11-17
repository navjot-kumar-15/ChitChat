import { BadRequestException, Injectable } from '@nestjs/common';
import { ChatMember } from '../../../schemas';
import { constants } from '../../../common/constants/error.constant';
import { IChatMemberInterface } from '../../../schemas/Chat-Member.schema';

@Injectable()
export class ChatMemberService {
  constructor() {}
  async chat_member_lists() {}
  async chat_member_details(
    chat_member_id: string,
  ): Promise<IChatMemberInterface> {
    const is_chat_member = await ChatMember.findById(chat_member_id);
    if (!is_chat_member)
      throw new BadRequestException(constants.CHAT_MEMBER.NOT_FOUND);
    return is_chat_member;
  }
  async chat_member_get_by_condition(
    condition: any,
    select: string = '',
  ): Promise<IChatMemberInterface[]> {
    const is_chat_member = await ChatMember.find(condition).select(select);
    return is_chat_member;
  }
  async chat_member_create(body: any): Promise<IChatMemberInterface> {
    let new_chat = await ChatMember.create(body);
    return new_chat;
  }
  async chat_member_update(chat_member_id: string, body: any) {
    const is_chat_member = await this.chat_member_details(chat_member_id);
    const update_chat_member = await ChatMember.findByIdAndUpdate(
      chat_member_id,
      body,
      { new: true },
    );
    return update_chat_member;
  }
  async chat_member_delete() {}
}
