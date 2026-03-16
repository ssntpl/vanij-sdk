import React, { createContext, useCallback, useMemo, useState } from 'react';
import { useStorefrontClient } from '../hooks/use-storefront-client';
import type { Cart } from '../types';

export interface CartContextValue {
  /** The current cart, or null if no cart exists yet */
  cart: Cart | null;
  /** Whether a cart operation is in progress */
  isLoading: boolean;
  /** Add an item to the cart */
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  /** Update the quantity of a line item */
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  /** Remove a line item from the cart */
  removeItem: (lineId: string) => Promise<void>;
  /** Clear all items from the cart */
  clear: () => Promise<void>;
  /** Total number of items in the cart */
  totalQuantity: number;
}

export const CartContext = createContext<CartContextValue | null>(null);

export interface CartProviderProps {
  children: React.ReactNode;
  /** Optional initial cart ID (e.g., from a cookie or localStorage) */
  cartId?: string;
}

/**
 * Provides cart state and actions to all child components.
 *
 * Must be nested inside a `<StorefrontProvider>`.
 *
 * @example
 * ```tsx
 * <StorefrontProvider client={client}>
 *   <CartProvider>
 *     <YourApp />
 *   </CartProvider>
 * </StorefrontProvider>
 * ```
 */
export function CartProvider({ children, cartId: initialCartId }: CartProviderProps) {
  const client = useStorefrontClient();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cartId, setCartId] = useState<string | undefined>(initialCartId);

  const addItem = useCallback(
    async (variantId: string, quantity: number = 1) => {
      setIsLoading(true);
      try {
        const updatedCart = await client.cart.addItem({ variantId, quantity, cartId });
        setCart(updatedCart);
        setCartId(updatedCart.id);
      } finally {
        setIsLoading(false);
      }
    },
    [client, cartId],
  );

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cartId) return;
      setIsLoading(true);
      try {
        const updatedCart = await client.cart.updateItem({ cartId, lineId, quantity });
        setCart(updatedCart);
      } finally {
        setIsLoading(false);
      }
    },
    [client, cartId],
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cartId) return;
      setIsLoading(true);
      try {
        await client.cart.removeItem(cartId, lineId);
        // Refresh the cart after removal
        const updatedCart = await client.cart.get(cartId);
        setCart(updatedCart);
      } finally {
        setIsLoading(false);
      }
    },
    [client, cartId],
  );

  const clear = useCallback(async () => {
    if (!cartId) return;
    setIsLoading(true);
    try {
      await client.cart.clear(cartId);
      setCart(null);
      setCartId(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [client, cartId]);

  const totalQuantity = useMemo(() => {
    return cart?.totalQuantity ?? 0;
  }, [cart]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      isLoading,
      addItem,
      updateItem,
      removeItem,
      clear,
      totalQuantity,
    }),
    [cart, isLoading, addItem, updateItem, removeItem, clear, totalQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
