import type { Metadata } from "next";
import { Suspense } from "react";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Review from "@/models/Review";
import Settings from "@/models/Settings";
import FAQ from "@/models/FAQ";
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
import type { CarouselSlide, ProductAd } from "@/components/home/types";
import type { PromoBannerSettings } from "@/components/home/PromoBannerOne";
import type { SaleBarSettings } from "@/components/home/herosection/SaleBar";
import type { HomeFAQItem } from "@/components/home/HomeFAQ";
import { formatPrice } from "@/lib/utils";
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

// ── Shared helpers ──

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
    thumbnail: p.thumbnail ?? undefined,
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

const PRODUCT_FIELDS =
  "title slug thumbnail base_price final_price discount material is_new_arrival is_best_seller rating review_count short_description";

const HERO_PRODUCT_FIELDS =
  "title slug thumbnail base_price final_price discount material short_description";

// ── Hero section (categories + tagged products + settings) ──

async function HeroDataSection() {
  try {
    await connectDB();

    // 1. DB categories → CategoryNav (prepend "All")
    const dbCategories = await Category.find({ is_active: true })
      .sort({ sort_order: 1 })
      .select("name")
      .lean();
    const categories = ["All", ...dbCategories.map((c) => c.name)];

    // 2. Products tagged hero-carousel → HeroCarousel slides
    const carouselProducts = await Product.find({
      tags: "hero-carousel",
      status: "published",
    })
      .sort({ created_at: -1 })
      .limit(5)
      .select(HERO_PRODUCT_FIELDS)
      .lean();

    const carouselSlides: CarouselSlide[] = carouselProducts
      .filter((p) => !!p.thumbnail)
      .map((p) => {
      const words = p.title.split(" ");
      const mid = Math.ceil(words.length / 2);
      return {
        id: (p._id as { toString(): string }).toString(),
        image: p.thumbnail!,
        titleLine1: words.slice(0, mid).join(" ").toUpperCase(),
        titleLine2: words.slice(mid).join(" ").toUpperCase(),
        accentWord: p.material || "",
        subtitle: p.short_description || p.title,
        price: `Starting From ${formatPrice(p.final_price ?? p.base_price)}`,
        terms: "T&C Apply*",
        slug: p.slug,
      };
    });

    // 3. Products tagged hero-ad → ProductAds (max 2)
    const adProducts = await Product.find({
      tags: "hero-ad",
      status: "published",
    })
      .sort({ created_at: -1 })
      .limit(2)
      .select(HERO_PRODUCT_FIELDS)
      .lean();

    const productAds: ProductAd[] = adProducts
      .filter((p) => !!p.thumbnail)
      .map((p) => ({
      id: (p._id as { toString(): string }).toString(),
      image: p.thumbnail!,
      title: p.title,
      label: p.material || undefined,
      subtitle: p.short_description || undefined,
      priceCaption: p.discount > 0 ? "Now At" : "Starting From",
      oldPrice: p.discount > 0 ? formatPrice(p.base_price) : undefined,
      nowPrice: p.discount > 0 ? formatPrice(p.final_price ?? p.base_price) : undefined,
      price: p.discount > 0 ? undefined : formatPrice(p.final_price ?? p.base_price),
      terms: "T&C Apply*",
      slug: p.slug,
    }));

    // 4. SaleBar settings
    const saleBarRaw = await Settings.getByKey("sale_bar");
    const saleBarSettings: SaleBarSettings | undefined = saleBarRaw
      ? (saleBarRaw as SaleBarSettings)
      : undefined;

    return (
      <HeroSection
        categories={categories}
        carouselSlides={carouselSlides.length > 0 ? carouselSlides : undefined}
        productAds={productAds.length > 0 ? productAds : undefined}
        saleBarSettings={saleBarSettings}
      />
    );
  } catch {
    return <HeroSection />;
  }
}

// ── Categories section ──

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

// ── Best Sellers section ──

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

// ── PromoBanner section ──

async function PromoBannerSection() {
  try {
    await connectDB();
    const raw = await Settings.getByKey("promo_banner");
    const settings = raw ? (raw as PromoBannerSettings) : undefined;
    return <PromoBannerOne settings={settings} />;
  } catch {
    return <PromoBannerOne />;
  }
}

// ── New Arrivals section ──

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

// ── Testimonials section ──

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

// ── FAQ section ──

async function FAQSection() {
  try {
    await connectDB();
    const raw = await FAQ.find({ is_active: true })
      .sort({ sort_order: 1, created_at: 1 })
      .select("_id question answer")
      .lean();

    const faqs: HomeFAQItem[] = raw.map((f) => ({
      _id: (f._id as { toString(): string }).toString(),
      question: f.question,
      answer: f.answer,
    }));

    return <HomeFAQ faqs={faqs} />;
  } catch {
    return null;
  }
}

// ── Shared skeleton fallbacks for Suspense ──

function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="mx-auto mb-12 h-6 w-48 rounded bg-stone-200" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-4/3 rounded-xl bg-stone-200" />
                <div className="h-4 w-3/4 rounded bg-stone-200" />
                <div className="h-3 w-1/3 rounded bg-stone-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroSkeleton() {
  return (
    <div className="mt-41.5 animate-pulse bg-white">
      <div className="h-12 bg-stone-200" />
      <div className="mx-auto max-w-340 px-5 py-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
          <div className="aspect-16/10 rounded-2xl bg-stone-200" />
          <div className="flex flex-col gap-5">
            <div className="flex-1 rounded-2xl bg-stone-200" />
            <div className="flex-1 rounded-2xl bg-stone-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Schemas ──

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

      {/* 1 · Hero — categories, carousel & ads all from DB */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroDataSection />
      </Suspense>

      {/* 2 · Shop by category (streamed) */}
      <Suspense fallback={<GridSkeleton count={6} />}>
        <CategoriesSection />
      </Suspense>

      {/* 3 · Best Sellers (streamed) */}
      <Suspense fallback={<GridSkeleton count={8} />}>
        <BestSellersSection />
      </Suspense>

      {/* 4 · Promo banner — settings-driven */}
      <Suspense fallback={null}>
        <PromoBannerSection />
      </Suspense>

      {/* 5 · New Arrivals (streamed) */}
      <Suspense fallback={<GridSkeleton count={4} />}>
        <NewArrivalsSection />
      </Suspense>

      {/* 6 · Deals carousel — products tagged promo-ad */}
      <PromoAdsCarousel />

      {/* 7 · FAQs — admin-managed */}
      <Suspense fallback={null}>
        <FAQSection />
      </Suspense>
    </>
  );
}
