import mongoose, { Document, Model } from 'mongoose';
import { createBaseSchema } from './BaseSchema';
import type { Timestamps, ContactStatus } from '@/types';

export interface IContact extends Document, Timestamps {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: ContactStatus;
  admin_reply: string | null;
}

interface IContactModel extends Model<IContact> {
  build(data: Partial<IContact>): IContact;
}

const ContactSchema = createBaseSchema<IContact>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
  },
  phone: {
    type: String,
    default: null,
    trim: true,
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    minlength: [5, 'Subject must be at least 5 characters'],
    maxlength: [200, 'Subject cannot exceed 200 characters'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [20, 'Message must be at least 20 characters'],
    maxlength: [5000, 'Message cannot exceed 5000 characters'],
  },
  status: {
    type: String,
    enum: {
      values: ['new', 'read', 'replied', 'closed'],
      message: '{VALUE} is not a valid contact status',
    },
    default: 'new',
    required: [true, 'Status is required'],
  },
  admin_reply: {
    type: String,
    default: null,
    maxlength: [5000, 'Admin reply cannot exceed 5000 characters'],
  },
});

ContactSchema.index({ status: 1, created_at: -1 });

ContactSchema.statics.build = function build(data: Partial<IContact>): IContact {
  return new this(data);
};

const Contact = (mongoose.models.Contact as IContactModel) ||
  mongoose.model<IContact, IContactModel>('Contact', ContactSchema);

export default Contact;
