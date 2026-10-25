import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose, { isValidObjectId } from 'mongoose';
import Order from '@/models/Order';
import Product from '@/models/Product';
import ProductVariant from '@/models/ProductVariant';
import Inventory from '@/models/Inventory';
import Coupon from '@/models/Coupon';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const source = searchParams.get('source');

    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (source) query.source = source;

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ created_at: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

interface CheckoutItemInput {
  product_id?: string;
  variant_id?: string | null;
  sku?: string;
  quantity?: number;
}

/**
 * Public checkout endpoint (WhatsApp orders). Prices and stock are read from
 * the database — client-sent prices are ignored.
 */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!checkRateLimit(`orders:${ip}`, 5, 60 * 1000).allowed) {
      return NextResponse.json({ error: 'Too many orders. Please try again in a minute.' }, { status: 429 });
    }

    await connectDB();
    const body = await req.json();
    const rawItems: CheckoutItemInput[] = Array.isArray(body?.items) ? body.items : [];
    if (rawItems.length === 0 || rawItems.length > 50) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
    }
    if (rawItems.some((i) => !isValidObjectId(i.product_id) || (i.variant_id && !isValidObjectId(i.variant_id)))) {
      return NextResponse.json({ error: 'Invalid cart item.' }, { status: 400 });
    }

    const productIds = [...new Set(rawItems.map((i) => String(i.product_id)))];
    const variantIds = rawItems.filter((i) => i.variant_id).map((i) => String(i.variant_id));
    const [products, variants, inventory] = await Promise.all([
      Product.find({ _id: mongoose.trusted({ $in: productIds }), status: 'published' })
        .select('title sku final_price')
        .lean(),
      variantIds.length
        ? ProductVariant.find({ _id: mongoose.trusted({ $in: variantIds }) }).select('product_id sku price stock').lean()
        : Promise.resolve([]),
      Inventory.find({ product_id: mongoose.trusted({ $in: productIds }) }).select('product_id variant_id sku stock').lean(),
    ]);

    const items = [];
    for (const raw of rawItems) {
      const product = products.find((p) => String(p._id) === String(raw.product_id));
      if (!product) {
        return NextResponse.json({ error: 'A product in your cart is no longer available.' }, { status: 409 });
      }
      const variant = raw.variant_id ? variants.find((v) => String(v._id) === String(raw.variant_id)) : null;
      const sku = (variant?.sku || product.sku || '').toUpperCase();
      const quantity = Math.floor(Number(raw.quantity));
      if (!Number.isFinite(quantity) || quantity < 1) {
        return NextResponse.json({ error: `Invalid quantity for ${product.title}.` }, { status: 400 });
      }

      // Same rule as the product page: inventory record by SKU, else variant stock, else product total.
      const productInventory = inventory.filter((inv) => String(inv.product_id) === String(product._id));
      const record = productInventory.find((inv) => inv.sku?.toUpperCase() === sku);
      const stock = record
        ? record.stock
        : variant
          ? variant.stock
          : productInventory.reduce((sum, inv) => sum + inv.stock, 0);
      if (quantity > stock) {
        const message = stock > 0
          ? `Only ${stock} unit${stock === 1 ? '' : 's'} of ${product.title} ${stock === 1 ? 'is' : 'are'} available.`
          : `${product.title} is out of stock.`;
        return NextResponse.json({ error: message, product_id: String(product._id), available: stock }, { status: 409 });
      }

      const unit_price = variant?.price ?? product.final_price;
      items.push({
        product_id: product._id,
        variant_id: variant?._id ?? null,
        title: product.title,
        sku: sku || 'N/A',
        quantity,
        unit_price,
        total_price: unit_price * quantity,
      });
    }

    const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
    let discount = 0;
    let appliedCouponId: unknown = null;
    if (typeof body.coupon_code === 'string' && body.coupon_code.trim()) {
      const coupon = await Coupon.validateCoupon(body.coupon_code.trim(), subtotal);
      if (coupon) appliedCouponId = coupon._id;
      if (coupon?.type === 'percentage') {
        discount = Math.round(Math.min(subtotal * (coupon.value / 100), coupon.max_discount ?? Infinity));
      } else if (coupon?.type === 'flat') {
        discount = Math.min(coupon.value, subtotal);
      }
    }

    const c = body.customer ?? {};
    const a = c.address ?? {};
    const order = await Order.create({
      customer: {
        name: c.name,
        phone: String(c.phone ?? '').replace(/\D/g, '').slice(-10),
        email: c.email || null,
        address: {
          line1: a.line1,
          line2: a.line2 || null,
          city: a.city,
          state: a.state,
          pincode: a.pincode,
          country: a.country || 'India',
        },
      },
      items,
      notes: typeof body.notes === 'string' && body.notes.trim() ? body.notes.trim() : null,
      subtotal,
      total: subtotal - discount,
      source: 'whatsapp',
    });
    if (appliedCouponId) await Coupon.updateOne({ _id: appliedCouponId }, { $inc: { used_count: 1 } });

    return NextResponse.json(
      {
        order_number: order.order_number,
        items: items.map((i) => ({ title: i.title, quantity: i.quantity, unit_price: i.unit_price })),
        subtotal,
        discount,
        total: order.total,
      },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      const first = Object.values(err.errors)[0];
      return NextResponse.json({ error: first?.message || 'Please check your details.' }, { status: 400 });
    }
    console.error('Failed to create order', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
