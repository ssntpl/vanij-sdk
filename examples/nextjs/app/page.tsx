'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useStorefrontClient } from '@vanij/storefront-sdk/react';
import { ProductCard } from '@/components/product-card';

export default function HomePage() {
  const client = useStorefrontClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['vanij', 'products', 'featured'],
    queryFn: () => client.products.list({ perPage: 8 }),
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
              Welcome to My Store
            </h1>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Discover our curated collection of products. Quality meets style.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/products"
                className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white
                  hover:bg-gray-800 transition-colors"
              >
                Shop All
              </Link>
              <Link
                href="/collections"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700
                  hover:bg-gray-50 transition-colors"
              >
                Browse Collections
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link
            href="/products"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            View All &rarr;
          </Link>
        </div>

        {isLoading && <ProductGridSkeleton />}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-600">
              Failed to load products. Make sure your store domain and access token are configured.
            </p>
          </div>
        )}

        {data && data.data.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
            <p className="text-gray-500">No products found. Add some products in your Vanij dashboard.</p>
          </div>
        )}

        {data && data.data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border border-gray-100 overflow-hidden">
          <div className="aspect-square bg-gray-100" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
