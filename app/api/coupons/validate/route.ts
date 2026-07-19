import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Coupon from '@/models/Coupon';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { code, subtotal } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const coupon = await Coupon.validateCoupon(code, subtotal ?? 0);

    if (!coupon) {
      return NextResponse.json({ error: 'Invalid or expired coupon' }, { status: 400 });
    }

    return NextResponse.json({
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        max_discount: coupon.max_discount,
      },
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
