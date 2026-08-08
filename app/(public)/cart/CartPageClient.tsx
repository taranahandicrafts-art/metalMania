'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart-store';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCart } from '@/components/cart/EmptyCart';

export default function CartPageClient() {
  const items = useCartStore((s) => s.items);
  const patchItem = useCartStore((s) => s.patchItem);

  useEffect(() => {
    const itemsMissingSlug = items.filter((i) => !i.slug);
    if (itemsMissingSlug.length === 0) return;

    itemsMissingSlug.forEach(async (item) => {
      try {
        const res = await fetch(`/api/products/${item.product_id}`);
        if (!res.ok) return;
        const product = await res.json();
        if (product?.slug) patchItem(item.product_id, { slug: product.slug });
      } catch {
        // silently skip — link falls back to product_id
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-white text-slate-900">
    <div className="mx-auto max-w-7xl px-4 py-8 pt-50 md:pt-44 sm:px-6 lg:px-8">

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <CartItem key={`${item.product_id}-${item.variant_id}`} item={item} />
            ))}
          </div>
          <div className="lg:sticky lg:top-24 lg:self-start">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
