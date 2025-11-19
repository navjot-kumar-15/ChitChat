import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { constants } from '../../../common/constants/error.constant';

@Controller('auths')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register_user(@Body() body: any) {
    try {
      const result = await this.authService.register_user(body);
      return {
        success: true,
        statusCode: 200,
        message: constants.AUTH.REGISTER,
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

  @Post('login')
  async login_user(@Body() body: any) {
    try {
      const result = await this.authService.login_user(body);
      return {
        success: true,
        statusCode: 200,
        message: constants.AUTH.LOGGED_IN,
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
