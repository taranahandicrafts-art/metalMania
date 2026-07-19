'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Variant {
  _id?: string;
  sku: string;
  title: string;
  price_adjustment: number;
  stock: number;
  is_active: boolean;
  attributes: { name: string; value: string }[];
  images: string[];
}

interface VariantManagerProps {
  productId: string;
  variants: Variant[];
}

export function VariantManager({ productId, variants: initialVariants }: VariantManagerProps) {
  const router = useRouter();
  const [variants, setVariants] = useState<Variant[]>(
    initialVariants.length > 0
      ? initialVariants
      : [{ sku: '', title: '', price_adjustment: 0, stock: 0, is_active: true, attributes: [{ name: '', value: '' }], images: [] }],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const addVariant = useCallback(() => {
    setVariants((prev) => [...prev, { sku: '', title: '', price_adjustment: 0, stock: 0, is_active: true, attributes: [{ name: '', value: '' }], images: [] }]);
  }, []);

  const removeVariant = useCallback((index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateVariant = useCallback((index: number, key: string, value: unknown) => {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, [key]: value } : v)));
  }, []);

  const addAttribute = useCallback((variantIndex: number) => {
    setVariants((prev) => prev.map((v, i) => (i === variantIndex ? { ...v, attributes: [...v.attributes, { name: '', value: '' }] } : v)));
  }, []);

  const updateAttribute = useCallback((variantIndex: number, attrIndex: number, key: 'name' | 'value', value: string) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === variantIndex
          ? { ...v, attributes: v.attributes.map((a, j) => (j === attrIndex ? { ...a, [key]: value } : a)) }
          : v,
      ),
    );
  }, []);

  const removeAttribute = useCallback((variantIndex: number, attrIndex: number) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === variantIndex ? { ...v, attributes: v.attributes.filter((_, j) => j !== attrIndex) } : v,
      ),
    );
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/products/${productId}/variants`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variants }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save variants');
      }

      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

  return (
    <div className="space-y-6">
      {error && <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
      {success && <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">Variants saved successfully</div>}

      {variants.map((variant, vi) => (
        <div key={vi} className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Variant {vi + 1}</h3>
            {variants.length > 1 && (
              <button type="button" onClick={() => removeVariant(vi)} className="text-sm text-destructive hover:text-destructive/80">Remove</button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input className={inputClass} value={variant.title} onChange={(e) => updateVariant(vi, 'title', e.target.value)} placeholder="e.g. Walnut Finish" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">SKU</label>
              <input className={inputClass} value={variant.sku} onChange={(e) => updateVariant(vi, 'sku', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price Adjustment (₹)</label>
              <input type="number" className={inputClass} value={variant.price_adjustment} onChange={(e) => updateVariant(vi, 'price_adjustment', Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stock</label>
              <input type="number" min="0" className={inputClass} value={variant.stock} onChange={(e) => updateVariant(vi, 'stock', Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Images (comma separated URLs)</label>
              <input className={inputClass} value={variant.images.join(', ')} onChange={(e) => updateVariant(vi, 'images', e.target.value.split(',').map((s) => s.trim()))} />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={variant.is_active} onChange={(e) => updateVariant(vi, 'is_active', e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
                Active
              </label>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <p className="text-sm font-medium">Attributes</p>
            {variant.attributes.map((attr, ai) => (
              <div key={ai} className="flex items-center gap-2">
                <input className={inputClass} placeholder="Attribute name (e.g. Color)" value={attr.name} onChange={(e) => updateAttribute(vi, ai, 'name', e.target.value)} />
                <input className={inputClass} placeholder="Value (e.g. Walnut)" value={attr.value} onChange={(e) => updateAttribute(vi, ai, 'value', e.target.value)} />
                {variant.attributes.length > 1 && (
                  <button type="button" onClick={() => removeAttribute(vi, ai)} className="shrink-0 text-muted-foreground hover:text-destructive">&times;</button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addAttribute(vi)} className="text-sm text-primary underline underline-offset-2">+ Add attribute</button>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4">
        <button type="button" onClick={addVariant} className="inline-flex h-10 items-center justify-center rounded-md border px-6 text-sm font-medium hover:bg-muted">
          + Add Variant
        </button>
        <button type="button" onClick={handleSave} disabled={loading} className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Variants'}
        </button>
      </div>
    </div>
  );
}
