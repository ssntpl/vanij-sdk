import type {
  Announcement,
  BlogPost,
  Cart,
  Collection,
  CustomerAddressData,
  CustomerData,
  CustomerLoginResponse,
  CustomerOrder,
  Menu,
  Page,
  PaginatedResponse,
  Product,
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
  }): Promise<PaginatedResponse<Product>>;
  getByHandle(handle: string): Promise<Product>;
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
    params?: { page?: number; perPage?: number },
  ): Promise<PaginatedResponse<Product>>;
  suggest(term: string): Promise<SearchSuggestion[]>;
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
  readonly customer: CustomerResource;
  /** The resolved API base URL */
  readonly apiUrl: string;
  /** The store domain */
  readonly storeDomain: string;
}

// ─── Internal Implementation ────────────────────────────────────────

function deriveApiUrl(storeDomain: string): string {
  // If the store domain looks like "xxx.vanij.in", the API is at "api.vanij.in"
  // Otherwise, assume the API is on the same domain with /api prefix
  const parts = storeDomain.replace(/^https?:\/\//, '').split('.');
  if (parts.length >= 3) {
    // e.g., "myshop.vanij.in" -> "api.vanij.in"
    return `https://api.${parts.slice(1).join('.')}`;
  }
  // e.g., "vanij.in" -> "https://api.vanij.in"
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
    this.customer = this.createCustomerResource();
  }

  // ─── Internal Fetch ─────────────────────────────────────────────

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(init?.headers as Record<string, string>),
    };

    // Primary auth: storefront access token
    if (this.accessToken) {
      headers['X-Storefront-Access-Token'] = this.accessToken;
    }

    // Fallback: tenant ID header for backward compatibility
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

    // Handle 204 No Content
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
        const qs = searchParams.toString();
        return this.request<PaginatedResponse<Product>>(
          `/storefront/products${qs ? `?${qs}` : ''}`,
        );
      },
      getByHandle: async (handle) => {
        return this.request<Product>(`/storefront/products/${encodeURIComponent(handle)}`);
      },
    };
  }

  private createCollectionsResource(): CollectionsResource {
    return {
      list: async () => {
        return this.request<Collection[]>('/storefront/collections');
      },
      getByHandle: async (handle) => {
        return this.request<Collection>(
          `/storefront/collections/${encodeURIComponent(handle)}`,
        );
      },
    };
  }

  private createPagesResource(): PagesResource {
    return {
      list: async () => {
        return this.request<Page[]>('/storefront/pages');
      },
      getByHandle: async (handle) => {
        return this.request<Page>(`/storefront/pages/${encodeURIComponent(handle)}`);
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
        return this.request<PaginatedResponse<BlogPost>>(
          `/storefront/blog${qs ? `?${qs}` : ''}`,
        );
      },
      getByHandle: async (handle) => {
        return this.request<BlogPost>(`/storefront/blog/${encodeURIComponent(handle)}`);
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
        return this.request<Cart>(`/storefront/cart/${encodeURIComponent(cartId)}`);
      },
      addItem: async ({ variantId, quantity, cartId }) => {
        return this.request<Cart>('/storefront/cart/items', {
          method: 'POST',
          body: JSON.stringify({ variantId, quantity, cartId }),
        });
      },
      updateItem: async ({ cartId, lineId, quantity }) => {
        return this.request<Cart>(
          `/storefront/cart/${encodeURIComponent(cartId)}/items/${encodeURIComponent(lineId)}`,
          {
            method: 'PATCH',
            body: JSON.stringify({ quantity }),
          },
        );
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
        return this.request<PaginatedResponse<Product>>(
          `/storefront/search?${searchParams.toString()}`,
        );
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

  private createCustomerResource(): CustomerResource {
    return {
      login: async (email, password) => {
        return this.request<CustomerLoginResponse>('/storefront/customers/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
      },
      register: async (data) => {
        return this.request<CustomerData>('/storefront/customers/register', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      },
      getAccount: async (token) => {
        return this.request<CustomerData>('/storefront/customers/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
      },
      getOrders: async (token, params) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', String(params.page));
        if (params?.perPage) searchParams.set('perPage', String(params.perPage));
        const qs = searchParams.toString();
        return this.request<PaginatedResponse<CustomerOrder>>(
          `/storefront/customers/orders${qs ? `?${qs}` : ''}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
      },
      getOrder: async (token, orderId) => {
        return this.request<CustomerOrder>(
          `/storefront/customers/orders/${encodeURIComponent(orderId)}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
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
 * ```
 */
export function createStorefrontClient(options: StorefrontClientOptions): StorefrontClient {
  return new StorefrontClientImpl(options);
}
