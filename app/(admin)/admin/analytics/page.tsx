import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Review from '@/models/Review';
import Inventory from '@/models/Inventory';
import Analytics from '@/models/Analytics';
import { getAuthSession } from '@/lib/auth-guard';
import { formatPrice } from '@/lib/utils';

export const metadata = { title: 'Analytics | Admin' };

export default async function AdminAnalyticsPage() {
  await getAuthSession();
  await connectDB();

  const [
    totalProducts,
    publishedProducts,
    draftProducts,
    archivedProducts,
    totalOrders,
    totalReviews,
    approvedReviews,
    pendingReviews,
    inventoryData,
    orderAgg,
    reviewAgg,
    categoryAgg,
    recentPageviews,
  ] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ status: 'published' }),
    Product.countDocuments({ status: 'draft' }),
    Product.countDocuments({ status: 'archived' }),
    Order.countDocuments(),
    Review.countDocuments(),
    Review.countDocuments({ status: 'approved' }),
    Review.countDocuments({ status: 'pending' }),
    Inventory.aggregate([
      { $group: {
        _id: null,
        totalStock: { $sum: '$stock' },
        totalReserved: { $sum: '$reserved' },
        avgStock: { $avg: '$stock' },
        lowStockCount: { $sum: { $cond: [{ $lte: ['$stock', '$low_stock_threshold'] }, 1, 0] } },
        outOfStockCount: { $sum: { $cond: [{ $lte: ['$stock', 0] }, 1, 0] } },
      }},
    ]),
    Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, totalRevenue: { $sum: '$total' } } },
    ]),
    Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' }, total: { $sum: 1 } } },
    ]),
    Product.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category_id', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
    Analytics.find({ type: 'pageview' }).sort({ timestamp: -1 }).limit(10).lean(),
  ]);

  const stock = inventoryData[0] as {
    totalStock: number;
    totalReserved: number;
    avgStock: number;
    lowStockCount: number;
    outOfStockCount: number;
  } | undefined;

  const ratings = reviewAgg[0] as { avgRating: number; total: number } | undefined;
  const totalRevenue = orderAgg.reduce((sum: number, o: { totalRevenue: number }) => sum + o.totalRevenue, 0);

  const orderStatusChart = ['new', 'pending', 'contacted', 'closed', 'cancelled'].map((status) => {
    const found = orderAgg.find((o: { _id: string }) => o._id === status);
    return { label: status, count: found?.count || 0, revenue: found?.totalRevenue || 0 };
  });

  const engagement = totalOrders > 0 ? Math.round((totalOrders / Math.max(1, totalProducts)) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
        <p className="text-sm text-muted-foreground">Store performance and metrics</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Revenue', value: formatPrice(totalRevenue), sub: `${totalOrders} orders`, color: 'text-green-600' },
          { label: 'Avg Order Value', value: totalOrders > 0 ? formatPrice(Math.round(totalRevenue / totalOrders)) : '—', sub: 'per order', color: 'text-blue-600' },
          { label: 'Avg Rating', value: ratings?.avgRating?.toFixed(1) || '—', sub: `${ratings?.total || 0} reviews`, color: 'text-amber-500' },
          { label: 'Engagement Rate', value: `${engagement}%`, sub: 'orders vs products', color: 'text-purple-600' },
        ].map((card) => (
          <div key={card.label} className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className={`mt-1 text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card">
          <div className="border-b px-4 py-3">
            <h3 className="font-semibold">Order Status Distribution</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {orderStatusChart.map((item) => {
                const maxCount = Math.max(...orderStatusChart.map((o) => o.count), 1);
                const pct = (item.count / maxCount) * 100;
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize font-medium">{item.label}</span>
                      <span className="text-muted-foreground">{item.count} orders · {formatPrice(item.revenue)}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="border-b px-4 py-3">
            <h3 className="font-semibold">Inventory Health</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Stock', value: stock?.totalStock || 0, color: 'text-blue-600' },
                { label: 'Reserved', value: stock?.totalReserved || 0, color: 'text-amber-600' },
                { label: 'Low Stock Items', value: stock?.lowStockCount || 0, color: 'text-orange-600' },
                { label: 'Out of Stock', value: stock?.outOfStockCount || 0, color: 'text-red-600' },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium">Stock Level Distribution</p>
              <div className="flex h-3 overflow-hidden rounded-full bg-muted">
                <div className="bg-green-500 transition-all" style={{ width: `${Math.min(100, ((stock?.totalStock || 0) - (stock?.lowStockCount || 0)) / Math.max(1, stock?.totalStock || 1) * 100)}%` }} />
                <div className="bg-amber-500 transition-all" style={{ width: `${(stock?.lowStockCount || 0) / Math.max(1, stock?.totalStock || 1) * 100}%` }} />
                <div className="bg-red-500 transition-all" style={{ width: `${(stock?.outOfStockCount || 0) / Math.max(1, stock?.totalStock || 1) * 100}%` }} />
              </div>
              <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-green-500" /> Healthy</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-amber-500" /> Low</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-red-500" /> Out</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card">
          <div className="border-b px-4 py-3">
            <h3 className="font-semibold">Product Overview</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{publishedProducts}</p>
                <p className="text-xs text-muted-foreground">Published</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">{draftProducts}</p>
                <p className="text-xs text-muted-foreground">Drafts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-muted-foreground">{archivedProducts}</p>
                <p className="text-xs text-muted-foreground">Archived</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="border-b px-4 py-3">
            <h3 className="font-semibold">Reviews Overview</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{approvedReviews}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">{pendingReviews}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{ratings?.avgRating?.toFixed(1) || '—'}</p>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {recentPageviews.length > 0 && (
        <div className="rounded-lg border bg-card">
          <div className="border-b px-4 py-3">
            <h3 className="font-semibold">Recent Pageviews</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Path</th>
                  <th className="px-4 py-3 font-medium">Referrer</th>
                  <th className="px-4 py-3 font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentPageviews.map((v) => (
                  <tr key={v._id.toString()} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs">{v.path}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{v.referrer || '—'}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(v.timestamp).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
