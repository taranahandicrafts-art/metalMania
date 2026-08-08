'use client';

import { motion } from 'framer-motion';

export function ContactHero() {
  return (
    <section className="pt-50 md:pt-44 relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-[#1A1714]">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1714]/70 via-[#1A1714]/50 to-[#1A1714]/80" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-sm font-medium tracking-[0.2em] uppercase text-[#B8956A]"
        >
          Get in Touch
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-4xl font-light tracking-tight text-white sm:text-6xl"
        >
          We&apos;d love to hear from you
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
          Have a question about our furniture, need design advice, or want to
          visit our showroom? We are here to help you create the home of your
          dreams.
        </motion.p>
      </div>
    </section>
  );
}
