import { useContext } from 'react';
import { StorefrontContext } from '../components/storefront-provider';
import type { StorefrontClient } from '../client';

/**
 * Access the StorefrontClient instance from context.
 *
 * Must be used inside a `<StorefrontProvider>`.
 *
 * @returns The StorefrontClient instance
 * @throws If used outside of a StorefrontProvider
 */
export function useStorefrontClient(): StorefrontClient {
  const client = useContext(StorefrontContext);
  if (!client) {
    throw new Error(
      'useStorefrontClient must be used within a <StorefrontProvider>. ' +
        'Wrap your app with <StorefrontProvider client={client}>.',
    );
  }
  return client;
}
