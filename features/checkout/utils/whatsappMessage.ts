export function formatWhatsAppMessage(order: { items: { title: string; quantity: number; unit_price: number; total_price: number }[]; subtotal: number; total: number; notes?: string }): string {
  let message = 'Hi, I would like to place an order for:\n\n';
  order.items.forEach((item, i) => {
    message += `${i + 1}. ${item.title} x${item.quantity} — ₹${item.unit_price}\n`;
  });
  message += `\nSubtotal: ₹${order.subtotal}\nTotal: ₹${order.total}`;
  if (order.notes) message += `\n\nNotes: ${order.notes}`;
  return message;
}

export function encodeWhatsAppUrl(message: string, phone: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function isWhatsAppInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function generateCheckoutPayload(form: Record<string, unknown>, items: Record<string, unknown>[]) {
  return {
    customer: {
      name: form.name,
      phone: form.phone,
      email: form.email || null,
      address: form.address,
    },
    items: items.map((item: Record<string, unknown>) => ({
      product_id: item.product_id,
      variant_id: item.variant_id || null,
      title: item.title,
      sku: item.sku,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity as number * (item.unit_price as number),
    })),
    subtotal: items.reduce((sum: number, item: Record<string, unknown>) => sum + (item.quantity as number) * (item.unit_price as number), 0),
    total: items.reduce((sum: number, item: Record<string, unknown>) => sum + (item.quantity as number) * (item.unit_price as number), 0),
    notes: form.notes || null,
    source: 'admin',
  };
}
