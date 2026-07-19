import { AdminProductList } from '@/components/admin/products/AdminProductList';

export default async function AdminProductsPage(props: { searchParams: Promise<Record<string, string>> }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Products</h2>
      <AdminProductList searchParams={props.searchParams} />
    </div>
  );
}
