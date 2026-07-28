import Image from 'next/image';
import Link from 'next/link';
import { SectionHeading, RevealItem, RevealGroup } from './shared';
import { cn } from '@/lib/utils';

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string | null;
  product_count: number;
  description: string | null;
}

interface FeaturedCategoriesProps {
  categories: Category[];
}

/**
 * Editorial category showcase. Falls back to a curated set so the section is
 * always cinematic, even before catalogue data is seeded.
 */
const FALLBACK: Omit<Category, '_id'>[] = [
  { name: 'Beds', slug: 'beds', product_count: 0, description: 'Restful sanctuaries', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600' },
  { name: 'Sofas', slug: 'sofas', product_count: 0, description: 'Sink-in comfort', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1600' },
  { name: 'Dining tables', slug: 'dining-tables', product_count: 0, description: 'Where evenings linger', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1600' },
  { name: 'Chairs', slug: 'chairs', product_count: 0, description: 'Sculpted to sit', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1600' },
  { name: 'Coffee tables', slug: 'coffee-tables', product_count: 0, description: 'The quiet centre', image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?q=80&w=1600' },
  { name: 'Office', slug: 'office', product_count: 0, description: 'Considered workspaces', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600' },
  { name: 'Storage', slug: 'storage', product_count: 0, description: 'Order, beautifully kept', image: 'https://images.unsplash.com/photo-1594224457860-23f30622a4a2?q=80&w=1600' },
  { name: 'Bedroom', slug: 'bedroom', product_count: 0, description: 'Complete the retreat', image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1600' },
];

// Bento spans keyed by index — an intentional, asymmetric editorial rhythm.
const SPANS = [
  'lg:col-span-7 lg:row-span-2',
  'lg:col-span-5',
  'lg:col-span-5',
  'lg:col-span-4',
  'lg:col-span-4',
  'lg:col-span-4',
  'lg:col-span-6',
  'lg:col-span-6',
];

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  const items: Category[] =
    categories.length > 0
      ? categories
      : FALLBACK.map((c, i) => ({ ...c, _id: `fallback-${i}` }));

  const hrefFor = (c: Category) =>
    c._id.startsWith('fallback-') ? `/products?category=${c.slug}` : `/products?category=${c._id}`;

  return (
    <section className="relative overflow-hidden bg-lux-ivory py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow="Explore the collection"
            title="Shop by category"
            description="Eight disciplines of making, each with its own character — begin wherever your room does."
          />
          <Link
            href="/products"
            className="group hidden shrink-0 items-center gap-2 text-sm font-medium uppercase tracking-[0.14em] text-lux-ink md:inline-flex"
          >
            View all
            <span className="inline-block transition-transform duration-500 group-hover:translate-x-1.5">→</span>
          </Link>
        </div>

        <RevealGroup
          className="mt-14 grid auto-rows-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[repeat(3,14rem)]"
          stagger={0.08}
        >
          {items.slice(0, 8).map((category, i) => (
            <RevealItem key={category._id} className={cn('min-h-[16rem]', SPANS[i])}>
              <Link
                href={hrefFor(category)}
                className="group relative flex h-full w-full overflow-hidden rounded-2xl bg-lux-charcoal"
              >
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 45vw"
                    className="object-cover opacity-90 transition-all duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-hover:opacity-100"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-lux-graphite to-lux-charcoal">
                    <span className="font-display text-6xl text-lux-soft/15">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-lux-ink/85 via-lux-ink/10 to-transparent transition-opacity duration-500 group-hover:from-lux-ink/90" />

                <div className="relative z-10 mt-auto flex w-full items-end justify-between p-6 sm:p-7">
                  <div>
                    {category.description && (
                      <p className="mb-1 text-[0.7rem] uppercase tracking-[0.22em] text-lux-parchment/90 opacity-0 transition-all duration-500 group-hover:opacity-100">
                        {category.description}
                      </p>
                    )}
                    <h3 className="font-display text-2xl leading-tight text-lux-soft sm:text-3xl">
                      {category.name}
                    </h3>
                    {category.product_count > 0 && (
                      <p className="mt-1 text-xs text-lux-sand/70">
                        {category.product_count} {category.product_count === 1 ? 'piece' : 'pieces'}
                      </p>
                    )}
                  </div>
                  <span className="flex h-11 w-11 shrink-0 translate-y-2 items-center justify-center rounded-full border border-lux-soft/40 text-lux-soft opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-hover:border-lux-gold group-hover:bg-lux-gold group-hover:text-lux-ink">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17 17 7M7 7h10v10" />
                    </svg>
                  </span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
