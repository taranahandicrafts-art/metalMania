import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchState {
  query: string;
  isOpen: boolean;
  recentSearches: string[];
  setQuery: (query: string) => void;
  open: () => void;
  close: () => void;
  addRecentSearch: (term: string) => void;
  clearRecent: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      query: '',
      isOpen: false,
      recentSearches: [],

      setQuery: (query) => set({ query }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false, query: '' }),

      addRecentSearch: (term) => {
        const trimmed = term.trim();
        if (!trimmed) return;
        const filtered = get().recentSearches.filter((s) => s !== trimmed);
        set({ recentSearches: [trimmed, ...filtered].slice(0, 10) });
      },

      clearRecent: () => set({ recentSearches: [] }),
    }),
    { name: 'furniture-search' },
  ),
);
