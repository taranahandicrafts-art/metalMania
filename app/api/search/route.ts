import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export interface SearchProduct {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  final_price?: number;
}
export interface SearchCategory {
  id: string;
  name: string;
}
export interface SearchResponse {
  categories: SearchCategory[];
  products: SearchProduct[];
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  if (q.length < 2) {
    return NextResponse.json<SearchResponse>({ categories: [], products: [] });
  }

  await connectDB();
  const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

  const [categories, products] = await Promise.all([
    Category.find({ is_active: true, name: rx }).select("name").limit(4).lean(),
    Product.find({ status: "published", title: rx })
      .select("title slug thumbnail final_price")
      .limit(6)
      .lean(),
  ]);

  return NextResponse.json<SearchResponse>({
    categories: categories.map((c) => ({ id: c._id.toString(), name: c.name })),
    products: products.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      slug: p.slug,
      thumbnail: p.thumbnail,
      final_price: p.final_price,
    })),
  });
}
