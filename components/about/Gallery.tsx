'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const GALLERY_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800',
    alt: 'Workshop artisan hand-finishing a table',
    span: 'col-span-1 row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800',
    alt: 'Modern living room with handcrafted furniture',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?q=80&w=800',
    alt: 'Wood grain detail on premium oak surface',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800',
    alt: 'Showroom displaying curated furniture collection',
    span: 'col-span-1 row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=800',
    alt: 'Precision joinery in progress',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=800',
    alt: 'Finished dining set in natural light',
    span: 'col-span-1 row-span-1',
  },
];

export function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-[#9A9590]">
            Behind the Scenes
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1A1714] sm:text-4xl">
            From our workshop to your home
          </h2>
        </div>

        <div
          ref={ref}
          className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
        >
          {GALLERY_IMAGES.map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group relative overflow-hidden bg-[#F5F3EF] ${img.span}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#1A1714]/0 transition-all duration-300 group-hover:bg-[#1A1714]/40" />
              <div className="absolute inset-0 flex items-end p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-sm font-medium text-white">{img.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
