import { connectDB } from '@/lib/db';
import Inventory from '@/models/Inventory';
import Product from '@/models/Product';
import ProductVariant from '@/models/ProductVariant';
import { requirePermission } from '@/lib/auth-guard';
import { formatPrice, formatDate } from '@/lib/utils';
import { InventoryClient } from './InventoryClient';

export default async function AdminInventoryPage() {
  await requirePermission('inventory:read');
  await connectDB();

  const [inventoryRecords, products, variants] = await Promise.all([
    Inventory.find().sort('-created_at').limit(100).populate('product_id', 'title slug').lean(),
    Product.find().select('title sku').sort('title').lean(),
    ProductVariant.find().select('name sku stock').sort('name').lean(),
  ]);

  const productStocks = new Map<string, { stock: number; title: string; sku: string }>();
  inventoryRecords.forEach((r) => {
    const pid = r.product_id as unknown as { _id: string; title: string } | null;
    if (pid) {
      productStocks.set(r.sku, { stock: r.stock, title: pid.title || '', sku: r.sku });
    }
  });

  const lowStockItems = inventoryRecords.filter((r) => r.stock <= r.low_stock_threshold);
  const outOfStockItems = inventoryRecords.filter((r) => r.stock <= 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
        <p className="text-sm text-muted-foreground">Monitor stock levels and movements</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Products Tracked</p>
          <p className="text-2xl font-bold">{inventoryRecords.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Healthy Stock</p>
          <p className="text-2xl font-bold text-green-600">{inventoryRecords.filter((r) => r.stock > r.low_stock_threshold).length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Low Stock</p>
          <p className="text-2xl font-bold text-amber-600">{lowStockItems.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">{outOfStockItems.length}</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="font-semibold">Stock Adjustments</h3>
        </div>
        <div className="p-4">
          <InventoryClient
            products={products.map((p) => ({
              id: (p._id as unknown as { toString(): string }).toString(),
              title: p.title,
              sku: p.sku,
            }))}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <div className="border-b bg-muted/50 px-4 py-3">
          <h3 className="font-semibold">All Inventory Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Reserved</th>
                <th className="px-4 py-3 font-medium">Available</th>
                <th className="px-4 py-3 font-medium">Threshold</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {inventoryRecords.map((r) => {
                const product = r.product_id as unknown as { title: string } | null;
                const isLow = r.stock <= r.low_stock_threshold;
                return (
                  <tr key={r._id.toString()} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs">{r.sku}</td>
                    <td className="px-4 py-3">{product?.title || '—'}</td>
                    <td className="px-4 py-3 font-medium">{r.stock}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.reserved}</td>
                    <td className="px-4 py-3">{r.available}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.low_stock_threshold}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        r.stock <= 0 ? 'bg-red-100 text-red-700' :
                        isLow ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {r.stock <= 0 ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {inventoryRecords.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No inventory records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
