'use client';

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useAdminProducts(options?: { page?: number; status?: string }) {
  const params = new URLSearchParams();
  if (options?.page) params.set('page', options.page.toString());
  if (options?.status) params.set('status', options.status);

  const { data, error, isLoading, mutate } = useSWR(`/api/products?${params.toString()}`, fetcher);
  return { products: data?.products || [], total: data?.total || 0, isLoading, error, mutate };
}

export function useAdminOrders(options?: { page?: number; status?: string }) {
  const params = new URLSearchParams();
  if (options?.page) params.set('page', options.page.toString());
  if (options?.status) params.set('status', options.status);

  return useSWR(`/api/orders?${params.toString()}`, fetcher);
}

export function useAnalytics() {
  return useSWR('/api/analytics', fetcher);
}

export function useUpdateOrder(id: string) {
  return useSWRMutation(`/api/orders/${id}`, (url, { arg }: { arg: Record<string, unknown> }) =>
    fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(arg) }).then((r) => r.json()),
  );
}
