import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Shopping Cart',
  description: 'Review your items and proceed to checkout.',
  path: '/cart',
  noIndex: true,
});

export { default } from './CartPageClient';
