import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Returns & Exchanges',
  description: 'Our return and exchange policy. Learn how to return or exchange your furniture purchase.',
  path: '/returns',
});

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Returns &amp; Exchanges</h1>
      <div className="mt-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <h2 className="text-lg font-semibold text-foreground">30-Day Return Policy</h2>
        <p>If you are not completely satisfied with your purchase, you may return it within 30 days of delivery for a full refund or exchange.</p>
        <h2 className="text-lg font-semibold text-foreground">Conditions</h2>
        <p>Items must be unused and in their original condition. Custom-made items are not eligible for return unless defective.</p>
        <h2 className="text-lg font-semibold text-foreground">Process</h2>
        <p>Contact us to initiate a return. We will arrange for pickup and process your refund within 5-7 business days after inspection.</p>
      </div>
    </div>
  );
}
