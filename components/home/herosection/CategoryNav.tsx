'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORIES } from '../data/showcase';

interface CategoryNavProps {
  categories?: string[];
  initialActive?: string;
  /** Server-resolved active category name (takes precedence over the URL). */
  activeCategory?: string;
  /** Base path to navigate to on selection. Defaults to the products page. */
  basePath?: string;
  onSelect?: (category: string) => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const CategoryNav: React.FC<CategoryNavProps> = ({
  categories = CATEGORIES,
  initialActive = 'All',
  activeCategory,
  basePath = '/products',
  onSelect,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, setPending] = useState<string | null>(null);

  const urlCategory = searchParams.get('category') ?? '';

  // Clear the optimistic highlight once the URL reflects a navigation so the
  // active state stays in sync on back/forward navigation.
  useEffect(() => {
    setPending(null);
  }, [urlCategory]);

  const active = useMemo(() => {
    if (pending) return pending;
    if (activeCategory) return activeCategory;
    if (urlCategory) {
      const byName = categories.find((c) => c.toLowerCase() === urlCategory.toLowerCase());
      if (byName) return byName;
      const bySlug = categories.find((c) => slugify(c) === urlCategory.toLowerCase());
      if (bySlug) return bySlug;
    }
    return categories.includes('All') ? 'All' : initialActive;
  }, [pending, activeCategory, urlCategory, categories, initialActive]);

  const handleClick = (cat: string) => {
    if (onSelect) {
      onSelect(cat);
      return;
    }
    setPending(cat);
    router.push(cat === 'All' ? basePath : `${basePath}?category=${encodeURIComponent(cat)}`);
  };

  return (
    <nav className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-[1360px] items-center gap-1 overflow-x-auto px-5 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              onClick={() => handleClick(cat)}
              className={[
                'flex-1 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-center text-[15px] tracking-wide transition-colors',
                isActive
                  ? 'font-semibold text-amber-600'
                  : 'font-medium text-neutral-800 hover:text-amber-600',
              ].join(' ')}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default CategoryNav;
