import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const material = searchParams.get('material');
  const sort = searchParams.get('sort') || 'created_at';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));
  const allStatuses = searchParams.get('all') === 'true';

  if (q && q.length < 2) return NextResponse.json({ products: [], total: 0, facets: {} });

  try {
    await connectDB();

    const match: Record<string, unknown> = allStatuses ? {} : { status: 'published' };
    if (q) {
      if (allStatuses) {
        const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        match.$or = [{ title: re }, { brand: re }, { tags: re }, { sku: re }];
      } else {
        match.$text = { $search: q };
      }
    }
    if (category) match.category_id = category;
    if (minPrice || maxPrice) {
      const priceFilter: Record<string, number> = {};
      if (minPrice) priceFilter.$gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);
      match.base_price = priceFilter;
    }
    if (material) match.material = { $regex: material, $options: 'i' } as unknown;

    type SortOption = Record<string, 1 | -1 | { $meta: string }>;
    const sortOpts: SortOption = {};
    if (q && !allStatuses) sortOpts.score = { $meta: 'textScore' };
    else if (sort === 'price_asc') sortOpts.final_price = 1;
    else if (sort === 'price_desc') sortOpts.final_price = -1;
    else if (sort === 'newest') sortOpts.created_at = -1;
    else if (sort === 'discount') sortOpts.discount = -1;
    else sortOpts.created_at = -1;

    const [products, total, facetResult] = await Promise.all([
      Product.find(match, q && !allStatuses ? { score: { $meta: 'textScore' } } : {})
        .sort(sortOpts)
        .skip((page - 1) * limit)
        .limit(limit)
        .select('title slug thumbnail base_price final_price discount material is_new_arrival is_best_seller created_at')
        .lean(),
      Product.countDocuments(match),
      !q && !category
        ? Product.aggregate([
            { $match: { status: 'published' } },
            {
              $group: {
                _id: null,
                materials: { $addToSet: '$material' },
                minPrice: { $min: '$base_price' },
                maxPrice: { $max: '$base_price' },
              },
            },
          ])
        : Promise.resolve([]),
    ]);

    const facets = {
      materials: (facetResult[0] as { materials: string[] } | undefined)?.materials || [],
      priceRange: {
        min: (facetResult[0] as { minPrice: number } | undefined)?.minPrice || 0,
        max: (facetResult[0] as { maxPrice: number } | undefined)?.maxPrice || 100000,
      },
    };

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      facets,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[/api/products/search]', err);
    return NextResponse.json({ error: 'Search failed', detail: message }, { status: 500 });
  }
}
