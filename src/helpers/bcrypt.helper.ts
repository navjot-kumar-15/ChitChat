import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptHelper {
  constructor() {}

  async hash_pass(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async compare_pass(password: string, hashPassword: string): Promise<Boolean> {
    const is_match = await bcrypt.compare(password, hashPassword);
    return is_match;
  }
}
