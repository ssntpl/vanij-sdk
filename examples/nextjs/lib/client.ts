import { createStorefrontClient } from '@vanij/storefront-sdk';

export const client = createStorefrontClient({
  storeDomain: process.env.NEXT_PUBLIC_STORE_DOMAIN || 'acme.vanij.in',
  publicAccessToken: process.env.NEXT_PUBLIC_STOREFRONT_TOKEN || '',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || undefined,
});
