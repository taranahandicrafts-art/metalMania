import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import FAQ from '@/models/FAQ';
import { getAuthSession } from '@/lib/auth-guard';

export async function GET() {
  try {
    await connectDB();
    const faqs = await FAQ.find({ is_active: true })
      .sort({ sort_order: 1, created_at: 1 })
      .lean();
    return NextResponse.json({ faqs });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { question, answer, sort_order, is_active } = body;

    if (!question?.trim() || !answer?.trim()) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }

    const faq = await FAQ.create({ question, answer, sort_order: sort_order ?? 0, is_active: is_active ?? true });
    return NextResponse.json(faq, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
  }
}
