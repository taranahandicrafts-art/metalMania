import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Inventory from '@/models/Inventory';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { sku, quantity, reason, notes } = await req.json();
    const result = await Inventory.adjustStock(sku, quantity, reason, notes);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Stock validation failed' }, { status: 500 });
  }
}
