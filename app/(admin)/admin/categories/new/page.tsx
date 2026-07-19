import { connectDB } from '@/lib/db';
import Category from '@/models/Category';
import { CategoryForm } from '@/components/admin/categories/CategoryForm';

export default async function NewCategoryPage() {
  await connectDB();
  const raw = await Category.find({ is_active: true }).sort('name').lean();
  const categories = JSON.parse(JSON.stringify(raw)).map((c: Record<string, unknown>) => ({
    ...c,
    path: c.ancestors && (c.ancestors as { name: string }[]).length > 0
      ? [...(c.ancestors as { name: string }[]).map((a: { name: string }) => a.name), c.name as string].join(' > ')
      : c.name,
  }));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">New Category</h2>
      <div className="rounded-lg border bg-card p-6">
        <CategoryForm categories={categories} />
      </div>
    </div>
  );
}
