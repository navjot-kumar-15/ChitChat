import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class MongooseHelper {
  constructor() {}

  convert_to_object_id(id: any): Types.ObjectId | null {
    // Case 1: Already a valid ObjectId instance
    if (id instanceof Types.ObjectId) {
      return id;
    }

    // Case 2: String (most common from query params, JWT, etc.)
    if (typeof id === 'string') {
      // Optional: trim whitespace
      id = id.trim();

      // Fast check: must be 24 chars hex
      if (id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
        return new Types.ObjectId(id);
      }

      // Fallback to mongoose's built-in validator (slower but 100% safe)
      if (Types.ObjectId.isValid(id)) {
        return new Types.ObjectId(id);
      }
    }

    // Anything else → invalid
    return null;
  }
}
