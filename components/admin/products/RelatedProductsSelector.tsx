'use client';

import { useState, useCallback, useEffect } from 'react';

interface RelatedProductsSelectorProps {
  label: string;
  field: string;
  selectedIds: string[];
  onChange: (field: string, ids: string[]) => void;
}

interface SearchResult {
  _id: string;
  title: string;
  slug: string;
  base_price: number;
  final_price: number;
}

export function RelatedProductsSelector({ label, field, selectedIds, onChange }: RelatedProductsSelectorProps) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (selectedIds.length > 0) {
      Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/products/${id}`)
            .then((r) => r.json())
            .catch(() => null),
        ),
      ).then((products) => {
        setSelectedProducts(products.filter(Boolean));
      });
    }
  }, [selectedIds]);

  const handleSearch = useCallback(async (q: string) => {
    setSearch(q);
    if (q.length < 2) {
      setResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}&limit=8`);
      const data = await res.json();
      setResults(data.products || []);
    } catch {
      setResults([]);
    }
  }, []);

  const addProduct = useCallback(
    (product: SearchResult) => {
      if (!selectedIds.includes(product._id)) {
        onChange(field, [...selectedIds, product._id]);
        setSelectedProducts((prev) => [...prev, product]);
      }
      setSearch('');
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

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>

      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search products..."
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {results.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-lg">
            {results.map((p) => (
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
        )}
      </div>

      {selectedProducts.length > 0 && (
        <div className="space-y-1.5">
          {selectedProducts.map((p) => (
            <div key={p._id} className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm">
              <span className="truncate">{p.title}</span>
              <button
                type="button"
                onClick={() => removeProduct(p._id)}
                className="ml-2 shrink-0 text-muted-foreground hover:text-destructive"
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
