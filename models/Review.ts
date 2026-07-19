import mongoose, { Document, Model, Schema as MongooseSchema, Types } from 'mongoose';
import { createBaseSchema } from './BaseSchema';
import type { Timestamps, ReviewStatus, ReviewUser, AdminReply } from '@/types';

export interface IReview extends Document, Timestamps {
  product_id: Types.ObjectId;
  user: ReviewUser;
  rating: number;
  title: string | null;
  body: string;
  images: string[];
  is_verified_purchase: boolean;
  is_approved: boolean;
  is_pinned: boolean;
  status: ReviewStatus;
  admin_reply: AdminReply | null;
}

interface IReviewModel extends Model<IReview> {
  build(data: Partial<IReview>): IReview;
}

const ReviewUserSchema = new MongooseSchema(
  {
    name: {
      type: String,
      required: [true, 'Reviewer name is required'],
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
  },
  { _id: false },
);

const AdminReplySchema = new MongooseSchema(
  {
    body: {
      type: String,
      required: [true, 'Reply body is required'],
      maxlength: [2000, 'Reply cannot exceed 2000 characters'],
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const ReviewSchema = createBaseSchema<IReview>({
  product_id: {
    type: MongooseSchema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required'],
    index: true,
  },
  user: {
    type: ReviewUserSchema,
    required: [true, 'User information is required'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },
  title: {
    type: String,
    default: null,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  body: {
    type: String,
    required: [true, 'Review body is required'],
    minlength: [10, 'Review must be at least 10 characters'],
    maxlength: [5000, 'Review cannot exceed 5000 characters'],
  },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: function (images: string[]) {
        return images.length <= 5;
      },
      message: 'Review images cannot exceed 5',
    },
  },
  is_verified_purchase: {
    type: Boolean,
    default: false,
  },
  is_approved: {
    type: Boolean,
    default: false,
  },
  is_pinned: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'rejected'],
      message: '{VALUE} is not a valid review status',
    },
    default: 'pending',
    required: [true, 'Status is required'],
  },
  admin_reply: {
    type: AdminReplySchema,
    default: null,
  },
});

ReviewSchema.index({ product_id: 1, is_approved: 1, created_at: -1 });
ReviewSchema.index({ product_id: 1, is_pinned: -1, created_at: -1 });
ReviewSchema.index({ status: 1, created_at: -1 });
ReviewSchema.index({ product_id: 1, rating: -1 });
ReviewSchema.index({ product_id: 1, is_verified_purchase: 1 });
ReviewSchema.index({ product_id: 1, is_approved: 1 });

ReviewSchema.pre<IReview>('save', function preSave(next) {
  if (this.isModified('status')) {
    this.is_approved = this.status === 'approved';
    if (this.status !== 'approved') {
      this.is_pinned = false;
    }
  }
  next();
});

ReviewSchema.statics.build = function build(data: Partial<IReview>): IReview {
  return new this(data);
};

ReviewSchema.virtual('rating_stars').get(function ratingStars(): string[] {
  const stars: string[] = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(i <= this.rating ? 'full' : 'empty');
  }
  return stars;
});

const Review = (mongoose.models.Review as IReviewModel) ||
  mongoose.model<IReview, IReviewModel>('Review', ReviewSchema);

export default Review;
