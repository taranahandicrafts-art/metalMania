'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Facets {
  materials: string[];
  priceRange: { min: number; max: number };
}

interface ProductFiltersProps {
  categories: { _id: string; name: string; slug: string }[];
  facets: Facets;
  currentCategory: string;
  currentMaterial: string;
  currentMinPrice: string;
  currentMaxPrice: string;
  currentQ: string;
  currentSort: string;
}

export function ProductFilters({
  categories,
  facets,
  currentCategory,
  currentMaterial,
  currentMinPrice,
  currentMaxPrice,
  currentSort,
}: ProductFiltersProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);
  const [search, setSearch] = useState('');

  useEffect(() => { setMounted(true); }, []);

  const buildUrl = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.set('category', params.category);
    if (params.material) searchParams.set('material', params.material);
    if (params.minPrice) searchParams.set('minPrice', params.minPrice);
    if (params.maxPrice) searchParams.set('maxPrice', params.maxPrice);
    if (params.q) searchParams.set('q', params.q);
    if (params.sort) searchParams.set('sort', params.sort);
    const qs = searchParams.toString();
    return `/products${qs ? `?${qs}` : ''}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const applyPrice = () => {
    const params: Record<string, string> = {};
    if (currentCategory) params.category = currentCategory;
    if (currentMaterial) params.material = currentMaterial;
    if (currentSort) params.sort = currentSort;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    router.push(buildUrl(params));
  };

  const isActive = (key: string, value: string) => {
    if (key === 'category') return currentCategory === value;
    if (key === 'material') return currentMaterial === value;
    return false;
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="h-10 w-full rounded-md border bg-background pl-10 pr-3 text-sm"
          />
        </div>
      </form>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Categories</h3>
        <div className="space-y-1">
          <Link
            href="/products"
            className={`block rounded px-3 py-1.5 text-sm ${!currentCategory ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground hover:bg-muted'}`}
          >
            All Categories
          </Link>
          {categories.map((c) => (
            <Link
              key={c._id}
              href={isActive('category', c._id) ? '/products' : `/products?category=${c._id}`}
              className={`block rounded px-3 py-1.5 text-sm ${
                isActive('category', c._id) ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {facets.materials.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold">Material</h3>
          <div className="space-y-1">
            {facets.materials.map((m) => (
              <Link
                key={m}
                href={isActive('material', m) ? '/products' : `/products?material=${encodeURIComponent(m)}`}
                className={`block rounded px-3 py-1.5 text-sm ${
                  isActive('material', m) ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {m}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-3 text-sm font-semibold">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-9 w-full rounded-md border px-2 text-sm"
          />
          <span className="text-muted-foreground">—</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-9 w-full rounded-md border px-2 text-sm"
          />
        </div>
        <button onClick={applyPrice} className="mt-2 w-full rounded-md bg-primary py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
          Apply
        </button>
      </div>

      <Link
        href="/products"
        className="block text-center text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
      >
        Clear all filters
      </Link>
    </div>
  );
}
