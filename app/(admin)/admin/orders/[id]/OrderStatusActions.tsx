'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface OrderStatusActionsProps {
  orderId: string;
  currentStatus: string;
  validTransitions: string[];
}

export function OrderStatusActions({ orderId, currentStatus, validTransitions }: OrderStatusActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Change status to "${newStatus}"?`)) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update status');
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this order permanently?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      if (res.ok) router.push('/admin/orders');
    } catch {
      setError('Failed to delete order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}

      <div className="flex items-center gap-1">
        {['new', 'pending', 'contacted', 'closed', 'cancelled'].map((s) => {
          const isCurrent = s === currentStatus;
          const isAllowed = validTransitions.includes(s);
          return (
            <button
              key={s}
              onClick={() => isAllowed && handleStatusChange(s)}
              disabled={loading || isCurrent || !isAllowed}
              className={`h-9 rounded-md px-3 text-xs font-medium transition-colors disabled:opacity-50 ${
                isCurrent
                  ? 'bg-primary text-primary-foreground'
                  : isAllowed
                    ? 'border bg-background hover:bg-muted'
                    : 'border border-dashed text-muted-foreground/50 cursor-not-allowed'
              }`}
              title={!isAllowed && !isCurrent ? `Cannot transition from ${currentStatus}` : ''}
            >
              {s}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-sm text-destructive hover:text-destructive/80 underline underline-offset-2"
      >
        Delete order
      </button>
    </div>
  );
}
