import { BadRequestException, Injectable } from '@nestjs/common';
import { Message } from '../../../schemas';
import { constants } from '../../../common/constants/error.constant';
import { IMessageInterface } from '../../../schemas/Message.schema';
import { MongooseHelper } from '../../../helpers/mongoose.helper';

@Injectable()
export class MessageService {
  constructor(private readonly mongooseHelper: MongooseHelper) {}
  async get_messages(
    query: any,
  ): Promise<{ data: IMessageInterface; total: number; pages: number }> {
    let { chat_id, user_id, message_id, page, limit, sort, created_by } = query;
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
    if (message_id) {
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

    const result = await Message.aggregate(pipeline).exec();

    const users = result[0]?.users || [];
    const total = result[0]?.totalCount[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);
    return {
      data: users,
      total,
      pages: totalPages,
    };
  }

  async get_message_detail(message_id: string): Promise<IMessageInterface> {
    const is_message = await Message.findById(message_id);
    if (!is_message) {
      throw new BadRequestException(constants.MESSAGE.NOT_FOUND);
    }
    return is_message;
  }

  async get_message_by_condition(
    condition: any,
    select: string = '',
  ): Promise<IMessageInterface[]> {
    const is_message = await Message.find(condition).select(select);
    return is_message;
  }

  async create_message(body: any): Promise<IMessageInterface> {
    const is_message = await Message.create(body);
    return is_message;
  }

  async message_update(
    message_id: string,
    body: any,
  ): Promise<IMessageInterface | null | undefined> {
    let is_message = await Message.findByIdAndUpdate(message_id, body, {
      new: true,
    });
    return is_message;
  }
  async message_delete(message_id: string): Promise<IMessageInterface> {
    let is_message = await this.get_message_detail(message_id);
    is_message.is_deleted = true;
    await is_message.save();
    return is_message;
  }
}
