import { ProductCard, type ProductCardData } from '@/components/common/ProductCard';

interface RelatedProductsSectionProps {
  products: ProductCardData[];
}

export function RelatedProductsSection({ products }: RelatedProductsSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
