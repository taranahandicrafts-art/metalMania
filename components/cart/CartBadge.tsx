'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store';

export function CartBadge({ className }: { className?: string }) {
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <Link
      href="/cart"
      className={cn(
        'relative flex h-9 w-9 items-center justify-center text-current opacity-80 transition-opacity hover:opacity-100',
        className,
      )}
      aria-label={`Cart with ${itemCount} items`}
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-lux-gold px-1 text-[10px] font-semibold text-lux-ink">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}
