import { useQuery } from '@tanstack/react-query';
import { useStorefrontClient } from './use-storefront-client';
import type { CustomerData } from '../types';

/**
 * Fetch the current customer's account data.
 *
 * Requires a customer auth token. Pass `null` to skip the query
 * (e.g., when the customer is not logged in).
 *
 * @param token - Customer auth token, or null if not logged in
 * @returns React Query result with customer data
 *
 * @example
 * ```tsx
 * const token = localStorage.getItem('customerToken');
 * const { data: customer, isLoading } = useCustomer(token);
 * ```
 */
export function useCustomer(token: string | null) {
  const client = useStorefrontClient();

  return useQuery<CustomerData, Error>({
    queryKey: ['vanij', 'customer', token],
    queryFn: () => client.customer.getAccount(token!),
    enabled: !!token,
  });
}
