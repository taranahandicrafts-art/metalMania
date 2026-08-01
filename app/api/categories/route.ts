import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Category from '@/models/Category';
import { mongoErrorMessage, isClientError } from '@/lib/api-error';

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ sort_order: 1 }).lean();
    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const category = await Category.create(body);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: mongoErrorMessage(error, 'Failed to create category') },
      { status: isClientError(error) ? 400 : 500 },
    );
  }
}
