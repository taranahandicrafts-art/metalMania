'use client';

import { cn } from '@/lib/utils';

interface AvailabilityBadgeProps {
  stock: number;
  threshold?: number;
}

export function AvailabilityBadge({ stock, threshold = 5 }: AvailabilityBadgeProps) {
  if (stock <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        Out of Stock
      </span>
    );
  }

  if (stock <= threshold) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
        <span className="h-2 w-2 rounded-full bg-amber-500" />
        Only {stock} left
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
      <span className="h-2 w-2 rounded-full bg-green-500" />
      In Stock
    </span>
  );
}
