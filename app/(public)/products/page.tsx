import type { Metadata } from "next";
import { Suspense } from "react";
import mongoose, { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import {
  ProductCard,
  type ProductCardData,
} from "@/components/common/ProductCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import CategoryNav from "@/components/home/herosection/CategoryNav";

/**
 * Resolves a `category` query param — which may be an ObjectId, a slug or a
 * category name — into the matching category document.
 */
async function resolveCategory(
  value: string,
): Promise<{ id: string; name: string } | null> {
  if (!value) return null;
  let doc: { _id: unknown; name: string } | null = null;
  if (isValidObjectId(value)) {
    doc = (await Category.findById(value).select("name").lean()) as {
      _id: unknown;
      name: string;
    } | null;
  }
  if (!doc) {
    const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    doc = (await Category.findOne({
      $or: [
        { slug: value.toLowerCase() },
        { name: new RegExp(`^${escaped}$`, "i") },
      ],
    })
      .select("name")
      .lean()) as { _id: unknown; name: string } | null;
  }
  return doc ? { id: String(doc._id), name: doc.name } : null;
}

/** Merchandising flags set in the admin product form, usable as `?flag=true`. */
const FLAG_FILTERS = [
  { param: "is_featured", label: "Featured" },
  { param: "is_new_arrival", label: "New Arrivals" },
  { param: "is_best_seller", label: "Best Sellers" },
  { param: "is_trending", label: "Trending" },
] as const;

interface Props {
  searchParams: Promise<Record<string, string>>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const q = params.q || "";
  const category = params.category || "";

  let title = "All Products";
  let description = `Browse our complete collection of premium furniture. Find the perfect piece for your home.`;

  if (q) {
    title = `Search results for "${q}"`;
    description = `Search results for "${q}". Find premium furniture matching your criteria.`;
  }

  if (category) {
    try {
      await connectDB();
      const resolved = await resolveCategory(category);
      if (resolved) {
        title = resolved.name;
        description = `Browse our collection of ${resolved.name}. Premium furniture crafted for lasting beauty.`;
      }
    } catch {}
  }

  return buildMetadata({
    title,
    description,
    path: `/products${q ? `?q=${encodeURIComponent(q)}` : ""}${category ? `${q ? "&" : "?"}category=${category}` : ""}`,
  });
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  await connectDB();

  const page = Math.max(1, parseInt(params.page || "1"));
  const limit = 20;
  const categoryParam = params.category || "";
  const material = params.material || "";
  const minPrice = params.minPrice || "";
  const maxPrice = params.maxPrice || "";
  const sort = params.sort || "newest";
  const q = params.q || "";

  const resolvedCategory = categoryParam
    ? await resolveCategory(categoryParam)
    : null;

  const match: Record<string, unknown> = { status: "published" };
  if (resolvedCategory) match.category_id = resolvedCategory.id;
  if (material) match.material = new RegExp(material.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  if (minPrice || maxPrice) {
    // Filter on the price customers see; trusted() so sanitizeFilter keeps the range operators.
    const priceFilter: Record<string, number> = {};
    if (minPrice && !isNaN(parseFloat(minPrice))) priceFilter.$gte = parseFloat(minPrice);
    if (maxPrice && !isNaN(parseFloat(maxPrice))) priceFilter.$lte = parseFloat(maxPrice);
    if (Object.keys(priceFilter).length) match.final_price = mongoose.trusted(priceFilter);
  }
  if (q) match.$text = mongoose.trusted({ $search: q });
  for (const flag of FLAG_FILTERS) {
    if (params[flag.param] === "true") match[flag.param] = true;
  }
  const activeFlag = FLAG_FILTERS.find((f) => params[f.param] === "true");

  type SortOption = Record<string, 1 | -1>;
  const sortOpts: SortOption =
    sort === "price_asc"
      ? { final_price: 1 }
      : sort === "price_desc"
        ? { final_price: -1 }
        : sort === "discount"
          ? { discount: -1 }
          : { created_at: -1 };

  const [products, total, categories] = await Promise.all([
    Product.find(match)
      .sort(sortOpts)
      .skip((page - 1) * limit)
      .limit(limit)
      .select(
        "title slug thumbnail base_price final_price discount material is_new_arrival is_best_seller",
      )
      .lean(),
    Product.countDocuments(match),
    Category.find({ is_active: true }).sort("name").lean(),
  ]);

  const totalPages = Math.ceil(total / limit);

  const breadcrumbs = [
    { name: "Home", href: "/" },
    {
      name: q
        ? `Search: "${q}"`
        : resolvedCategory?.name || activeFlag?.label || "All Products",
      href: `/products${q ? `?q=${encodeURIComponent(q)}` : ""}`,
    },
  ];

  const navCategories = ["All", ...categories.map((c) => c.name)];

  return (
    <>
      <JsonLd schema={breadcrumbSchema(breadcrumbs)} />

      <div className="bg-white mx-auto max-w-7xl px-4 py-8 pt-50 sm:px-6 lg:px-8">
        {/* Full-width category strip: All → categories */}
        <Suspense
          fallback={<div className="h-14 border-b border-neutral-200" />}
        >
          <CategoryNav
            categories={navCategories}
            activeCategory={resolvedCategory?.name || "All"}
          />
        </Suspense>

        <div className="mt-8">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="mb-4 text-muted-foreground"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard
                  key={p._id.toString()}
                  product={JSON.parse(JSON.stringify(p)) as ProductCardData}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/products?page=${p}&sort=${sort}${categoryParam ? `&category=${encodeURIComponent(categoryParam)}` : ""}${activeFlag ? `&${activeFlag.param}=true` : ""}${material ? `&material=${material}` : ""}${minPrice ? `&minPrice=${minPrice}` : ""}${maxPrice ? `&maxPrice=${maxPrice}` : ""}${q ? `&q=${q}` : ""}`}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm ${
                    p === page
                      ? "bg-primary text-primary-foreground"
                      : "border hover:bg-muted"
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
