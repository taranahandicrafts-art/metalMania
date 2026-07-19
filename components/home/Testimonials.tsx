'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { SectionHeading } from './shared';

interface Testimonial {
  _id: string;
  name: string;
  text: string;
  rating: number;
  image?: string | null;
  location?: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const FALLBACK: Testimonial[] = [
  { _id: 't1', name: 'Ananya Mehta', location: 'Mumbai', rating: 5, image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400', text: 'The craftsmanship is extraordinary. Our dining table arrived like a piece of sculpture — the delivery team placed it, levelled it, and left the room spotless.' },
  { _id: 't2', name: 'Rohan Kapoor', location: 'Bengaluru', rating: 5, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400', text: 'I was choosing between a few studios and nothing came close. The oak has aged into the most beautiful patina. It genuinely feels like an heirloom already.' },
  { _id: 't3', name: 'Priya Nair', location: 'Delhi', rating: 5, image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=400', text: 'From swatches to the final placement, the consultant made everything effortless. The bouclé sofa is the softest, most considered thing in our home.' },
  { _id: 't4', name: 'Karan Shah', location: 'Pune', rating: 5, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400', text: 'You feel the difference the moment you touch it. Weighty brass, flawless joints, a finish with real depth. Worth every rupee and then some.' },
];

export function Testimonials({ testimonials }: TestimonialsProps) {
  const items = testimonials.length > 0 ? testimonials : FALLBACK;
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const go = useCallback(
    (next: number, direction: number) => {
      setDir(direction);
      setCurrent((next + items.length) % items.length);
    },
    [items.length],
  );

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const id = setInterval(() => go(current + 1, 1), 6500);
    return () => clearInterval(id);
  }, [current, paused, items.length, go]);

  const t = items[current];

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: reduceMotion ? 0 : d * 60, filter: 'blur(6px)' }),
    center: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: (d: number) => ({ opacity: 0, x: reduceMotion ? 0 : d * -60, filter: 'blur(6px)' }),
  };

  return (
    <section className="relative overflow-hidden bg-lux-soft py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="In their words"
          title="Homes that speak for us"
          description="A few notes from the people who now live with our work."
        />

        <div
          className="relative mx-auto mt-16 max-w-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Oversized quotation mark */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 font-display text-[10rem] leading-none text-lux-sand"
          >
            &ldquo;
          </span>

          <div className="relative min-h-[19rem] sm:min-h-[16rem]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.figure
                key={t._id}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative text-center"
              >
                <div className="mb-6 flex justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i < t.rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" className={i < t.rating ? 'text-lux-gold' : 'text-lux-desert/50'}>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>

                <blockquote className="font-display text-2xl leading-relaxed text-lux-charcoal sm:text-[1.7rem] sm:leading-[1.5]">
                  {t.text}
                </blockquote>

                <figcaption className="mt-8 flex items-center justify-center gap-4">
                  {t.image && (
                    <span className="relative h-12 w-12 overflow-hidden rounded-full ring-1 ring-lux-sand">
                      <Image src={t.image} alt={t.name} fill className="object-cover" sizes="48px" />
                    </span>
                  )}
                  <span className="text-left">
                    <span className="block text-sm font-medium text-lux-ink">{t.name}</span>
                    {t.location && (
                      <span className="block text-xs uppercase tracking-[0.16em] text-lux-stone">{t.location}</span>
                    )}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {items.length > 1 && (
            <div className="mt-12 flex items-center justify-center gap-5">
              <button onClick={() => go(current - 1, -1)} aria-label="Previous testimonial" className="flex h-11 w-11 items-center justify-center rounded-full border border-lux-graphite/25 text-lux-ink transition-colors hover:border-lux-ink hover:bg-lux-ink hover:text-lux-soft">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <div className="flex gap-2">
                {items.map((item, i) => (
                  <button key={item._id} onClick={() => go(i, i > current ? 1 : -1)} aria-label={`Go to testimonial ${i + 1}`} className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'w-8 bg-lux-gold' : 'w-1.5 bg-lux-desert/60 hover:bg-lux-stone'}`} />
                ))}
              </div>
              <button onClick={() => go(current + 1, 1)} aria-label="Next testimonial" className="flex h-11 w-11 items-center justify-center rounded-full border border-lux-graphite/25 text-lux-ink transition-colors hover:border-lux-ink hover:bg-lux-ink hover:text-lux-soft">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
