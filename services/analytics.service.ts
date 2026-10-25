import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import Order from '@/models/Order';
import Analytics from '@/models/Analytics';
import Product from '@/models/Product';

export async function getDashboardStats() {
  await connectDB();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totalOrders, newOrders, totalProducts, totalRevenue, recentEvents] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ created_at: mongoose.trusted({ $gte: thirtyDaysAgo }) }),
    Product.countDocuments({ status: 'published' }),
    Order.aggregate([
      { $match: { status: { $nin: ['cancelled'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Analytics.find({ timestamp: mongoose.trusted({ $gte: thirtyDaysAgo }) }).sort({ timestamp: -1 }).limit(50).lean(),
  ]);

  return {
    totalOrders,
    newOrders,
    totalProducts,
    totalRevenue: totalRevenue[0]?.total || 0,
    recentEvents,
  };
}

export async function getSalesTrend(days: number = 30) {
  await connectDB();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const data = await Order.aggregate([
    { $match: { created_at: { $gte: since }, status: { $nin: ['cancelled'] } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } }, total: { $sum: '$total' }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  return data;
}

export async function getOrderStatusDistribution() {
  await connectDB();
  return Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
}

export async function getTopProducts(limit: number = 10) {
  await connectDB();
  return Order.aggregate([
    { $unwind: '$items' },
    { $group: { _id: '$items.product_id', totalSold: { $sum: '$items.quantity' }, revenue: { $sum: '$items.total_price' } } },
    { $sort: { totalSold: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    { $project: { title: '$product.title', sku: '$product.sku', thumbnail: '$product.thumbnail', totalSold: 1, revenue: 1 } },
  ]);
}

export async function getRevenueByCategory() {
  await connectDB();
  return Order.aggregate([
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: '$product.category_id',
        revenue: { $sum: '$items.total_price' },
        count: { $sum: '$items.quantity' },
      },
    },
  ]);
}
