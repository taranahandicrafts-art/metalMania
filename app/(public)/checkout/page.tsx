import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Checkout',
  description: 'Complete your order. Provide delivery details and place your order via WhatsApp.',
  path: '/checkout',
  noIndex: true,
});

export { default } from './CheckoutPageClient';
