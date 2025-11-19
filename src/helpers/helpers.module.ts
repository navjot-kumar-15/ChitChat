import { Global, Module } from '@nestjs/common';
import { BcryptHelper } from './bcrypt.helper';
import { MongooseHelper } from './mongoose.helper';
import { JwtHelperService } from './jwt.helper';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE_TIME as any },
    }),
  ],
  providers: [BcryptHelper, MongooseHelper, JwtHelperService],
  exports: [BcryptHelper, MongooseHelper, JwtHelperService],
})
export class HelpersModule {}
