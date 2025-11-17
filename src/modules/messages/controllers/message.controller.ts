import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { constants } from '../../../common/constants/error.constant';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('')
  async get_message_lists(@Query() query: any) {
    try {
      const { data, total } = await this.messageService.get_messages(query);
      return {
        success: true,
        statusCode: 200,
        message: constants.MESSAGE.GET,
        data,
        total,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 400,
        message: error.message,
      };
    }
  }

  @Get(':id')
  async get_message_detail(@Param() params: Record<string, any>) {
    try {
      const { id } = params;
      const result = await this.messageService.get_messages(id);
      return {
        success: true,
        statusCode: 200,
        message: constants.MESSAGE.GET,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 400,
        message: error.message,
      };
    }
  }

  @Post('')
  async create_message(@Body() body: any) {
    try {
      const result = await this.messageService.create_message(body);
      return {
        success: true,
        statusCode: 200,
        message: constants.MESSAGE.CREATED,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 400,
        message: error.message,
      };
    }
  }

  @Patch(':id')
  async update_message(
    @Param() params: Record<string, any>,
    @Body() body: any,
  ) {
    try {
      const { id } = params;
      const result = await this.messageService.message_update(id, body);
      return {
        success: true,
        statusCode: 200,
        message: constants.MESSAGE.UPDATED,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 400,
        message: error.message,
      };
    }
  }

  @Delete(':id')
  async delete_message(@Param() params: Record<string, any>) {
    try {
      const { id } = params;
      const result = await this.messageService.message_delete(id);
      return {
        success: true,
        statusCode: 200,
        message: constants.MESSAGE.DELETED,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 400,
        message: error.message,
      };
    }
  }
}
