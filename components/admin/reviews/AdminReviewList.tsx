import { connectDB } from '@/lib/db';
import Review from '@/models/Review';
import { requirePermission } from '@/lib/auth-guard';
import { formatDate } from '@/lib/utils';
import { ReviewActions } from './ReviewActions';

export async function AdminReviewList() {
  await requirePermission('review:read');
  await connectDB();

  const reviews = await Review.find()
    .sort('-created_at')
    .populate('product_id', 'title slug')
    .lean();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reviews</h2>
        <p className="text-sm text-muted-foreground">Moderate customer reviews</p>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left font-medium text-muted-foreground">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Review</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No reviews yet</td>
              </tr>
            ) : (
              reviews.map((r) => {
                const product = r.product_id as unknown as { title: string; slug: string } | null;
                return (
                  <tr key={r._id.toString()} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{product?.title || 'Deleted product'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.user.name || r.user.email}</td>
                    <td className="px-4 py-3">
                      <span className="text-amber-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      <span className="ml-1 text-xs text-muted-foreground">{r.rating}/5</span>
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">{r.body || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        r.status === 'approved' ? 'bg-green-100 text-green-700' :
                        r.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(String(r.created_at))}</td>
                    <td className="px-4 py-3">
                      <ReviewActions reviewId={r._id.toString()} currentStatus={r.status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
