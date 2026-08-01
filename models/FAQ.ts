import mongoose, { Document, Model } from 'mongoose';
import { createBaseSchema } from './BaseSchema';
import type { Timestamps } from '@/types';

export interface IFAQ extends Document, Timestamps {
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
}

const FAQSchema = createBaseSchema<IFAQ>({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    maxlength: [500, 'Question cannot exceed 500 characters'],
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    trim: true,
    maxlength: [2000, 'Answer cannot exceed 2000 characters'],
  },
  sort_order: {
    type: Number,
    default: 0,
    index: true,
  },
  is_active: {
    type: Boolean,
    default: true,
    index: true,
  },
});

const FAQ = (mongoose.models.FAQ as Model<IFAQ>) ||
  mongoose.model<IFAQ>('FAQ', FAQSchema);

export default FAQ;
