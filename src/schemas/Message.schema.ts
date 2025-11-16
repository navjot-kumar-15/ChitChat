import mongoose, { Types } from 'mongoose';

export interface IMessageInterface {
  chat_id?: string;
  sender_id?: string;
  content?: string;
  message_type?: string;
  reply_to?: string;
  media?: string;
  is_deleted?: string;
  is_edited?: string;
}

const message_schema = new mongoose.Schema<IMessageInterface>(
  {
    chat_id: {
      type: Types.ObjectId,
      ref: 'Chat',
      default: null,
    },
    sender_id: {
      type: Types.ObjectId,
      ref: 'User',
      default: null,
    },
    content: {
      type: String,
      default: '',
    },
    message_type: {
      type: String,
      enum: [
        'text',
        'image',
        'video',
        'audio',
        'document',
        'location',
        'contact',
        'sticker',
      ],
      default: 'text',
    },
    reply_to: {
      type: Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    media: {
      type: [String],
      default: [],
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    is_edited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IMessageInterface>('Message', message_schema);
