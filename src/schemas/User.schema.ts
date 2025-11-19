import mongoose, { Document } from 'mongoose';

export interface IUserInterface extends Document {
  name?: string;
  email?: string;
  user?: string;
  username?: string;
  password?: string;
  profile_pic?: string;
  std_code?: string;
  phone_number?: string;
  social_links?: {
    fb_link?: string;
    instagram_link?: string;
    youtube_link?: string;
    website_link?: string;
  };
  is_phone_verified?: boolean;
  is_email_verified?: boolean;
  is_blocked_by_admin?: boolean;
  is_deleted?: boolean;
  token?: string;
}

const user_schema = new mongoose.Schema<IUserInterface>(
  {
    name: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    username: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      default: '',
    },
    profile_pic: {
      type: String,
      default: '',
    },
    std_code: {
      type: String,
      default: '',
    },
    phone_number: {
      type: String,
      default: '',
    },
    social_links: {
      fb_link: {
        type: String,
        default: '',
      },
      instagram_link: {
        type: String,
        default: '',
      },
      youtube_link: {
        type: String,
        default: '',
      },
      website_link: {
        type: String,
        default: '',
      },
    },
    is_phone_verified: {
      type: Boolean,
      default: false,
    },
    is_email_verified: {
      type: Boolean,
      default: false,
    },
    is_blocked_by_admin: {
      type: Boolean,
      default: false,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

export default mongoose.model<IUserInterface>('User', user_schema);
