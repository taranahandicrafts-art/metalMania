import { WHATSAPP_NUMBER, WHATSAPP_PREFIX, SITE_NAME } from '@/lib/constants';
import { generateOrderNumber, formatPrice } from '@/lib/utils';

interface OrderItemInput {
  title: string;
  sku?: string;
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

function formatItemLine(item: OrderItemInput, index: number): string {
  const lineTotal = item.unit_price * item.quantity;
  return `${index + 1}. ${item.title}\n   ${item.quantity} × ${formatPrice(item.unit_price)} = ${formatPrice(lineTotal)}`;
}

function formatAddress(addr: OrderAddressInput): string {
  return [
    [addr.line1, addr.line2].filter(Boolean).join(', '),
    `${addr.city}, ${addr.state} - ${addr.pincode}`,
    addr.country || 'India',
  ].join('\n');
}

/** The order message the customer sends to the store, written in their voice. */
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

  lines.push(`Hi ${SITE_NAME}, I'd like to place an order.`);
  lines.push('');
  lines.push(`*Order ID:* ${orderNum}`);
  lines.push('');

  lines.push('*Items*');
  items.forEach((item, i) => lines.push(formatItemLine(item, i)));
  lines.push('');

  if (discount && discount.amount > 0) {
    lines.push(`Subtotal: ${formatPrice(subtotal)}`);
    lines.push(`Discount: -${formatPrice(discount.amount)}`);
  }
  lines.push(`*Total: ${formatPrice(total)}*`);
  lines.push('');

  lines.push('*Deliver to*');
  lines.push(address.name);
  lines.push(formatAddress(address));
  lines.push(`Phone: ${address.phone}`);
  if (address.email) lines.push(`Email: ${address.email}`);

  if (notes) {
    lines.push('');
    lines.push(`*Notes:* ${notes}`);
  }

  lines.push('');
  lines.push('Please confirm availability and delivery details. Thank you!');

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
