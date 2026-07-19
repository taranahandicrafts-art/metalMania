import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ProductVariant from '@/models/ProductVariant';
import Product from '@/models/Product';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await connectDB();
    const variants = await ProductVariant.find({ product_id: id }).sort('sort_order').lean();
    return NextResponse.json({ variants });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch variants' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await connectDB();
    const body = await req.json();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await ProductVariant.deleteMany({ product_id: id });

    const variants = body.variants || [];
    if (variants.length > 0) {
      const docs = variants.map((v: Record<string, unknown>, i: number) => {
        const attrs = (v.attributes as { name: string; value: string }[]) || [];
        return {
          product_id: id,
          type: attrs.length > 0 ? attrs[0].name.toLowerCase() : 'default',
          name: (v.title as string) || '',
          sku: (v.sku as string) || '',
          price: (v.price_adjustment as number) || null,
          stock: (v.stock as number) || 0,
          is_active: v.is_active !== undefined ? (v.is_active as boolean) : true,
          sort_order: i,
          metadata: Object.fromEntries(attrs.map((a) => [a.name, a.value])),
          images: (v.images as string[])?.map((url: string) => ({ url, alt: '' })) || [],
        };
      });

      await ProductVariant.insertMany(docs);
    }

    product.has_variants = variants.length > 0;
    await product.save();

    return NextResponse.json({ success: true, count: variants.length });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update variants' }, { status: 500 });
  }
}
