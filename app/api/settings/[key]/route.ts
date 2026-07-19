import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Settings from '@/models/Settings';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  try {
    await connectDB();
    const setting = await Settings.findOne({ key }).lean();
    if (!setting) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(setting);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch setting' }, { status: 500 });
  }
}
