import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { getAuthSession } from '@/lib/auth-guard';
import { mongoErrorMessage, isClientError } from '@/lib/api-error';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Only authenticated staff may view non-published products or use admin
    // filters. Anonymous visitors always see published products only, regardless
    // of the `admin`/`status` query parameters they supply.
    const session = await getAuthSession();
    const requestedStatus = searchParams.get('status');
    const wantsAdmin = searchParams.get('admin') === 'true';

    const query: Record<string, unknown> = {};
    if (session && (wantsAdmin || requestedStatus)) {
      if (requestedStatus) query.status = requestedStatus;
    } else {
      query.status = 'published';
    }
    if (category) query.category_id = category;
    if (search) {
      const re = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [{ title: re }, { sku: re }];
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ created_at: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: mongoErrorMessage(error, 'Failed to create product') },
      { status: isClientError(error) ? 400 : 500 },
    );
  }
}
