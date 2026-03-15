# Vanij Next.js Storefront Example

A complete storefront built with Next.js 14 and the `@vanij/storefront-sdk`.

## Quick Start

1. Copy the environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` with your store domain and access token.
   (Create a token in Dashboard > Settings > Channels > New Channel)

3. Install and run:
   ```bash
   npm install
   npm run dev
   ```

4. Open http://localhost:4000

## Pages

- `/` — Homepage with featured products
- `/products` — All products with pagination
- `/products/[handle]` — Product detail with add to cart
- `/collections` — All collections
- `/collections/[handle]` — Collection with products
- `/cart` — Shopping cart
- `/search?q=...` — Search results

## SDK Usage

This example demonstrates the key SDK features:

### Client Setup (`lib/client.ts`)

```ts
import { createStorefrontClient } from '@vanij/storefront-sdk';

export const client = createStorefrontClient({
  storeDomain: 'acme.vanij.in',
  publicAccessToken: 'sfp_your_token',
});
```

### React Providers (`components/providers.tsx`)

```tsx
import { StorefrontProvider, CartProvider } from '@vanij/storefront-sdk/react';

<StorefrontProvider client={client}>
  <CartProvider>
    {children}
  </CartProvider>
</StorefrontProvider>
```

### Hooks

- `useProduct(handle)` — Fetch a product by slug
- `useCollection(handle)` — Fetch a collection by slug
- `useSearch(query)` — Search for products
- `useCart()` — Access cart state and actions
- `useStorefrontClient()` — Access the raw client

### Components

- `<Money amount={1299} currency="USD" />` — Formatted price
- `<AddToCartButton variantId="..." />` — Add to cart with loading state
- `<Image src="..." width={400} />` — Responsive images

## Customization

This is a starting point — customize the components in `components/` and pages in `app/` to match your brand.

## Learn More

- [Vanij SDK Documentation](https://github.com/ssntpl/vanij-sdk)
- [Next.js Documentation](https://nextjs.org/docs)
