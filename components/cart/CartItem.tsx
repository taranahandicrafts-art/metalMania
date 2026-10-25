'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore, type CartItem as CartItemType } from '@/store/cart-store';
import { QuantityPicker } from '@/components/product/QuantityPicker';
import { formatPrice } from '@/lib/utils';

export function CartItem({ item }: { item: CartItemType }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  return (
    <div className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50 sm:gap-6">
      <Link
        href={`/products/${item.slug || item.product_id}`}
        className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-slate-200 sm:h-28 sm:w-28"
      >
        {item.thumbnail ? (
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-2">
        <div className="flex justify-between gap-4">
          <div className="min-w-0">
            <Link
              href={`/products/${item.slug || item.product_id}`}
              className="text-sm font-medium hover:underline sm:text-base"
            >
              {item.title}
            </Link>
          </div>
          <p className="flex-shrink-0 text-sm font-medium sm:text-base">
            {formatPrice(item.unit_price * item.quantity)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <QuantityPicker
            value={item.quantity}
            max={item.maxQuantity ?? 99}
            onChange={(q) => updateQuantity(item.product_id, q, item.variant_id)}
          />
          <button
            onClick={() => removeItem(item.product_id, item.variant_id)}
            className="text-xs text-slate-500 underline-offset-2 hover:text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
