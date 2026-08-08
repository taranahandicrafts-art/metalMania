import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  product_id: string;
  variant_id?: string | null;
  slug?: string;
  title: string;
  sku: string;
  thumbnail?: string;
  unit_price: number;
  quantity: number;
  maxQuantity?: number;
}

export interface AppliedCoupon {
  code: string;
  type: 'percentage' | 'flat' | 'free_shipping' | 'bogo';
  value: number;
  max_discount: number | null;
}

interface DiscountBreakdown {
  type: AppliedCoupon['type'];
  value: number;
  amount: number;
}

interface CartState {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  notes: string;
  address: Record<string, string> | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string | null) => void;
  patchItem: (productId: string, patch: Partial<CartItem>) => void;
  clearCart: () => void;
  setNotes: (notes: string) => void;
  setAddress: (address: Record<string, string>) => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => DiscountBreakdown | null;
  getTotal: () => number;
}

function computeDiscount(subtotal: number, coupon: AppliedCoupon | null): DiscountBreakdown | null {
  if (!coupon) return null;
  if (coupon.type === 'percentage') {
    const amount = Math.min(
      subtotal * (coupon.value / 100),
      coupon.max_discount ?? Infinity,
    );
    return { type: 'percentage', value: coupon.value, amount: Math.round(amount) };
  }
  if (coupon.type === 'flat') {
    return { type: 'flat', value: coupon.value, amount: Math.min(coupon.value, subtotal) };
  }
  if (coupon.type === 'free_shipping') {
    return { type: 'free_shipping', value: 0, amount: 0 };
  }
  return null;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      notes: '',
      address: null,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.product_id === item.product_id && i.variant_id === item.variant_id,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === item.product_id && i.variant_id === item.variant_id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product_id === productId && i.variant_id === variantId),
          ),
        })),

      updateQuantity: (productId, quantity, variantId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === productId && i.variant_id === variantId
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxQuantity || 99)) }
              : i,
          ),
        })),

      patchItem: (productId, patch) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === productId ? { ...i, ...patch } : i,
          ),
        })),

      clearCart: () => set({ items: [], coupon: null, notes: '', address: null }),
      setNotes: (notes) => set({ notes }),
      setAddress: (address) => set({ address }),
      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getSubtotal: () => get().items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0),

      getDiscount: () => computeDiscount(get().getSubtotal(), get().coupon),

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = computeDiscount(subtotal, get().coupon);
        return subtotal - (discount?.amount ?? 0);
      },
    }),
    { name: 'furniture-cart' },
  ),
);
