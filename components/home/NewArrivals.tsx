'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { SectionHeading, LuxProductCard, type LuxProduct } from './shared';

interface NewArrivalsProps {
  products: LuxProduct[];
}

const FALLBACK: LuxProduct[] = [
  { _id: 'n1', title: 'Aria travertine coffee table', slug: 'aria-coffee-table', thumbnail: 'https://images.unsplash.com/photo-1554295405-abb8fd54f153?q=80&w=1200', base_price: 42000, final_price: 42000, discount: 0, material: 'Travertine', is_new_arrival: true, is_best_seller: false, rating: 5, review_count: 12, short_description: 'A softly veined stone top on a sculpted plinth base.' },
  { _id: 'n2', title: 'Linnea linen bed', slug: 'linnea-bed', thumbnail: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200', base_price: 58000, final_price: 58000, discount: 0, material: 'Belgian linen', is_new_arrival: true, is_best_seller: false, rating: 5, review_count: 9, short_description: 'A fully upholstered headboard in washed natural linen.' },
  { _id: 'n3', title: 'Sten oak sideboard', slug: 'sten-sideboard', thumbnail: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1200', base_price: 64000, final_price: 64000, discount: 0, material: 'White oak', is_new_arrival: true, is_best_seller: false, rating: 4, review_count: 7, short_description: 'Fluted doors and solid brass pulls, soft-close throughout.' },
  { _id: 'n4', title: 'Corso boucle armchair', slug: 'corso-armchair', thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200', base_price: 34000, final_price: 34000, discount: 0, material: 'Bouclé', is_new_arrival: true, is_best_seller: false, rating: 5, review_count: 15, short_description: 'A curved shell that wraps you in soft ivory bouclé.' },
  { _id: 'n5', title: 'Vale walnut desk', slug: 'vale-desk', thumbnail: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1200', base_price: 48000, final_price: 48000, discount: 0, material: 'Walnut', is_new_arrival: true, is_best_seller: false, rating: 5, review_count: 5, short_description: 'A slim writing desk with a leather-lined drawer.' },
  { _id: 'n6', title: 'Mira woven pendant', slug: 'mira-pendant', thumbnail: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1200', base_price: 22000, final_price: 22000, discount: 0, material: 'Rattan', is_new_arrival: true, is_best_seller: false, rating: 4, review_count: 8, short_description: 'Hand-woven rattan casting warm, dappled light.' },
];

export function NewArrivals({ products }: NewArrivalsProps) {
  const items = products.length > 0 ? products : FALLBACK;
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    return () => {
      el.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
  }, [updateEdges]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.8, 640);
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  const arrowBase =
    'flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed';

  return (
    <section className="relative overflow-hidden bg-lux-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow="Just arrived"
            title="New this season"
            description="The latest additions to the atelier — fresh silhouettes, materials and finishes, released in small runs."
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={atStart}
              aria-label="Previous arrivals"
              className={`${arrowBase} border-lux-graphite/30 text-lux-ink hover:border-lux-ink hover:bg-lux-ink hover:text-lux-soft`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={atEnd}
              aria-label="Next arrivals"
              className={`${arrowBase} border-lux-graphite/30 text-lux-ink hover:border-lux-ink hover:bg-lux-ink hover:text-lux-soft`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-4 sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Leading spacer to align first card with the max-w container gutter on wide screens */}
        <div aria-hidden className="hidden shrink-0 lg:block lg:w-[max(0px,calc((100vw-80rem)/2))]" />
        {items.map((product) => (
          <div
            key={product._id}
            className="w-[75vw] shrink-0 snap-start sm:w-[45vw] md:w-[34vw] lg:w-[22rem]"
          >
            <LuxProductCard product={product} />
          </div>
        ))}
        <div aria-hidden className="shrink-0 pr-1 sm:pr-3 lg:pr-8" />
      </div>
    </section>
  );
}
