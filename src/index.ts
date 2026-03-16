// ─── Client ─────────────────────────────────────────────────────────
export { createStorefrontClient } from './client';
export type {
  StorefrontClient,
  StorefrontClientOptions,
  ProductsResource,
  CollectionsResource,
  PagesResource,
  BlogResource,
  AnnouncementsResource,
  MenusResource,
  CartResource,
  SearchResource,
  CurrenciesResource,
  CustomerResource,
} from './client';

// ─── Types ──────────────────────────────────────────────────────────
export type {
  Announcement,
  BlogPost,
  Cart,
  CartLine,
  Collection,
  Currency,
  CustomerAddressData,
  CustomerData,
  CustomerLoginResponse,
  CustomerOrder,
  CustomerOrderLineItem,
  Image,
  Menu,
  MenuItem,
  MoneyV2,
  Page,
  PaginatedResponse,
  Product,
  ProductOption,
  ProductVariant,
  SearchResult,
  SearchSuggestion,
  // Deprecated aliases
  ProductImage,
  CartItem,
} from './types';

// ─── Utilities ──────────────────────────────────────────────────────
export { formatMoney } from './utilities/money';
export { buildImageUrl } from './utilities/image-url';
export type { ImageUrlOptions } from './utilities/image-url';
