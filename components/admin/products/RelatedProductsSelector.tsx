'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface RelatedProductsSelectorProps {
  label: string;
  field: string;
  selectedIds: string[];
  onChange: (field: string, ids: string[]) => void;
}

interface ProductOption {
  _id: string;
  title: string;
  slug: string;
  base_price: number;
  final_price: number;
}

export function RelatedProductsSelector({ label, field, selectedIds, onChange }: RelatedProductsSelectorProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [results, setResults] = useState<ProductOption[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedIds.length === 0) return;
    Promise.all(
      selectedIds.map((id) =>
        fetch(`/api/products/${id}`)
          .then((r) => r.json())
          .catch(() => null),
      ),
    ).then((products) => setSelectedProducts(products.filter(Boolean)));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFilter('');
        setResults([]);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleFilter = useCallback(async (q: string) => {
    setFilter(q);
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}&limit=10&all=true`);
      const data = await res.json();
      setResults(data.products || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = useCallback(
    (product: ProductOption) => {
      if (selectedIds.includes(product._id)) return;
      onChange(field, [...selectedIds, product._id]);
      setSelectedProducts((prev) => [...prev, product]);
      setFilter('');
      setResults([]);
    },
    [selectedIds, onChange, field],
  );

  const removeProduct = useCallback(
    (id: string) => {
      onChange(field, selectedIds.filter((i) => i !== id));
      setSelectedProducts((prev) => prev.filter((p) => p._id !== id));
    },
    [selectedIds, onChange, field],
  );

  const availableResults = results.filter((p) => !selectedIds.includes(p._id));

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>

      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>Add related product…</span>
          <svg className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </button>

        {open && (
          <div className="absolute z-20 mt-1 w-full rounded-md border bg-background shadow-lg">
            <div className="p-2 border-b">
              <input
                autoFocus
                type="text"
                value={filter}
                onChange={(e) => handleFilter(e.target.value)}
                placeholder="Filter by name…"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="max-h-56 overflow-y-auto">
              {loading && (
                <p className="px-3 py-2 text-sm text-muted-foreground">Searching…</p>
              )}
              {!loading && filter.length >= 2 && availableResults.length === 0 && (
                <p className="px-3 py-2 text-sm text-muted-foreground">No products found</p>
              )}
              {!loading && filter.length < 2 && (
                <p className="px-3 py-2 text-sm text-muted-foreground">Type at least 2 characters to search</p>
              )}
              {availableResults.map((p) => (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => addProduct(p)}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  <span className="flex-1 truncate">{p.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">₹{p.final_price}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedProducts.length > 0 && (
        <div className="space-y-1.5">
          {selectedProducts.map((p) => (
            <div key={p._id} className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2 text-sm">
              <span className="truncate">{p.title}</span>
              <span className="mx-3 shrink-0 text-xs text-muted-foreground">₹{p.final_price}</span>
              <button
                type="button"
                onClick={() => removeProduct(p._id)}
                aria-label={`Remove ${p.title}`}
                className="shrink-0 text-muted-foreground hover:text-destructive"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
