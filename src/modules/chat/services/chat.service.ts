import { BadRequestException, Injectable } from '@nestjs/common';
import { Chat, ChatMember } from '../../../schemas';
import { isContext } from 'vm';
import { constants } from '../../../common/constants/error.constant';
import { IChatInterface } from '../../../schemas/Chat.schema';
import { MongooseHelper } from '../../../helpers/mongoose.helper';
import { ChatMemberService } from '../../chat-member/services/chat-member.service';

@Injectable()
export class ChatService {
  constructor(
    private mongooseHelper: MongooseHelper,
    private chatMemberService: ChatMemberService,
  ) {}

  async chat_lists(
    query: any,
  ): Promise<{ data: IChatInterface[]; total: number; pages: number }> {
    let { chat_id, user_id, page, limit, sort, created_by } = query;
    let filters: Record<string, any> = {};

    if (chat_id) {
      filters._id = this.mongooseHelper.convert_to_object_id(chat_id);
    }

    if (user_id) {
      filters.participants = {
        $in: [this.mongooseHelper.convert_to_object_id(user_id)],
      };
    }

    if (created_by) {
      filters.created_by = this.mongooseHelper.convert_to_object_id(created_by);
    }

    let sort_query: Record<string, any> = {};
    if (sort) {
      sort_query.createdAt = sort;
    } else {
      sort_query.createdAt = -1;
    }

    let pipeline: any = [
      {
        $match: filters,
      },
    ];

    pipeline.push({
      $facet: {
        users: [
          { $sort: sort_query },
          ...(page && limit
            ? [{ $skip: (+page - 1) * limit }, { $limit: limit }]
            : []),

          { $project: { password: 0, __v: 0 } },
        ],
        totalCount: [{ $count: 'total' }],
      },
    });

    const result = await Chat.aggregate(pipeline).exec();

    const users = result[0]?.users || [];
    const total = result[0]?.totalCount[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);
    return {
      data: users,
      total,
      pages: totalPages,
    };
  }
  async chat_details(chat_id: any): Promise<IChatInterface> {
    let is_chat = await Chat.findById(chat_id);
    if (!is_chat) throw new BadRequestException(constants.CHAT.NOT_FOUND);
    if (is_chat.chat_type === 'group') {
      const members = await this.chatMemberService.chat_member_get_by_condition(
        { chat_id },
        'chat_id user_id role',
      );
      (is_chat as any)._doc.chat_members = members || [];
    } else {
      (is_chat as any)._doc.chat_members = [];
    }
    return is_chat;
  }

  async chat_get_by_condition(
    condition: any,
    select: string = '',
  ): Promise<IChatInterface[] | IChatInterface> {
    const is_chat = await Chat.find(condition).select(select);
    return is_chat;
  }
  async chat_create(body: any): Promise<IChatInterface> {
    const { chat_type, participants } = body;
    const is_chat = await Chat.create(body);
    if (chat_type === 'group') {
      const members = participants.map((user) => ({
        chat_id: is_chat._id,
        user_id: user,
        role:
          is_chat.created_by?.toString() === user.toString() ? 'admin' : 'user',
      }));

      await this.chatMemberService.chat_member_create(members);
    }
    return is_chat;
  }
  async chat_udpate(
    chat_id: string,
    body: any,
  ): Promise<IChatInterface | null> {
    const is_chat = await this.chat_details(chat_id);
    let updated_chat = await Chat.findByIdAndUpdate(chat_id, body, {
      new: true,
    });
    return updated_chat;
  }
  async chat_delete(chat_id: string): Promise<IChatInterface> {
    let is_chat = await this.chat_details(chat_id);
    is_chat.is_deleted = true;
    await is_chat.save();
    return is_chat;
  }
}
