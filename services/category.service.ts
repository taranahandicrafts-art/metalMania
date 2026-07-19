import { connectDB } from '@/lib/db';
import Category from '@/models/Category';
import { generateSlug, ensureUniqueSlug } from '@/utils/slugify';

export async function createCategory(data: Record<string, unknown>) {
  await connectDB();
  if (data.name) {
    data.slug = await ensureUniqueSlug(generateSlug(data.name as string), Category);
  }
  return Category.create(data);
}

export async function updateCategory(id: string, data: Record<string, unknown>) {
  await connectDB();
  if (data.name && !data.slug) {
    data.slug = await ensureUniqueSlug(generateSlug(data.name as string), Category, id);
  }
  return Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function deleteCategory(id: string) {
  await connectDB();
  const childCount = await Category.countDocuments({ parent_id: id });
  if (childCount > 0) {
    throw new Error('Cannot delete category with child categories');
  }
  return Category.findByIdAndDelete(id);
}

export async function getCategoryTree() {
  await connectDB();
  const categories = await Category.find().sort({ sort_order: 1 }).lean();

  const map = new Map<string, Record<string, unknown> & { children: Record<string, unknown>[] }>();
  const roots: Record<string, unknown>[] = [];

  for (const cat of categories) {
    map.set(cat._id.toString(), { ...cat, children: [] });
  }

  for (const cat of categories) {
    const node = map.get(cat._id.toString())!;
    if (cat.parent_id && map.has(cat.parent_id.toString())) {
      map.get(cat.parent_id.toString())!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export async function flattenCategoryTree() {
  await connectDB();
  return Category.find().sort({ sort_order: 1 }).lean();
}

export async function reorderCategories(orderedIds: string[]) {
  await connectDB();
  const updates = orderedIds.map((id, index) =>
    Category.findByIdAndUpdate(id, { sort_order: index }),
  );
  return Promise.all(updates);
}
