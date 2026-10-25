import { SectionHeading, RevealItem, RevealGroup, LuxButton, LuxProductCard, type LuxProduct } from './shared';

interface BestSellersProps {
  products: LuxProduct[];
}

/**
 * Featured Collection — the most-loved pieces, presented gallery-style with
 * generous breathing room rather than a dense grid.
 */
export function BestSellers({ products }: BestSellersProps) {
  // Hide the section rather than show placeholder pieces that link nowhere.
  if (products.length === 0) return null;
  const items = products;

  return (
    <section className="relative overflow-hidden bg-lux-soft py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow="Featured collection"
            title="The pieces most loved"
            description="A rotating selection of our signature work — the designs our clients return to, room after room."
          />
          <div className="hidden md:block">
            <LuxButton href="/products?is_featured=true" variant="outline">
              Browse all
            </LuxButton>
          </div>
        </div>

        <RevealGroup
          className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-4"
          stagger={0.09}
        >
          {items.slice(0, 8).map((product) => (
            <RevealItem key={product._id} className="h-full">
              <LuxProductCard product={product} />
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-12 flex justify-center md:hidden">
          <LuxButton href="/products?is_featured=true" variant="outline">
            Browse all
          </LuxButton>
        </div>
      </div>
    </section>
  );
}
