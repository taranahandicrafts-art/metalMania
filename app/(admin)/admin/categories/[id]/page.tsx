import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Category from '@/models/Category';
import { CategoryForm } from '@/components/admin/categories/CategoryForm';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();

  const category = await Category.findById(id).lean();
  if (!category) notFound();

  const rawCategories = await Category.find({ is_active: true }).sort('name').lean();
  const allCategories = JSON.parse(JSON.stringify(rawCategories)).map((c: Record<string, unknown>) => ({
    ...c,
    path: c.ancestors && (c.ancestors as { name: string }[]).length > 0
      ? [...(c.ancestors as { name: string }[]).map((a: { name: string }) => a.name), c.name as string].join(' > ')
      : c.name,
  }));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Edit Category</h2>
      <div className="rounded-lg border bg-card p-6">
        <CategoryForm
          initialData={JSON.parse(JSON.stringify(category))}
          categories={allCategories}
        />
      </div>
    </div>
  );
}
