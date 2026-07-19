'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FAQ {
  question: string;
  answer: string;
}

export function ProductFAQs({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="mb-6 text-2xl font-bold">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-lg border">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium"
            >
              {faq.question}
              <svg
                className={cn('h-4 w-4 transition-transform', openIndex === i && 'rotate-180')}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {openIndex === i && (
              <div className="border-t px-6 py-4 text-sm text-muted-foreground">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
