'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { SectionHeading, Reveal } from './shared';
import { JsonLd } from '@/components/seo/JsonLd';

export interface HomeFAQItem {
  _id: string;
  question: string;
  answer: string;
}

interface ItemProps {
  qa: HomeFAQItem;
  open: boolean;
  onToggle: () => void;
  index: number;
}

function Item({ qa, open, onToggle, index }: ItemProps) {
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
            {qa.question}
          </span>
          <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500', open ? 'rotate-45 border-lux-gold bg-lux-gold text-lux-ink' : 'border-lux-graphite/30 text-lux-graphite group-hover:border-lux-ink')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 5v14M5 12h14" /></svg>
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        className={cn('grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-7 text-base leading-relaxed text-lux-stone">{qa.answer}</p>
        </div>
      </div>
    </div>
  );
}

interface HomeFAQProps {
  faqs?: HomeFAQItem[];
}

export function HomeFAQ({ faqs = [] }: HomeFAQProps) {
  const [open, setOpen] = useState<number | null>(faqs.length > 0 ? 0 : null);

  if (faqs.length === 0) return null;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
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
            {faqs.map((qa, i) => (
              <Item key={qa._id} qa={qa} index={i} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
