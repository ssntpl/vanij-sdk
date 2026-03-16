'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useStorefrontClient, Image } from '@vanij/storefront-sdk/react';

export default function CollectionsPage() {
  const client = useStorefrontClient();

  const { data: collections, isLoading, error } = useQuery({
    queryKey: ['vanij', 'collections'],
    queryFn: () => client.collections.list(),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Collections</h1>
        <p className="mt-2 text-sm text-gray-500">Browse our curated collections.</p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-gray-100 overflow-hidden">
              <div className="aspect-[3/2] bg-gray-100" />
              <div className="p-6 space-y-3">
                <div className="h-5 bg-gray-100 rounded w-1/2" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">Failed to load collections. Please try again later.</p>
        </div>
      )}

      {/* Empty */}
      {collections && collections.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-gray-500">No collections found.</p>
        </div>
      )}

      {/* Collections Grid */}
      {collections && collections.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.handle}`}
              className="group block rounded-xl border border-gray-100 bg-white overflow-hidden
                hover:shadow-lg hover:border-gray-200 transition-all duration-200"
            >
              {/* Image */}
              <div className="aspect-[3/2] bg-gray-50 overflow-hidden">
                {collection.image ? (
                  <Image
                    data={collection.image}
                    width={600}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <span className="text-4xl font-bold text-gray-300">
                      {collection.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                  {collection.title}
                </h2>
                {collection.description && (
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{collection.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
