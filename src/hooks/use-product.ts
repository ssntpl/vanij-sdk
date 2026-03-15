import { useQuery } from '@tanstack/react-query';
import { useStorefrontClient } from './use-storefront-client';
import type { Product } from '../types';

/**
 * Fetch a single product by its handle (slug).
 *
 * @param handle - The product handle/slug
 * @returns React Query result with the product data
 *
 * @example
 * ```tsx
 * const { data: product, isLoading, error } = useProduct('running-shoes');
 * ```
 */
export function useProduct(handle: string) {
  const client = useStorefrontClient();

  return useQuery<Product, Error>({
    queryKey: ['vanij', 'product', handle],
    queryFn: () => client.products.getByHandle(handle),
    enabled: !!handle,
  });
}
