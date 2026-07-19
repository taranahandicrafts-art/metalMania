import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Inventory from '@/models/Inventory';

export async function GET() {
  try {
    await connectDB();
    const alerts = await Inventory.aggregate([
      { $match: { $expr: { $lte: ['$stock', '$low_stock_threshold'] } } },
      { $lookup: { from: 'products', localField: 'product_id', foreignField: '_id', as: 'product' } },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      { $sort: { stock: 1 } },
      { $project: { _id: 1, sku: 1, stock: 1, low_stock_threshold: 1, product_id: 1, 'product.title': 1, 'product.sku': 1, 'product.thumbnail': 1 } },
    ]);

    return NextResponse.json({ alerts });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }
}
