import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Media from '@/models/Media';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const folder = searchParams.get('folder');

    const query: Record<string, unknown> = {};
    if (type) query.resource_type = type;
    if (folder) query.folder = folder;

    const media = await Media.find(query).sort({ created_at: -1 }).lean();
    return NextResponse.json({ media });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const media = await Media.create(body);
    return NextResponse.json(media, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to save media' }, { status: 500 });
  }
}
