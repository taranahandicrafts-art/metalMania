export function generateProductSchema(product: {
  title: string;
  slug: string;
  short_description: string;
  base_price: number;
  final_price: number;
  brand: string;
  thumbnail: string;
  category_name?: string;
  inStock?: boolean;
  sku: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.short_description,
    sku: product.sku,
    brand: { '@type': 'Brand', name: product.brand },
    image: product.thumbnail,
    offers: {
      '@type': 'Offer',
      price: product.final_price,
      priceCurrency: 'INR',
      availability: product.inStock !== false
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Shubharambh Products',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/logo.png`,
  };
}

export function generateMetadata({
  title,
  description,
  path,
  images,
}: {
  title: string;
  description: string;
  path: string;
  images?: string[];
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}${path}` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}${path}`,
      images: images?.length ? images : [`${baseUrl}/og-image.jpg`],
    },
  };
}
