import { useQuery } from '@tanstack/react-query';
import { useStorefrontClient } from './use-storefront-client';
import type { Product, PaginatedResponse } from '../types';

/**
 * Search for products by query string.
 *
 * The query is debounce-friendly: pass an empty string to disable the query.
 *
 * @param query - Search term
 * @param params - Optional pagination parameters
 * @returns React Query result with paginated search results
 *
 * @example
 * ```tsx
 * const [query, setQuery] = useState('');
 * const { data: results, isLoading } = useSearch(query);
 * ```
 */
export function useSearch(
  query: string,
  params?: { page?: number; perPage?: number },
) {
  const client = useStorefrontClient();

  return useQuery<PaginatedResponse<Product>, Error>({
    queryKey: ['vanij', 'search', query, params],
    queryFn: () => client.search.query(query, params),
    enabled: query.length > 0,
  });
}
