'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Meera Joshi',
    location: 'Mumbai',
    rating: 5,
    text: 'The Oxford bed frame is absolutely stunning. The craftsmanship is evident in every detail — from the perfectly aligned joints to the silky smooth finish. Our bedroom has never looked this elegant.',
    product: 'Oxford solid wood bed frame',
  },
  {
    id: 2,
    name: 'Sanjay Verma',
    location: 'Bangalore',
    rating: 5,
    text: 'We furnished our entire living room with their collection. Three years later, every piece still looks as pristine as the day it was delivered. This is furniture built to last generations.',
    product: 'Living room collection',
  },
  {
    id: 3,
    name: 'Deepa Nair',
    location: 'Delhi',
    rating: 5,
    text: 'The customization service was exceptional. They helped us design a dining table that perfectly fits our space. The attention to detail and the quality of the sheesham wood is remarkable.',
    product: 'Custom dining table',
  },
  {
    id: 4,
    name: 'Arvind Mehta',
    location: 'Hyderabad',
    rating: 5,
    text: 'White-glove delivery was impressive — they assembled everything and even cleaned up. The sofa is incredibly comfortable and the fabric quality is premium. Worth every rupee.',
    product: 'Cambridge sofa set',
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent(
      (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
    );
  }, []);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next, paused]);

  const t = TESTIMONIALS[current];

  return (
    <section className="bg-[#1A1714] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-[#9A9590]">
            Testimonials
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            What our customers say
          </h2>
        </div>

        <div
          className="relative mt-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="mx-auto max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="mx-auto mb-6 flex justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill={i < t.rating ? '#B8956A' : 'none'}
                      stroke="#B8956A"
                      strokeWidth="1.5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>

                <svg
                  className="mx-auto mb-6 text-[#B8956A]/30"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <blockquote className="text-lg leading-relaxed text-white/80 sm:text-xl">
                  &ldquo;{t.text}&rdquo;
                </blockquote>

                <div className="mt-8">
                  <p className="font-medium text-white">{t.name}</p>
                  <p className="mt-1 text-sm text-white/50">
                    {t.location} &middot; {t.product}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center border border-white/20 text-white/60 transition-all hover:border-[#B8956A] hover:text-[#B8956A]"
              aria-label="Previous testimonial"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 transition-all duration-300 ${
                    i === current
                      ? 'w-6 bg-[#B8956A]'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center border border-white/20 text-white/60 transition-all hover:border-[#B8956A] hover:text-[#B8956A]"
              aria-label="Next testimonial"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
