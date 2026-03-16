import { useQuery } from '@tanstack/react-query';
import { useStorefrontClient } from './use-storefront-client';
import type { Currency } from '../types';

/**
 * Fetch the list of available currencies for the store.
 *
 * @returns React Query result with currencies and the base currency code
 *
 * @example
 * ```tsx
 * const { data } = useCurrencies();
 * // data?.currencies = [{ code: "USD", name: "US Dollar", symbol: "$", decimalPlaces: 2 }, ...]
 * // data?.baseCurrency = "USD"
 * ```
 */
export function useCurrencies() {
  const client = useStorefrontClient();

  return useQuery<{ currencies: Currency[]; baseCurrency: string }, Error>({
    queryKey: ['vanij', 'currencies'],
    queryFn: () => client.currencies.list(),
  });
}
