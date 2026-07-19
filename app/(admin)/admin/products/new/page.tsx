import { connectDB } from '@/lib/db';
import Category from '@/models/Category';
import { requirePermission } from '@/lib/auth-guard';
import { ProductForm } from '@/components/admin/products/ProductForm';

export default async function NewProductPage() {
  await requirePermission('product:create');
  await connectDB();
  const rawCats = await Category.find({ is_active: true }).sort('name').lean();
  const categories = JSON.parse(JSON.stringify(rawCats)).map((c: Record<string, unknown>) => ({
    _id: String(c._id),
    name: c.name as string,
    path: c.ancestors && (c.ancestors as { name: string }[]).length > 0
      ? [...(c.ancestors as { name: string }[]).map((a: { name: string }) => a.name), c.name as string].join(' > ')
      : (c.name as string),
  }));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">New Product</h2>
      <ProductForm categories={categories} />
    </div>
  );
}
