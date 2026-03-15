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
  CustomerResource,
} from './client';

// ─── Types ──────────────────────────────────────────────────────────
export type {
  Announcement,
  BlogPost,
  Cart,
  CartItem,
  Collection,
  CustomerAddressData,
  CustomerData,
  CustomerLoginResponse,
  CustomerOrder,
  CustomerOrderLineItem,
  Menu,
  MenuItem,
  Page,
  PaginatedResponse,
  Product,
  ProductImage,
  ProductOption,
  ProductVariant,
  SearchResult,
  SearchSuggestion,
} from './types';

// ─── Utilities ──────────────────────────────────────────────────────
export { formatMoney } from './utilities/money';
export { buildImageUrl } from './utilities/image-url';
export type { ImageUrlOptions } from './utilities/image-url';
