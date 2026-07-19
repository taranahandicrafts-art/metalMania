import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Shipping Information',
  description: 'Learn about our shipping policies, delivery times, and shipping costs.',
  path: '/shipping',
});

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Shipping Information</h1>
      <div className="mt-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <h2 className="text-lg font-semibold text-foreground">Delivery Areas</h2>
        <p>We currently deliver across India. Free shipping is available within 50 km of our location.</p>
        <h2 className="text-lg font-semibold text-foreground">Delivery Timelines</h2>
        <p>Estimated delivery times are provided for each product and typically range from 3 to 14 business days depending on your location.</p>
        <h2 className="text-lg font-semibold text-foreground">Shipping Charges</h2>
        <p>Shipping charges are calculated at checkout based on your delivery address and order value.</p>
      </div>
    </div>
  );
}
