'use client';

import { cn, formatPrice } from '@/lib/utils';
import type { WarrantyInfo, ShippingInfo } from '@/types';

interface ProductInfoProps {
  title: string;
  brand: string;
  material: string;
  base_price: number;
  final_price: number;
  discount: number;
  short_description: string;
  sku: string;
  warranty: WarrantyInfo;
  shipping: ShippingInfo;
}

export function ProductInfo({
  title,
  brand,
  material,
  base_price,
  final_price,
  discount,
  short_description,
  sku,
  warranty,
  shipping,
}: ProductInfoProps) {
  const hasDiscount = discount > 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">{brand}</p>
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">{title}</h1>
        <p className="mt-1 text-xs text-muted-foreground">SKU: {sku}</p>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold">{formatPrice(final_price)}</span>
        {hasDiscount && (
          <>
            <span className="text-lg text-muted-foreground line-through">{formatPrice(base_price)}</span>
            <span className="rounded bg-destructive/10 px-2 py-0.5 text-sm font-semibold text-destructive">
              -{discount}% OFF
            </span>
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <span className="rounded-md bg-[#d3dbf2] px-3 py-1">{material}</span>
        {shipping.free_shipping && (
          <span className="rounded-md bg-green-100 px-3 py-1 text-green-700">Free Shipping</span>
        )}
        {warranty.period && (
          <span className="rounded-md bg-blue-100 px-3 py-1 text-blue-700">{warranty.period} Warranty</span>
        )}
      </div>

      <p className="text-muted-foreground leading-relaxed">{short_description}</p>
    </div>
  );
}
