import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { AboutHero } from '@/components/about/AboutHero';
import { BrandStory } from '@/components/about/BrandStory';
import { Philosophy } from '@/components/about/Philosophy';
import { Craftsmanship } from '@/components/about/Craftsmanship';
import { WhyChooseUsAbout } from '@/components/about/WhyChooseUs';
import { Statistics } from '@/components/about/Statistics';
import { TeamSection } from '@/components/about/TeamSection';
import { Gallery } from '@/components/about/Gallery';
import { Testimonials } from '@/components/about/Testimonials';
import { FAQ } from '@/components/about/FAQ';
import { AboutCTA } from '@/components/about/AboutCTA';

export const metadata: Metadata = buildMetadata({
  title: 'About Us',
  description:
    'Discover the story behind our premium handcrafted furniture brand. Learn about our 15-year legacy of craftsmanship, sustainability, and commitment to creating timeless pieces for your home.',
  path: '/about',
  keywords: [
    'about us',
    'furniture brand',
    'handcrafted furniture',
    'premium furniture India',
    'wooden furniture craftsmanship',
    'sustainable furniture',
    'luxury furniture brand',
  ],
  ogTitle: 'Our Story — Premium Handcrafted Furniture Since 2008',
  ogDescription:
    'From a small workshop to 10,000+ happy homes. Discover the craftsmanship, sustainability, and passion behind every piece we create.',
});

const aboutPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Us',
  description:
    'Discover the story behind our premium handcrafted furniture brand. Learn about our 15-year legacy of craftsmanship, sustainability, and commitment to creating timeless pieces for your home.',
  mainEntity: {
    '@type': 'Organization',
    name: 'Shubharambh Products',
    foundingDate: '2008',
    description:
      'Premium handcrafted furniture designed for lasting beauty and everyday comfort.',
  },
};

export default function AboutPage() {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
  ];

  return (
    <>
      <JsonLd schema={[breadcrumbSchema(breadcrumbs), aboutPageSchema]} />

      <AboutHero />

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <BrandStory />
      <Philosophy />
      <Craftsmanship />
      <WhyChooseUsAbout />
      <Statistics />
      <TeamSection />
      <Gallery />
      <Testimonials />
      {/* <FAQ /> */}
      <AboutCTA />
    </>
  );
}
