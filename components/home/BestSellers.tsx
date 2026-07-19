import { SectionHeading, RevealItem, RevealGroup, LuxButton, LuxProductCard, type LuxProduct } from './shared';

interface BestSellersProps {
  products: LuxProduct[];
}

const FALLBACK: LuxProduct[] = [
  { _id: 'f1', title: 'Oxford solid oak bed frame', slug: 'oxford-oak-bed', thumbnail: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=1200', base_price: 68000, final_price: 54400, discount: 20, material: 'Solid oak', is_new_arrival: false, is_best_seller: true, rating: 5, review_count: 128, short_description: 'A low, architectural frame in hand-oiled European oak.' },
  { _id: 'f2', title: 'Halden three-seat sofa', slug: 'halden-sofa', thumbnail: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=1200', base_price: 92000, final_price: 92000, discount: 0, material: 'Bouclé wool', is_new_arrival: true, is_best_seller: true, rating: 5, review_count: 86, short_description: 'Deep, feather-wrapped cushions in ivory bouclé.' },
  { _id: 'f3', title: 'Marlow walnut dining table', slug: 'marlow-dining-table', thumbnail: 'https://images.unsplash.com/photo-1615529162924-f8605388461d?q=80&w=1200', base_price: 74000, final_price: 62900, discount: 15, material: 'American walnut', is_new_arrival: false, is_best_seller: true, rating: 4, review_count: 54, short_description: 'A single-slab silhouette that seats eight with ease.' },
  { _id: 'f4', title: 'Rue accent lounge chair', slug: 'rue-lounge-chair', thumbnail: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=1200', base_price: 38000, final_price: 38000, discount: 0, material: 'Tan leather', is_new_arrival: true, is_best_seller: true, rating: 5, review_count: 41, short_description: 'Full-grain leather stretched over a steam-bent frame.' },
];

/**
 * Featured Collection — the most-loved pieces, presented gallery-style with
 * generous breathing room rather than a dense grid.
 */
export function BestSellers({ products }: BestSellersProps) {
  const items = products.length > 0 ? products : FALLBACK;

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
            <LuxButton href="/products?is_best_seller=true" variant="outline">
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
          <LuxButton href="/products?is_best_seller=true" variant="outline">
            Browse all
          </LuxButton>
        </div>
      </div>
    </section>
  );
}
