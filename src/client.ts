import type {
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
  Image,
  Menu,
  MoneyV2,
  Page,
  PaginatedResponse,
  Product,
  ProductVariant,
  SearchSuggestion,
} from './types';

// ─── Options ────────────────────────────────────────────────────────

export interface StorefrontClientOptions {
  /** Store domain, e.g. "myshop.vanij.in" */
  storeDomain: string;
  /** Public storefront access token (sfp_xxx) for authenticated API access */
  publicAccessToken?: string;
  /** Override the API URL (default: derived from storeDomain) */
  apiUrl?: string;
  /** Fallback: direct tenant ID for internal/legacy use */
  tenantId?: string;
}

// ─── Resource Interfaces ────────────────────────────────────────────

export interface ProductsResource {
  list(params?: {
    collection?: string;
    page?: number;
    perPage?: number;
    currency?: string;
  }): Promise<PaginatedResponse<Product>>;
  getByHandle(handle: string, currency?: string): Promise<Product>;
}

export interface CollectionsResource {
  list(): Promise<Collection[]>;
  getByHandle(handle: string): Promise<Collection>;
}

export interface PagesResource {
  list(): Promise<Page[]>;
  getByHandle(handle: string): Promise<Page>;
}

export interface BlogResource {
  list(params?: {
    tag?: string;
    page?: number;
    perPage?: number;
  }): Promise<PaginatedResponse<BlogPost>>;
  getByHandle(handle: string): Promise<BlogPost>;
}

export interface AnnouncementsResource {
  list(): Promise<Announcement[]>;
}

export interface MenusResource {
  get(handle: string): Promise<Menu>;
}

export interface CartResource {
  get(cartId: string): Promise<Cart>;
  addItem(params: {
    variantId: string;
    quantity: number;
    cartId?: string;
  }): Promise<Cart>;
  updateItem(params: {
    cartId: string;
    lineId: string;
    quantity: number;
  }): Promise<Cart>;
  removeItem(cartId: string, lineId: string): Promise<void>;
  clear(cartId: string): Promise<void>;
}

export interface SearchResource {
  query(
    term: string,
    params?: { page?: number; perPage?: number; currency?: string },
  ): Promise<PaginatedResponse<Product>>;
  suggest(term: string): Promise<SearchSuggestion[]>;
}

export interface CurrenciesResource {
  list(): Promise<{ currencies: Currency[]; baseCurrency: string }>;
}

export interface CustomerResource {
  login(email: string, password: string): Promise<CustomerLoginResponse>;
  register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<CustomerData>;
  getAccount(token: string): Promise<CustomerData>;
  getOrders(
    token: string,
    params?: { page?: number; perPage?: number },
  ): Promise<PaginatedResponse<CustomerOrder>>;
  getOrder(token: string, orderId: string): Promise<CustomerOrder>;
  addAddress(
    token: string,
    address: Omit<CustomerAddressData, 'id' | 'isDefault'>,
  ): Promise<CustomerAddressData>;
  updateAddress(
    token: string,
    addressId: string,
    address: Partial<Omit<CustomerAddressData, 'id' | 'isDefault'>>,
  ): Promise<CustomerAddressData>;
  deleteAddress(token: string, addressId: string): Promise<void>;
  recoverPassword(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
  activateAccount(token: string, password: string): Promise<void>;
}

// ─── Client Interface ───────────────────────────────────────────────

export interface StorefrontClient {
  readonly products: ProductsResource;
  readonly collections: CollectionsResource;
  readonly pages: PagesResource;
  readonly blog: BlogResource;
  readonly announcements: AnnouncementsResource;
  readonly menus: MenusResource;
  readonly cart: CartResource;
  readonly search: SearchResource;
  readonly currencies: CurrenciesResource;
  readonly customer: CustomerResource;
  /** The resolved API base URL */
  readonly apiUrl: string;
  /** The store domain */
  readonly storeDomain: string;
}

// ─── Internal: API Response Types (raw from backend) ────────────────

interface RawProductVariant {
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

interface RawProductImage {
  id: string;
  productId: string;
  variantId: string | null;
  fileId: string | null;
  url: string | null;
  altText: string | null;
  position: number;
}

interface RawProductOption {
  id: string;
  productId: string;
  name: string;
  position: number;
  values: string[];
}

interface RawProduct {
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
  price?: string | null;
  compareAtPrice?: string | null;
  currencyCode?: string;
  featuredImage?: RawProductImage | null;
  variants?: RawProductVariant[];
  images?: RawProductImage[];
  options?: RawProductOption[];
}

interface RawCollection {
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
  productIds?: string[];
}

interface RawPage {
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

interface RawBlogPost {
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

interface RawCartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: string;
  metadata: Record<string, unknown>;
}

interface RawCart {
  id: string;
  tenantId: string;
  customerId: string | null;
  sessionId: string | null;
  currencyCode: string;
  metadata: Record<string, unknown>;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: RawCartItem[];
}

interface RawCustomerData {
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

interface RawCustomerOrder {
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
  lineItems: RawCustomerOrderLineItem[];
  shippingAddress: CustomerAddressData | null;
  billingAddress: CustomerAddressData | null;
  createdAt: string;
  updatedAt: string;
}

interface RawCustomerOrderLineItem {
  id: string;
  title: string;
  variantTitle: string | null;
  sku: string | null;
  quantity: number;
  price: string;
  linePrice: string;
  imageUrl: string | null;
}

// ─── Transform Helpers ──────────────────────────────────────────────

function money(amount: string | number | null | undefined, currencyCode: string): MoneyV2 {
  if (amount === null || amount === undefined) {
    return { amount: '0.00', currencyCode };
  }
  const str = typeof amount === 'number' ? amount.toFixed(2) : amount;
  return { amount: str, currencyCode };
}

function moneyOrNull(
  amount: string | number | null | undefined,
  currencyCode: string,
): MoneyV2 | null {
  if (amount === null || amount === undefined) return null;
  return money(amount, currencyCode);
}

function transformImage(raw: RawProductImage | null | undefined): Image | null {
  if (!raw || !raw.url) return null;
  return {
    url: raw.url,
    altText: raw.altText ?? null,
    width: null,
    height: null,
  };
}

function transformVariant(raw: RawProductVariant): ProductVariant {
  const cc = raw.currencyCode || 'USD';
  const optionEntries = Object.entries(raw.optionValues ?? {});
  return {
    id: raw.id,
    title: raw.name,
    sku: raw.sku,
    price: money(raw.price, cc),
    compareAtPrice: moneyOrNull(raw.compareAtPrice, cc),
    available: raw.isActive,
    quantityAvailable: null,
    selectedOptions: optionEntries.map(([name, value]) => ({ name, value })),
    image: null,
    barcode: raw.barcode,
    weightGrams: raw.weightGrams,
    requiresShipping: raw.requiresShipping,
    position: raw.position,
  };
}

function transformProduct(raw: RawProduct): Product {
  const cc = raw.currencyCode ?? raw.variants?.[0]?.currencyCode ?? 'USD';
  const variants = (raw.variants ?? []).map(transformVariant);
  const images: Image[] = (raw.images ?? [])
    .map(transformImage)
    .filter((img): img is Image => img !== null);

  // Compute price ranges from variants
  const variantPrices = variants.map((v) => parseFloat(v.price.amount));
  const minPrice =
    variantPrices.length > 0
      ? Math.min(...variantPrices)
      : raw.price
        ? parseFloat(raw.price)
        : 0;
  const maxPrice =
    variantPrices.length > 0
      ? Math.max(...variantPrices)
      : raw.price
        ? parseFloat(raw.price)
        : 0;

  const compareAtPrices = variants
    .map((v) => v.compareAtPrice)
    .filter((p): p is MoneyV2 => p !== null)
    .map((p) => parseFloat(p.amount));
  const minCompare = compareAtPrices.length > 0 ? Math.min(...compareAtPrices) : null;
  const maxCompare = compareAtPrices.length > 0 ? Math.max(...compareAtPrices) : null;

  return {
    id: raw.id,
    title: raw.name,
    handle: raw.slug,
    description: raw.description ?? '',
    vendor: '',
    productType: raw.productType,
    tags: raw.tags,
    priceRange: {
      minVariantPrice: money(minPrice.toFixed(2), cc),
      maxVariantPrice: money(maxPrice.toFixed(2), cc),
    },
    compareAtPriceRange: {
      minVariantPrice: minCompare !== null ? money(minCompare.toFixed(2), cc) : null,
      maxVariantPrice: maxCompare !== null ? money(maxCompare.toFixed(2), cc) : null,
    },
    featuredImage: transformImage(raw.featuredImage) ?? (images[0] ?? null),
    images,
    variants,
    options: (raw.options ?? []).map((opt) => ({
      id: opt.id,
      name: opt.name,
      position: opt.position,
      values: opt.values,
    })),
    available: variants.length > 0 ? variants.some((v) => v.available) : true,
    createdAt: raw.createdAt,
    publishedAt: null,
  };
}

function transformCollection(raw: RawCollection): Collection {
  return {
    id: raw.id,
    title: raw.name,
    handle: raw.slug,
    description: raw.description,
    image: raw.imageUrl ? { url: raw.imageUrl, altText: raw.name, width: null, height: null } : null,
    sortOrder: raw.sortOrder,
    productsCount: null,
    publishedAt: raw.publishedAt,
  };
}

function transformPage(raw: RawPage): Page {
  return {
    id: raw.id,
    title: raw.title,
    handle: raw.slug,
    content: raw.content,
    publishedAt: raw.publishedAt,
    seoTitle: raw.seoTitle,
    seoDescription: raw.seoDescription,
  };
}

function transformBlogPost(raw: RawBlogPost): BlogPost {
  return {
    id: raw.id,
    title: raw.title,
    handle: raw.slug,
    content: raw.content,
    excerpt: raw.excerpt,
    featuredImage: raw.featuredImageUrl
      ? { url: raw.featuredImageUrl, altText: raw.title, width: null, height: null }
      : null,
    authorName: null,
    publishedAt: raw.publishedAt,
    tags: raw.tags,
    seoTitle: raw.seoTitle,
    seoDescription: raw.seoDescription,
  };
}

function transformCart(raw: RawCart): Cart {
  const cc = raw.currencyCode || 'USD';
  const lines: CartLine[] = raw.items.map((item) => {
    const unitPrice = money(item.unitPrice, cc);
    const totalAmount = money(
      (parseFloat(item.unitPrice) * item.quantity).toFixed(2),
      cc,
    );
    return {
      id: item.id,
      quantity: item.quantity,
      merchandise: {
        id: item.variantId,
        title: '',
        product: { handle: '', title: '' },
        image: null,
        price: unitPrice,
        compareAtPrice: null,
        selectedOptions: [],
      },
      cost: {
        totalAmount,
        amountPerQuantity: unitPrice,
      },
    };
  });

  const totalValue = lines.reduce(
    (sum, line) => sum + parseFloat(line.cost.totalAmount.amount),
    0,
  );

  return {
    id: raw.id,
    lines,
    cost: {
      totalAmount: money(totalValue.toFixed(2), cc),
      subtotalAmount: money(totalValue.toFixed(2), cc),
      totalTaxAmount: null,
    },
    totalQuantity: lines.reduce((sum, line) => sum + line.quantity, 0),
    note: '',
    buyerIdentity: null,
  };
}

function transformCustomerData(raw: RawCustomerData, cc: string = 'USD'): CustomerData {
  return {
    ...raw,
    totalSpent: money(
      typeof raw.totalSpent === 'number' ? raw.totalSpent.toFixed(2) : String(raw.totalSpent),
      cc,
    ),
  };
}

function transformCustomerOrder(raw: RawCustomerOrder): CustomerOrder {
  const cc = raw.currencyCode || 'USD';
  return {
    id: raw.id,
    name: raw.name,
    orderNumber: raw.orderNumber,
    status: raw.status,
    fulfillmentStatus: raw.fulfillmentStatus,
    financialStatus: raw.financialStatus,
    subtotalPrice: money(raw.subtotalPrice, cc),
    totalPrice: money(raw.totalPrice, cc),
    totalTax: money(raw.totalTax, cc),
    currencyCode: cc,
    lineItems: raw.lineItems.map((li) => ({
      id: li.id,
      title: li.title,
      variantTitle: li.variantTitle,
      sku: li.sku,
      quantity: li.quantity,
      price: money(li.price, cc),
      totalPrice: money(li.linePrice, cc),
      image: li.imageUrl
        ? { url: li.imageUrl, altText: li.title, width: null, height: null }
        : null,
    })),
    shippingAddress: raw.shippingAddress,
    billingAddress: raw.billingAddress,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

// ─── Internal Implementation ────────────────────────────────────────

function deriveApiUrl(storeDomain: string): string {
  const parts = storeDomain.replace(/^https?:\/\//, '').split('.');
  if (parts.length >= 3) {
    return `https://api.${parts.slice(1).join('.')}`;
  }
  return `https://api.${storeDomain}`;
}

class StorefrontClientImpl implements StorefrontClient {
  readonly apiUrl: string;
  readonly storeDomain: string;
  private readonly accessToken?: string;
  private readonly tenantId?: string;

  readonly products: ProductsResource;
  readonly collections: CollectionsResource;
  readonly pages: PagesResource;
  readonly blog: BlogResource;
  readonly announcements: AnnouncementsResource;
  readonly menus: MenusResource;
  readonly cart: CartResource;
  readonly search: SearchResource;
  readonly currencies: CurrenciesResource;
  readonly customer: CustomerResource;

  constructor(options: StorefrontClientOptions) {
    this.storeDomain = options.storeDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    this.apiUrl = (options.apiUrl ?? deriveApiUrl(this.storeDomain)).replace(/\/$/, '');
    this.accessToken = options.publicAccessToken;
    this.tenantId = options.tenantId;

    this.products = this.createProductsResource();
    this.collections = this.createCollectionsResource();
    this.pages = this.createPagesResource();
    this.blog = this.createBlogResource();
    this.announcements = this.createAnnouncementsResource();
    this.menus = this.createMenusResource();
    this.cart = this.createCartResource();
    this.search = this.createSearchResource();
    this.currencies = this.createCurrenciesResource();
    this.customer = this.createCustomerResource();
  }

  // ─── Internal Fetch ─────────────────────────────────────────────

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(init?.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers['X-Storefront-Access-Token'] = this.accessToken;
    }

    if (this.tenantId) {
      headers['x-tenant-id'] = this.tenantId;
    }

    const response = await fetch(`${this.apiUrl}${path}`, {
      ...init,
      headers,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `Vanij Storefront API Error: ${response.status} ${response.statusText} - ${body}`,
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  // ─── Resource Factories ─────────────────────────────────────────

  private createProductsResource(): ProductsResource {
    return {
      list: async (params) => {
        const searchParams = new URLSearchParams();
        if (params?.collection) searchParams.set('collection', params.collection);
        if (params?.page) searchParams.set('page', String(params.page));
        if (params?.perPage) searchParams.set('perPage', String(params.perPage));
        if (params?.currency) searchParams.set('currency', params.currency);
        const qs = searchParams.toString();
        const raw = await this.request<PaginatedResponse<RawProduct>>(
          `/storefront/products${qs ? `?${qs}` : ''}`,
        );
        return {
          ...raw,
          data: raw.data.map(transformProduct),
        };
      },
      getByHandle: async (handle, currency) => {
        const searchParams = new URLSearchParams();
        if (currency) searchParams.set('currency', currency);
        const qs = searchParams.toString();
        const raw = await this.request<RawProduct>(
          `/storefront/products/${encodeURIComponent(handle)}${qs ? `?${qs}` : ''}`,
        );
        return transformProduct(raw);
      },
    };
  }

  private createCollectionsResource(): CollectionsResource {
    return {
      list: async () => {
        const raw = await this.request<RawCollection[]>('/storefront/collections');
        return raw.map(transformCollection);
      },
      getByHandle: async (handle) => {
        const raw = await this.request<RawCollection>(
          `/storefront/collections/${encodeURIComponent(handle)}`,
        );
        return transformCollection(raw);
      },
    };
  }

  private createPagesResource(): PagesResource {
    return {
      list: async () => {
        const raw = await this.request<RawPage[]>('/storefront/pages');
        return raw.map(transformPage);
      },
      getByHandle: async (handle) => {
        const raw = await this.request<RawPage>(
          `/storefront/pages/${encodeURIComponent(handle)}`,
        );
        return transformPage(raw);
      },
    };
  }

  private createBlogResource(): BlogResource {
    return {
      list: async (params) => {
        const searchParams = new URLSearchParams();
        if (params?.tag) searchParams.set('tag', params.tag);
        if (params?.page) searchParams.set('page', String(params.page));
        if (params?.perPage) searchParams.set('perPage', String(params.perPage));
        const qs = searchParams.toString();
        const raw = await this.request<PaginatedResponse<RawBlogPost>>(
          `/storefront/blog${qs ? `?${qs}` : ''}`,
        );
        return {
          ...raw,
          data: raw.data.map(transformBlogPost),
        };
      },
      getByHandle: async (handle) => {
        const raw = await this.request<RawBlogPost>(
          `/storefront/blog/${encodeURIComponent(handle)}`,
        );
        return transformBlogPost(raw);
      },
    };
  }

  private createAnnouncementsResource(): AnnouncementsResource {
    return {
      list: async () => {
        return this.request<Announcement[]>('/storefront/announcements');
      },
    };
  }

  private createMenusResource(): MenusResource {
    return {
      get: async (handle) => {
        return this.request<Menu>(`/storefront/menus/${encodeURIComponent(handle)}`);
      },
    };
  }

  private createCartResource(): CartResource {
    return {
      get: async (cartId) => {
        const raw = await this.request<RawCart>(
          `/storefront/cart/${encodeURIComponent(cartId)}`,
        );
        return transformCart(raw);
      },
      addItem: async ({ variantId, quantity, cartId }) => {
        const raw = await this.request<RawCart>('/storefront/cart/items', {
          method: 'POST',
          body: JSON.stringify({ variantId, quantity, cartId }),
        });
        return transformCart(raw);
      },
      updateItem: async ({ cartId, lineId, quantity }) => {
        const raw = await this.request<RawCart>(
          `/storefront/cart/${encodeURIComponent(cartId)}/items/${encodeURIComponent(lineId)}`,
          {
            method: 'PATCH',
            body: JSON.stringify({ quantity }),
          },
        );
        return transformCart(raw);
      },
      removeItem: async (cartId, lineId) => {
        await this.request<void>(
          `/storefront/cart/${encodeURIComponent(cartId)}/items/${encodeURIComponent(lineId)}`,
          { method: 'DELETE' },
        );
      },
      clear: async (cartId) => {
        await this.request<void>(
          `/storefront/cart/${encodeURIComponent(cartId)}`,
          { method: 'DELETE' },
        );
      },
    };
  }

  private createSearchResource(): SearchResource {
    return {
      query: async (term, params) => {
        const searchParams = new URLSearchParams();
        searchParams.set('q', term);
        if (params?.page) searchParams.set('page', String(params.page));
        if (params?.perPage) searchParams.set('perPage', String(params.perPage));
        if (params?.currency) searchParams.set('currency', params.currency);
        const raw = await this.request<PaginatedResponse<RawProduct>>(
          `/storefront/search?${searchParams.toString()}`,
        );
        return {
          ...raw,
          data: raw.data.map(transformProduct),
        };
      },
      suggest: async (term) => {
        const searchParams = new URLSearchParams();
        searchParams.set('q', term);
        return this.request<SearchSuggestion[]>(
          `/storefront/search/suggest?${searchParams.toString()}`,
        );
      },
    };
  }

  private createCurrenciesResource(): CurrenciesResource {
    return {
      list: async () => {
        return this.request<{ currencies: Currency[]; baseCurrency: string }>(
          '/storefront/currencies',
        );
      },
    };
  }

  private createCustomerResource(): CustomerResource {
    return {
      login: async (email, password) => {
        const raw = await this.request<{
          token: string;
          customer: RawCustomerData;
        }>('/storefront/customers/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        return {
          token: raw.token,
          customer: transformCustomerData(raw.customer),
        };
      },
      register: async (data) => {
        const raw = await this.request<RawCustomerData>('/storefront/customers/register', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        return transformCustomerData(raw);
      },
      getAccount: async (token) => {
        const raw = await this.request<RawCustomerData>('/storefront/customers/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        return transformCustomerData(raw);
      },
      getOrders: async (token, params) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', String(params.page));
        if (params?.perPage) searchParams.set('perPage', String(params.perPage));
        const qs = searchParams.toString();
        const raw = await this.request<PaginatedResponse<RawCustomerOrder>>(
          `/storefront/customers/orders${qs ? `?${qs}` : ''}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        return {
          ...raw,
          data: raw.data.map(transformCustomerOrder),
        };
      },
      getOrder: async (token, orderId) => {
        const raw = await this.request<RawCustomerOrder>(
          `/storefront/customers/orders/${encodeURIComponent(orderId)}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        return transformCustomerOrder(raw);
      },
      addAddress: async (token, address) => {
        return this.request<CustomerAddressData>('/storefront/customers/addresses', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify(address),
        });
      },
      updateAddress: async (token, addressId, address) => {
        return this.request<CustomerAddressData>(
          `/storefront/customers/addresses/${encodeURIComponent(addressId)}`,
          {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(address),
          },
        );
      },
      deleteAddress: async (token, addressId) => {
        await this.request<void>(
          `/storefront/customers/addresses/${encodeURIComponent(addressId)}`,
          {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      },
      recoverPassword: async (email) => {
        await this.request<void>('/storefront/customers/recover', {
          method: 'POST',
          body: JSON.stringify({ email }),
        });
      },
      resetPassword: async (token, password) => {
        await this.request<void>('/storefront/customers/reset', {
          method: 'POST',
          body: JSON.stringify({ token, password }),
        });
      },
      activateAccount: async (token, password) => {
        await this.request<void>('/storefront/customers/activate', {
          method: 'POST',
          body: JSON.stringify({ token, password }),
        });
      },
    };
  }
}

// ─── Factory Function ───────────────────────────────────────────────

/**
 * Create a new Vanij Storefront API client.
 *
 * All prices are returned in MoneyV2 format: `{ amount: "39.99", currencyCode: "USD" }`.
 * Images use `{ url, altText, width, height }`.
 *
 * @example
 * ```ts
 * import { createStorefrontClient } from '@vanij/storefront-sdk';
 *
 * const client = createStorefrontClient({
 *   storeDomain: 'myshop.vanij.in',
 *   publicAccessToken: 'sfp_your_token_here',
 * });
 *
 * const products = await client.products.list();
 * const price = products.data[0].priceRange.minVariantPrice;
 * // { amount: "39.99", currencyCode: "USD" }
 *
 * // Fetch in a different currency
 * const inrProducts = await client.products.list({ currency: 'INR' });
 * ```
 */
export function createStorefrontClient(options: StorefrontClientOptions): StorefrontClient {
  return new StorefrontClientImpl(options);
}
