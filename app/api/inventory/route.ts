import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Inventory from '@/models/Inventory';

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
    }

    const record = await Inventory.create(body);
    return NextResponse.json(record, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create inventory record' }, { status: 500 });
  }
}
