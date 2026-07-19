import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { connectDB } from '@/lib/db';
import Settings from '@/models/Settings';

export const metadata: Metadata = buildMetadata({
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about our furniture, ordering process, shipping, and more.',
  path: '/faq',
});

const defaultFaqs = [
  { question: 'What materials do you use?', answer: 'We use premium materials sourced from sustainable forests, including solid wood, engineered wood, and premium finishes.' },
  { question: 'Do you offer assembly service?', answer: 'Yes, assembly service is available on request for an additional fee.' },
  { question: 'How long does delivery take?', answer: 'Delivery typically takes 3-14 business days depending on your location and product availability.' },
  { question: 'Can I cancel my order?', answer: 'Orders can be cancelled within 24 hours of placement. Please contact us immediately.' },
  { question: 'What payment methods do you accept?', answer: 'We accept payments via bank transfer, UPI, and major credit/debit cards.' },
];

async function getFaqs() {
  try {
    await connectDB();
    const settings = await Settings.findOne({ key: 'faq' }).lean();
    if (settings?.value && Array.isArray(settings.value)) {
      return settings.value as { question: string; answer: string }[];
    }
  } catch {}
  return defaultFaqs;
}

export default async function FAQPage() {
  const faqs = await getFaqs();

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
    <>
      <JsonLd schema={faqSchema} />
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h1>
        <div className="mt-8 space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group rounded-lg border">
              <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium">
                {faq.question}
                <svg className="h-4 w-4 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
              </summary>
              <div className="border-t px-4 py-3 text-sm text-muted-foreground">{faq.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
