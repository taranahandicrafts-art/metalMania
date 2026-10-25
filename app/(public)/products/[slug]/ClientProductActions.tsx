'use client';

import { QuantityPicker } from '@/components/product/QuantityPicker';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cart-store';
import { encodeWhatsAppUrl } from '@/lib/whatsapp';
import { SITE_URL } from '@/lib/constants';

interface ClientProductActionsProps {
  productId: string;
  slug: string;
  sku: string;
  title: string;
  price: number;
  thumbnail?: string;
  stock?: number;
  variantId?: string;
  maxQuantity?: number;
}

export function ClientProductActions({
  productId,
  slug,
  sku,
  title,
  price,
  thumbnail,
  stock,
  variantId,
  maxQuantity,
}: ClientProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const inCart = useCartStore(
    (s) =>
      s.items.find((i) => i.product_id === productId && (i.variant_id ?? null) === (variantId ?? null))
        ?.quantity ?? 0,
  );

  const limit = maxQuantity ?? stock;
  // Units the customer can still add, after what's already in their cart.
  const remaining = limit === undefined ? 99 : Math.max(0, limit - inCart);

  useEffect(() => {
    setQuantity((q) => Math.max(1, Math.min(q, remaining || 1)));
  }, [remaining]);

  const handleAdd = () => {
    if (remaining <= 0) return;
    addItem({
      product_id: productId,
      variant_id: variantId ?? null,
      slug,
      title,
      sku,
      thumbnail,
      unit_price: price,
      quantity: Math.min(quantity, remaining),
      maxQuantity: limit,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const outOfStock = stock !== undefined && stock <= 0;

  if (outOfStock) {
    const pageUrl = `${SITE_URL.replace(/\/$/, '')}/products/${slug}`;
    const interestUrl = encodeWhatsAppUrl(
      `Hi! I'm interested in "${title}", which is currently out of stock. Please let me know when it's available.\n${pageUrl}`,
    );
    return (
      <div className="space-y-2">
        <a
          href={interestUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1ebe5a]"
        >
          I&apos;m interested — ask on WhatsApp
        </a>
        <p className="text-center text-xs text-muted-foreground">
          This piece is out of stock. Message us and we&apos;ll let you know when it&apos;s back.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <QuantityPicker value={quantity} onChange={setQuantity} max={Math.max(1, remaining)} />
        <button
          onClick={handleAdd}
          disabled={remaining <= 0}
          className={`flex-1 rounded-md px-6 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
            added ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-primary/90'
          }`}
        >
          {added ? 'Added to Cart!' : remaining <= 0 ? 'Max quantity in cart' : 'Add to Cart'}
        </button>
      </div>
      {limit !== undefined && limit <= 5 && (
        <p className="text-xs text-amber-700">
          Only {limit} left in stock{inCart > 0 ? ` (${inCart} in your cart)` : ''}.
        </p>
      )}
    </div>
  );
}
