import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { folder, public_id } = body;

    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: folder || 'furniture', ...(public_id ? { public_id } : {}) },
      process.env.CLOUDINARY_API_SECRET!,
    );

    return NextResponse.json({ timestamp, signature, folder: folder || 'furniture' });
  } catch {
    return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
  }
}
