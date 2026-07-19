'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

interface Review {
  _id: string;
  user: { name: string; email: string };
  rating: number;
  title: string | null;
  body: string;
  created_at: string;
  is_verified_purchase: boolean;
}

interface ProductTabsProps {
  description: string;
  reviews: Review[];
  avgRating: number;
  ratingCounts: number[];
}

export function ProductTabs({ description, reviews, avgRating, ratingCounts }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  const totalReviews = ratingCounts.reduce((a, b) => a + b, 0);

  return (
    <div className="mt-16">
      <div className="flex border-b">
        {(['description', 'reviews'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-6 py-3 text-sm font-medium transition-colors',
              activeTab === tab
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab === 'description' ? 'Description' : `Reviews (${totalReviews})`}
          </button>
        ))}
      </div>

      <div className="py-6">
        {activeTab === 'description' && (
          <div className="prose prose-sm max-w-none text-muted-foreground">
            {description ? (
              description.split('\n').map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p className="text-muted-foreground/60">No description available.</p>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
            <div className="text-center lg:text-left">
              <p className="text-5xl font-bold">{avgRating}</p>
              <div className="mt-2 text-lg text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={star <= Math.round(avgRating) ? '' : 'text-muted-foreground/30'}>
                    ★
                  </span>
                ))}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{totalReviews} reviews</p>

              <div className="mt-4 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingCounts[star - 1] || 0;
                  const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="w-3">{star}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right text-muted-foreground">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No reviews yet.</p>
              ) : (
                reviews.map((r) => (
                  <div key={r._id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{r.user.name}</p>
                        <div className="text-amber-500">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span key={s} className={s <= r.rating ? '' : 'text-muted-foreground/30'}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        {r.is_verified_purchase && <p className="text-green-600">Verified Purchase</p>}
                        <p>{formatDate(r.created_at)}</p>
                      </div>
                    </div>
                    {r.title && <p className="mt-2 text-sm font-medium">{r.title}</p>}
                    <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
