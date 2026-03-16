import { useQuery } from '@tanstack/react-query';
import { useStorefrontClient } from './use-storefront-client';
import type { Product } from '../types';

/**
 * Fetch a single product by its handle (slug).
 *
 * @param handle - The product handle/slug
 * @param options - Optional settings (e.g., currency for price conversion)
 * @returns React Query result with the product data
 *
 * @example
 * ```tsx
 * const { data: product, isLoading, error } = useProduct('running-shoes');
 *
 * // Fetch with a specific currency
 * const { data } = useProduct('running-shoes', { currency: 'INR' });
 * ```
 */
export function useProduct(handle: string, options?: { currency?: string }) {
  const client = useStorefrontClient();

  return useQuery<Product, Error>({
    queryKey: ['vanij', 'product', handle, options?.currency],
    queryFn: () => client.products.getByHandle(handle, options?.currency),
    enabled: !!handle,
  });
}
