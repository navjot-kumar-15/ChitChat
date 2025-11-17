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
import { ChatService } from '../services/chat.service';
import { constants } from '../../../common/constants/error.constant';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async get_chat_lists(@Query() query: any) {
    try {
      const { data, total } = await this.chatService.chat_lists(query);
      return {
        success: true,
        message: constants.CHAT.GET,
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
  async get_chat_details(@Param() params: Record<string, any>) {
    try {
      const { id } = params;
      const result = await this.chatService.chat_details(id);
      return {
        success: true,
        message: constants.CHAT.GET,
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

  @Post()
  async create_chat(@Body() body: any) {
    try {
      const result = await this.chatService.chat_create(body);
      return {
        success: true,
        message: constants.CHAT.CREATED,
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
  async uddate_chat(@Param() params: Record<string, any>, @Body() body: any) {
    try {
      const { id } = params;
      const result = await this.chatService.chat_udpate(id, body);
      return {
        success: true,
        message: constants.CHAT.UPDATED,
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
  async delete_chat(@Param() params: Record<string, any>) {
    try {
      const { id } = params;
      const result = await this.chatService.chat_delete(id);
      return {
        success: true,
        message: constants.CHAT.DELETED,
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
