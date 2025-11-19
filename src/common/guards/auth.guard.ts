import {
  BadGatewayException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtHelperService } from '../../helpers/jwt.helper';
import { User } from '../../schemas';
import { constants } from '../constants/error.constant';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtHelperService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const decode_token = await this.jwtService.verify_token(token);
      const is_user = await User.findById(decode_token.id).select('-password');
      if (!is_user) throw new BadGatewayException(constants.USER.NOT_FOUND);
      request['user'] = is_user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
    return true;
  }

  private extractTokenFromHeader(
    request: Request,
  ): string | string[] | undefined {
    const header_token = request.headers?.token;
    const authorization_token = request.headers.authorization?.split(' ')[1];
    let final_token = header_token ? header_token : authorization_token;
    return final_token;
  }
}
