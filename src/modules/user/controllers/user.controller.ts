import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { constants } from '../../../common/constants/error.constant';
import { AuthGuard } from '../../../common/guards/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async get_users(@Query() query: any) {
    try {
      const { data, total } = await this.userService.get_users(query);
      return {
        success: true,
        statusCode: 200,
        message: constants.USER.GET,
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
  async get_user_details(@Param('id') id: string) {
    try {
      const result = await this.userService.get_user_details(id);
      return {
        success: true,
        message: constants.USER.GET,
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
  async create_user(@Body() body: any) {
    try {
      const result = await this.userService.create_user(body);
      return {
        success: true,
        message: constants.USER.CREATED,
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
  async update_user(@Param('id') id: string, @Body() body: any) {
    try {
      const result = await this.userService.update_user(id, body);
      return {
        success: true,
        message: constants.USER.UPDATED,
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
  async delete_user(@Param('id') id: string) {
    try {
      const result = await this.userService.delete_user(id);
      return {
        success: true,
        message: constants.USER.DELETED,
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
