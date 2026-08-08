'use client';

import { useCartStore } from '@/store/cart-store';
import { formatPrice } from '@/lib/utils';
import { CouponInput } from './CouponInput';
import Link from 'next/link';

export function CartSummary() {
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getDiscount = useCartStore((s) => s.getDiscount);
  const getTotal = useCartStore((s) => s.getTotal);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getTotal();

  if (items.length === 0) return null;

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold">Order Summary</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {discount && discount.amount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>
              Discount
              {discount.type === 'percentage' && ` (${discount.value}%)`}
            </span>
            <span>-{formatPrice(discount.amount)}</span>
          </div>
        )}

        <div className="border-t border-slate-200 pt-2">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <CouponInput />

      <Link
        href="/checkout"
        className="block rounded-md bg-slate-900 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-slate-800"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
