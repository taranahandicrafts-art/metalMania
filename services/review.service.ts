import { connectDB } from '@/lib/db';
import Review from '@/models/Review';

export async function approveReview(id: string) {
  await connectDB();
  return Review.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
}

export async function rejectReview(id: string) {
  await connectDB();
  return Review.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
}

export async function deleteReview(id: string) {
  await connectDB();
  return Review.findByIdAndDelete(id);
}

export async function addAdminReply(id: string, reply: { text: string; author: string }) {
  await connectDB();
  return Review.findByIdAndUpdate(
    id,
    {
      admin_reply: {
        text: reply.text,
        author: reply.author,
        replied_at: new Date(),
      },
      is_approved: true,
      status: 'approved',
    },
    { new: true },
  );
}

export async function togglePin(id: string) {
  await connectDB();
  const review = await Review.findById(id);
  if (!review) throw new Error('Review not found');
  review.is_pinned = !review.is_pinned;
  return review.save();
}

export async function listReviews(options: {
  page?: number;
  limit?: number;
  productId?: string;
  status?: string;
}) {
  await connectDB();
  const { page = 1, limit = 20, productId, status } = options;

  const query: Record<string, unknown> = {};
  if (productId) query.product_id = productId;
  if (status) query.status = status;

  const [reviews, total] = await Promise.all([
    Review.find(query).sort({ created_at: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Review.countDocuments(query),
  ]);

  return { reviews, total, page, totalPages: Math.ceil(total / limit) };
}
