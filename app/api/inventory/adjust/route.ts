import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Inventory from '@/models/Inventory';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { sku, type, quantity, note } = await req.json();

    if (!sku) {
      return NextResponse.json({ error: 'SKU is required' }, { status: 400 });
    }

    let record = await Inventory.findOne({ sku: sku.toUpperCase() });
    if (!record) {
      return NextResponse.json({ error: `Inventory record not found for SKU: ${sku}` }, { status: 404 });
    }

    switch (type) {
      case 'add':
        record.stock += quantity;
        break;
      case 'set':
        record.stock = Math.max(0, quantity);
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    if (note) {
      (record as unknown as Record<string, unknown>).last_note = note;
    }

    await record.save();

    return NextResponse.json({ success: true, stock: record.stock, available: record.available });
  } catch {
    return NextResponse.json({ error: 'Failed to adjust stock' }, { status: 500 });
  }
}
