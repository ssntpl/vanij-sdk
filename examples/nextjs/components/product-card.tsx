import Link from 'next/link';
import type { Product } from '@vanij/storefront-sdk';
import { formatMoney } from '@vanij/storefront-sdk';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.featuredImage?.url;
  const price = product.price ? parseFloat(product.price) * 100 : null;
  const compareAtPrice = product.compareAtPrice ? parseFloat(product.compareAtPrice) * 100 : null;
  const currency = product.currencyCode || 'USD';

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-xl border border-gray-100 bg-white overflow-hidden
        hover:shadow-lg hover:border-gray-200 transition-all duration-200"
    >
      {/* Image */}
      <div className="aspect-square bg-gray-50 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.featuredImage?.altText || product.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          {price !== null && (
            <span className="text-sm font-semibold text-gray-900">
              {formatMoney(price, currency)}
            </span>
          )}
          {compareAtPrice !== null && compareAtPrice > (price ?? 0) && (
            <span className="text-xs text-gray-400 line-through">
              {formatMoney(compareAtPrice, currency)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
