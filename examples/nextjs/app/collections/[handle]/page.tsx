'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useCollection, useStorefrontClient } from '@vanij/storefront-sdk/react';
import { ProductCard } from '@/components/product-card';

export default function CollectionDetailPage() {
  const params = useParams<{ handle: string }>();
  const { data: collection, isLoading, error } = useCollection(params.handle);
  const client = useStorefrontClient();

  // Fetch products for this collection
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['vanij', 'products', 'collection', params.handle],
    queryFn: () => client.products.list({ collection: params.handle, perPage: 24 }),
    enabled: !!params.handle,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-100 rounded w-1/3" />
          <div className="h-4 bg-gray-100 rounded w-2/3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="aspect-square bg-gray-100" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">Failed to load collection.</p>
          <Link href="/collections" className="mt-4 inline-block text-sm font-medium text-red-700 underline">
            Back to Collections
          </Link>
        </div>
      </div>
    );
  }

  if (!collection) return null;

  const products = productsData?.data || [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/collections" className="hover:text-gray-700 transition-colors">
          Collections
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{collection.title}</span>
      </nav>

      {/* Collection Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">{collection.title}</h1>
        {collection.description && (
          <p className="mt-3 text-gray-600 max-w-2xl">{collection.description}</p>
        )}
      </div>

      {/* Products */}
      {productsLoading && (
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
      )}

      {!productsLoading && products.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-gray-500">No products in this collection yet.</p>
        </div>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
