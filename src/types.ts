// ─── Core Pagination ────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}

// ─── Products ───────────────────────────────────────────────────────

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string | null;
  barcode: string | null;
  price: string;
  compareAtPrice: string | null;
  costPrice: string | null;
  currencyCode: string;
  weightGrams: number | null;
  trackInventory: boolean;
  requiresShipping: boolean;
  isActive: boolean;
  position: number;
  optionValues: Record<string, string>;
  metadata: Record<string, unknown>;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  variantId: string | null;
  fileId: string | null;
  url: string | null;
  altText: string | null;
  position: number;
}

export interface ProductOption {
  id: string;
  productId: string;
  name: string;
  position: number;
  values: string[];
}

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description: string | null;
  productType: string;
  status: string;
  taxCategoryId: string | null;
  tags: string[];
  metadata: Record<string, unknown>;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  /** Present on list endpoints */
  price?: string | null;
  /** Present on list endpoints */
  compareAtPrice?: string | null;
  /** Present on list endpoints */
  currencyCode?: string;
  /** Present on list endpoints */
  featuredImage?: ProductImage | null;
  /** Present on detail endpoint */
  variants?: ProductVariant[];
  /** Present on detail endpoint */
  images?: ProductImage[];
  /** Present on detail endpoint */
  options?: ProductOption[];
}

// ─── Collections ────────────────────────────────────────────────────

export interface Collection {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  conditions: Record<string, unknown>;
  publishedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  /** Present on detail endpoint */
  productIds?: string[];
}

// ─── Pages ──────────────────────────────────────────────────────────

export interface Page {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  content: string | null;
  status: string;
  publishedAt: string | null;
  templateSuffix: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  authorId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ─── Blog Posts ─────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  featuredImageUrl: string | null;
  authorId: string | null;
  status: string;
  publishedAt: string | null;
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  templateSuffix: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ─── Announcements ──────────────────────────────────────────────────

export interface Announcement {
  id: string;
  tenantId: string;
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
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
}

export interface Menu {
  id: string;
  tenantId: string;
  name: string;
  handle: string;
  createdAt: string;
  updatedAt: string;
  items: MenuItem[];
}

// ─── Cart ───────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: string;
  metadata: Record<string, unknown>;
}

export interface Cart {
  id: string;
  tenantId: string;
  customerId: string | null;
  sessionId: string | null;
  currencyCode: string;
  metadata: Record<string, unknown>;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
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
  totalSpent: number;
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
  subtotalPrice: string;
  totalPrice: string;
  totalTax: string;
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
  price: string;
  linePrice: string;
  imageUrl: string | null;
}
