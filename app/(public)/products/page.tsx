import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import {
  ProductCard,
  type ProductCardData,
} from "@/components/common/ProductCard";
import { ProductFilters } from "./ProductFilters";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { SITE_NAME } from "@/lib/constants";
import CategoryNav from "@/components/home/herosection/CategoryNav";

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
      const cat = await Category.findById(category)
        .select("name description")
        .lean();
      if (cat) {
        title = cat.name;
        description =
          cat.description ||
          `Browse our collection of ${cat.name}. Premium furniture crafted for lasting beauty.`;
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
  const category = params.category || "";
  const material = params.material || "";
  const minPrice = params.minPrice || "";
  const maxPrice = params.maxPrice || "";
  const sort = params.sort || "newest";
  const q = params.q || "";

  const match: Record<string, unknown> = { status: "published" };
  if (category) match.category_id = category;
  if (material) match.material = { $regex: material, $options: "i" } as unknown;
  if (minPrice || maxPrice) {
    const priceFilter: Record<string, number> = {};
    if (minPrice) priceFilter.$gte = parseFloat(minPrice);
    if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);
    match.base_price = priceFilter;
  }
  if (q) match.$text = { $search: q };

  type SortOption = Record<string, 1 | -1>;
  const sortOpts: SortOption =
    sort === "price_asc"
      ? { final_price: 1 }
      : sort === "price_desc"
        ? { final_price: -1 }
        : sort === "discount"
          ? { discount: -1 }
          : { created_at: -1 };

  const [products, total, categories, facetResult] = await Promise.all([
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
    Product.aggregate([
      { $match: { status: "published" } },
      {
        $group: {
          _id: null,
          materials: { $addToSet: "$material" },
          minPrice: { $min: "$base_price" },
          maxPrice: { $max: "$base_price" },
        },
      },
    ]),
  ]);

  const totalPages = Math.ceil(total / limit);
  const facets = {
    materials:
      (facetResult[0] as { materials: string[] } | undefined)?.materials || [],
    priceRange: {
      min: (facetResult[0] as { minPrice: number } | undefined)?.minPrice || 0,
      max:
        (facetResult[0] as { maxPrice: number } | undefined)?.maxPrice ||
        100000,
    },
  };

  const breadcrumbs = [
    { name: "Home", href: "/" },
    {
      name: q
        ? `Search: "${q}"`
        : category
          ? categories.find((c) => c._id.toString() === category)?.name ||
            "Products"
          : "All Products",
      href: `/products${q ? `?q=${encodeURIComponent(q)}` : ""}`,
    },
  ];

  return (
    <>
      <JsonLd schema={breadcrumbSchema(breadcrumbs)} />

      <div className="mx-auto max-w-7xl px-4 py-8 pt-44 sm:px-6 lg:px-8">
        {/* Full-width category strip: All → categories → New Arrivals */}
        <CategoryNav />

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
                  href={`/products?page=${p}&sort=${sort}${category ? `&category=${category}` : ""}${material ? `&material=${material}` : ""}${minPrice ? `&minPrice=${minPrice}` : ""}${maxPrice ? `&maxPrice=${maxPrice}` : ""}${q ? `&q=${q}` : ""}${arrivals ? `&arrivals=${arrivals}` : ""}`}
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
