import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class MongooseHelper {
  constructor() {}

  convert_to_object_id(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      return new Types.ObjectId(id);
    }
    return id;
  }
}
