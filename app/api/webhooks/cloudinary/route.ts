import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Media from '@/models/Media';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Cloudinary webhook payload
    const { public_id, secure_url, resource_type, bytes, width, height, format, folder } = body;

    if (!public_id || !secure_url) {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }

    await connectDB();
    const media = await Media.create({
      public_id,
      url: secure_url,
      resource_type: resource_type || 'image',
      format: format || '',
      bytes,
      width: width || 0,
      height: height || 0,
      folder: folder || '/',
      tags: [],
      metadata: {},
    });

    return NextResponse.json({ success: true, mediaId: media._id });
  } catch {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
