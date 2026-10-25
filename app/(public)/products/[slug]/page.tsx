import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import ProductVariant from '@/models/ProductVariant';
import Inventory from '@/models/Inventory';
import Review from '@/models/Review';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductTabs } from '@/components/product/ProductTabs';
import { ProductFAQs } from '@/components/product/ProductFAQs';
import { RelatedProductsSection } from '@/components/product/RelatedProducts';
import { ProductDetailClient } from './ProductDetailClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { buildMetadata, breadcrumbSchema, productSchema, webPageSchema } from '@/lib/seo';
import { absoluteUrl } from '@/lib/seo';
import Category from '@/models/Category';

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Builds the lookup for a product URL segment. Accepts the (possibly
 * URL-encoded) slug in any case, and also a product id so older links that
 * fell back to `/products/<id>` keep working.
 */
function productFilter(rawSlug: string): Record<string, unknown> {
  let slug = rawSlug;
  try {
    slug = decodeURIComponent(rawSlug);
  } catch {}
  slug = slug.trim().toLowerCase();
  const or: Record<string, unknown>[] = [{ slug }];
  if (mongoose.isValidObjectId(slug)) or.push({ _id: slug });
  return { $or: or, status: 'published' };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const product = await Product.findOne(productFilter(slug)).select('title short_description seo meta thumbnail').lean();
  if (!product) return {};

  const metaTitle = product.seo?.title || product.title;
  const metaDesc = product.seo?.description || product.short_description;

  return buildMetadata({
    title: metaTitle,
    description: metaDesc,
    path: `/products/${slug}`,
    ogImage: product.meta?.open_graph?.image || product.thumbnail || undefined,
    ogTitle: product.meta?.open_graph?.title || undefined,
    ogDescription: product.meta?.open_graph?.description || undefined,
    twitterCard: product.meta?.twitter_card?.card || 'summary_large_image',
    type: 'article',
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();

  const product = await Product.findOne(productFilter(slug)).populate('category_id', 'name slug').lean();
  if (!product) notFound();

  const [variants, reviews, relatedProducts, category, inventoryRecords] = await Promise.all([
    ProductVariant.find({ product_id: product._id, is_active: true }).sort('sort_order').lean(),
    Review.find({ product_id: product._id, status: 'approved' }).sort('-created_at').lean(),
    (product.related_product_ids?.length
      ? Product.find({ _id: mongoose.trusted({ $in: product.related_product_ids.map((id: { toString(): string }) => id.toString()) }), status: 'published' })
          .select('title slug thumbnail base_price final_price discount material is_new_arrival')
          .limit(6)
          .lean()
      : Promise.resolve([])
    ),
    product.category_id
      ? Category.findById(product.category_id).select('name slug').lean()
      : null,
    Inventory.find({ product_id: product._id }).lean(),
  ]);

  const avgRating = reviews.length > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : 0;

  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => { if (r.rating >= 1 && r.rating <= 5) ratingCounts[r.rating - 1]++; });

  const images = (product.images || []).map((img) => ({ url: img.url, alt: img.alt }));

  const allStock = inventoryRecords.length > 0
    ? inventoryRecords.reduce((sum, inv) => sum + inv.stock, 0)
    : variants.reduce((sum, v) => sum + v.stock, 0);

  // Per-SKU stock so the quantity picker can't exceed what's actually available.
  const stockBySku: Record<string, number> = {};
  for (const v of variants) stockBySku[v.sku.toUpperCase()] = v.stock;
  for (const inv of inventoryRecords) stockBySku[inv.sku.toUpperCase()] = inv.stock;

  const mappedVariants = variants.map((v) => ({
    _id: v._id.toString(),
    name: v.name,
    sku: v.sku,
    attributes: Object.entries(v.metadata || {}).map(([name, value]) => ({ name, value })),
    is_active: v.is_active,
  }));

  const productJson = JSON.parse(JSON.stringify(product));

  const breadcrumbs = [
    { name: category?.name || 'Products', href: category ? `/products?category=${category._id}` : '/products' },
    { name: productJson.title, href: `/products/${slug}` },
  ];

  const reviewSchemas = reviews.map((r) => ({
    id: `${absoluteUrl(`/products/${slug}`)}#review-${r._id.toString()}`,
    author: r.user?.name || 'Verified Customer',
    reviewBody: r.body,
    datePublished: r.created_at?.toISOString?.() || new Date(r.created_at).toISOString(),
    reviewRating: {
      ratingValue: r.rating,
      bestRating: 5,
      worstRating: 1,
    },
  }));

  const schema = productSchema({
    title: productJson.title,
    description: productJson.short_description,
    sku: productJson.sku,
    brand: productJson.brand,
    price: productJson.final_price,
    priceCurrency: 'INR',
    availability: allStock > 0 ? 'InStock' : 'OutOfStock',
    image: productJson.thumbnail || undefined,
    url: absoluteUrl(`/products/${slug}`),
    material: productJson.material,
    category: category?.name || undefined,
    reviews: reviewSchemas,
    aggregateRating: reviews.length > 0 ? {
      ratingValue: avgRating,
      reviewCount: reviews.length,
      bestRating: 5,
    } : undefined,
  });

  return (
    <>
      <JsonLd schema={[
        breadcrumbSchema(breadcrumbs),
        schema,
        ...webPageSchema({
          title: productJson.title,
          description: productJson.short_description,
          path: `/products/${slug}`,
          breadcrumbs,
        }),
      ]} />

      <div className="mx-auto max-w-7xl px-4 py-8 pt-50 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="grid gap-8 lg:grid-cols-2">
          <ProductGallery images={images} thumbnail={productJson.thumbnail} title={productJson.title} />

          <ProductDetailClient
            title={productJson.title}
            brand={productJson.brand}
            material={productJson.material}
            base_price={productJson.base_price}
            final_price={productJson.final_price}
            discount={productJson.discount}
            short_description={productJson.short_description}
            sku={productJson.sku}
            warranty={productJson.warranty}
            shipping={productJson.shipping}
            variants={mappedVariants}
            allStock={allStock}
            stockBySku={stockBySku}
            productId={productJson._id.toString()}
            slug={productJson.slug}
            thumbnail={productJson.thumbnail}
            returnPolicy={productJson.return_policy || undefined}
          />
        </div>

        <ProductTabs
          description={productJson.long_description}
          reviews={JSON.parse(JSON.stringify(reviews))}
          avgRating={avgRating}
          ratingCounts={ratingCounts}
        />

        {productJson.faqs?.length > 0 && <ProductFAQs faqs={productJson.faqs} />}

        <RelatedProductsSection products={JSON.parse(JSON.stringify(relatedProducts))} />
      </div>
    </>
  );
}
