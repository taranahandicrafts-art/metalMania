'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function AboutHero() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-[#1A1714]">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1714]/70 via-[#1A1714]/50 to-[#1A1714]/80" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-sm font-medium tracking-[0.2em] uppercase text-[#B8956A]"
        >
          Since 2008
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-4xl font-light tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Our Story
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-6 h-px w-24 bg-[#B8956A]"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/70"
        >
          Crafting timeless furniture that transforms houses into homes. Every
          piece tells a story of dedication, artistry, and an unwavering
          commitment to excellence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/products"
            className="inline-flex h-12 items-center justify-center bg-[#B8956A] px-8 text-sm font-medium uppercase tracking-wider text-white transition-all hover:bg-[#A07D52] active:scale-95"
          >
            Explore Collection
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center border border-white/30 px-8 text-sm font-medium uppercase tracking-wider text-white transition-all hover:bg-white/10 active:scale-95"
          >
            Get in Touch
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
