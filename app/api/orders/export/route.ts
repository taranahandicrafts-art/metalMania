import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const query: Record<string, unknown> = {};
    if (status) query.status = status;

    const orders = await Order.find(query).sort({ created_at: -1 }).lean();

    const headers = ['Order Number', 'Customer Name', 'Phone', 'Status', 'Total', 'Date'];
    const csvRows = [headers.join(',')];
    for (const order of orders) {
      csvRows.push([
        order.order_number,
        `"${order.customer?.name || ''}"`,
        order.customer?.phone || '',
        order.status,
        order.total,
        order.created_at?.toISOString().split('T')[0] || '',
      ].join(','));
    }

    return new NextResponse(csvRows.join('\n'), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=orders.csv',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
