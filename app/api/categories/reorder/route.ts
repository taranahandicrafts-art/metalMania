import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { orderedIds } = body;
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'orderedIds array required' }, { status: 400 });
    }
    const Category = (await import('@/models/Category')).default;
    const updates = orderedIds.map((id: string, index: number) =>
      Category.findByIdAndUpdate(id, { sort_order: index }),
    );
    await Promise.all(updates);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to reorder' }, { status: 500 });
  }
}
