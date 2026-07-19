'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  parent_id: string | null;
  path: string;
  is_active: boolean;
  image: string;
  order: number;
}

interface CategoryFormProps {
  initialData?: Category;
  categories: { _id: string; name: string; path: string }[];
}

export function CategoryForm({ initialData, categories }: CategoryFormProps) {
  const router = useRouter();
  const initial = initialData as Record<string, unknown> | undefined;
  const [form, setForm] = useState({
    name: (initial?.name as string) || '',
    slug: (initial?.slug as string) || '',
    description: (initial?.description as string) || '',
    parent_id: (initial?.parent_id as string) || '',
    is_active: (initial?.is_active as boolean) ?? true,
    image: (initial?.image as string) || '',
    order: (initial?.sort_order as number) || 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        ...form,
        parent_id: form.parent_id || null,
        sort_order: Number(form.order),
      };

      const url = initialData ? `/api/categories/${initialData._id}` : '/api/categories';
      const method = initialData ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
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
  const labelClass = 'text-sm font-medium leading-none';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
      {success && <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">Saved successfully</div>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className={labelClass}>Name</label>
          <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Slug</label>
          <input className={inputClass} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea className={`${inputClass} h-20 resize-none pt-2`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Parent Category</label>
          <select className={inputClass} value={form.parent_id} onChange={(e) => setForm({ ...form, parent_id: e.target.value })}>
            <option value="">None (top-level)</option>
            {categories
              .filter((c) => c._id !== initialData?._id)
              .map((c) => (
                <option key={c._id} value={c._id}>{c.path || c.name}</option>
              ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Order</label>
          <input type="number" min="0" className={inputClass} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Image URL</label>
          <input className={inputClass} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="h-4 w-4 rounded border-gray-300" />
            Active
          </label>
        </div>
      </div>

      <button type="submit" disabled={loading} className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
        {loading ? 'Saving...' : initialData ? 'Update Category' : 'Create Category'}
      </button>
    </form>
  );
}
