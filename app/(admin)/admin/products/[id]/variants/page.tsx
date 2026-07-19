import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import ProductVariant from '@/models/ProductVariant';
import { VariantManager } from '@/components/admin/variants/VariantManager';

export default async function ProductVariantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();

  const product = await Product.findById(id).select('title has_variants').lean();
  if (!product) notFound();

  const variants = await ProductVariant.find({ product_id: id }).sort('sort_order').lean();

  const mappedVariants = variants.map((v) => ({
    _id: v._id.toString(),
    sku: v.sku,
    title: v.name,
    price_adjustment: v.price || 0,
    stock: v.stock,
    is_active: v.is_active,
    attributes: Object.entries(v.metadata || {}).map(([name, value]) => ({ name, value: value || '' })),
    images: v.images.map((img) => img.url),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Variants</h2>
        <p className="text-sm text-muted-foreground">{product.title}</p>
      </div>
      <VariantManager productId={id} variants={mappedVariants} />
    </div>
  );
}
