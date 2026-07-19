import mongoose, { Document, Model, Schema as MongooseSchema, Types } from 'mongoose';
import { createBaseSchema } from './BaseSchema';
import type { Timestamps, VariantType, VariantImage, VariantVideo } from '@/types';

export interface IProductVariant extends Document, Timestamps {
  product_id: Types.ObjectId;
  type: VariantType;
  name: string;
  sku: string;
  price: number | null;
  stock: number;
  reserved: number;
  sold: number;
  images: VariantImage[];
  videos: VariantVideo[];
  is_active: boolean;
  sort_order: number;
  metadata: Record<string, string>;
}

interface IProductVariantModel extends Model<IProductVariant> {
  build(data: Partial<IProductVariant>): IProductVariant;
}

const VariantImageSchema = new MongooseSchema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: '' },
  },
  { _id: false },
);

const VariantVideoSchema = new MongooseSchema(
  {
    url: { type: String, required: true },
    type: { type: String, default: '' },
  },
  { _id: false },
);

const ProductVariantSchema = createBaseSchema<IProductVariant>({
  product_id: {
    type: MongooseSchema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required'],
    index: true,
  },
  type: {
    type: String,
    enum: {
      values: ['color', 'size', 'material', 'dimension'],
      message: '{VALUE} is not a valid variant type',
    },
    required: [true, 'Variant type is required'],
  },
  name: {
    type: String,
    required: [true, 'Variant name is required'],
    trim: true,
    maxlength: [100, 'Variant name cannot exceed 100 characters'],
  },
  sku: {
    type: String,
    required: [true, 'Variant SKU is required'],
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: [50, 'SKU cannot exceed 50 characters'],
  },
  price: {
    type: Number,
    default: null,
    min: [0, 'Price must be positive'],
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative'],
  },
  reserved: {
    type: Number,
    default: 0,
    min: [0, 'Reserved cannot be negative'],
  },
  sold: {
    type: Number,
    default: 0,
    min: [0, 'Sold cannot be negative'],
  },
  images: {
    type: [VariantImageSchema],
    default: [],
    validate: {
      validator: function (images: VariantImage[]) {
        return images.length <= 10;
      },
      message: 'Variant images cannot exceed 10',
    },
  },
  videos: {
    type: [VariantVideoSchema],
    default: [],
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  sort_order: {
    type: Number,
    default: 0,
  },
  metadata: {
    type: MongooseSchema.Types.Map,
    of: String,
    default: {},
  },
});

ProductVariantSchema.index({ product_id: 1, type: 1 });
ProductVariantSchema.index({ product_id: 1, sort_order: 1 });
ProductVariantSchema.index({ product_id: 1, is_active: 1, sort_order: 1 });
ProductVariantSchema.index({ type: 1, 'metadata.hex': 1 });

ProductVariantSchema.statics.build = function build(data: Partial<IProductVariant>): IProductVariant {
  return new this(data);
};

ProductVariantSchema.virtual('available').get(function available(): number {
  return Math.max(0, this.stock - this.reserved - this.sold);
});

ProductVariantSchema.virtual('effective_price').get(function effectivePrice(): number | null {
  return this.price;
});

const ProductVariant = (mongoose.models.ProductVariant as IProductVariantModel) ||
  mongoose.model<IProductVariant, IProductVariantModel>('ProductVariant', ProductVariantSchema);

export default ProductVariant;
