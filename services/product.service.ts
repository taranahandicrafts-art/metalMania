import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import Product from '@/models/Product';
import { generateSlug, ensureUniqueSlug } from '@/utils/slugify';
import { sanitizeHtml } from '@/utils/sanitize';

export async function createProduct(data: Record<string, unknown>) {
  await connectDB();
  if (data.title) {
    data.slug = await ensureUniqueSlug(generateSlug(data.title as string), Product);
  }
  if (data.long_description) {
    data.long_description = sanitizeHtml(data.long_description as string);
  }
  return Product.create(data);
}

export async function updateProduct(id: string, data: Record<string, unknown>) {
  await connectDB();
  if (data.title && !data.slug) {
    data.slug = await ensureUniqueSlug(generateSlug(data.title as string), Product, id);
  }
  if (data.long_description) {
    data.long_description = sanitizeHtml(data.long_description as string);
  }
  return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function deleteProduct(id: string) {
  await connectDB();
  return Product.findByIdAndDelete(id);
}

export async function getProduct(idOrSlug: string) {
  await connectDB();
  const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };
  return Product.findOne(query).lean();
}

export async function listProducts(options: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
  sort?: string;
}) {
  await connectDB();
  const { page = 1, limit = 20, category, status = 'published', search, sort } = options;

  const query: Record<string, unknown> = { status };
  if (category) query.category_id = category;
  if (search) query.$text = mongoose.trusted({ $search: search });

  let sortQuery: Record<string, 1 | -1> = { created_at: -1 };
  if (sort === 'price_asc') sortQuery = { final_price: 1 };
  else if (sort === 'price_desc') sortQuery = { final_price: -1 };
  else if (sort === 'newest') sortQuery = { created_at: -1 };
  else if (sort === 'oldest') sortQuery = { created_at: 1 };
  else if (sort === 'name') sortQuery = { title: 1 };
  else if (sort === 'discount') sortQuery = { discount: -1 };

  const [products, total] = await Promise.all([
    Product.find(query).sort(sortQuery).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(query),
  ]);

  return { products, total, page, totalPages: Math.ceil(total / limit) };
}

export async function searchProducts(q: string, limit = 10) {
  await connectDB();
  return Product.find(
    { $text: mongoose.trusted({ $search: q }), status: 'published' },
    { score: { $meta: 'textScore' } },
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit)
    .select('title slug thumbnail base_price final_price')
    .lean();
}
