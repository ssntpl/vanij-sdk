'use client';

import Link from 'next/link';
import { useCart, Money } from '@vanij/storefront-sdk/react';

export default function CartPage() {
  const { cart, isLoading, updateItem, removeItem, clear, totalQuantity } = useCart();

  const lines = cart?.lines || [];

  if (lines.length === 0 && !isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={0.5}
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="mt-2 text-gray-500">Looks like you haven&apos;t added anything yet.</p>
          <Link
            href="/products"
            className="mt-8 inline-block rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white
              hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
      <p className="mt-2 text-sm text-gray-500">
        {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
      </p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cart Lines */}
        <div className="lg:col-span-8 divide-y divide-gray-100">
          {lines.map((line) => (
            <div key={line.id} className="flex gap-6 py-6 first:pt-0">
              {/* Placeholder image */}
              <div className="h-24 w-24 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300">
                {line.merchandise.image ? (
                  <img
                    src={line.merchandise.image.url}
                    alt={line.merchandise.image.altText ?? ''}
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={0.5}
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                    />
                  </svg>
                )}
              </div>

              {/* Line Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {line.merchandise.product.title || `Product #${line.merchandise.id.slice(0, 8)}`}
                    </h3>
                    {line.merchandise.title && (
                      <p className="mt-1 text-xs text-gray-500">{line.merchandise.title}</p>
                    )}
                    {line.merchandise.selectedOptions.length > 0 && (
                      <p className="mt-1 text-xs text-gray-500">
                        {line.merchandise.selectedOptions.map((o) => `${o.name}: ${o.value}`).join(', ')}
                      </p>
                    )}
                    <div className="mt-1">
                      <Money
                        data={line.cost.amountPerQuantity}
                        className="text-sm text-gray-500"
                      />
                      <span className="text-sm text-gray-400"> each</span>
                    </div>
                  </div>
                  <Money
                    data={line.cost.totalAmount}
                    className="text-sm font-semibold text-gray-900"
                  />
                </div>

                {/* Quantity Controls */}
                <div className="mt-4 flex items-center gap-4">
                  <div className="inline-flex items-center rounded-lg border border-gray-200">
                    <button
                      type="button"
                      onClick={() => updateItem(line.id, Math.max(1, line.quantity - 1))}
                      disabled={isLoading || line.quantity <= 1}
                      className="px-2.5 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50
                        disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="min-w-[2.5rem] text-center text-sm font-medium text-gray-900 tabular-nums">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateItem(line.id, line.quantity + 1)}
                      disabled={isLoading}
                      className="px-2.5 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50
                        disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label="Increase quantity"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(line.id)}
                    disabled={isLoading}
                    className="text-xs text-red-500 hover:text-red-700 disabled:opacity-40 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>

            {cart?.cost && (
              <dl className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    <Money data={cart.cost.subtotalAmount} />
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Shipping</dt>
                  <dd className="text-sm text-gray-500">Calculated at checkout</dd>
                </div>
                {cart.cost.totalTaxAmount && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Tax</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      <Money data={cart.cost.totalTaxAmount} />
                    </dd>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <dt className="text-base font-semibold text-gray-900">Total</dt>
                  <dd className="text-base font-semibold text-gray-900">
                    <Money data={cart.cost.totalAmount} />
                  </dd>
                </div>
              </dl>
            )}

            <button
              type="button"
              className="mt-6 w-full rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white
                hover:bg-gray-800 transition-colors"
              onClick={() => alert('Checkout is not implemented in this example.')}
            >
              Proceed to Checkout
            </button>

            <div className="mt-4 flex items-center justify-between">
              <Link
                href="/products"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                &larr; Continue Shopping
              </Link>
              <button
                type="button"
                onClick={() => clear()}
                disabled={isLoading}
                className="text-xs text-gray-400 hover:text-red-500 disabled:opacity-40 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
