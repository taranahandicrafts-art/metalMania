import Image from 'next/image';
import Link from 'next/link';
import { cn, formatPrice } from '@/lib/utils';

export interface ProductCardData {
  _id: string;
  title: string;
  slug: string;
  thumbnail: string;
  base_price: number;
  final_price: number;
  discount: number;
  material: string;
  is_new_arrival: boolean;
  is_best_seller: boolean;
}

interface ProductCardProps {
  product: ProductCardData;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.discount > 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative block overflow-hidden rounded-lg bg-white text-black"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m3 16 4-4 3 3 5-5 6 6"/></svg>
          </div>
        )}

        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded bg-destructive px-2 py-0.5 text-xs font-semibold text-destructive-foreground">
            -{product.discount}%
          </span>
        )}

        {product.is_new_arrival && !hasDiscount && (
          <span className="absolute left-3 top-3 rounded bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
            New
          </span>
        )}

        <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/5" />
      </div>

      <div className="space-y-1 p-4">
        <p className="text-xs text-muted-foreground">{product.material}</p>
        <h3 className="font-medium leading-tight transition-colors group-hover:text-primary">
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
          {hasDiscount ? (
            <>
              <span className="font-semibold">{formatPrice(product.final_price)}</span>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.base_price)}
              </span>
            </>
          ) : (
            <span className="font-semibold">{formatPrice(product.final_price || product.base_price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
