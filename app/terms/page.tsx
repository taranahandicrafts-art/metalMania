import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Terms & Conditions',
  description: 'Our terms and conditions govern the use of our website and the purchase of our products.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Terms &amp; Conditions</h1>
      <div className="mt-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>By using our website and placing orders, you agree to the following terms and conditions.</p>
        <h2 className="text-lg font-semibold text-foreground">Orders</h2>
        <p>All orders are subject to availability and confirmation. We reserve the right to cancel any order at our discretion.</p>
        <h2 className="text-lg font-semibold text-foreground">Pricing</h2>
        <p>Prices are listed in INR and are subject to change without notice. The price at the time of order confirmation is final.</p>
        <h2 className="text-lg font-semibold text-foreground">Shipping</h2>
        <p>Delivery times are estimates and not guaranteed. We are not responsible for delays beyond our control.</p>
      </div>
    </div>
  );
}
