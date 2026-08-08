'use client';

import { formatPrice } from '@/lib/utils';

interface EstimatedDeliveryProps {
  min: number;
  max: number;
  freeShipping: boolean;
  flatRate: number | null;
}

export function EstimatedDelivery({ min, max, freeShipping, flatRate }: EstimatedDeliveryProps) {
  return (
    <div className="rounded-lg border border-[#e6e6e6] bg-white text-black p-4 text-sm">
      <div className="flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
        </svg>
        <span className="font-medium">Estimated Delivery</span>
      </div>
      <p className="mt-1 text-muted-foreground">
        {min}–{max} business days
      </p>
      <p className="text-xs text-muted-foreground">
        {freeShipping
          ? 'Free shipping'
          : flatRate
            ? `Flat rate ${formatPrice(flatRate)}`
            : 'Shipping calculated at checkout'}
      </p>
    </div>
  );
}
