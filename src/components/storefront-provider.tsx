import React, { createContext } from 'react';
import type { StorefrontClient } from '../client';

export const StorefrontContext = createContext<StorefrontClient | null>(null);

export interface StorefrontProviderProps {
  /** The StorefrontClient instance created via `createStorefrontClient()` */
  client: StorefrontClient;
  children: React.ReactNode;
}

/**
 * Provides the StorefrontClient to all child components via React context.
 *
 * @example
 * ```tsx
 * import { createStorefrontClient } from '@vanij/storefront-sdk';
 * import { StorefrontProvider } from '@vanij/storefront-sdk/react';
 *
 * const client = createStorefrontClient({
 *   storeDomain: 'myshop.vanij.in',
 *   publicAccessToken: 'sfp_xxx',
 * });
 *
 * function App() {
 *   return (
 *     <StorefrontProvider client={client}>
 *       <YourApp />
 *     </StorefrontProvider>
 *   );
 * }
 * ```
 */
export function StorefrontProvider({ client, children }: StorefrontProviderProps) {
  return (
    <StorefrontContext.Provider value={client}>{children}</StorefrontContext.Provider>
  );
}
