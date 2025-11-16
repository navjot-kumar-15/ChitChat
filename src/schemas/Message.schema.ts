import mongoose, { Types } from 'mongoose';

const message_schema = new mongoose.Schema<any>(
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

export default mongoose.model<any>('Message', message_schema);
