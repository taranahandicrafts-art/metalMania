import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
  product_id: string;
  variant_id?: string | null;
  title: string;
  thumbnail?: string;
  price: number;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  isInWishlist: (productId: string, variantId?: string | null) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const exists = state.items.some(
            (i) => i.product_id === item.product_id && i.variant_id === item.variant_id,
          );
          if (exists) return state;
          return { items: [...state.items, item] };
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product_id === productId && i.variant_id === variantId),
          ),
        })),

      isInWishlist: (productId, variantId) =>
        get().items.some(
          (i) => i.product_id === productId && i.variant_id === variantId,
        ),

      clear: () => set({ items: [] }),
    }),
    { name: 'furniture-wishlist' },
  ),
);
