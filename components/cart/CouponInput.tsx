'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cart-store';
import { cn } from '@/lib/utils';

export function CouponInput() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const coupon = useCartStore((s) => s.coupon);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);

  const handleApply = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid coupon');
        return;
      }
      applyCoupon(data.coupon);
      setCode('');
    } catch {
      setError('Failed to validate coupon');
    } finally {
      setLoading(false);
    }
  };

  if (coupon) {
    return (
      <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm">
        <span className="font-medium text-green-600">{coupon.code}</span>
        <button
          onClick={removeCoupon}
          className="text-xs text-muted-foreground underline-offset-2 hover:text-destructive hover:underline"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Coupon Code</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => { setCode(e.target.value); setError(''); }}
          placeholder="Enter coupon"
          className="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
        />
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className={cn(
            'rounded-md px-4 py-2 text-sm font-medium transition-colors',
            loading
              ? 'bg-muted text-muted-foreground'
              : 'bg-primary text-primary-foreground hover:bg-primary/90',
          )}
        >
          {loading ? '...' : 'Apply'}
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
