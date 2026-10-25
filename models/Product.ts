import mongoose, { Document, Model, Schema as MongooseSchema, Types, CallbackError } from 'mongoose';
import { createBaseSchema } from './BaseSchema';
import type {
  Timestamps,
  ProductStatus,
  Dimensions,
  Weight,
  ShippingInfo,
  WarrantyInfo,
  FAQ,
  ProductImage,
  ProductVideo,
  ProductMeta,
  SEO,
} from '@/types';

export interface IProduct extends Document, Timestamps {
  title: string;
  slug: string;
  short_description: string;
  long_description: string;
  sku: string;
  barcode: string | null;
  brand: string;
  material: string;
  dimensions: Dimensions;
  weight: Weight;
  base_price: number;
  discount: number;
  final_price: number;
  category_id: Types.ObjectId;
  collections: string[];
  tags: string[];
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_trending: boolean;
  status: ProductStatus;
  seo: SEO;
  shipping: ShippingInfo;
  warranty: WarrantyInfo;
  assembly_instructions: string | null;
  return_policy: string;
  faqs: FAQ[];
  related_product_ids: Types.ObjectId[];
  cross_sell_product_ids: Types.ObjectId[];
  upsell_product_ids: Types.ObjectId[];
  thumbnail: string;
  images: ProductImage[];
  videos: ProductVideo[];
  min_order_qty: number;
  has_variants: boolean;
  meta: ProductMeta;
}

interface IProductModel extends Model<IProduct> {
  build(data: Partial<IProduct>): IProduct;
  findBySlug(slug: string): Promise<IProduct | null>;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const SegmentSchema = new MongooseSchema(
  {
    url: { type: String, required: true },
    alt: { type: String, required: true, maxlength: 125 },
    order: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const VideoSegmentSchema = new MongooseSchema(
  {
    url: { type: String, required: true },
    type: {
      type: String,
      enum: {
        values: ['youtube', 'cloudinary'],
        message: '{VALUE} is not a valid video type',
      },
      required: true,
    },
  },
  { _id: false },
);

const FAQSchema = new MongooseSchema(
  {
    question: { type: String, required: [true, 'FAQ question is required'], maxlength: 500 },
    answer: { type: String, required: [true, 'FAQ answer is required'], maxlength: 5000 },
  },
  { _id: false },
);

const ShippingSchema = new MongooseSchema(
  {
    weight: { type: Number, default: 0 },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
    flat_rate: { type: Number, default: null },
    free_shipping: { type: Boolean, default: false },
    estimated_days: {
      min: {
        type: Number,
        required: [true, 'Minimum estimated delivery days is required'],
        min: [1, 'Minimum delivery days must be at least 1'],
      },
      max: {
        type: Number,
        required: [true, 'Maximum estimated delivery days is required'],
        min: [1, 'Maximum delivery days must be at least 1'],
      },
    },
  },
  { _id: false },
);

const WarrantySchema = new MongooseSchema(
  {
    period: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { _id: false },
);

const SEOSchema = new MongooseSchema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    keywords: { type: [String], default: [] },
    canonical_url: { type: String, default: null },
  },
  { _id: false },
);

const MetaSchema = new MongooseSchema(
  {
    canonical_url: { type: String, default: null },
    open_graph: {
      title: { type: String, default: null },
      description: { type: String, default: null },
      image: { type: String, default: null },
    },
    twitter_card: {
      card: {
        type: String,
        enum: ['summary', 'summary_large_image'],
        default: 'summary_large_image',
      },
      title: { type: String, default: null },
      description: { type: String, default: null },
    },
  },
  { _id: false },
);

const DimensionSchema = new MongooseSchema(
  {
    length: { type: Number, required: true, min: 0 },
    width: { type: Number, required: true, min: 0 },
    height: { type: Number, required: true, min: 0 },
    unit: {
      type: String,
      enum: {
        values: ['cm', 'inch'],
        message: '{VALUE} is not a valid dimension unit',
      },
      required: true,
    },
  },
  { _id: false },
);

const WeightSchema = new MongooseSchema(
  {
    value: { type: Number, required: true, min: 0 },
    unit: {
      type: String,
      enum: {
        values: ['kg', 'g', 'lb'],
        message: '{VALUE} is not a valid weight unit',
      },
      required: true,
    },
  },
  { _id: false },
);

const ProductSchema = createBaseSchema<IProduct>({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  short_description: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [500, 'Short description cannot exceed 500 characters'],
  },
  long_description: {
    type: String,
    default: '',
    maxlength: [50000, 'Long description cannot exceed 50000 characters'],
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: [50, 'SKU cannot exceed 50 characters'],
  },
  barcode: {
    type: String,
    default: null,
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
  },
  material: {
    type: String,
    required: [true, 'Material is required'],
    trim: true,
  },
  dimensions: {
    type: DimensionSchema,
    required: [true, 'Dimensions are required'],
  },
  weight: {
    type: WeightSchema,
    required: [true, 'Weight is required'],
  },
  base_price: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Base price must be positive'],
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
  },
  final_price: {
    type: Number,
    default: 0,
  },
  category_id: {
    type: MongooseSchema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
    index: true,
  },
  collections: {
    type: [String],
    default: [],
  },
  tags: {
    type: [String],
    default: [],
  },
  is_featured: {
    type: Boolean,
    default: false,
  },
  is_best_seller: {
    type: Boolean,
    default: false,
  },
  is_new_arrival: {
    type: Boolean,
    default: false,
  },
  is_trending: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: {
      values: ['draft', 'published', 'archived'],
      message: '{VALUE} is not a valid product status',
    },
    default: 'draft',
    required: [true, 'Status is required'],
  },
  seo: {
    type: SEOSchema,
    default: () => ({}),
  },
  shipping: {
    type: ShippingSchema,
    required: [true, 'Shipping information is required'],
  },
  warranty: {
    type: WarrantySchema,
    default: () => ({}),
  },
  assembly_instructions: {
    type: String,
    default: null,
  },
  return_policy: {
    type: String,
    default: '',
  },
  faqs: {
    type: [FAQSchema],
    default: [],
    validate: {
      validator: function (faqs: FAQ[]) {
        return faqs.length <= 20;
      },
      message: 'FAQs cannot exceed 20 items',
    },
  },
  related_product_ids: {
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Product',
    default: [],
  },
  cross_sell_product_ids: {
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Product',
    default: [],
  },
  upsell_product_ids: {
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Product',
    default: [],
  },
  thumbnail: {
    type: String,
    default: null,
  },
  images: {
    type: [SegmentSchema],
    default: [],
    validate: {
      validator: function (images: ProductImage[]) {
        return images.length <= 20;
      },
      message: 'Product images cannot exceed 20',
    },
  },
  videos: {
    type: [VideoSegmentSchema],
    default: [],
    validate: {
      validator: function (videos: ProductVideo[]) {
        return videos.length <= 5;
      },
      message: 'Product videos cannot exceed 5',
    },
  },
  min_order_qty: {
    type: Number,
    default: 1,
    min: [1, 'Minimum order quantity must be at least 1'],
  },
  has_variants: {
    type: Boolean,
    default: false,
  },
  meta: {
    type: MetaSchema,
    default: () => ({}),
  },
});

ProductSchema.index({ category_id: 1, status: 1 });
ProductSchema.index({ is_featured: 1, status: 1 });
ProductSchema.index({ is_best_seller: 1, status: 1 });
ProductSchema.index({ is_new_arrival: 1, status: 1 });
ProductSchema.index({ status: 1, created_at: -1 });
ProductSchema.index({ status: 1, base_price: 1 });
ProductSchema.index({ brand: 1, status: 1 });
ProductSchema.index({ collections: 1, status: 1 });
ProductSchema.index({ discount: -1, status: 1 });
ProductSchema.index(
  { title: 'text', tags: 'text', short_description: 'text', brand: 'text' },
  {
    weights: { title: 10, tags: 5, brand: 3, short_description: 1 },
    name: 'product_fulltext_search',
  },
);

ProductSchema.pre<IProduct>('validate', function preValidate(next) {
  // Always store a URL-safe slug: an admin-typed slug such as "Brass Lamp"
  // would otherwise produce /products/brass%20lamp links that 404.
  const source = this.slug?.trim() ? this.slug : this.title;
  if (source) this.slug = slugify(source);
  next();
});

ProductSchema.pre<IProduct>('save', function preSave(next) {
  const discountMultiplier = 1 - (this.discount || 0) / 100;
  this.final_price = Math.round(this.base_price * discountMultiplier);
  // Fall back to the first gallery image when no explicit thumbnail is set so
  // the product still shows up in listings, hero carousels and promo ads.
  if (!this.thumbnail && this.images && this.images.length > 0 && this.images[0]?.url) {
    this.thumbnail = this.images[0].url;
  }
  next();
});

ProductSchema.pre('findOneAndUpdate', async function preFindOneAndUpdate(next) {
  const update = this.getUpdate() as Record<string, unknown>;
  // Validate hooks don't run on findOneAndUpdate, so normalise the slug here too.
  if (update && Object.prototype.hasOwnProperty.call(update, 'slug')) {
    const raw = typeof update.slug === 'string' ? update.slug.trim() : '';
    const source = raw || (typeof update.title === 'string' ? update.title : '');
    if (source) this.set({ slug: slugify(source) });
    else delete update.slug;
  }
  if (update?.base_price !== undefined || update?.discount !== undefined) {
    const doc = await this.model.findOne(this.getQuery()).lean();
    if (doc) {
      const basePrice = (update.base_price as number) ?? (doc as unknown as IProduct).base_price;
      const discount = (update.discount as number) ?? (doc as unknown as IProduct).discount;
      const discountMultiplier = 1 - (discount || 0) / 100;
      this.set({ final_price: Math.round(basePrice * discountMultiplier) });
    }
  }

  // Derive the thumbnail from the first image when it is being cleared/omitted.
  const hasThumbnailKey = update && Object.prototype.hasOwnProperty.call(update, 'thumbnail');
  if (hasThumbnailKey && !update.thumbnail) {
    const updateImages = update.images as ProductImage[] | undefined;
    if (Array.isArray(updateImages) && updateImages.length > 0 && updateImages[0]?.url) {
      this.set({ thumbnail: updateImages[0].url });
    } else {
      const doc = await this.model.findOne(this.getQuery()).select('images').lean();
      const docImages = (doc as unknown as { images?: ProductImage[] } | null)?.images;
      if (Array.isArray(docImages) && docImages.length > 0 && docImages[0]?.url) {
        this.set({ thumbnail: docImages[0].url });
      }
    }
  }
  next();
});

ProductSchema.statics.build = function build(data: Partial<IProduct>): IProduct {
  return new this(data);
};

ProductSchema.statics.findBySlug = function findBySlug(slug: string): Promise<IProduct | null> {
  return this.findOne({ slug });
};

ProductSchema.virtual('discount_percentage').get(function discountPercentage(): number {
  if (!this.base_price || !this.final_price) return 0;
  return Math.round((1 - this.final_price / this.base_price) * 100);
});

ProductSchema.virtual('is_on_sale').get(function isOnSale(): boolean {
  return this.discount > 0;
});

const Product = (mongoose.models.Product as IProductModel) ||
  mongoose.model<IProduct, IProductModel>('Product', ProductSchema);

export default Product;
