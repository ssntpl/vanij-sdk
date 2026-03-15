import { useQuery } from '@tanstack/react-query';
import { useStorefrontClient } from './use-storefront-client';
import type { Collection } from '../types';

/**
 * Fetch a single collection by its handle (slug).
 *
 * @param handle - The collection handle/slug
 * @returns React Query result with the collection data
 *
 * @example
 * ```tsx
 * const { data: collection, isLoading } = useCollection('summer-sale');
 * ```
 */
export function useCollection(handle: string) {
  const client = useStorefrontClient();

  return useQuery<Collection, Error>({
    queryKey: ['vanij', 'collection', handle],
    queryFn: () => client.collections.getByHandle(handle),
    enabled: !!handle,
  });
}
