// ─── Core ───────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}

// ─── MoneyV2 ────────────────────────────────────────────────────────

/**
 * Universal price format (Shopify-compatible).
 * Amount is always a string, never a number.
 */
export interface MoneyV2 {
  /** Decimal amount as a string, e.g. "39.99" */
  amount: string;
  /** ISO 4217 currency code, e.g. "USD" */
  currencyCode: string;
}

// ─── Currency ───────────────────────────────────────────────────────

export interface Currency {
  /** ISO 4217 code, e.g. "USD" */
  code: string;
  /** Human-readable name, e.g. "US Dollar" */
  name: string;
  /** Symbol, e.g. "$" */
  symbol: string;
  /** Number of decimal places, e.g. 2 */
  decimalPlaces: number;
}

// ─── Images ─────────────────────────────────────────────────────────

export interface Image {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

// ─── Products ───────────────────────────────────────────────────────

export interface ProductVariant {
  id: string;
  title: string;
  sku: string | null;
  price: MoneyV2;
  compareAtPrice: MoneyV2 | null;
  available: boolean;
  quantityAvailable: number | null;
  selectedOptions: { name: string; value: string }[];
  image: Image | null;
  barcode: string | null;
  weightGrams: number | null;
  requiresShipping: boolean;
  position: number;
}

export interface ProductOption {
  id: string;
  name: string;
  position: number;
  values: string[];
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  priceRange: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  };
  compareAtPriceRange: {
    minVariantPrice: MoneyV2 | null;
    maxVariantPrice: MoneyV2 | null;
  };
  featuredImage: Image | null;
  images: Image[];
  variants: ProductVariant[];
  options: ProductOption[];
  available: boolean;
  createdAt: string;
  publishedAt: string | null;
}

// ─── Collections ────────────────────────────────────────────────────

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  image: Image | null;
  sortOrder: number;
  productsCount: number | null;
  publishedAt: string | null;
}

// ─── Pages ──────────────────────────────────────────────────────────

export interface Page {
  id: string;
  title: string;
  handle: string;
  content: string | null;
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

// ─── Blog Posts ─────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  title: string;
  handle: string;
  content: string | null;
  excerpt: string | null;
  featuredImage: Image | null;
  authorName: string | null;
  publishedAt: string | null;
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
}

// ─── Announcements ──────────────────────────────────────────────────

export interface Announcement {
  id: string;
  title: string;
  content: string | null;
  type: string;
  displayLocation: string;
  startsAt: string | null;
  endsAt: string | null;
  isDismissible: boolean;
  isActive: boolean;
  backgroundColor: string | null;
  textColor: string | null;
  linkUrl: string | null;
  linkText: string | null;
}

// ─── Menus ──────────────────────────────────────────────────────────

export interface MenuItem {
  id: string;
  menuId: string;
  parentId: string | null;
  title: string;
  url: string | null;
  resourceType: string | null;
  resourceId: string | null;
  position: number;
}

export interface Menu {
  id: string;
  name: string;
  handle: string;
  items: MenuItem[];
}

// ─── Cart ───────────────────────────────────────────────────────────

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: { handle: string; title: string };
    image: Image | null;
    price: MoneyV2;
    compareAtPrice: MoneyV2 | null;
    selectedOptions: { name: string; value: string }[];
  };
  cost: {
    totalAmount: MoneyV2;
    amountPerQuantity: MoneyV2;
  };
}

export interface Cart {
  id: string;
  lines: CartLine[];
  cost: {
    totalAmount: MoneyV2;
    subtotalAmount: MoneyV2;
    totalTaxAmount: MoneyV2 | null;
  };
  totalQuantity: number;
  note: string;
  buyerIdentity: { countryCode: string | null } | null;
}

// ─── Search ─────────────────────────────────────────────────────────

export type SearchResult = Product;

export interface SearchSuggestion {
  text: string;
  type: 'product' | 'collection' | 'page';
  url: string;
}

// ─── Customer Auth ──────────────────────────────────────────────────

export interface CustomerLoginResponse {
  token: string;
  customer: CustomerData;
}

export interface CustomerData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  acceptsMarketing: boolean;
  tags: string[];
  ordersCount: number;
  totalSpent: MoneyV2;
  addresses: CustomerAddressData[];
  defaultAddress: CustomerAddressData | null;
}

export interface CustomerAddressData {
  id: string;
  firstName: string;
  lastName: string;
  company: string | null;
  address1: string;
  address2: string | null;
  city: string;
  province: string | null;
  provinceCode: string | null;
  country: string;
  countryCode: string;
  zip: string;
  phone: string | null;
  isDefault: boolean;
}

export interface CustomerOrder {
  id: string;
  name: string;
  orderNumber: number;
  status: string;
  fulfillmentStatus: string;
  financialStatus: string;
  subtotalPrice: MoneyV2;
  totalPrice: MoneyV2;
  totalTax: MoneyV2;
  currencyCode: string;
  lineItems: CustomerOrderLineItem[];
  shippingAddress: CustomerAddressData | null;
  billingAddress: CustomerAddressData | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerOrderLineItem {
  id: string;
  title: string;
  variantTitle: string | null;
  sku: string | null;
  quantity: number;
  price: MoneyV2;
  totalPrice: MoneyV2;
  image: Image | null;
}

// ─── Legacy Type Aliases (deprecated) ───────────────────────────────

/** @deprecated Use Image instead */
export type ProductImage = Image;
/** @deprecated Use CartLine instead */
export type CartItem = CartLine;
