import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { generateOrderNumber } from '@/lib/utils';

export async function createOrder(data: Record<string, unknown>) {
  await connectDB();
  return Order.create({ ...data, order_number: generateOrderNumber() });
}

export async function updateOrderStatus(id: string, status: string) {
  await connectDB();
  return Order.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
}

export async function getOrder(id: string) {
  await connectDB();
  return Order.findById(id).lean();
}

export async function listOrders(options: {
  page?: number;
  limit?: number;
  status?: string;
  source?: string;
  sort?: string;
}) {
  await connectDB();
  const { page = 1, limit = 20, status, source } = options;

  const query: Record<string, unknown> = {};
  if (status) query.status = status;
  if (source) query.source = source;

  const [orders, total] = await Promise.all([
    Order.find(query).sort({ created_at: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Order.countDocuments(query),
  ]);

  return { orders, total, page, totalPages: Math.ceil(total / limit) };
}

export async function exportOrdersToCSV(filters?: Record<string, unknown>) {
  await connectDB();
  const orders = await Order.find(filters || {}).sort({ created_at: -1 }).lean();
  const headers = ['Order Number', 'Name', 'Phone', 'Status', 'Total', 'Source', 'Date'];
  const rows = orders.map((o) => [
    o.order_number,
    `"${o.customer?.name || ''}"`,
    o.customer?.phone || '',
    o.status,
    o.total,
    o.source,
    o.created_at?.toISOString().split('T')[0] || '',
  ]);
  return [headers, ...rows];
}
