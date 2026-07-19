import Link from 'next/link';
import Image from 'next/image';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { formatPrice, formatDate } from '@/lib/utils';
import { requirePermission } from '@/lib/auth-guard';
import { DeleteButton } from './DeleteButton';

interface ProductListProps {
  searchParams: Promise<Record<string, string>>;
}

export async function AdminProductList({ searchParams }: ProductListProps) {
  await requirePermission('product:read');
  await connectDB();

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1'));
  const limit = 20;
  const search = params.search || '';
  const status = params.status || '';
  const category = params.category || '';

  const query: Record<string, unknown> = {};
  if (status) query.status = status;
  if (category) query.category_id = category;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
    ];
  }

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('title slug thumbnail base_price final_price discount status sku created_at')
      .lean(),
    Product.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{total} product{total !== 1 ? 's' : ''}</p>
        <Link
          href="/admin/products/new"
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          New Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50 text-left text-sm font-medium text-muted-foreground">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p._id.toString()} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${p._id}`} className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-muted">
                      {p.thumbnail ? (
                        <Image src={p.thumbnail} alt="" fill className="object-cover" sizes="40px" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground/50">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m3 16 4-4 3 3 5-5 6 6"/></svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{p.title}</p>
                      {p.discount > 0 && <p className="text-xs text-destructive">-{p.discount}% off</p>}
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{p.sku}</td>
                <td className="px-4 py-3">
                  <span className="font-medium">{formatPrice(p.final_price || p.base_price)}</span>
                  {p.discount > 0 && (
                    <span className="ml-1.5 text-sm text-muted-foreground line-through">{formatPrice(p.base_price)}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    p.status === 'published' ? 'bg-green-100 text-green-700' :
                    p.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(p.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${p._id}`}
                      className="text-sm text-primary underline underline-offset-2 hover:text-primary/80"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={p._id.toString()} />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/products?page=${p}${search ? `&search=${search}` : ''}`}
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
