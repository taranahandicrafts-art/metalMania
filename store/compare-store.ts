import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompareItem {
  product_id: string;
  title: string;
  thumbnail?: string;
  price: number;
}

interface CompareState {
  items: CompareItem[];
  addItem: (item: CompareItem) => void;
  removeItem: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clear: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          if (state.items.length >= 4) return state;
          const exists = state.items.some((i) => i.product_id === item.product_id);
          if (exists) return state;
          return { items: [...state.items, item] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product_id !== productId),
        })),

      isInCompare: (productId) =>
        get().items.some((i) => i.product_id === productId),

      clear: () => set({ items: [] }),
    }),
    { name: 'furniture-compare' },
  ),
);
