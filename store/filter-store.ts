import { create } from 'zustand';

interface FilterState {
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  sort: string;
  search: string;
  setFilter: (key: string, value: unknown) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>()((set) => ({
  category: null,
  minPrice: null,
  maxPrice: null,
  sort: 'newest',
  search: '',

  setFilter: (key, value) => set({ [key]: value }),

  clearFilters: () =>
    set({
      category: null,
      minPrice: null,
      maxPrice: null,
      sort: 'newest',
      search: '',
    }),
}));
