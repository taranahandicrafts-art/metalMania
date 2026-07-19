import { type ReactNode } from 'react';
import { SectionHeading, RevealGroup, RevealItem } from './shared';

interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const FEATURES: Feature[] = [
  {
    title: 'Premium craftsmanship',
    description:
      'Every joint hand-fitted, every surface hand-finished by artisans with decades at the bench.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    title: 'Sustainable materials',
    description:
      'Responsibly sourced hardwoods and natural fibres from certified, regenerative forests.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke}>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6" />
      </svg>
    ),
  },
  {
    title: 'Lifetime durability',
    description:
      'Kiln-dried timber and mortise-and-tenon frames built to outlast trends and generations.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke}>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      </svg>
    ),
  },
  {
    title: 'Modern design',
    description:
      'Timeless silhouettes drawn by our in-house studio — quietly contemporary, never loud.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke}>
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z" />
      </svg>
    ),
  },
  {
    title: 'Expert support',
    description:
      'Personal design consultants guide every choice — from swatch to final placement at home.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke}>
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
  },
  {
    title: 'White-glove delivery',
    description:
      'Scheduled to the hour, unpacked, assembled and placed — packaging carried away with us.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke}>
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" />
      </svg>
    ),
  },
  {
    title: 'Bespoke commissions',
    description:
      'Adjust dimension, timber and textile — or commission an original piece made to your room.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
      </svg>
    ),
  },
];

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-lux-soft py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The house standard"
          title={
            <>
              Reasons the discerning
              <br className="hidden sm:block" /> choose our workshop
            </>
          }
          description="Seven promises behind every piece — the quiet assurances that turn a purchase into an heirloom."
        />

        <RevealGroup
          className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-lux-sand bg-lux-sand sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.07}
        >
          {FEATURES.map((feature) => (
            <RevealItem key={feature.title} className="h-full">
              <article className="group relative flex h-full flex-col bg-lux-soft p-8 transition-colors duration-500 hover:bg-lux-white">
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-lux-gold to-transparent transition-transform duration-700 group-hover:scale-x-100" />
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-lux-sand text-lux-graphite transition-all duration-500 group-hover:border-lux-gold group-hover:bg-lux-gold group-hover:text-lux-soft group-hover:-translate-y-1">
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl text-lux-ink">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-lux-stone">
                  {feature.description}
                </p>
              </article>
            </RevealItem>
          ))}
          {/* Closing tile — keeps the 8-cell grid whole and adds an editorial note. */}
          <RevealItem className="h-full">
            <article className="flex h-full flex-col justify-center bg-lux-ink p-8 text-lux-soft">
              <p className="font-display text-2xl italic leading-snug text-lux-soft">
                &ldquo;Made once, made well.&rdquo;
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-lux-parchment">
                — Our founding principle
              </p>
            </article>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
