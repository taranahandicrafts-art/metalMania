import { connectDB } from '@/lib/db';
import Inventory from '@/models/Inventory';

export async function adjustStock(sku: string, quantity: number, reason: string, notes?: string) {
  await connectDB();
  return Inventory.adjustStock(sku, quantity, reason, notes);
}

export async function getLowStockAlerts() {
  await connectDB();
  return Inventory.aggregate([
    { $match: { $expr: { $lte: ['$stock', '$low_stock_threshold'] } } },
    { $lookup: { from: 'products', localField: 'product_id', foreignField: '_id', as: 'product' } },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    { $sort: { stock: 1 } },
    { $project: { _id: 1, sku: 1, stock: 1, low_stock_threshold: 1, product_id: 1, 'product.title': 1, 'product.sku': 1, 'product.thumbnail': 1 } },
  ]);
}

export async function getInventory(options: {
  page?: number;
  limit?: number;
  sku?: string;
  productId?: string;
  warehouse?: string;
}) {
  await connectDB();
  const { page = 1, limit = 20, sku, productId, warehouse } = options;

  const query: Record<string, unknown> = {};
  if (sku) query.sku = sku;
  if (productId) query.product_id = productId;
  if (warehouse) query.warehouse = warehouse;

  const [records, total] = await Promise.all([
    Inventory.find(query).sort({ created_at: -1 }).skip((page - 1) * limit).limit(limit).populate('product_id', 'title thumbnail').lean(),
    Inventory.countDocuments(query),
  ]);

  return { records, total, page, totalPages: Math.ceil(total / limit) };
}

export async function findBySku(sku: string) {
  await connectDB();
  return Inventory.findOne({ sku }).lean();
}
