import Link from 'next/link';
import { connectDB } from '@/lib/db';
import Category from '@/models/Category';
import { requirePermission } from '@/lib/auth-guard';

export async function AdminCategoryList() {
  await requirePermission('category:read');
  await connectDB();

  const raw = await Category.find().sort('name').lean();
  const typedCategories: Array<Record<string, unknown>> = JSON.parse(JSON.stringify(raw));
  const categories = typedCategories.map((c: Record<string, unknown>) => ({
    ...c,
    path: (c.ancestors as Array<{ name: string }>)?.length
      ? [...(c.ancestors as Array<{ name: string }>).map((a) => a.name), c.name as string].join(' > ')
      : c.name,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-sm text-muted-foreground">Organise your product catalog</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          New Category
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50 text-left text-sm font-medium text-muted-foreground">
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3 w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">No categories yet</td>
              </tr>
            ) : (
              categories.map((c: Record<string, unknown>) => (
                <tr key={String(c._id)} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{(c.path as string) || (c.name as string)}</p>
                      {(c.description as string) && <p className="max-w-xs truncate text-xs text-muted-foreground">{c.description as string}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{c.slug as string}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{(c.product_count as number) || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{c.sort_order as number}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/categories/${String(c._id)}`} className="text-sm text-primary underline underline-offset-2 hover:text-primary/80">Edit</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
