import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type CartItem = {
  slug: string;
  name: string;
  image: string;
};

type CartStore = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.slug === item.slug);

        if (existingItem) {
          return; // Prevent duplicates
        }

        set({ items: [...currentItems, item] });
      },
      removeFromCart: (slug) => {
        set({ items: get().items.filter((item) => item.slug !== slug) });
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'urevent-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
