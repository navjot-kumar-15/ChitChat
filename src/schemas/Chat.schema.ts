import mongoose, { Document, Types } from 'mongoose';

export interface IChatInterface extends Document {
  chat_type?: string;
  name?: string;
  avatar?: string;
  created_by?: string;
  last_message_at?: string;
  unread_count?: string;
  is_deleted?: boolean;
  chat_status?: string;
  s;
}

const chat_schema = new mongoose.Schema<IChatInterface>(
  {
    chat_type: {
      type: String,
      enum: ['personal', 'group'],
      default: 'personal',
    },
    name: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    created_by: {
      type: Types.ObjectId,
      ref: 'User',
      default: null,
    },
    last_message_at: {
      type: String,
      default: '',
    },
    unread_count: {
      type: Number,
      default: 0,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    chat_status: {
      type: String,
      enum: ['active', 'deactive'],
      default: 'active',
    },
  },
  { timestamps: true },
);

export default mongoose.model<IChatInterface>('Chat', chat_schema);
