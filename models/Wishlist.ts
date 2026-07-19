import mongoose, { Document, Model, Schema as MongooseSchema, Types } from 'mongoose';
import { createBaseSchema } from './BaseSchema';
import type { Timestamps } from '@/types';

export interface IWishlistItem {
  product_id: Types.ObjectId;
  variant_id: Types.ObjectId | null;
  added_at: Date;
}

export interface IWishlist extends Document, Timestamps {
  user_id: Types.ObjectId | null;
  session_id: string | null;
  items: IWishlistItem[];
}

interface IWishlistModel extends Model<IWishlist> {
  build(data: Partial<IWishlist>): IWishlist;
}

const WishlistItemSchema = new MongooseSchema(
  {
    product_id: {
      type: MongooseSchema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    variant_id: {
      type: MongooseSchema.Types.ObjectId,
      ref: 'ProductVariant',
      default: null,
    },
    added_at: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const WishlistSchema = createBaseSchema<IWishlist>({
  user_id: {
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    default: null,
    sparse: true,
    unique: true,
  },
  session_id: {
    type: String,
    default: null,
    sparse: true,
    unique: true,
  },
  items: {
    type: [WishlistItemSchema],
    default: [],
    validate: {
      validator: function (items: IWishlistItem[]) {
        return items.length <= 100;
      },
      message: 'Wishlist cannot exceed 100 items',
    },
  },
});

WishlistSchema.index({ user_id: 1, session_id: 1 });

WishlistSchema.statics.build = function build(data: Partial<IWishlist>): IWishlist {
  return new this(data);
};

WishlistSchema.virtual('items_count').get(function itemsCount(): number {
  return this.items?.length || 0;
});

const Wishlist = (mongoose.models.Wishlist as IWishlistModel) ||
  mongoose.model<IWishlist, IWishlistModel>('Wishlist', WishlistSchema);

export default Wishlist;
