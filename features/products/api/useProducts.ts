'use client';

import useSWR from 'swr';
import type { IProduct } from '@/models/Product';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useProducts(options?: { page?: number; category?: string; search?: string }) {
  const params = new URLSearchParams();
  if (options?.page) params.set('page', options.page.toString());
  if (options?.category) params.set('category', options.category);
  if (options?.search) params.set('search', options.search);

  const { data, error, isLoading, mutate } = useSWR<{
    products: IProduct[];
    total: number;
    page: number;
    totalPages: number;
  }>(`/api/products?${params.toString()}`, fetcher);

  return { products: data?.products || [], total: data?.total || 0, page: data?.page || 1, totalPages: data?.totalPages || 1, isLoading, error, mutate };
}

export function useProduct(slug: string) {
  const { data, error, isLoading } = useSWR<IProduct>(`/api/products/${slug}`, fetcher);
  return { product: data, isLoading, error };
}

export function useSearchProducts(q: string) {
  const { data, error, isLoading } = useSWR<{ products: IProduct[] }>(
    q?.length >= 2 ? `/api/products/search?q=${encodeURIComponent(q)}` : null,
    fetcher,
  );
  return { products: data?.products || [], isLoading, error };
}
