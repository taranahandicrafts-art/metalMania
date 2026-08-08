import type { Metadata } from 'next';
import { connectDB } from '@/lib/db';
import Settings from '@/models/Settings';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { buildMetadata, breadcrumbSchema, localBusinessSchema, mapStoreInfo } from '@/lib/seo';
import { ContactHero } from '@/components/contact/ContactHero';
import { ContactCards } from '@/components/contact/ContactCards';
import { ContactForm } from '@/components/contact/ContactForm';
import { MapSection } from '@/components/contact/MapSection';
import { BusinessHours } from '@/components/contact/BusinessHours';
import { Showroom } from '@/components/contact/Showroom';

export const metadata: Metadata = buildMetadata({
  title: 'Contact Us',
  description: 'Get in touch with us. We would love to hear from you. Visit our store or reach out via phone, email, or WhatsApp.',
  path: '/contact',
});

async function getContactSchemas() {
  try {
    await connectDB();
    const settings = await Settings.findOne({ key: 'store_info' }).lean();
    const storeInfo = mapStoreInfo(settings as Record<string, unknown> | null);
    return storeInfo ? localBusinessSchema(storeInfo) : null;
  } catch {
    return null;
  }
}

export default async function ContactPage() {
  const localBizSchema = await getContactSchemas();
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <div className="pt-16">
      <JsonLd schema={[
        breadcrumbSchema(breadcrumbs),
        ...(localBizSchema ? [localBizSchema] : []),
      ]} />

      <ContactHero />
      <ContactCards />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbs} />
        <div className="grid gap-12 lg:grid-cols-2">
          <ContactForm />
          <MapSection />
        </div>
      </div>

      <BusinessHours />
      <Showroom />
    </div>
  );
}
