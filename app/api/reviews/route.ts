import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Review from '@/models/Review';
import { getAuthSession } from '@/lib/auth-guard';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const status = searchParams.get('status');
    const session = await getAuthSession();

    const query: Record<string, unknown> = {};
    if (productId) query.product_id = productId;
    // Anonymous visitors only ever see approved reviews. Authenticated staff may
    // filter by status (e.g. to moderate pending/rejected reviews).
    if (session) {
      if (status) query.status = status;
    } else {
      query.status = 'approved';
    }

    const reviews = await Review.find(query).sort({ created_at: -1 }).lean();
    return NextResponse.json({ reviews });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    // Customer-submitted reviews are always created as pending; approval and
    // pinning are controlled exclusively by admin moderation.
    const review = await Review.create({
      ...body,
      is_approved: false,
      is_pinned: false,
      status: 'pending',
    });
    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
