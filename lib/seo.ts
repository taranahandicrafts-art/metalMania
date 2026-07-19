import type { Metadata } from 'next';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants';

// ─────────────────────────────────────────
// URL Helpers
// ─────────────────────────────────────────

export function absoluteUrl(path: string): string {
  const base = SITE_URL.replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

export function canonicalUrl(path?: string): string {
  return absoluteUrl(path || '/');
}

// ─────────────────────────────────────────
// Image helpers
// ─────────────────────────────────────────

export function seoImage(url?: string | null, fallback?: string): string | undefined {
  if (url) return url.startsWith('http') ? url : absoluteUrl(url);
  return fallback ? absoluteUrl(fallback) : undefined;
}

// ─────────────────────────────────────────
// Next.js Metadata builders
// ─────────────────────────────────────────

interface PageMetaInput {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  ogImage?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  twitterCard?: 'summary' | 'summary_large_image';
  publishedTime?: string;
  modifiedTime?: string;
  type?: 'website' | 'article';
}

export function buildMetadata({
  title,
  description,
  path,
  keywords,
  noIndex,
  ogImage,
  ogTitle,
  ogDescription,
  twitterCard = 'summary_large_image',
  publishedTime,
  modifiedTime,
  type = 'website',
}: PageMetaInput): Metadata {
  const url = path ? absoluteUrl(path) : undefined;
  const imageUrl = ogImage
    ? (ogImage.startsWith('http') ? ogImage : absoluteUrl(ogImage))
    : undefined;

  return {
    title,
    description,
    ...(keywords?.length ? { keywords: keywords.join(', ') } : {}),
    ...(url ? { alternates: { canonical: url } } : {}),
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: ogTitle || title,
      description: ogDescription || description,
      url,
      siteName: SITE_NAME,
      type,
      ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 630 }] } : {}),
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: twitterCard,
      title: ogTitle || title,
      description: ogDescription || description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

// ─────────────────────────────────────────
// JSON-LD Schema Generators
// ─────────────────────────────────────────

interface StoreInfo {
  name?: string;
  description?: string;
  address?: {
    street?: string;
    locality?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  };
  geo?: { latitude?: number; longitude?: number };
  telephone?: string;
  email?: string;
  openingHours?: string[];
  image?: string;
  sameAs?: string[];
}

interface ProductSchemaInput {
  title: string;
  description: string;
  sku: string;
  brand: string;
  price: number;
  priceCurrency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'Discontinued';
  image?: string;
  url: string;
  mpn?: string;
  gtin?: string;
  material?: string;
  category?: string;
  reviews?: ReviewSchemaInput[];
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
  };
  offers?: OfferSchemaInput[];
}

interface ReviewSchemaInput {
  id?: string;
  author: string;
  reviewBody: string;
  datePublished: string;
  reviewRating: {
    ratingValue: number;
    bestRating?: number;
    worstRating?: number;
  };
}

interface OfferSchemaInput {
  price: number;
  priceCurrency?: string;
  availability?: string;
  sku?: string;
  url?: string;
  validFrom?: string;
}

interface BreadcrumbItem {
  name: string;
  href: string;
}

// ─────────────────────────────────────────
// Schema.org / JSON-LD
// ─────────────────────────────────────────

export function websiteSchema(storeInfo?: StoreInfo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: storeInfo?.name || SITE_NAME,
    description: storeInfo?.description || SITE_DESCRIPTION,
    url: SITE_URL,
    ...(storeInfo?.image ? { image: seoImage(storeInfo.image) } : {}),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function organizationSchema(storeInfo?: StoreInfo) {
  const info = storeInfo || {};
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: info.name || SITE_NAME,
    description: info.description || SITE_DESCRIPTION,
    url: SITE_URL,
  };

  if (info.telephone) schema.telephone = info.telephone;
  if (info.email) schema.email = info.email;
  if (info.image) schema.image = seoImage(info.image);

  if (info.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: info.address.street,
      addressLocality: info.address.locality,
      addressRegion: info.address.region,
      postalCode: info.address.postalCode,
      addressCountry: info.address.country,
    };
  }

  if (info.geo?.latitude && info.geo?.longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: info.geo.latitude,
      longitude: info.geo.longitude,
    };
  }

  if (info.sameAs?.length) {
    schema.sameAs = info.sameAs;
  }

  return schema;
}

export function localBusinessSchema(storeInfo?: StoreInfo) {
  const org = organizationSchema(storeInfo);
  return {
    ...org,
    '@type': 'LocalBusiness',
    ...(storeInfo?.openingHours ? { openingHoursSpecification: storeInfo.openingHours.map((h) => ({ '@type': 'OpeningHoursSpecification', ...parseHours(h) })) } : {}),
  };
}

function parseHours(h: string) {
  const [days, timeRange] = h.split(' ');
  const [opens, closes] = timeRange?.split('-') || [];
  return {
    dayOfWeek: days?.split(',').map((d) => `https://schema.org/${d.trim()}`),
    opens,
    closes,
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function productSchema(data: ProductSchemaInput) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.title,
    description: data.description,
    sku: data.sku,
    brand: { '@type': 'Brand', name: data.brand },
    url: data.url,
  };

  if (data.image) schema.image = data.image;
  if (data.mpn) schema.mpn = data.mpn;
  if (data.gtin) schema.gtin = data.gtin;
  if (data.material) schema.material = data.material;
  if (data.category) schema.category = data.category;

  schema.offers = (data.offers || [{
    price: data.price,
    priceCurrency: data.priceCurrency || 'INR',
    availability: data.availability
      ? `https://schema.org/${data.availability}`
      : 'https://schema.org/InStock',
    url: data.url,
    sku: data.sku,
  }]).map((offer) => ({
    '@type': 'Offer',
    price: offer.price,
    priceCurrency: offer.priceCurrency || 'INR',
    ...(offer.availability ? { availability: `https://schema.org/${offer.availability}` } : {}),
    ...(offer.sku ? { sku: offer.sku } : {}),
    ...(offer.url ? { url: offer.url } : {}),
    ...(offer.validFrom ? { validFrom: offer.validFrom } : {}),
  }));

  if (data.reviews?.length) {
    schema.review = data.reviews.map((r) => ({
      '@type': 'Review',
      ...(r.id ? { '@id': r.id } : {}),
      reviewBody: r.reviewBody,
      datePublished: r.datePublished,
      author: { '@type': 'Person', name: r.author },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.reviewRating.ratingValue,
        bestRating: r.reviewRating.bestRating || 5,
        worstRating: r.reviewRating.worstRating || 1,
      },
    }));
  }

  if (data.aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.aggregateRating.ratingValue,
      reviewCount: data.aggregateRating.reviewCount,
      bestRating: data.aggregateRating.bestRating || 5,
    };
  }

  return schema;
}

export function webPageSchema({
  title,
  description,
  path,
  breadcrumbs,
  storeInfo,
}: {
  title: string;
  description: string;
  path: string;
  breadcrumbs?: BreadcrumbItem[];
  storeInfo?: StoreInfo;
}) {
  const schemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: absoluteUrl(path),
      ...(storeInfo?.name ? { publisher: { '@type': 'Organization', name: storeInfo.name } } : {}),
    },
  ];

  if (breadcrumbs?.length) {
    schemas.push(breadcrumbSchema(breadcrumbs));
  }

  return schemas;
}

// ─────────────────────────────────────────
// Settings → StoreInfo mapper
// ─────────────────────────────────────────

export function mapStoreInfo(settings: Record<string, unknown> | null): StoreInfo | undefined {
  if (!settings) return undefined;

  const storeInfo = settings as Record<string, unknown>;
  const contactInfo = (settings.contact_info ?? {}) as Record<string, unknown>;
  const socialLinks = (settings.social_links ?? {}) as Record<string, unknown>;

  const sameAs: string[] = [];
  if (socialLinks.facebook) sameAs.push(socialLinks.facebook as string);
  if (socialLinks.instagram) sameAs.push(socialLinks.instagram as string);
  if (socialLinks.twitter) sameAs.push(socialLinks.twitter as string);
  if (socialLinks.youtube) sameAs.push(socialLinks.youtube as string);
  if (socialLinks.pinterest) sameAs.push(socialLinks.pinterest as string);

  return {
    name: (storeInfo.store_name as string) || SITE_NAME,
    description: (storeInfo.store_description as string) || SITE_DESCRIPTION,
    telephone: (contactInfo.phone as string) || undefined,
    email: (contactInfo.email as string) || undefined,
    image: (storeInfo.logo as string) || undefined,
    address: {
      street: (contactInfo.address_line1 as string) || undefined,
      locality: (contactInfo.city as string) || undefined,
      region: (contactInfo.state as string) || undefined,
      postalCode: (contactInfo.pincode as string) || undefined,
      country: (contactInfo.country as string) || 'India',
    },
    geo: contactInfo.latitude && contactInfo.longitude
      ? { latitude: Number(contactInfo.latitude), longitude: Number(contactInfo.longitude) }
      : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  };
}
