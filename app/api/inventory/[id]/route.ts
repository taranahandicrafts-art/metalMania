import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Inventory from '@/models/Inventory';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const result = await Inventory.adjustStock(body.sku, body.quantity, body.reason, body.notes);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to adjust stock' }, { status: 500 });
  }
}
