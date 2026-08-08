import { WHATSAPP_NUMBER, WHATSAPP_PREFIX, SITE_NAME } from '@/lib/constants';
import { generateOrderNumber, formatPrice } from '@/lib/utils';

interface OrderItemInput {
  title: string;
  sku: string;
  quantity: number;
  unit_price: number;
  variant_id?: string | null;
}

interface OrderAddressInput {
  name: string;
  phone: string;
  email?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

interface DiscountInput {
  type: 'percentage' | 'flat' | 'free_shipping' | 'bogo';
  value: number;
  amount: number;
}

interface BuildOrderMessageParams {
  items: OrderItemInput[];
  address: OrderAddressInput;
  subtotal: number;
  total: number;
  discount?: DiscountInput | null;
  notes?: string;
  orderNumber?: string;
}

const SEP = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';

function formatDate(): string {
  const now = new Date();
  return now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatItemLine(item: OrderItemInput, index: number): string {
  const lineTotal = item.unit_price * item.quantity;
  let line = `${index + 1}. *${item.title}*`;
  if (item.variant_id) line += ` [Variant]`;
  line += `\n   SKU : ${item.sku}`;
  line += `\n   Qty : ${item.quantity} × ${formatPrice(item.unit_price)} = ${formatPrice(lineTotal)}`;
  return line;
}

function formatAddressBlock(addr: OrderAddressInput): string {
  const parts: string[] = [];
  parts.push(`*${addr.name}*`);
  const addressLine = [addr.line1, addr.line2].filter(Boolean).join(', ');
  parts.push(addressLine);
  parts.push(`${addr.city} - ${addr.pincode}`);
  parts.push(`${addr.state}, ${addr.country || 'India'}`);
  return parts.join('\n');
}

export function buildWhatsAppOrderMessage({
  items,
  address,
  subtotal,
  total,
  discount,
  notes,
  orderNumber,
}: BuildOrderMessageParams): string {
  const orderNum = orderNumber || generateOrderNumber();
  const lines: string[] = [];

  lines.push(`╔══════════════════════════════╗`);
  lines.push(`        🛋️ *NEW ORDER RECEIVED*`);
  lines.push(`        ${SITE_NAME}`);
  lines.push(`╚══════════════════════════════╝`);
  lines.push('');
  lines.push(`📋 *Order ID :* ${orderNum}`);
  lines.push(`📅 *Date     :* ${formatDate()}`);
  lines.push('');

  lines.push(SEP);
  lines.push('👤 *CUSTOMER DETAILS*');
  lines.push(SEP);
  lines.push(`Name  : ${address.name}`);
  lines.push(`Phone : ${address.phone}`);
  if (address.email) lines.push(`Email : ${address.email}`);
  lines.push('');

  lines.push(SEP);
  lines.push('🛒 *ORDER ITEMS*');
  lines.push(SEP);
  items.forEach((item, i) => {
    lines.push(formatItemLine(item, i));
  });
  lines.push('');

  lines.push(SEP);
  lines.push('💰 *PAYMENT SUMMARY*');
  lines.push(SEP);
  lines.push(`Subtotal  :  ${formatPrice(subtotal)}`);
  if (discount && discount.amount > 0) {
    const discountLabel =
      discount.type === 'percentage'
        ? `${discount.value}% OFF`
        : discount.type === 'flat'
          ? 'FLAT DISCOUNT'
          : 'DISCOUNT';
    lines.push(`Discount  : -${formatPrice(discount.amount)} (${discountLabel})`);
  }
  lines.push(`*TOTAL    :  ${formatPrice(total)}*`);
  lines.push('');

  lines.push(SEP);
  lines.push('📍 *DELIVERY ADDRESS*');
  lines.push(SEP);
  lines.push(formatAddressBlock(address));
  lines.push('');

  if (notes) {
    lines.push(SEP);
    lines.push('📝 *SPECIAL NOTES*');
    lines.push(SEP);
    lines.push(notes);
    lines.push('');
  }

  lines.push(SEP);
  lines.push(`✅ Order received successfully.`);
  lines.push(`We'll confirm & share delivery details shortly.`);
  lines.push(`Thank you for shopping with us! 🙏`);

  return lines.join('\n');
}

export function encodeWhatsAppUrl(message: string): string {
  const cleaned = WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
  return `${WHATSAPP_PREFIX}/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppOrderUrl(params: BuildOrderMessageParams): string {
  const message = buildWhatsAppOrderMessage(params);
  return encodeWhatsAppUrl(message);
}
