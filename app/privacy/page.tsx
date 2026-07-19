import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description: 'Our privacy policy outlines how we collect, use, and protect your personal information.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <div className="mt-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>This Privacy Policy explains how we collect, use, and protect your personal information when you use our website.</p>
        <h2 className="text-lg font-semibold text-foreground">Information We Collect</h2>
        <p>We collect information you provide directly, such as your name, email address, phone number, and delivery address when you place an order or contact us.</p>
        <h2 className="text-lg font-semibold text-foreground">How We Use Your Information</h2>
        <p>We use your information to process orders, communicate with you about your purchases, and improve our services.</p>
        <h2 className="text-lg font-semibold text-foreground">Data Protection</h2>
        <p>We implement appropriate security measures to protect your personal information from unauthorized access or disclosure.</p>
        <h2 className="text-lg font-semibold text-foreground">Contact</h2>
        <p>If you have questions about this policy, please contact us through our contact page.</p>
      </div>
    </div>
  );
}
