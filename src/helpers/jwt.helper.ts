import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import envConfig from '../common/config/env.config';

@Injectable()
export class JwtHelperService {
  constructor(private jwtService: JwtService) {}

  async generate_token(payload: any) {
    let config = envConfig();
    let token = await this.jwtService.signAsync(payload, {
      secret: config.jwt.secret,
      expiresIn: config.jwt.expire_time || '1h',
    });

    return token;
  }

  async verify_token(token: any) {
    let config = envConfig();
    let is_verified_token = await this.jwtService.verifyAsync(token, {
      secret: config.jwt.secret,
    });
    return is_verified_token;
  }
}
