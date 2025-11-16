import { BadRequestException, Injectable } from '@nestjs/common';
import { Chat } from '../../../schemas';
import { isContext } from 'vm';
import { constants } from '../../../common/constants/error.constant';
import { IChatInterface } from '../../../schemas/Chat.schema';
import { MongooseHelper } from '../../../helpers/mongoose.helper';

@Injectable()
export class ChatService {
  constructor(private mongooseHelper: MongooseHelper) {}

  async chat_lists(
    query: any,
  ): Promise<{ data: IChatInterface[]; total: number; pages: number }> {
    let { chat_id, page, limit, sort, created_by } = query;
    let filters: Record<string, any> = {};

    if (chat_id) {
      filters._id = this.mongooseHelper.convert_to_object_id(chat_id);
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
    const is_chat = await Chat.findById(chat_id);
    if (!is_chat) throw new BadRequestException(constants.CHAT.NOT_FOUND);
    return is_chat;
  }
  async chat_get_by_condition(
    condition: any,
  ): Promise<IChatInterface[] | IChatInterface> {
    const is_chat = await Chat.find(condition);
    return is_chat;
  }
  async chat_create(body: any): Promise<IChatInterface> {
    const is_chat = await Chat.create(body);
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
