import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp, FloatingCall, ScrollToTop } from '@/components/common/FloatingButtons';
import { JsonLd } from '@/components/seo/JsonLd';
import { connectDB } from '@/lib/db';
import Settings from '@/models/Settings';
import { websiteSchema, organizationSchema, mapStoreInfo } from '@/lib/seo';

async function getGlobalSchemas() {
  try {
    await connectDB();
    const settings = await Settings.findOne({ key: 'store_info' }).lean();
    const storeInfo = mapStoreInfo(settings as Record<string, unknown> | null);
    return [
      organizationSchema(storeInfo),
      websiteSchema(storeInfo),
    ];
  } catch {
    const storeInfo = mapStoreInfo(null);
    return [
      organizationSchema(storeInfo),
      websiteSchema(storeInfo),
    ];
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemas = await getGlobalSchemas();

  return (
    <>
      <JsonLd schema={schemas} />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <FloatingCall />
      <ScrollToTop />
    </>
  );
}
