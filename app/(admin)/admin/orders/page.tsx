import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils';
import { getAuthSession } from '@/lib/auth-guard';
import Link from 'next/link';

export const metadata = { title: 'Orders | Admin' };

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
  contacted: 'bg-purple-100 text-purple-700',
  closed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

interface Props {
  searchParams: Promise<Record<string, string>>;
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  await getAuthSession();
  await connectDB();

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1'));
  const limit = 25;
  const status = params.status || '';
  const source = params.source || '';
  const search = params.search || '';

  const query: Record<string, unknown> = {};
  if (status) query.status = status;
  if (source) query.source = source;
  if (search) {
    const re = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [{ order_number: re }, { 'customer.name': re }, { 'customer.phone': re }];
  }

  const [orders, total] = await Promise.all([
    Order.find(query).sort({ created_at: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Order.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-sm text-muted-foreground">{total} total orders</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['', 'new', 'pending', 'contacted', 'closed', 'cancelled'].map((s) => (
            <Link
              key={s}
              href={s ? `/admin/orders?status=${s}` : '/admin/orders'}
              className={`inline-flex h-8 items-center rounded-md px-3 text-xs font-medium transition-colors ${
                status === s ? 'bg-primary text-primary-foreground' : 'border bg-background hover:bg-muted'
              }`}
            >
              {s || 'All'}
            </Link>
          ))}
        </div>
      </div>

      <form method="get" className="flex gap-2">
        {status && <input type="hidden" name="status" value={status} />}
        <input
          name="search"
          defaultValue={search}
          placeholder="Search by order ID, customer name or phone"
          className="flex h-9 w-full max-w-sm rounded-md border bg-background px-3 text-sm"
        />
        <button type="submit" className="h-9 rounded-md bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90">
          Search
        </button>
      </form>

      <div className="overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No orders found</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id.toString()} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${o._id}`} className="font-medium text-primary underline underline-offset-2">
                        {o.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{o.customer?.name}</p>
                      <p className="text-xs text-muted-foreground">{o.customer?.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{o.items?.length || 0}</td>
                    <td className="px-4 py-3 font-medium">{formatPrice(o.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[o.status] || 'bg-muted text-muted-foreground'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground capitalize">{o.source}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(o.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/orders?page=${p}${status ? `&status=${status}` : ''}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
              className={`inline-flex h-8 w-8 items-center justify-center rounded text-sm ${
                p === page ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
