import type { Metadata } from "next";
import { Suspense } from "react";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Review from "@/models/Review";
import Settings from "@/models/Settings";
import {
  HeroSection,
  FeaturedCategories,
  BestSellers,
  PromoBannerOne,
  PromoAdsCarousel,
  NewArrivals,
  Testimonials,
  HomeFAQ,
  CTA,
} from "@/components/home";
import type { LuxProduct } from "@/components/home/shared";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildMetadata,
  websiteSchema,
  breadcrumbSchema,
  webPageSchema,
  mapStoreInfo,
} from "@/lib/seo";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: `Premium Furniture — Handcrafted for ${SITE_NAME}`,
  description:
    "Discover premium handcrafted furniture. Timeless designs crafted from the finest materials for lasting beauty and everyday comfort.",
  path: "/",
});

// Shared projection → LuxProduct for the marketing product cards.
function toLuxProduct(p: {
  _id: { toString(): string };
  title: string;
  slug: string;
  thumbnail?: string | null;
  base_price: number;
  final_price?: number | null;
  discount?: number | null;
  material?: string | null;
  is_new_arrival?: boolean | null;
  is_best_seller?: boolean | null;
  rating?: number | null;
  review_count?: number | null;
}): LuxProduct {
  return {
    _id: p._id.toString(),
    title: p.title,
    slug: p.slug,
    thumbnail: p.thumbnail ?? "",
    base_price: p.base_price,
    final_price: p.final_price ?? p.base_price,
    discount: p.discount ?? 0,
    material: p.material ?? "",
    is_new_arrival: p.is_new_arrival ?? false,
    is_best_seller: p.is_best_seller ?? false,
    rating: p.rating ?? undefined,
    review_count: p.review_count ?? undefined,
  };
}

// ── Async data-fetching section wrappers for streaming ──

async function CategoriesSection() {
  try {
    await connectDB();
    const categories = await Category.find({ is_active: true })
      .sort({ sort_order: 1 })
      .limit(6)
      .select("name slug image product_count description")
      .lean();

    return (
      <FeaturedCategories
        categories={categories.map((c) => ({
          _id: c._id.toString(),
          name: c.name,
          slug: c.slug,
          image: c.image,
          product_count: c.product_count ?? 0,
          description: c.description,
        }))}
      />
    );
  } catch {
    return <FeaturedCategories categories={[]} />;
  }
}

const PRODUCT_FIELDS =
  "title slug thumbnail base_price final_price discount material is_new_arrival is_best_seller rating review_count";

async function BestSellersSection() {
  try {
    await connectDB();
    const products = await Product.find({
      is_best_seller: true,
      status: "published",
    })
      .sort({ created_at: -1 })
      .limit(8)
      .select(PRODUCT_FIELDS)
      .lean();

    return <BestSellers products={products.map(toLuxProduct)} />;
  } catch {
    return <BestSellers products={[]} />;
  }
}

async function NewArrivalsSection() {
  try {
    await connectDB();
    const products = await Product.find({
      is_new_arrival: true,
      status: "published",
    })
      .sort({ created_at: -1 })
      .limit(10)
      .select(PRODUCT_FIELDS)
      .lean();

    return <NewArrivals products={products.map(toLuxProduct)} />;
  } catch {
    return <NewArrivals products={[]} />;
  }
}

async function TestimonialsSection() {
  try {
    await connectDB();
    const reviews = await Review.find({ is_approved: true, status: "approved" })
      .sort({ created_at: -1 })
      .limit(8)
      .select("user rating body")
      .lean();

    return (
      <Testimonials
        testimonials={reviews.map((r) => ({
          _id: r._id.toString(),
          name: r.user?.name ?? "Verified Customer",
          text: r.body,
          rating: r.rating,
        }))}
      />
    );
  } catch {
    return <Testimonials testimonials={[]} />;
  }
}

// ── Shared skeleton fallbacks for Suspense ──

function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="mx-auto mb-12 h-6 w-48 rounded bg-muted" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[4/3] rounded-xl bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/3 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Schemas (data-dependent, fetched in parallel with sections) ──

async function GlobalSchemas() {
  try {
    await connectDB();
    const storeSettings = await Settings.findOne({ key: "store_info" }).lean();
    const storeInfo = mapStoreInfo(
      storeSettings as Record<string, unknown> | null,
    );
    const breadcrumbs = [{ name: "Home", href: "/" }];
    return (
      <JsonLd
        schema={[
          websiteSchema(storeInfo),
          breadcrumbSchema(breadcrumbs),
          ...webPageSchema({
            title: `Premium Furniture — Handcrafted for ${SITE_NAME}`,
            description: "Discover premium handcrafted furniture.",
            path: "/",
            breadcrumbs,
            storeInfo,
          }),
        ]}
      />
    );
  } catch {
    return null;
  }
}

// ── Page Component ──

export default async function HomePage() {
  return (
    <>
      <Suspense fallback={null}>
        <GlobalSchemas />
      </Suspense>
      <JsonLd schema={breadcrumbSchema([{ name: "Home", href: "/" }])} />

      {/* 1 · Cinematic hero — pinned, immersive room-assembly experience */}
      <HeroSection />

      {/* 2 · Why choose us */}
      {/* <WhyChooseUs /> */}

      {/* 3 · Shop by category (streamed) */}
      <Suspense fallback={<GridSkeleton count={6} />}>
        <CategoriesSection />
      </Suspense>

      {/* 4 · Featured collection (streamed) */}
      <Suspense fallback={<GridSkeleton count={8} />}>
        <BestSellersSection />
      </Suspense>

      {/* 5 · Luxury promotion banner #1 */}
      <PromoBannerOne />

      {/* 6 · New arrivals (streamed) */}
      <Suspense fallback={<GridSkeleton count={4} />}>
        <NewArrivalsSection />
      </Suspense>

      {/* 7 · Craftsmanship & materials */}
      {/* <Craftsmanship /> */}

      {/* 8 · Luxury promotion banner #2 */}
      {/* <PromoBannerTwo /> */}
      <PromoAdsCarousel />

      {/* 9 · Testimonials (streamed) */}
      {/* <Suspense
        fallback={
          <section className="py-24 sm:py-32">
            <div className="mx-auto max-w-2xl px-4 animate-pulse">
              <div className="mx-auto mb-8 h-6 w-48 rounded bg-muted" />
              <div className="mx-auto h-32 w-full rounded bg-muted" />
            </div>
          </section>
        }
      >
        {/* <TestimonialsSection /> */}
      {/* </Suspense> */} */

      {/* 10 · Frequently asked questions */}
      <HomeFAQ />

      {/* 11 · Get in touch */}
      {/* <CTA /> */}
    </>
  );
}
