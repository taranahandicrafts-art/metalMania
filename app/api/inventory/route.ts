import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Inventory from '@/models/Inventory';
import Product from '@/models/Product';
import { mongoErrorMessage, isClientError } from '@/lib/api-error';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const query: Record<string, unknown> = {};
    if (productId) query.product_id = productId;

    const records = await Inventory.find(query).sort({ created_at: -1 }).lean();
    return NextResponse.json({ records });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (body.sku) {
      const existing = await Inventory.findOne({ sku: body.sku.toUpperCase() });
      if (existing) {
        const type = body.type || 'add';
        if (type === 'add') existing.stock += body.quantity;
        else if (type === 'set') existing.stock = Math.max(0, body.quantity);
        await existing.save();
        return NextResponse.json(existing);
      }
      // No inventory record yet — look up the product by SKU and auto-create one.
      const productId = body.product_id;
      if (!productId) {
        const product = await Product.findOne({ sku: body.sku.toUpperCase() }).lean();
        if (!product) {
          return NextResponse.json(
            { error: `No product found for SKU "${body.sku.toUpperCase()}". Create the product first.` },
            { status: 404 },
          );
        }
        const initialStock = Math.max(0, Number(body.quantity));
        const newRecord = await Inventory.create({
          product_id: product._id,
          sku: body.sku.toUpperCase(),
          stock: initialStock,
        });
        return NextResponse.json(newRecord, { status: 201 });
      }
    }

    const record = await Inventory.create(body);
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: mongoErrorMessage(error, 'Failed to create inventory record') },
      { status: isClientError(error) ? 400 : 500 },
    );
  }
}
