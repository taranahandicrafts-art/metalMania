'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ReviewActions({ reviewId, currentStatus }: { reviewId: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: string) => {
    setLoading(true);
    try {
      await fetch(`/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action }),
      });
      router.refresh();
    } catch {
      // silently fail
    }
    setLoading(false);
  };

  if (loading) return <span className="text-xs text-muted-foreground">Updating...</span>;

  return (
    <div className="flex items-center gap-2">
      {currentStatus !== 'approved' && (
        <button onClick={() => handleAction('approved')} className="text-xs text-green-600 underline underline-offset-2 hover:text-green-700">
          Approve
        </button>
      )}
      {currentStatus !== 'rejected' && (
        <button onClick={() => handleAction('rejected')} className="text-xs text-red-600 underline underline-offset-2 hover:text-red-700">
          Reject
        </button>
      )}
      {currentStatus !== 'pending' && (
        <button onClick={() => handleAction('pending')} className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">
          Reset
        </button>
      )}
    </div>
  );
}
