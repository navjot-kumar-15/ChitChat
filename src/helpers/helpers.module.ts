import { Global, Module } from '@nestjs/common';
import { BcryptHelper } from './bcrypt.helper';
import { MongooseHelper } from './mongoose.helper';

@Global()
@Module({
  imports: [],
  providers: [BcryptHelper, MongooseHelper],
  exports: [BcryptHelper, MongooseHelper],
})
export class HelpersModule {}
