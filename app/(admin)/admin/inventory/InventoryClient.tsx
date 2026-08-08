'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProductOption {
  id: string;
  title: string;
  sku: string;
}

interface InventoryClientProps {
  products: ProductOption[];
}

export function InventoryClient({ products }: InventoryClientProps) {
  const router = useRouter();
  const [sku, setSku] = useState('');
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'add' | 'set'>('add');
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = products.filter(
    (p) =>
      p.sku.toLowerCase().includes(filter.toLowerCase()) ||
      p.title.toLowerCase().includes(filter.toLowerCase()),
  );

  const selectedProduct = products.find((p) => p.sku === sku);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (product: ProductOption) => {
    setSku(product.sku);
    setFilter('');
    setOpen(false);
  };

  const handleSkuInputChange = (val: string) => {
    setFilter(val);
    setSku(val.toUpperCase());
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: sku.toUpperCase(),
          type,
          quantity: Number(quantity),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to adjust stock');
      }

      setSuccess(true);
      setQuantity(0);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md bg-green-50 px-4 py-2 text-sm text-green-700">
          Stock adjusted successfully
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Product / SKU</label>
          <div className="relative" ref={dropdownRef}>
            <input
              className={inputClass}
              value={open ? filter : (selectedProduct ? `${selectedProduct.title} — ${sku}` : sku)}
              onChange={(e) => handleSkuInputChange(e.target.value)}
              onFocus={() => {
                setFilter('');
                setOpen(true);
              }}
              placeholder="Search product or type SKU"
              required
              autoComplete="off"
            />
            {open && (
              <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover shadow-md">
                {filtered.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">No products found</div>
                ) : (
                  filtered.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground ${
                        p.sku === sku ? 'bg-accent/50 font-medium' : ''
                      }`}
                      onClick={() => handleSelect(p)}
                    >
                      <span className="truncate">{p.title}</span>
                      <span className="ml-2 shrink-0 font-mono text-xs text-muted-foreground">
                        {p.sku}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          {selectedProduct && !open && (
            <p className="text-xs text-muted-foreground font-mono">{sku}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>
          <select
            className={inputClass}
            value={type}
            onChange={(e) => setType(e.target.value as 'add' | 'set')}
          >
            <option value="add">Add Stock</option>
            <option value="set">Set Exact</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Quantity</label>
          <input
            type="number"
            min="0"
            className={inputClass}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !sku}
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Adjusting...' : 'Adjust Stock'}
      </button>
    </form>
  );
}
