'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useProduct, Image } from '@vanij/storefront-sdk/react';
import { ProductForm } from '@/components/product-form';

export default function ProductDetailPage() {
  const params = useParams<{ handle: string }>();
  const { data: product, isLoading, error } = useProduct(params.handle);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square rounded-xl bg-gray-100" />
          <div className="space-y-6">
            <div className="h-8 bg-gray-100 rounded w-2/3" />
            <div className="h-6 bg-gray-100 rounded w-1/4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-5/6" />
              <div className="h-4 bg-gray-100 rounded w-4/6" />
            </div>
            <div className="h-12 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">Failed to load product. It may not exist or the server is unreachable.</p>
          <Link href="/products" className="mt-4 inline-block text-sm font-medium text-red-700 underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images || [];
  const currentImage = images[selectedImageIndex] || null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-gray-700 transition-colors">
          Products
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          {/* Main Image */}
          <div className="aspect-square rounded-xl bg-gray-50 overflow-hidden">
            {currentImage ? (
              <Image
                data={currentImage}
                width={800}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-300">
                <svg className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={0.5}
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImageIndex(i)}
                  className={`flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden border-2 transition-colors
                    ${i === selectedImageIndex ? 'border-gray-900' : 'border-transparent hover:border-gray-300'}`}
                >
                  {img.url ? (
                    <Image
                      data={img}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-100" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

          {product.description && (
            <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>
          )}

          <div className="mt-8">
            <ProductForm product={product} />
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
