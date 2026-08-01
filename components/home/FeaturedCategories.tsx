import Image from 'next/image';
import Link from 'next/link';
import { SectionHeading, RevealItem, RevealGroup } from './shared';

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
            description="Browse our disciplines of making — begin wherever your room does."
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
          className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-6"
          stagger={0.06}
        >
          {items.map((category) => (
            <RevealItem key={category._id}>
              <Link href={hrefFor(category)} className="group block">
                {/* Image tile */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-lux-charcoal">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-lux-graphite to-lux-charcoal">
                      <span className="font-display text-5xl text-lux-soft/20">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  {/* Subtle hover wash for polish */}
                  <div className="absolute inset-0 bg-lux-ink/0 transition-colors duration-500 group-hover:bg-lux-ink/5" />
                </div>

                {/* Label */}
                <h3 className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-lux-ink transition-colors duration-300 group-hover:text-lux-gold sm:text-sm">
                  {category.name}
                </h3>
                {category.product_count > 0 && (
                  <p className="mt-0.5 text-center text-[0.7rem] text-lux-graphite/70">
                    {category.product_count} {category.product_count === 1 ? 'piece' : 'pieces'}
                  </p>
                )}
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
