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
    if (!is_message) throw new BadRequestException(constants.MESSAGE.NOT_FOUND);
    return is_message;
  }
  async get_message_by_condition() {}
  async create_message() {}
  async message_update() {}
  async message_delete() {}
}
