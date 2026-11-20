import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  clearLocalCart,
  getLocalCart,
  getRemoteCart,
  mergeCarts,
  saveLocalCart,
  saveRemoteCart,
} from '../services/cartService';
import { CartItem, PackVariant, Product } from '../types';

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  loading: boolean;
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, variant: PackVariant, quantity?: number) => void;
  updateQuantity: (productId: string, variant: PackVariant, quantity: number) => void;
  removeItem: (productId: string, variant: PackVariant) => void;
  clearCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

export const FREE_SHIPPING_THRESHOLD = 499;
export const STANDARD_SHIPPING_FEE = 40;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    const syncCart = async () => {
      setLoading(true);
      try {
        if (user) {
          const localItems = getLocalCart();
          const remoteItems = await getRemoteCart(user.uid);
          if (localItems.length > 0) {
            const merged = mergeCarts(remoteItems, localItems);
            setItems(merged);
            await saveRemoteCart(user.uid, merged);
            clearLocalCart();
          } else {
            setItems(remoteItems);
          }
        } else {
          setItems(getLocalCart());
        }
      } catch (err) {
        console.error('Cart sync failed:', err);
        setItems(getLocalCart());
      } finally {
        setLoading(false);
      }
    };

    syncCart();
  }, [user, authLoading]);

  const persist = useCallback(
    async (nextItems: CartItem[]) => {
      setItems(nextItems);
      if (user) {
        try {
          await saveRemoteCart(user.uid, nextItems);
        } catch (err) {
          console.error('Failed to save cart to Firestore:', err);
        }
      } else {
        saveLocalCart(nextItems);
      }
    },
    [user]
  );

  const addToCart = useCallback(
    (product: Product, variant: PackVariant, quantity = 1) => {
      const price = variant === 'standard' ? product.price : product.trialPrice;
      const variantLabel =
        variant === 'standard'
          ? `${product.weightGrams || 200}g Pack`
          : `${product.trialWeightGrams || 50}g Trial Pack`;

      const existingIdx = items.findIndex(
        (i) => i.productId === product.id && i.variant === variant
      );

      let nextItems: CartItem[];
      if (existingIdx > -1) {
        nextItems = items.map((item, idx) =>
          idx === existingIdx ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        nextItems = [
          ...items,
          {
            productId: product.id,
            name: product.name,
            flavour: product.flavour,
            variant,
            variantLabel,
            price,
            quantity,
            image: product.images?.[0] || '',
          },
        ];
      }

      persist(nextItems);
      setIsOpen(true);
    },
    [items, persist]
  );

  const updateQuantity = useCallback(
    (productId: string, variant: PackVariant, quantity: number) => {
      if (quantity <= 0) {
        const filtered = items.filter(
          (i) => !(i.productId === productId && i.variant === variant)
        );
        persist(filtered);
        return;
      }

      const next = items.map((i) =>
        i.productId === productId && i.variant === variant ? { ...i, quantity } : i
      );
      persist(next);
    },
    [items, persist]
  );

  const removeItem = useCallback(
    (productId: string, variant: PackVariant) => {
      const next = items.filter((i) => !(i.productId === productId && i.variant === variant));
      persist(next);
    },
    [items, persist]
  );

  const clearCart = useCallback(async () => {
    await persist([]);
    clearLocalCart();
  }, [persist]);

  const itemCount = useMemo(() => items.reduce((acc, i) => acc + i.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    [items]
  );
  const shippingFee = useMemo(
    () => (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE),
    [subtotal]
  );
  const total = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        loading,
        itemCount,
        subtotal,
        shippingFee,
        total,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
