import mongoose, { Document, Model, Schema as MongooseSchema, Types } from 'mongoose';
import { createBaseSchema } from './BaseSchema';
import type { Timestamps, CouponType } from '@/types';

export interface ICoupon extends Document, Timestamps {
  code: string;
  type: CouponType;
  value: number;
  min_cart_value: number;
  max_discount: number | null;
  usage_limit: number | null;
  per_user_limit: number;
  used_count: number;
  applicable_product_ids: Types.ObjectId[];
  applicable_category_ids: Types.ObjectId[];
  excluded_product_ids: Types.ObjectId[];
  starts_at: Date;
  expires_at: Date;
  is_active: boolean;
}

interface ICouponModel extends Model<ICoupon> {
  build(data: Partial<ICoupon>): ICoupon;
  validateCoupon(code: string, cartTotal: number): Promise<ICoupon | null>;
}

const CouponSchema = createBaseSchema<ICoupon>({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [50, 'Coupon code cannot exceed 50 characters'],
  },
  type: {
    type: String,
    enum: {
      values: ['percentage', 'flat', 'free_shipping', 'bogo'],
      message: '{VALUE} is not a valid coupon type',
    },
    required: [true, 'Coupon type is required'],
  },
  value: {
    type: Number,
    required: [true, 'Coupon value is required'],
    min: [0, 'Value must be positive'],
  },
  min_cart_value: {
    type: Number,
    default: 0,
    min: [0, 'Minimum cart value must be non-negative'],
  },
  max_discount: {
    type: Number,
    default: null,
    min: [0, 'Maximum discount must be positive'],
  },
  usage_limit: {
    type: Number,
    default: null,
    min: [1, 'Usage limit must be at least 1'],
  },
  per_user_limit: {
    type: Number,
    default: 1,
    min: [1, 'Per-user limit must be at least 1'],
  },
  used_count: {
    type: Number,
    default: 0,
    min: [0, 'Used count cannot be negative'],
  },
  applicable_product_ids: {
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Product',
    default: [],
  },
  applicable_category_ids: {
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Category',
    default: [],
  },
  excluded_product_ids: {
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Product',
    default: [],
  },
  starts_at: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  expires_at: {
    type: Date,
    required: [true, 'Expiry date is required'],
    validate: {
      validator: function (this: ICoupon, value: Date) {
        return value > this.starts_at;
      },
      message: 'Expiry date must be after start date',
    },
  },
  is_active: {
    type: Boolean,
    default: true,
  },
});

CouponSchema.index({ is_active: 1, expires_at: 1 });
CouponSchema.index({ starts_at: 1, expires_at: 1 });

CouponSchema.pre<ICoupon>('save', function preSave(next) {
  if (this.isModified('code')) {
    this.code = this.code.toUpperCase();
  }
  next();
});

CouponSchema.statics.build = function build(data: Partial<ICoupon>): ICoupon {
  return new this(data);
};

CouponSchema.statics.validateCoupon = async function validateCoupon(
  code: string,
  cartTotal: number,
): Promise<ICoupon | null> {
  const now = new Date();
  const coupon = await this.findOne({
    code: code.toUpperCase(),
    is_active: true,
    starts_at: { $lte: now },
    expires_at: { $gte: now },
  });

  if (!coupon) return null;
  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) return null;
  if (cartTotal < coupon.min_cart_value) return null;

  return coupon;
};

CouponSchema.virtual('is_expired').get(function isExpired(): boolean {
  return this.expires_at < new Date();
});

CouponSchema.virtual('is_valid').get(function isValid(): boolean {
  const now = new Date();
  return (
    this.is_active &&
    this.starts_at <= now &&
    this.expires_at >= now &&
    (!this.usage_limit || this.used_count < this.usage_limit)
  );
});

CouponSchema.virtual('remaining_uses').get(function remainingUses(): number | null {
  if (!this.usage_limit) return null;
  return Math.max(0, this.usage_limit - this.used_count);
});

const Coupon = (mongoose.models.Coupon as ICouponModel) ||
  mongoose.model<ICoupon, ICouponModel>('Coupon', CouponSchema);

export default Coupon;
