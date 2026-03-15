import React from 'react';
import { useCart } from '../hooks/use-cart';

export interface AddToCartButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'onError'> {
  /** The variant ID to add to the cart */
  variantId: string;
  /** Quantity to add (default: 1) */
  quantity?: number;
  /** Called after the item is successfully added */
  onSuccess?: () => void;
  /** Called if the add-to-cart operation fails */
  onError?: (error: Error) => void;
  /** Content to show while the item is being added */
  loadingContent?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Button that adds a product variant to the cart with automatic loading state.
 *
 * Must be used inside a `<CartProvider>`.
 *
 * @example
 * ```tsx
 * <AddToCartButton variantId="variant_123" quantity={1}>
 *   Add to Cart
 * </AddToCartButton>
 *
 * <AddToCartButton
 *   variantId="variant_123"
 *   loadingContent="Adding..."
 *   onSuccess={() => toast('Added!')}
 * >
 *   Add to Cart
 * </AddToCartButton>
 * ```
 */
export function AddToCartButton({
  variantId,
  quantity = 1,
  onSuccess,
  onError,
  loadingContent,
  children,
  disabled,
  ...props
}: AddToCartButtonProps) {
  const { addItem, isLoading } = useCart();

  const handleClick = async () => {
    try {
      await addItem(variantId, quantity);
      onSuccess?.();
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && loadingContent ? loadingContent : children}
    </button>
  );
}
