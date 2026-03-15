import { useContext } from 'react';
import { CartContext } from '../components/cart-provider';

/**
 * Access cart state and actions.
 *
 * Must be used inside a `<CartProvider>`.
 *
 * @returns Cart state and action functions
 *
 * @example
 * ```tsx
 * const { cart, addItem, removeItem, updateItem, clear, isLoading } = useCart();
 * ```
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      'useCart must be used within a <CartProvider>. ' +
        'Wrap your app with <CartProvider>.',
    );
  }
  return context;
}
