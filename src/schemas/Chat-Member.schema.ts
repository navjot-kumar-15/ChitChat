import mongoose, { Document, Types } from 'mongoose';

export interface IChatMemberInterface extends Document {
  chat_id?: string;
  user_id?: string;
  role?: string;
  last_read_at?: Date;
  left_at?: Date;
}

const chat_member_schema = new mongoose.Schema<IChatMemberInterface>(
  {
    chat_id: {
      type: Types.ObjectId,
      ref: 'Chat',
      default: null,
    },
    user_id: {
      type: Types.ObjectId,
      ref: 'User',
      default: null,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    last_read_at: {
      type: Date,
      default: null,
    },
    left_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IChatMemberInterface>(
  'chat-member',
  chat_member_schema,
);
