'use client';

import { QuantityPicker } from '@/components/product/QuantityPicker';
import { useState } from 'react';
import { useCartStore } from '@/store/cart-store';

interface ClientProductActionsProps {
  productId: string;
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

  const handleAdd = () => {
    addItem({
      product_id: productId,
      variant_id: variantId ?? null,
      title,
      sku,
      thumbnail,
      unit_price: price,
      quantity,
      maxQuantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const outOfStock = stock !== undefined && stock <= 0;

  if (outOfStock) {
    return (
      <div className="rounded-md bg-muted px-6 py-3 text-center text-sm font-medium text-muted-foreground">
        Out of Stock
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <QuantityPicker value={quantity} onChange={setQuantity} />
      <button
        onClick={handleAdd}
        className={`flex-1 rounded-md px-6 py-3 text-sm font-medium transition-colors ${
          added ? 'bg-green-600 text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
      >
        {added ? 'Added to Cart!' : 'Add to Cart'}
      </button>
    </div>
  );
}
