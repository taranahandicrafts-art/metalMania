import { Document, Model, Types } from 'mongoose';

// ──────────────────────────────────────────────
// Utility Types
// ──────────────────────────────────────────────

export type DocumentID = Types.ObjectId | string;

export type Timestamps = {
  created_at: Date;
  updated_at: Date;
};

export type SoftDelete = {
  deleted_at: Date | null;
};

export interface MongoDoc extends Document, Timestamps {
  _id: Types.ObjectId;
}

export interface MongoModel<T extends Document> extends Model<T> {
  build(data: Partial<T>): T;
}

// ──────────────────────────────────────────────
// Dimension & Weight
// ──────────────────────────────────────────────

export type DimensionUnit = 'cm' | 'inch';
export type WeightUnit = 'kg' | 'lb';

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: DimensionUnit;
}

export interface Weight {
  value: number;
  unit: WeightUnit;
}

// ──────────────────────────────────────────────
// Media Sub-types
// ──────────────────────────────────────────────

export interface ProductImage {
  url: string;
  alt: string;
  order: number;
}

export interface ProductVideo {
  url: string;
  type: 'youtube' | 'cloudinary';
}

export interface VariantImage {
  url: string;
  alt: string;
}

export interface VariantVideo {
  url: string;
  type: string;
}

// ──────────────────────────────────────────────
// SEO & Meta
// ──────────────────────────────────────────────

export interface SEO {
  title: string;
  description: string;
  keywords: string[];
  canonical_url: string | null;
}

export interface OpenGraph {
  title: string | null;
  description: string | null;
  image: string | null;
}

export interface TwitterCard {
  card: 'summary' | 'summary_large_image';
  title: string | null;
  description: string | null;
}

export interface ProductMeta {
  canonical_url: string | null;
  open_graph: OpenGraph;
  twitter_card: TwitterCard;
}

// ──────────────────────────────────────────────
// Shipping & Warranty
// ──────────────────────────────────────────────

export interface ShippingInfo {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  flat_rate: number | null;
  free_shipping: boolean;
  estimated_days: {
    min: number;
    max: number;
  };
}

export interface WarrantyInfo {
  period: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

// ──────────────────────────────────────────────
// Category Ancestor
// ──────────────────────────────────────────────

export interface CategoryAncestor {
  _id: Types.ObjectId;
  name: string;
  slug: string;
}

export interface CategorySEO {
  title: string | null;
  description: string | null;
}

// ──────────────────────────────────────────────
// Order Sub-types
// ──────────────────────────────────────────────

export interface OrderCustomer {
  name: string;
  phone: string;
  email: string | null;
  address: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

export interface OrderItem {
  product_id: Types.ObjectId;
  variant_id: Types.ObjectId | null;
  title: string;
  sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

// ──────────────────────────────────────────────
// Review Sub-types
// ──────────────────────────────────────────────

export interface ReviewUser {
  name: string;
  email: string;
}

export interface AdminReply {
  body: string;
  created_at: Date;
}

// ──────────────────────────────────────────────
// Media Sub-types
// ──────────────────────────────────────────────

export interface MediaUsedIn {
  model: 'products' | 'categories' | 'reviews' | null;
  field: string | null;
  id: Types.ObjectId | null;
}

// ──────────────────────────────────────────────
// Analytics
// ──────────────────────────────────────────────

export type AnalyticsEventType = 'pageview' | 'event' | 'conversion';

// ──────────────────────────────────────────────
// Settings
// ──────────────────────────────────────────────

export type SettingsKey =
  | 'store_info'
  | 'seo_defaults'
  | 'social_links'
  | 'contact_info'
  | 'why_choose_us'
  | 'faq'
  | 'footer'
  | 'feature_toggles'
  | 'newsletter'
  | 'payment';

// ──────────────────────────────────────────────
// Coupon
// ──────────────────────────────────────────────

export type CouponType = 'percentage' | 'flat' | 'free_shipping' | 'bogo';

// ──────────────────────────────────────────────
// Enums
// ──────────────────────────────────────────────

export type UserRole = 'superadmin' | 'admin' | 'editor' | 'manager';

export type ProductStatus = 'draft' | 'published' | 'archived';

export type VariantType = 'color' | 'size' | 'material' | 'dimension';

export type OrderStatus = 'new' | 'pending' | 'contacted' | 'closed' | 'cancelled';

export type OrderSource = 'whatsapp' | 'admin';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export type InventoryReason = 'restock' | 'return' | 'damage' | 'adjustment' | 'correction';

export type MediaResourceType = 'image' | 'video' | 'raw';

export type ContactStatus = 'new' | 'read' | 'replied' | 'closed';
