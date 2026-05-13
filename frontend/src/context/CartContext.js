import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty = 1) => {
        const items    = get().items;
        const existing = items.find(i => i.product_id === product._id);

        if (existing) {
          set({
            items: items.map(i =>
              i.product_id === product._id
                ? { ...i, qty: i.qty + qty }
                : i
            ),
          });
        } else {
          set({
            items: [...items, {
              product_id: product._id,
              name:       product.name,
              name_km:    product.name_km,
              price:      product.sale_price ?? product.price,
              image:      product.images?.[0],
              qty,
            }],
          });
        }
        toast.success('បន្ថែមទៅកង់រូបរថបានជោគជ័យ!');
      },

      removeItem: (product_id) => {
        set({ items: get().items.filter(i => i.product_id !== product_id) });
      },

      updateQty: (product_id, qty) => {
        if (qty < 1) return;
        set({
          items: get().items.map(i =>
            i.product_id === product_id ? { ...i, qty } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      get total() {
        return get().items.reduce((sum, i) => sum + i.price * i.qty, 0);
      },

      get count() {
        return get().items.reduce((sum, i) => sum + i.qty, 0);
      },
    }),
    { name: 'ecommerce-cart' }
  )
);
