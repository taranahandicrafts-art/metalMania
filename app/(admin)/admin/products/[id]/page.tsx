import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { requirePermission } from '@/lib/auth-guard';
import { ProductForm } from '@/components/admin/products/ProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requirePermission('product:update');
  await connectDB();

  const product = await Product.findById(id).lean();
  if (!product) notFound();

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
      <h2 className="text-2xl font-bold tracking-tight">Edit Product</h2>
      <ProductForm
        initialData={JSON.parse(JSON.stringify(product))}
        categories={categories}
      />
    </div>
  );
}
