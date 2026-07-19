import { notFound, redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { getAuthSession } from '@/lib/auth-guard';
import { OrderStatusActions } from './OrderStatusActions';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
  contacted: 'bg-purple-100 text-purple-700',
  closed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const VALID_TRANSITIONS: Record<string, string[]> = {
  new: ['pending', 'cancelled'],
  pending: ['contacted', 'cancelled'],
  contacted: ['closed', 'cancelled'],
  closed: [],
  cancelled: [],
};

interface Props {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string>>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  await getAuthSession();
  await connectDB();

  const order = await Order.findById(id).lean();
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/admin/orders" className="text-sm text-muted-foreground hover:text-foreground">&larr; Orders</Link>
            <h2 className="text-2xl font-bold tracking-tight">{order.order_number}</h2>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-muted text-muted-foreground'}`}>
              {order.status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Created {formatDateTime(order.created_at)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border bg-card">
            <div className="border-b px-4 py-3">
              <h3 className="font-semibold">Order Items</h3>
            </div>
            <div className="divide-y">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">SKU: {item.sku} × {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatPrice(item.total_price)}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(item.unit_price)} each</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t bg-muted/30 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Subtotal</span>
                <span className="text-sm">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total</span>
                <span className="text-lg font-bold">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card">
            <div className="border-b px-4 py-3">
              <h3 className="font-semibold">Status Timeline</h3>
            </div>
            <div className="p-4">
              <OrderStatusActions orderId={order._id.toString()} currentStatus={order.status} validTransitions={VALID_TRANSITIONS[order.status] || []} />
            </div>
          </div>

          {(order.notes || order.admin_notes) && (
            <div className="rounded-lg border bg-card">
              <div className="border-b px-4 py-3">
                <h3 className="font-semibold">Notes</h3>
              </div>
              <div className="space-y-3 p-4">
                {order.notes && (
                  <div>
                    <p className="text-xs text-muted-foreground">Customer note</p>
                    <p className="text-sm">{order.notes}</p>
                  </div>
                )}
                {order.admin_notes && (
                  <div>
                    <p className="text-xs text-muted-foreground">Admin note</p>
                    <p className="text-sm">{order.admin_notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card">
            <div className="border-b px-4 py-3">
              <h3 className="font-semibold">Customer</h3>
            </div>
            <div className="space-y-2 p-4 text-sm">
              <p><span className="text-muted-foreground">Name:</span> {order.customer?.name}</p>
              <p><span className="text-muted-foreground">Phone:</span> {order.customer?.phone}</p>
              {order.customer?.email && <p><span className="text-muted-foreground">Email:</span> {order.customer.email}</p>}
            </div>
          </div>

          <div className="rounded-lg border bg-card">
            <div className="border-b px-4 py-3">
              <h3 className="font-semibold">Delivery Address</h3>
            </div>
            <div className="space-y-1 p-4 text-sm">
              <p>{order.customer?.address?.line1}</p>
              {order.customer?.address?.line2 && <p>{order.customer.address.line2}</p>}
              <p>{order.customer?.address?.city}, {order.customer?.address?.state}</p>
              <p>{order.customer?.address?.pincode}</p>
              <p>{order.customer?.address?.country}</p>
            </div>
          </div>

          <div className="rounded-lg border bg-card">
            <div className="border-b px-4 py-3">
              <h3 className="font-semibold">Details</h3>
            </div>
            <div className="space-y-2 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source</span>
                <span className="capitalize">{order.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items</span>
                <span>{order.items?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{formatDateTime(order.created_at)}</span>
              </div>
              {order.exported_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exported</span>
                  <span>{formatDateTime(order.exported_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
