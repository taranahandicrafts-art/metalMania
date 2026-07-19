import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';
import User from '@/models/User';
import Review from '@/models/Review';
import Inventory from '@/models/Inventory';
import { getAuthSession } from '@/lib/auth-guard';
import { can } from '@/lib/permissions';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard | Admin',
};

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
  contacted: 'bg-purple-100 text-purple-700',
  closed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default async function AdminDashboardPage() {
  const user = await getAuthSession();
  await connectDB();

  const [
    totalProducts,
    totalOrders,
    totalUsers,
    totalReviews,
    draftProducts,
    recentOrders,
    lowStockItems,
    inventoryAgg,
    orderStats,
    reviewAgg,
  ] = await Promise.all([
    Product.countDocuments({ status: 'published' }),
    Order.countDocuments(),
    User.countDocuments({ is_active: true }),
    Review.countDocuments({ status: 'approved' }),
    Product.countDocuments({ status: 'draft' }),
    Order.find().sort({ created_at: -1 }).limit(5).lean(),
    Inventory.aggregate([
      { $match: { $expr: { $lte: ['$stock', '$low_stock_threshold'] } } },
      { $lookup: { from: 'products', localField: 'product_id', foreignField: '_id', as: 'product' } },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      { $limit: 5 },
      { $project: { _id: 1, sku: 1, stock: 1, low_stock_threshold: 1, product_id: 1, 'product.title': 1, 'product.slug': 1 } },
    ]),
    Inventory.aggregate([
      { $group: { _id: null, totalStock: { $sum: '$stock' }, totalReserved: { $sum: '$reserved' } } },
    ]),
    Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Review.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, total: { $sum: 1 } } },
    ]),
  ]);

  const stockData = inventoryAgg[0] as { totalStock: number; totalReserved: number } | undefined;
  const ratingData = reviewAgg[0] as { avgRating: number; total: number } | undefined;

  const orderStatusMap: Record<string, number> = {};
  orderStats.forEach((s: { _id: string; count: number }) => { orderStatusMap[s._id] = s.count; });

  const totalRevenue = recentOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back, {user?.name}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Orders', value: totalOrders, sub: `${orderStatusMap.new || 0} new`, href: '/admin/orders', color: 'text-blue-600' },
          { label: 'Products', value: totalProducts, sub: `${draftProducts} drafts`, href: '/admin/products', color: 'text-emerald-600' },
          { label: 'Active Users', value: totalUsers, sub: `${orderStatusMap.contacted || 0} active`, href: '/admin/users', color: 'text-purple-600' },
          { label: 'Revenue', value: formatPrice(totalRevenue), sub: `${totalOrders} orders`, href: '/admin/orders', color: 'text-amber-600' },
        ].map((card) => (
          <Link key={card.label} href={card.href} className="group rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
            <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
            <p className={`mt-1 text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{card.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card">
          <div className="border-b px-4 py-3">
            <h3 className="font-semibold">Order Status Breakdown</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-center gap-8">
              {['new', 'pending', 'contacted', 'closed', 'cancelled'].map((status) => {
                const count = orderStatusMap[status] || 0;
                const total = totalOrders || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={status} className="flex flex-col items-center">
                    <div className="relative flex h-16 w-16 items-center justify-center">
                      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke={
                          status === 'new' ? 'hsl(var(--chart-1))' :
                          status === 'pending' ? 'hsl(var(--chart-2))' :
                          status === 'contacted' ? 'hsl(var(--chart-3))' :
                          status === 'closed' ? 'hsl(var(--chart-4))' : 'hsl(var(--chart-5))'
                        } strokeWidth="3" strokeDasharray={`${pct * 0.942} 94.2`} />
                      </svg>
                      <span className="text-sm font-bold">{count}</span>
                    </div>
                    <span className="mt-1 text-xs capitalize text-muted-foreground">{status}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {ratingData && (
          <div className="rounded-lg border bg-card">
            <div className="border-b px-4 py-3">
              <h3 className="font-semibold">Reviews Overview</h3>
            </div>
            <div className="flex items-center justify-center gap-8 p-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-amber-500">{ratingData.avgRating.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <div className="mt-1 text-lg text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className={s <= Math.round(ratingData.avgRating) ? '' : 'text-muted-foreground/30'}>&#9733;</span>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{ratingData.total}</p>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600">{stockData?.totalStock || 0}</p>
                <p className="text-sm text-muted-foreground">Items in Stock</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="font-semibold">Recent Orders</h3>
            <Link href="/admin/orders" className="text-sm text-primary underline underline-offset-2">View all</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No orders yet</p>
          ) : (
            <div className="divide-y">
              {recentOrders.map((o) => (
                <Link key={o._id.toString()} href={`/admin/orders/${o._id}`} className="flex items-center justify-between px-4 py-3 hover:bg-muted/30">
                  <div>
                    <p className="text-sm font-medium">{o.order_number}</p>
                    <p className="text-xs text-muted-foreground">{o.customer?.name} · {formatDate(o.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{formatPrice(o.total)}</span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[o.status] || 'bg-muted text-muted-foreground'}`}>
                      {o.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="font-semibold">Low Stock Alerts</h3>
            <Link href="/admin/inventory" className="text-sm text-primary underline underline-offset-2">View all</Link>
          </div>
          {lowStockItems.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">All items well stocked</p>
          ) : (
            <div className="divide-y">
              {lowStockItems.map((item) => {
                const product = item.product_id as unknown as { title: string; slug: string } | null;
                return (
                  <div key={item._id.toString()} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{product?.title || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${item.stock <= 0 ? 'text-red-600' : 'text-amber-600'}`}>
                        {item.stock}
                      </p>
                      <p className="text-xs text-muted-foreground">threshold: {item.low_stock_threshold}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {can(user?.role ?? 'editor', 'analytics:read', user?.permissions) && (
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Quick Stats</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Avg Order Value</p>
              <p className="text-xl font-bold">{totalOrders > 0 ? formatPrice(Math.round(totalRevenue / totalOrders)) : '—'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inventory Value</p>
              <p className="text-xl font-bold">{formatPrice((stockData?.totalStock || 0) * 1000)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-xl font-bold">{totalOrders > 0 ? `${Math.round((totalOrders / Math.max(1, totalProducts)) * 100)}%` : '—'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
