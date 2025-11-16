import { BadRequestException, Injectable } from '@nestjs/common';
import { Message } from '../../../schemas';
import { constants } from '../../../common/constants/error.constant';
import { IMessageInterface } from '../../../schemas/Message.schema';

@Injectable()
export class MessageService {
  constructor() {}
  async get_messages() {}

  async get_message_detail(message_id: string): Promise<IMessageInterface> {
    const is_message = await Message.findById(message_id);
    if (!is_message) {
      throw new BadRequestException(constants.MESSAGE.NOT_FOUND);
    }
    return is_message;
  }

  async get_message_by_condition(condition: any): Promise<IMessageInterface[]> {
    const is_message = await Message.find(condition);
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
