'use client';

import { useCartStore } from '@/store/cart-store';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCart } from '@/components/cart/EmptyCart';

export default function CartPageClient() {
  const items = useCartStore((s) => s.items);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pt-44 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>

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
  );
}
