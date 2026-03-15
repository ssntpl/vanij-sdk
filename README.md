# @vanij/storefront-sdk

Build custom storefronts for [Vanij](https://vanij.in) — the multi-tenant commerce platform.

## Installation

```bash
npm install @vanij/storefront-sdk
```

For React hooks and components, also install the peer dependencies:

```bash
npm install react @tanstack/react-query
```

## Quick Start

### Core Client (Node.js or Browser)

```typescript
import { createStorefrontClient } from '@vanij/storefront-sdk';

const client = createStorefrontClient({
  storeDomain: 'myshop.vanij.in',
  publicAccessToken: 'sfp_your_token_here',
});

// Fetch products
const products = await client.products.list();

// Get a specific product
const product = await client.products.getByHandle('running-shoes');

// Cart operations
const cart = await client.cart.get('cart_id');
await client.cart.addItem({ variantId: '123', quantity: 1 });
```

### React Hooks & Components

```tsx
import { createStorefrontClient } from '@vanij/storefront-sdk';
import {
  StorefrontProvider,
  CartProvider,
  useProduct,
  useCart,
  Money,
  AddToCartButton,
} from '@vanij/storefront-sdk/react';

const client = createStorefrontClient({
  storeDomain: 'myshop.vanij.in',
  publicAccessToken: 'sfp_your_token_here',
});

// Wrap your app
function App() {
  return (
    <StorefrontProvider client={client}>
      <CartProvider>
        <ProductPage />
      </CartProvider>
    </StorefrontProvider>
  );
}

// Use in components
function ProductPage() {
  const { data: product, isLoading } = useProduct('running-shoes');
  const { addItem } = useCart();

  if (isLoading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <Money amount={Number(product.price) * 100} currency={product.currencyCode} />
      <AddToCartButton variantId={product.variants?.[0]?.id ?? ''}>
        Add to Cart
      </AddToCartButton>
    </div>
  );
}
```

## API Reference

### Client Methods

| Method | Description |
|--------|-------------|
| `client.products.list(params?)` | List products with optional filtering |
| `client.products.getByHandle(handle)` | Get a product by its handle/slug |
| `client.collections.list()` | List all collections |
| `client.collections.getByHandle(handle)` | Get a collection by handle |
| `client.pages.list()` | List all pages |
| `client.pages.getByHandle(handle)` | Get a page by handle |
| `client.blog.list(params?)` | List blog posts |
| `client.blog.getByHandle(handle)` | Get a blog post by handle |
| `client.announcements.list()` | List active announcements |
| `client.menus.get(handle)` | Get a navigation menu |
| `client.cart.get(cartId)` | Get cart by ID |
| `client.cart.addItem({ variantId, quantity })` | Add item to cart |
| `client.cart.updateItem({ cartId, lineId, quantity })` | Update cart item quantity |
| `client.cart.removeItem(cartId, lineId)` | Remove item from cart |
| `client.cart.clear(cartId)` | Clear all cart items |
| `client.search.query(term, params?)` | Search products |
| `client.search.suggest(term)` | Get search suggestions |
| `client.customer.login(email, password)` | Customer login |
| `client.customer.register(data)` | Customer registration |
| `client.customer.getAccount(token)` | Get customer account |
| `client.customer.getOrders(token, params?)` | Get customer orders |
| `client.customer.getOrder(token, orderId)` | Get a specific order |
| `client.customer.addAddress(token, address)` | Add customer address |
| `client.customer.updateAddress(token, id, data)` | Update customer address |
| `client.customer.deleteAddress(token, id)` | Delete customer address |
| `client.customer.recoverPassword(email)` | Send password recovery email |
| `client.customer.resetPassword(token, password)` | Reset password |
| `client.customer.activateAccount(token, password)` | Activate account |

### React Hooks

| Hook | Description |
|------|-------------|
| `useProduct(handle)` | Fetch a product by handle |
| `useCollection(handle)` | Fetch a collection by handle |
| `useCart()` | Cart state and actions (addItem, removeItem, updateItem, clear) |
| `useCustomer(token)` | Fetch current customer data |
| `useSearch(query, params?)` | Search products by query |
| `useStorefrontClient()` | Access the StorefrontClient from context |

### Components

| Component | Description |
|-----------|-------------|
| `<StorefrontProvider client={client}>` | Client context provider |
| `<CartProvider>` | Cart state management provider |
| `<Money amount={1299} currency="USD" />` | Format and display a price |
| `<Image src={url} alt="..." width={400} />` | Responsive image with srcSet |
| `<AddToCartButton variantId="..." />` | Add-to-cart button with loading state |

### Utilities

| Function | Description |
|----------|-------------|
| `formatMoney(amountInCents, currency?, locale?)` | Format a monetary amount as a string |
| `buildImageUrl(src, options?)` | Build a transformed image URL |

## Client Configuration

```typescript
interface StorefrontClientOptions {
  // Required: your store's domain
  storeDomain: string;

  // Recommended: public access token for API authentication
  publicAccessToken?: string;

  // Optional: override the API URL (default: derived from storeDomain)
  apiUrl?: string;

  // Optional: direct tenant ID (for internal/backward-compatible use)
  tenantId?: string;
}
```

The API URL is automatically derived from the store domain:
- `myshop.vanij.in` -> `https://api.vanij.in`
- Custom domains also supported via `apiUrl` override

## License

MIT
