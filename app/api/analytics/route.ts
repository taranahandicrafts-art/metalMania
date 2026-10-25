import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import Analytics from '@/models/Analytics';

export async function GET() {
  try {
    await connectDB();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const events = await Analytics.find({ timestamp: mongoose.trusted({ $gte: thirtyDaysAgo }) }).sort({ timestamp: -1 }).lean();
    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const event = await Analytics.create(body);
    return NextResponse.json(event, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to record event' }, { status: 500 });
  }
}
