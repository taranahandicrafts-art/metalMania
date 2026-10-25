import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { PromoAdsResponse } from "@/components/home/types";
import { formatPrice } from "@/lib/utils";

const BADGE_COLORS = [
  "bg-[#8a4a29] text-white",
  "bg-[#7c6f2a] text-white",
  "bg-[#2a6f4a] text-white",
  "bg-[#2a4a6f] text-white",
];

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({
      tags: "promo-ad",
      status: "published",
    })
      .sort({ created_at: -1 })
      .limit(6)
      .select(
        "_id title slug thumbnail images base_price final_price discount short_description material",
      )
      .lean();

    const items = products
      .map((p) => ({
        product: p,
        image:
          p.thumbnail ||
          (Array.isArray(p.images) && p.images[0]?.url) ||
          "",
      }))
      .filter((entry) => !!entry.image)
      .map(({ product: p, image }, i) => ({
        id: (p._id as { toString(): string }).toString(),
        badge: p.discount > 0 ? `UPTO ${p.discount}% OFF` : "FEATURED",
        badgeClassName: BADGE_COLORS[i % BADGE_COLORS.length],
        title: p.title.toUpperCase(),
        tagline: p.short_description || p.material || "",
        priceCaption: "Starting From",
        price: formatPrice(p.final_price ?? p.base_price),
        image,
        href: `/products/${p.slug}`,
        bgClassName: "bg-[#efe9df]",
      }));

    const response: PromoAdsResponse = {
      title: "Deals of the Day",
      items,
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json({
      title: "Deals of the Day",
      items: [],
    } satisfies PromoAdsResponse);
  }
}
