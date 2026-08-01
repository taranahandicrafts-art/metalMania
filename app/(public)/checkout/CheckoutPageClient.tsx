'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart-store';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { DeliveryAddressForm } from '@/components/cart/DeliveryAddressForm';
import { formatPrice } from '@/lib/utils';
import { getWhatsAppOrderUrl } from '@/lib/whatsapp';

const REQUIRED_FIELDS = ['name', 'phone', 'line1', 'city', 'state', 'pincode', 'country'];

function validateAddress(addr: Record<string, string> | null): string | null {
  if (!addr) return 'Please fill in your delivery address';
  for (const field of REQUIRED_FIELDS) {
    if (!addr[field]?.trim()) {
      const label = field.charAt(0).toUpperCase() + field.slice(1);
      return `${label} is required`;
    }
  }
  const phone = addr.phone?.replace(/\D/g, '');
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return 'Please enter a valid 10-digit Indian phone number';
  }
  return null;
}

export default function CheckoutPageClient() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const items = useCartStore((s) => s.items);
  const address = useCartStore((s) => s.address);
  const notes = useCartStore((s) => s.notes);
  const setNotes = useCartStore((s) => s.setNotes);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getDiscount = useCartStore((s) => s.getDiscount);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getTotal();

  const handleWhatsAppOrder = () => {
    setError(null);
    const validationError = validateAddress(address);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const addr = address as Record<string, string>;
      const url = getWhatsAppOrderUrl({
        items: items.map((item) => ({
          title: item.title,
          sku: item.sku,
          quantity: item.quantity,
          unit_price: item.unit_price,
          variant_id: item.variant_id,
        })),
        address: {
          name: addr.name,
          phone: addr.phone.replace(/\D/g, ''),
          email: addr.email || undefined,
          line1: addr.line1,
          line2: addr.line2 || undefined,
          city: addr.city,
          state: addr.state,
          pincode: addr.pincode,
          country: addr.country || 'India',
        },
        subtotal,
        total,
        discount: discount && discount.amount > 0 ? discount : null,
        notes: notes || undefined,
      });

      window.open(url, '_blank');
      clearCart();
    } catch {
      setError('Failed to open WhatsApp. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="mt-4 text-sm text-muted-foreground">Your cart is empty. Add some items first.</p>
        <Link
          href="/products"
          className="mt-4 inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 pt-44 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-3">
          <DeliveryAddressForm />

          <div className="space-y-2">
            <label className="text-sm font-medium">Order Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Delivery instructions, preferred time, landmark, etc."
              rows={3}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border p-6">
            <h2 className="text-lg font-semibold">Order Summary</h2>

            <div className="mt-4 space-y-3 text-sm">
              {items.map((item) => (
                <div key={`${item.product_id}-${item.variant_id}`} className="flex justify-between gap-2">
                  <span className="text-muted-foreground">
                    {item.title}{item.variant_id ? ' (Variant)' : ''}
                    <span className="block text-xs">SKU: {item.sku} × {item.quantity}</span>
                  </span>
                  <span className="whitespace-nowrap">{formatPrice(item.unit_price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount && discount.amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>
                    Discount
                    {discount.type === 'percentage' && ` (${discount.value}% OFF)`}
                  </span>
                  <span>-{formatPrice(discount.amount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <button
            onClick={handleWhatsAppOrder}
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#20BD5C] disabled:opacity-50"
          >
            {submitting ? (
              'Opening WhatsApp...'
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Place Order via WhatsApp — {formatPrice(total)}
              </>
            )}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            You will be redirected to WhatsApp to confirm your order.
            We will respond to your order number shortly.
          </p>
        </div>
      </div>
    </div>
  );
}
