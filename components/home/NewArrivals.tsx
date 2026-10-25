'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { SectionHeading, LuxProductCard, type LuxProduct } from './shared';

interface NewArrivalsProps {
  products: LuxProduct[];
}

export function NewArrivals({ products }: NewArrivalsProps) {
  const items = products;
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

  // Hide the section rather than show placeholder pieces that link nowhere.
  if (items.length === 0) return null;

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
            <a
              href="/products?is_new_arrival=true"
              className="mr-2 text-sm font-medium uppercase tracking-[0.14em] text-lux-ink hover:text-lux-gold"
            >
              View all
            </a>
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
        className="mt-14 pl-8 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-4 sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
