'use client';

import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const STORY_SECTIONS = [
  {
    year: '2008',
    title: 'Where it all began',
    description:
      'In a small workshop on the outskirts of the city, our founder Rajesh Sharma started with a simple belief: furniture should be more than functional. It should inspire. With two artisans and a passion for woodworking, he began crafting pieces that would eventually define a brand.',
    image:
      'https://images.unsplash.com/photo-1588854337236-6889d631faa8?q=80&w=2070',
  },
  {
    year: '2013',
    title: 'Growing with purpose',
    description:
      'Five years in, our workshop had expanded to a full-scale manufacturing facility. We stayed true to our roots — every joint still hand-fitted, every surface hand-finished. The difference was scale: we could now bring our vision to homes across the country.',
    image:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070',
  },
  {
    year: '2018',
    title: 'A decade of craftsmanship',
    description:
      'Ten years of relentless pursuit of perfection. We introduced sustainable sourcing, partnered with certified forests, and launched our bespoke service. Each piece became a collaboration between our artisans and the families who would live with them.',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070',
  },
  {
    year: '2024',
    title: 'Designing the future',
    description:
      'Today, we serve over 10,000 happy homes across 50 cities. Our design philosophy has evolved, but our core remains unchanged: premium materials, expert craftsmanship, and furniture that stands the test of time.',
    image:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2070',
  },
];

function StorySection({
  section,
  index,
}: {
  section: (typeof STORY_SECTIONS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isReversed = index % 2 === 1;

  return (
    <div ref={ref} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <motion.div
        initial={{ opacity: 0, x: isReversed ? 40 : -40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7 }}
        className={isReversed ? 'lg:order-2' : ''}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F3EF]">
          <Image
            src={section.image}
            alt={section.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: isReversed ? -40 : 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.2 }}
        className={isReversed ? 'lg:order-1' : ''}
      >
        <span className="text-sm font-medium tracking-[0.15em] uppercase text-[#B8956A]">
          {section.year}
        </span>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#1A1714] sm:text-3xl">
          {section.title}
        </h3>
        <div className="mt-2 h-px w-12 bg-[#B8956A]" />
        <p className="mt-6 max-w-lg leading-relaxed text-[#4A4540]">
          {section.description}
        </p>
      </motion.div>
    </div>
  );
}

export function BrandStory() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' });

  return (
    <section className="bg-[#FAFAF8] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-sm font-medium tracking-[0.2em] uppercase text-[#9A9590]"
          >
            Our Journey
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 text-3xl font-semibold tracking-tight text-[#1A1714] sm:text-4xl"
          >
            A legacy of craftsmanship
          </motion.h2>
        </div>

        <div className="mt-16 space-y-20 sm:space-y-28">
          {STORY_SECTIONS.map((section, i) => (
            <StorySection key={section.year} section={section} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
