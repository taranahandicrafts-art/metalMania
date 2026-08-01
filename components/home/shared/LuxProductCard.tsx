import Image from 'next/image';
import Link from 'next/link';
import { cn, formatPrice } from '@/lib/utils';

export interface LuxProduct {
  _id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  base_price: number;
  final_price: number;
  discount: number;
  material: string;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  rating?: number;
  review_count?: number;
  short_description?: string;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={i < Math.round(rating) ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
          className={i < Math.round(rating) ? 'text-lux-gold' : 'text-lux-desert/60'}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

interface LuxProductCardProps {
  product: LuxProduct;
  className?: string;
}

/** Premium product card — soft-zoom photography, hover quick actions, editorial detail. */
export function LuxProductCard({ product, className }: LuxProductCardProps) {
  const hasDiscount = product.discount > 0;
  const price = product.final_price || product.base_price;

  return (
    <article className={cn('group relative flex h-full flex-col', className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-lux-sand">
        <Link href={`/products/${product.slug}`} aria-label={product.title} className="absolute inset-0 z-10">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 24vw"
              className="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-lux-desert">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m3 16 4-4 3 3 5-5 6 6" />
              </svg>
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute left-4 top-4 z-20 flex flex-col gap-2">
          {hasDiscount && (
            <span className="rounded-full bg-lux-ink px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-lux-soft">
              −{product.discount}%
            </span>
          )}
          {product.is_new_arrival && (
            <span className="rounded-full bg-lux-gold px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-lux-ink">
              New
            </span>
          )}
        </div>

        {/* Hover quick actions */}
        <div className="pointer-events-none absolute inset-x-4 bottom-4 z-20 flex translate-y-3 items-center gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <Link
            href={`/products/${product.slug}`}
            className="pointer-events-auto flex h-11 flex-1 items-center justify-center rounded-full bg-lux-soft/95 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-lux-ink backdrop-blur transition-colors hover:bg-lux-gold hover:text-lux-ink"
          >
            View piece
          </Link>
          <button
            type="button"
            aria-label="Save to wishlist"
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-lux-soft/95 text-lux-ink backdrop-blur transition-colors hover:bg-lux-ink hover:text-lux-soft"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Detail */}
      <div className="flex flex-1 flex-col px-1 pt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-lux-stone">{product.material || 'Signature'}</p>
          {typeof product.rating === 'number' && product.rating > 0 && (
            <span className="flex items-center gap-1.5">
              <Stars rating={product.rating} />
              {product.review_count ? (
                <span className="text-[0.68rem] text-lux-ash">({product.review_count})</span>
              ) : null}
            </span>
          )}
        </div>

        <h3 className="mt-2 font-display text-lg leading-snug text-lux-ink transition-colors group-hover:text-lux-gold-dark">
          <Link href={`/products/${product.slug}`}>{product.title}</Link>
        </h3>

        {product.short_description && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-lux-stone">
            {product.short_description}
          </p>
        )}

        <div className="mt-3 flex items-baseline gap-2.5 pt-1">
          <span className="text-base font-medium text-lux-ink">{formatPrice(price)}</span>
          {hasDiscount && (
            <span className="text-sm text-lux-ash line-through">{formatPrice(product.base_price)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
