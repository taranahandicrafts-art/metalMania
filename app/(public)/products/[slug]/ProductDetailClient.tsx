'use client';

import { useState } from 'react';
import Link from 'next/link';
import { VariantSelector } from '@/components/product/VariantSelector';
import { ClientProductActions } from './ClientProductActions';
import { EstimatedDelivery } from '@/components/product/EstimatedDelivery';
import { ShareButtons } from '@/components/product/ShareButtons';
import { AvailabilityBadge } from '@/components/product/AvailabilityBadge';
import { ProductInfo } from '@/components/product/ProductInfo';
import type { WarrantyInfo, ShippingInfo } from '@/types';

interface ProductDetailClientProps {
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
  variants: {
    _id?: string;
    name: string;
    sku: string;
    attributes: { name: string; value: string }[];
    is_active: boolean;
  }[];
  allStock: number;
  stockBySku: Record<string, number>;
  productId: string;
  slug: string;
  thumbnail?: string;
  returnPolicy?: string;
}

export function ProductDetailClient({
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
  variants,
  allStock,
  stockBySku,
  productId,
  slug,
  thumbnail,
  returnPolicy,
}: ProductDetailClientProps) {
  const [selectedSku, setSelectedSku] = useState(sku);

  const selectedVariant = variants.find((v) => v.sku === selectedSku);
  const selectedStock = stockBySku[selectedSku?.toUpperCase()] ?? allStock;

  return (
    <div className="space-y-6">
      <ProductInfo
        title={title}
        brand={brand}
        material={material}
        base_price={base_price}
        final_price={final_price}
        discount={discount}
        short_description={short_description}
        sku={selectedVariant?.sku || sku}
        warranty={warranty || { period: '', description: '' }}
        shipping={shipping || { weight: 0, dimensions: { length: 0, width: 0, height: 0 }, flat_rate: null, free_shipping: false, estimated_days: { min: 3, max: 7 } }}
      />

      <AvailabilityBadge stock={selectedStock || 0} />

      <VariantSelector
        variants={variants}
        selectedSku={selectedSku}
        onSelect={setSelectedSku}
      />

      <ClientProductActions
        productId={productId}
        slug={slug}
        sku={selectedSku}
        title={title}
        price={final_price}
        thumbnail={thumbnail}
        variantId={selectedVariant?._id}
        stock={selectedStock}
        maxQuantity={selectedStock}
      />

      <EstimatedDelivery
        min={shipping?.estimated_days?.min || 3}
        max={shipping?.estimated_days?.max || 7}
        freeShipping={shipping?.free_shipping || false}
        flatRate={shipping?.flat_rate || null}
      />

      <div className="rounded-lg border border-[#e6e6e6] bg-white p-4 text-sm text-black">
        <span className="font-medium">30-Day Returns</span>
        <p className="mt-1 text-muted-foreground">
          {returnPolicy || 'Not happy with your piece? Return it within 30 days of delivery for a full refund.'}{' '}
          <Link href="/returns" className="underline underline-offset-2 hover:text-black">
            Read the return policy
          </Link>
        </p>
      </div>

      <ShareButtons title={title} />
    </div>
  );
}