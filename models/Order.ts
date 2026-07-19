import mongoose, { Document, Model, Schema as MongooseSchema, Types } from 'mongoose';
import { createBaseSchema } from './BaseSchema';
import type { Timestamps, OrderStatus, OrderSource, OrderCustomer, OrderItem } from '@/types';

export interface IOrder extends Document, Timestamps {
  order_number: string;
  customer: OrderCustomer;
  items: OrderItem[];
  notes: string | null;
  subtotal: number;
  total: number;
  status: OrderStatus;
  source: OrderSource;
  admin_notes: string | null;
  exported_at: Date | null;
}

interface IOrderModel extends Model<IOrder> {
  build(data: Partial<IOrder>): IOrder;
  generateOrderNumber(): string;
}

function generateOrderNumber(): string {
  const date = new Date();
  const yymmdd = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${yymmdd}-${random}`;
}

const AddressSchema = new MongooseSchema(
  {
    line1: { type: String, required: [true, 'Address line 1 is required'], trim: true },
    line2: { type: String, default: null, trim: true },
    city: { type: String, required: [true, 'City is required'], trim: true },
    state: { type: String, required: [true, 'State is required'], trim: true },
    pincode: { type: String, required: [true, 'Pincode is required'], trim: true },
    country: { type: String, required: [true, 'Country is required'], trim: true, default: 'India' },
  },
  { _id: false },
);

const CustomerSchema = new MongooseSchema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian mobile number'],
    },
    email: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    },
    address: {
      type: AddressSchema,
      required: [true, 'Delivery address is required'],
    },
  },
  { _id: false },
);

const OrderItemSchema = new MongooseSchema(
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
    title: {
      type: String,
      required: [true, 'Item title is required'],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'Item SKU is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    unit_price: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price must be positive'],
    },
    total_price: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price must be positive'],
    },
  },
  { _id: false },
);

const OrderSchema = createBaseSchema<IOrder>({
  order_number: {
    type: String,
    unique: true,
    uppercase: true,
  },
  customer: {
    type: CustomerSchema,
    required: [true, 'Customer information is required'],
  },
  items: {
    type: [OrderItemSchema],
    required: [true, 'At least one item is required'],
    validate: {
      validator: function (items: OrderItem[]) {
        return items.length >= 1 && items.length <= 50;
      },
      message: 'Order must have between 1 and 50 items',
    },
  },
  notes: {
    type: String,
    default: null,
    maxlength: [2000, 'Notes cannot exceed 2000 characters'],
  },
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: [0, 'Subtotal must be positive'],
  },
  total: {
    type: Number,
    required: [true, 'Total is required'],
    min: [0, 'Total must be positive'],
  },
  status: {
    type: String,
    enum: {
      values: ['new', 'pending', 'contacted', 'closed', 'cancelled'],
      message: '{VALUE} is not a valid order status',
    },
    default: 'new',
    required: [true, 'Status is required'],
  },
  source: {
    type: String,
    enum: {
      values: ['whatsapp', 'admin'],
      message: '{VALUE} is not a valid order source',
    },
    default: 'whatsapp',
    required: [true, 'Source is required'],
  },
  admin_notes: {
    type: String,
    default: null,
    maxlength: [2000, 'Admin notes cannot exceed 2000 characters'],
  },
  exported_at: {
    type: Date,
    default: null,
  },
});

OrderSchema.index({ status: 1, created_at: -1 });
OrderSchema.index({ 'customer.phone': 1 });
OrderSchema.index({ created_at: -1 });
OrderSchema.index({ source: 1, status: 1, created_at: -1 });
OrderSchema.index({ exported_at: 1, status: 1 });

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  new: ['pending', 'cancelled'],
  pending: ['contacted', 'cancelled'],
  contacted: ['closed', 'cancelled'],
  closed: [],
  cancelled: [],
};

OrderSchema.pre<IOrder>('save', function preSave(next) {
  if (this.isNew && !this.order_number) {
    this.order_number = generateOrderNumber();
  }
  next();
});

OrderSchema.pre('findOneAndUpdate', async function preFindOneAndUpdate(next) {
  const update = this.getUpdate() as Record<string, unknown>;
  if (update?.status) {
    const doc = await this.model.findOne(this.getQuery()).lean();
    if (doc) {
      const currentStatus = (doc as unknown as IOrder).status;
      const allowed = VALID_TRANSITIONS[currentStatus];
      if (allowed && !allowed.includes(update.status as OrderStatus)) {
        return next(
          new Error(`Invalid status transition from "${currentStatus}" to "${update.status as string}"`),
        );
      }
    }
  }
  next();
});

OrderSchema.statics.build = function build(data: Partial<IOrder>): IOrder {
  return new this(data);
};

OrderSchema.statics.generateOrderNumber = generateOrderNumber;

OrderSchema.virtual('items_count').get(function itemsCount(): number {
  return this.items?.length || 0;
});

OrderSchema.virtual('customer_name').get(function customerName(): string {
  return this.customer?.name || '';
});

const Order = (mongoose.models.Order as IOrderModel) ||
  mongoose.model<IOrder, IOrderModel>('Order', OrderSchema);

export default Order;
