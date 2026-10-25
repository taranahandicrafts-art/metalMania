'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { RelatedProductsSelector } from './RelatedProductsSelector';
import { CloudinaryUploadButton } from '@/components/admin/media/CloudinaryUploadButton';

interface ProductFormProps {
  initialData?: Record<string, unknown>;
  categories?: { _id: string; name: string; path?: string }[];
}

export function ProductForm({ initialData, categories = [] }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [form, setForm] = useState({
    title: (initialData?.title as string) || '',
    slug: (initialData?.slug as string) || '',
    short_description: (initialData?.short_description as string) || '',
    long_description: (initialData?.long_description as string) || '',
    sku: (initialData?.sku as string) || '',
    barcode: (initialData?.barcode as string) || '',
    brand: (initialData?.brand as string) || '',
    material: (initialData?.material as string) || '',
    dim_length: ((initialData?.dimensions as Record<string, unknown>)?.length as number) || 0,
    dim_width: ((initialData?.dimensions as Record<string, unknown>)?.width as number) || 0,
    dim_height: ((initialData?.dimensions as Record<string, unknown>)?.height as number) || 0,
    dim_unit: ((initialData?.dimensions as Record<string, string>)?.unit) || 'cm',
    weight_value: ((initialData?.weight as Record<string, unknown>)?.value as number) || 0,
    weight_unit: ((initialData?.weight as Record<string, string>)?.unit) || 'kg',
    base_price: (initialData?.base_price as number) || 0,
    discount: (initialData?.discount as number) || 0,
    category_id: (initialData?.category_id as string) || '',
    status: (initialData?.status as string) || 'draft',
    is_featured: (initialData?.is_featured as boolean) || false,
    is_best_seller: (initialData?.is_best_seller as boolean) || false,
    is_new_arrival: (initialData?.is_new_arrival as boolean) || false,
    is_trending: (initialData?.is_trending as boolean) || false,
    min_order_qty: (initialData?.min_order_qty as number) || 1,
    return_policy: (initialData?.return_policy as string) || '',
    assembly_instructions: (initialData?.assembly_instructions as string) || '',
    seo_title: ((initialData?.seo as Record<string, string>)?.title) || '',
    seo_description: ((initialData?.seo as Record<string, string>)?.description) || '',
    seo_keywords: (() => {
      const kw = (initialData?.seo as Record<string, unknown>)?.keywords;
      if (Array.isArray(kw)) return kw.join(', ');
      return (kw as string) || '';
    })(),
    shipping_weight: ((initialData?.shipping as Record<string, unknown>)?.weight as number) || 0,
    shipping_flat_rate: ((initialData?.shipping as Record<string, unknown>)?.flat_rate as number) || 0,
    shipping_free: ((initialData?.shipping as Record<string, unknown>)?.free_shipping as boolean) || false,
    shipping_est_min: ((initialData?.shipping as Record<string, unknown>)?.estimated_days as Record<string, number>)?.min || 3,
    shipping_est_max: ((initialData?.shipping as Record<string, unknown>)?.estimated_days as Record<string, number>)?.max || 7,
    warranty_period: ((initialData?.warranty as Record<string, string>)?.period) || '',
    warranty_desc: ((initialData?.warranty as Record<string, string>)?.description) || '',
    thumbnail:
      (initialData?.thumbnail as string) &&
      initialData?.thumbnail !== (initialData?.images as { url: string }[] | undefined)?.[0]?.url
        ? (initialData?.thumbnail as string)
        : '',
  });

  const [images, setImages] = useState<{ url: string; alt: string }[]>(
    (initialData?.images as { url: string; alt: string }[]) || [],
  );
  const [videos, setVideos] = useState<{ url: string; type: string }[]>(
    (initialData?.videos as { url: string; type: string }[]) || [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>(
    (initialData?.faqs as { question: string; answer: string }[]) || [],
  );
  const [tags, setTags] = useState<string[]>(
    ((initialData?.tags || []) as string[]),
  );
  const [tagInput, setTagInput] = useState('');

  const addTag = useCallback(() => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
    }
    setTagInput('');
  }, [tagInput, tags]);

  const removeTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const [relatedIds, setRelatedIds] = useState<string[]>(
    ((initialData?.related_product_ids || []) as string[]).map((id: string | { toString(): string }) => (typeof id === 'string' ? id : (id as unknown as { toString(): string }).toString())),
  );

  const finalPrice = form.base_price - (form.base_price * form.discount) / 100;

  const update = useCallback((key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const addImage = useCallback(() => {
    if (!newImageUrl) return;
    setImages((prev) => [...prev, { url: newImageUrl, alt: newImageAlt.trim() }]);
    setNewImageUrl('');
    setNewImageAlt('');
  }, [newImageUrl, newImageAlt]);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const addVideo = useCallback(() => {
    if (!newVideoUrl) return;
    const type = newVideoUrl.includes('youtube') || newVideoUrl.includes('youtu.be') ? 'youtube' : 'cloudinary';
    setVideos((prev) => [...prev, { url: newVideoUrl, type }]);
    setNewVideoUrl('');
  }, [newVideoUrl]);

  const removeVideo = useCallback((index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const addFaq = useCallback(() => {
    setFaqs((prev) => [...prev, { question: '', answer: '' }]);
  }, []);

  const updateFaq = useCallback((index: number, key: 'question' | 'answer', value: string) => {
    setFaqs((prev) => prev.map((f, i) => (i === index ? { ...f, [key]: value } : f)));
  }, []);

  const removeFaq = useCallback((index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        short_description: form.short_description,
        long_description: form.long_description,
        sku: form.sku,
        barcode: form.barcode,
        brand: form.brand,
        material: form.material,
        base_price: Number(form.base_price),
        discount: Number(form.discount),
        category_id: form.category_id,
        status: form.status,
        is_featured: form.is_featured,
        is_best_seller: form.is_best_seller,
        is_new_arrival: form.is_new_arrival,
        is_trending: form.is_trending,
        min_order_qty: Number(form.min_order_qty),
        return_policy: form.return_policy,
        assembly_instructions: form.assembly_instructions,
        thumbnail: form.thumbnail,
        dimensions: {
          length: Number(form.dim_length),
          width: Number(form.dim_width),
          height: Number(form.dim_height),
          unit: form.dim_unit,
        },
        weight: {
          value: Number(form.weight_value),
          unit: form.weight_unit,
        },
        images: images.map((img, i) => ({
          url: img.url,
          alt: (img.alt?.trim() || form.title || 'Product image').slice(0, 125),
          order: i,
        })),
        videos,
        faqs,
        seo: {
          title: form.seo_title,
          description: form.seo_description,
          keywords: form.seo_keywords ? form.seo_keywords.split(',').map((k: string) => k.trim()) : [],
        },
        shipping: {
          weight: Number(form.shipping_weight),
          flat_rate: form.shipping_flat_rate ? Number(form.shipping_flat_rate) : null,
          free_shipping: form.shipping_free,
          estimated_days: { min: Number(form.shipping_est_min), max: Number(form.shipping_est_max) },
        },
        warranty: {
          period: form.warranty_period,
          description: form.warranty_desc,
        },
        tags,
        related_product_ids: relatedIds,
      };

      const url = isEditing ? `/api/products/${initialData?._id}` : '/api/products';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save product');
      }

      setSuccess(true);
      router.refresh();
      if (!isEditing) {
        const product = await res.json();
        router.push(`/admin/products/${product._id || product.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  const labelClass = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';
  const sectionClass = 'rounded-lg border bg-card p-6 space-y-4';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
      )}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Product {isEditing ? 'updated' : 'created'} successfully
        </div>
      )}

      <div className={sectionClass}>
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label className={labelClass}>Title</label>
            <input className={inputClass} value={form.title} onChange={(e) => update('title', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Slug</label>
            <input className={inputClass} value={form.slug} onChange={(e) => update('slug', e.target.value)} placeholder="Auto-generated from title" />
            <p className="text-xs text-muted-foreground">Used in the product URL (/products/your-slug). Spaces and symbols are converted automatically.</p>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>SKU</label>
            <input className={inputClass} value={form.sku} onChange={(e) => update('sku', e.target.value.toUpperCase())} placeholder="e.g. MM-CHAIR-001" required />
            <p className="text-xs text-muted-foreground">
              Stock Keeping Unit: a unique code for this product. Inventory stock is tracked against it, and it appears in
              admin orders and order exports, admin product search and the product page details. Must be unique; variants
              get their own SKUs.
            </p>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Brand</label>
            <input className={inputClass} value={form.brand} onChange={(e) => update('brand', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Material</label>
            <input className={inputClass} value={form.material} onChange={(e) => update('material', e.target.value)} required />
          </div>
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h4 className="text-base font-semibold">Dimensions</h4>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="space-y-2">
                <label className={labelClass}>Length</label>
                <input type="number" min="0" step="0.1" className={inputClass} value={form.dim_length || ''} placeholder="0" onChange={(e) => update('dim_length', Number(e.target.value))} required />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Width</label>
                <input type="number" min="0" step="0.1" className={inputClass} value={form.dim_width || ''} placeholder="0" onChange={(e) => update('dim_width', Number(e.target.value))} required />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Height</label>
                <input type="number" min="0" step="0.1" className={inputClass} value={form.dim_height || ''} placeholder="0" onChange={(e) => update('dim_height', Number(e.target.value))} required />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Unit</label>
                <select className={inputClass} value={form.dim_unit} onChange={(e) => update('dim_unit', e.target.value)}>
                  <option value="cm">cm</option>
                  <option value="inch">inch</option>
                </select>
              </div>
            </div>
            <h4 className="text-base font-semibold">Weight</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className={labelClass}>Value</label>
                <input type="number" min="0" step="0.1" className={inputClass} value={form.weight_value || ''} placeholder="0" onChange={(e) => update('weight_value', Number(e.target.value))} required />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Unit</label>
                <select className={inputClass} value={form.weight_unit} onChange={(e) => update('weight_unit', e.target.value)}>
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="lb">lb</option>
                </select>
              </div>
            </div>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className={labelClass}>Short Description</label>
            <textarea className={`${inputClass} h-20 resize-none pt-2`} value={form.short_description} onChange={(e) => update('short_description', e.target.value)} required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className={labelClass}>Long Description</label>
            <textarea className={`${inputClass} h-40 resize-y pt-2`} value={form.long_description} onChange={(e) => update('long_description', e.target.value)} />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-lg font-semibold">Pricing</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label className={labelClass}>Base Price (₹)</label>
            <input type="number" min="0" className={inputClass} value={form.base_price || ''} placeholder="0" onChange={(e) => update('base_price', Number(e.target.value))} required />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Discount (%)</label>
            <input type="number" min="0" max="100" className={inputClass} value={form.discount || ''} placeholder="0" onChange={(e) => update('discount', Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Final Price</label>
            <div className={`${inputClass} flex items-center bg-muted text-muted-foreground`}>
              {formatPrice(Math.round(finalPrice))}
            </div>
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-lg font-semibold">Organization</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className={labelClass}>Category</label>
            <select className={inputClass} value={form.category_id} onChange={(e) => update('category_id', e.target.value)} required>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.path || c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Min Order Qty</label>
            <input type="number" min="1" className={inputClass} value={form.min_order_qty} onChange={(e) => update('min_order_qty', Number(e.target.value))} />
          </div>
        </div>
        <div className="flex flex-wrap gap-4 pt-2">
          {([
            ['is_featured', 'Featured'],
            ['is_best_seller', 'Best Seller'],
            ['is_new_arrival', 'New Arrival'],
            ['is_trending', 'Trending'],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form[key as keyof typeof form] as boolean} onChange={(e) => update(key, e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
              {label}
            </label>
          ))}
        </div>

        {/* Tags — control which home-page sections this product appears in */}
        <div className="space-y-2 pt-2">
          <label className={labelClass}>
            Section Tags
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              e.g. <code className="rounded bg-muted px-1">hero-carousel</code>, <code className="rounded bg-muted px-1">hero-ad</code>, <code className="rounded bg-muted px-1">promo-ad</code>
            </span>
          </label>
          <div className="flex gap-2">
            <input
              className={`${inputClass} flex-1`}
              placeholder="Type a tag and press Add"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
            />
            <button type="button" onClick={addTag} className="shrink-0 rounded-md bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90">
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    aria-label={`Remove tag ${tag}`}
                    className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-amber-200"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-lg font-semibold">Images</h3>
        <div className="flex flex-wrap gap-2">
          <input className={`${inputClass} flex-1`} placeholder="Image URL" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />
          <input className={`${inputClass} flex-1`} placeholder="Alt text" value={newImageAlt} onChange={(e) => setNewImageAlt(e.target.value)} />
          <button type="button" onClick={addImage} className="shrink-0 rounded-md bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90">Add URL</button>
          <CloudinaryUploadButton
            onUpload={(result) => {
              const url = result.secure_url || result.url;
              if (!url) return;
              setImages((prev) => [...prev, { url, alt: newImageAlt.trim() }]);
              setNewImageUrl('');
              setNewImageAlt('');
            }}
            label="Upload"
          />
        </div>
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((img, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
                <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="150px" />
                <button type="button" onClick={() => removeImage(i)} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">&times;</button>
              </div>
            ))}
          </div>
        )}
        <div className="space-y-3 border-t pt-4">
          <div>
            <label className={labelClass}>Thumbnail Image (optional)</label>
            <p className="mt-1 text-xs text-muted-foreground">
              The cover photo for this product. It is shown on product cards in listings and search, in home-page sections,
              in the cart and on the WhatsApp/social share preview, and it is the first picture on the product page. If you
              don&apos;t upload one, the first gallery image above is used; if there are no images at all, a placeholder is shown.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-muted">
              {form.thumbnail || images[0]?.url ? (
                <Image src={form.thumbnail || images[0].url} alt="Thumbnail preview" fill className="object-cover" sizes="96px" />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground/60">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m3 16 4-4 3 3 5-5 6 6"/></svg>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                {form.thumbnail
                  ? 'Using the uploaded thumbnail.'
                  : images[0]?.url
                    ? 'Using the first gallery image.'
                    : 'No image yet: a placeholder will be shown.'}
              </p>
              <div className="flex gap-2">
                <CloudinaryUploadButton
                  onUpload={(result) => {
                    const url = result.secure_url || result.url;
                    if (url) update('thumbnail', url);
                  }}
                  label={form.thumbnail ? 'Replace' : 'Upload Thumbnail'}
                />
                {form.thumbnail && (
                  <button
                    type="button"
                    onClick={() => update('thumbnail', '')}
                    className="h-10 rounded-md border px-3 text-sm hover:bg-muted"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-lg font-semibold">Videos</h3>
        <div className="flex flex-wrap gap-2">
          <input className={`${inputClass} flex-1`} placeholder="YouTube or Cloudinary URL" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} />
          <button type="button" onClick={addVideo} className="shrink-0 rounded-md bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90">Add URL</button>
          <CloudinaryUploadButton
            onUpload={(result) => {
              setNewVideoUrl(result.secure_url || result.url);
            }}
            folder="furniture/videos"
            label="Upload Video"
          />
        </div>
        {videos.length > 0 && (
          <div className="space-y-2">
            {videos.map((v, i) => (
              <div key={i} className="flex items-center justify-between rounded bg-muted px-3 py-2 text-sm">
                <span className="truncate text-muted-foreground">{v.url}</span>
                <span className="ml-2 shrink-0 rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">{v.type}</span>
                <button type="button" onClick={() => removeVideo(i)} className="ml-2 text-muted-foreground hover:text-destructive">&times;</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={sectionClass}>
        <h3 className="text-lg font-semibold">SEO</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label className={labelClass}>Meta Title</label>
            <input className={inputClass} value={form.seo_title} onChange={(e) => update('seo_title', e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className={labelClass}>Meta Description</label>
            <textarea className={`${inputClass} h-20 resize-none pt-2`} value={form.seo_description} onChange={(e) => update('seo_description', e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className={labelClass}>Keywords (comma separated)</label>
            <input className={inputClass} value={form.seo_keywords} onChange={(e) => update('seo_keywords', e.target.value)} placeholder="furniture, modern, wood" />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-lg font-semibold">Shipping & Warranty</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label className={labelClass}>Weight (kg)</label>
            <input type="number" min="0" step="0.1" className={inputClass} value={form.shipping_weight || ''} placeholder="0" onChange={(e) => update('shipping_weight', Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Flat Rate (₹)</label>
            <input type="number" min="0" className={inputClass} value={form.shipping_flat_rate || ''} placeholder="0" onChange={(e) => update('shipping_flat_rate', Number(e.target.value))} />
          </div>
          <div className="space-y-2 flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.shipping_free} onChange={(e) => update('shipping_free', e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
              Free Shipping
            </label>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Est. Delivery (min days)</label>
            <input type="number" min="1" className={inputClass} value={form.shipping_est_min} onChange={(e) => update('shipping_est_min', Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Est. Delivery (max days)</label>
            <input type="number" min="1" className={inputClass} value={form.shipping_est_max} onChange={(e) => update('shipping_est_max', Number(e.target.value))} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 pt-4">
          <div className="space-y-2">
            <label className={labelClass}>Warranty Period</label>
            <input className={inputClass} value={form.warranty_period} onChange={(e) => update('warranty_period', e.target.value)} placeholder="e.g. 5 years" />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Warranty Description</label>
            <input className={inputClass} value={form.warranty_desc} onChange={(e) => update('warranty_desc', e.target.value)} />
          </div>
        </div>
        <div className="space-y-2 pt-4">
          <label className={labelClass}>Return Policy Note (optional)</label>
          <input className={inputClass} value={form.return_policy} onChange={(e) => update('return_policy', e.target.value)} placeholder="Leave empty to show the standard 30-day return policy" />
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-lg font-semibold">FAQs</h3>
        {faqs.map((faq, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="grid flex-1 gap-2 sm:grid-cols-2">
              <input className={inputClass} placeholder="Question" value={faq.question} onChange={(e) => updateFaq(i, 'question', e.target.value)} />
              <input className={inputClass} placeholder="Answer" value={faq.answer} onChange={(e) => updateFaq(i, 'answer', e.target.value)} />
            </div>
            <button type="button" onClick={() => removeFaq(i)} className="mt-2 text-muted-foreground hover:text-destructive">&times;</button>
          </div>
        ))}
        <button type="button" onClick={addFaq} className="text-sm text-primary underline underline-offset-2">+ Add FAQ</button>
      </div>

      <div className={sectionClass}>
        <h3 className="text-lg font-semibold">Related Products</h3>
        <RelatedProductsSelector
          label="Related Products"
          field="related"
          selectedIds={relatedIds}
          onChange={(_field, ids) => setRelatedIds(ids)}
        />
      </div>

      <div className={sectionClass}>
        <h3 className="text-lg font-semibold">Publishing</h3>
        <div className="space-y-2">
          <label className={labelClass}>Status</label>
          <select className={inputClass} value={form.status} onChange={(e) => update('status', e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
        </button>
        {isEditing && (
          <a href={`/products/${initialData?.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline underline-offset-2">
            View on site
          </a>
        )}
      </div>
    </form>
  );
}
