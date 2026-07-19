'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { SectionHeading, Reveal } from './shared';
import { JsonLd } from '@/components/seo/JsonLd';

interface QA {
  q: string;
  a: string;
}

const FAQS: QA[] = [
  {
    q: 'How long does a piece take to arrive?',
    a: 'In-stock designs ship within one to two weeks. Made-to-order and bespoke commissions are hand-built to your specification and typically take six to ten weeks — your consultant will confirm a date before you commit.',
  },
  {
    q: 'Do you deliver and assemble?',
    a: 'Yes. Every order includes our white-glove service: we schedule to the hour, carry the piece into the room of your choice, assemble and level it, and take all packaging away with us.',
  },
  {
    q: 'Can I customise dimensions, timber or fabric?',
    a: 'Almost everything is configurable. Adjust size, choose from our library of hardwoods and textiles, or commission an entirely original piece drawn with our design studio.',
  },
  {
    q: 'What does the guarantee cover?',
    a: 'Our structural guarantee covers frames and joinery for twenty-five years. Natural materials are expected to develop a patina over time — we see that as a feature, and we are always here to advise on care.',
  },
  {
    q: 'Is the timber responsibly sourced?',
    a: 'All of our timber is FSC-certified and traceable to regenerative forests. Our workshop runs on renewable energy and we have eliminated single-use plastic from our packaging.',
  },
  {
    q: 'What is your returns policy?',
    a: 'If a stock piece is not right, you have thirty days to arrange a collection for a full refund. Bespoke commissions, being made to your specification, are non-returnable but fully guaranteed against defects.',
  },
];

function Item({ qa, open, onToggle, index }: { qa: QA; open: boolean; onToggle: () => void; index: number }) {
  const panelId = `faq-panel-${index}`;
  const btnId = `faq-btn-${index}`;
  return (
    <div className="border-b border-lux-sand">
      <h3>
        <button
          id={btnId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className={cn('font-display text-xl transition-colors sm:text-2xl', open ? 'text-lux-gold-dark' : 'text-lux-ink group-hover:text-lux-graphite')}>
            {qa.q}
          </span>
          <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500', open ? 'rotate-45 border-lux-gold bg-lux-gold text-lux-ink' : 'border-lux-graphite/30 text-lux-graphite group-hover:border-lux-ink')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 5v14M5 12h14" /></svg>
          </span>
        </button>
      </h3>
      {/* grid-rows trick keeps the answer in the DOM (SEO) while animating height */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        className={cn('grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-7 text-base leading-relaxed text-lux-stone">{qa.a}</p>
        </div>
      </div>
    </div>
  );
}

export function HomeFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <section className="relative overflow-hidden bg-lux-ivory py-24 sm:py-32">
      <JsonLd schema={faqSchema} />
      <div className="mx-auto grid max-w-6xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            align="left"
            eyebrow="Good to know"
            title="Questions, answered"
            description="Everything you might want to know before you welcome a piece into your home."
          />
        </div>

        <Reveal className="lg:pt-2">
          <div className="border-t border-lux-sand">
            {FAQS.map((qa, i) => (
              <Item key={qa.q} qa={qa} index={i} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
