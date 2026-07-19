import mongoose, { Document, Model, Schema as MongooseSchema, Types } from 'mongoose';
import { createBaseSchema } from './BaseSchema';
import type { Timestamps } from '@/types';

export interface IInventory extends Document, Timestamps {
  product_id: Types.ObjectId;
  variant_id: Types.ObjectId | null;
  sku: string;
  stock: number;
  reserved: number;
  sold: number;
  available: number;
  low_stock_threshold: number;
  warehouse: string | null;
  location: string | null;
  last_restocked_at: Date | null;
}

interface IInventoryModel extends Model<IInventory> {
  build(data: Partial<IInventory>): IInventory;
  adjustStock(sku: string, quantity: number, reason: string, notes?: string): Promise<IInventory>;
}

const InventorySchema = createBaseSchema<IInventory>({
  product_id: {
    type: MongooseSchema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required'],
    index: true,
  },
  variant_id: {
    type: MongooseSchema.Types.ObjectId,
    ref: 'ProductVariant',
    default: null,
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
    uppercase: true,
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Stock must be an integer',
    },
  },
  reserved: {
    type: Number,
    default: 0,
    min: [0, 'Reserved cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Reserved must be an integer',
    },
  },
  sold: {
    type: Number,
    default: 0,
    min: [0, 'Sold cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Sold must be an integer',
    },
  },
  available: {
    type: Number,
    default: 0,
    min: [0, 'Available cannot be negative'],
  },
  low_stock_threshold: {
    type: Number,
    default: 5,
    min: [0, 'Low stock threshold must be non-negative'],
  },
  warehouse: {
    type: String,
    default: null,
    trim: true,
  },
  location: {
    type: String,
    default: null,
    trim: true,
  },
  last_restocked_at: {
    type: Date,
    default: null,
  },
});

InventorySchema.index({ available: 1, low_stock_threshold: 1 });
InventorySchema.index({ warehouse: 1, sku: 1 });
InventorySchema.index({ last_restocked_at: -1 });

InventorySchema.pre<IInventory>('save', function preSave(next) {
  this.available = Math.max(0, this.stock - this.reserved - this.sold);
  next();
});

InventorySchema.pre('findOneAndUpdate', function preFindOneAndUpdate(next) {
  const update = this.getUpdate() as Record<string, unknown>;
  if (update?.$inc) {
    const inc = update.$inc as Record<string, number>;
    this.set({ $inc: { ...inc } });
  }
  next();
});

InventorySchema.statics.build = function build(data: Partial<IInventory>): IInventory {
  return new this(data);
};

InventorySchema.virtual('status').get(function status(): string {
  if (this.available <= 0) return 'out_of_stock';
  if (this.available <= this.low_stock_threshold) return 'low_stock';
  return 'healthy';
});

InventorySchema.virtual('is_low_stock').get(function isLowStock(): boolean {
  return this.available > 0 && this.available <= this.low_stock_threshold;
});

InventorySchema.virtual('is_out_of_stock').get(function isOutOfStock(): boolean {
  return this.available <= 0;
});

InventorySchema.statics.findBySku = async function findBySku(
  sku: string,
): Promise<IInventory | null> {
  return this.findOne({ sku: sku.toUpperCase() });
};

InventorySchema.statics.adjustStock = async function adjustStock(
  sku: string,
  quantity: number,
  reason: string,
  notes?: string,
): Promise<IInventory> {
  const doc = await this.findOne({ sku: sku.toUpperCase() });
  if (!doc) throw new Error(`Inventory record not found for SKU: ${sku}`);
  doc.stock = Math.max(0, doc.stock + quantity);
  const record = await this.create({
    product_id: doc.product_id,
    variant_id: doc.variant_id,
    sku: doc.sku,
    stock: doc.stock,
    reason,
    notes: notes || null,
  });
  return record;
};

const Inventory = (mongoose.models.Inventory as IInventoryModel) ||
  mongoose.model<IInventory, IInventoryModel>('Inventory', InventorySchema);

export default Inventory;
