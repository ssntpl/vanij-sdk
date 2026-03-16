'use client';

import { useState, useMemo } from 'react';
import type { Product, ProductVariant, ProductOption } from '@vanij/storefront-sdk';
import { Money, AddToCartButton } from '@vanij/storefront-sdk/react';

interface ProductFormProps {
  product: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const options = product.options || [];
  const variants = product.variants || [];

  // Initialize selected options from the first variant
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    if (variants.length > 0) {
      const initial: Record<string, string> = {};
      for (const opt of variants[0].selectedOptions) {
        initial[opt.name] = opt.value;
      }
      return initial;
    }
    const initial: Record<string, string> = {};
    for (const option of options) {
      if (option.values.length > 0) {
        initial[option.name] = option.values[0];
      }
    }
    return initial;
  });

  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Find the variant matching the selected options
  const selectedVariant = useMemo((): ProductVariant | undefined => {
    if (variants.length === 0) return undefined;
    return variants.find((v) =>
      options.every((opt) =>
        v.selectedOptions.some(
          (so) => so.name === opt.name && so.value === selectedOptions[opt.name],
        ),
      ),
    );
  }, [variants, options, selectedOptions]);

  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice;
  const compareAtPrice = selectedVariant?.compareAtPrice ?? null;
  const hasDiscount =
    compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  const handleSuccess = () => {
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Price */}
      <div className="flex items-baseline gap-3">
        <Money
          data={price}
          className="text-2xl font-bold text-gray-900"
        />
        {hasDiscount && (
          <Money
            data={compareAtPrice}
            className="text-lg text-gray-400 line-through"
          />
        )}
      </div>

      {/* Variant Options */}
      {options.map((option) => (
        <OptionSelector
          key={option.id}
          option={option}
          selectedValue={selectedOptions[option.name]}
          onChange={(value) => handleOptionChange(option.name, value)}
        />
      ))}

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
        <div className="inline-flex items-center rounded-lg border border-gray-200">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            aria-label="Decrease quantity"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="min-w-[3rem] text-center text-sm font-medium text-gray-900 tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            aria-label="Increase quantity"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Add to Cart */}
      {selectedVariant ? (
        <AddToCartButton
          variantId={selectedVariant.id}
          quantity={quantity}
          onSuccess={handleSuccess}
          onError={(err) => alert(err.message)}
          loadingContent={
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Adding...
            </span>
          }
          className="w-full rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white
            hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {addedFeedback ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Added to Cart!
            </span>
          ) : (
            'Add to Cart'
          )}
        </AddToCartButton>
      ) : (
        <button
          disabled
          className="w-full rounded-lg bg-gray-200 px-6 py-3 text-sm font-semibold text-gray-500 cursor-not-allowed"
        >
          {variants.length > 0 ? 'Unavailable' : 'Add to Cart'}
        </button>
      )}
    </div>
  );
}

// ─── Option Selector ─────────────────────────────────────────────────

function OptionSelector({
  option,
  selectedValue,
  onChange,
}: {
  option: ProductOption;
  selectedValue: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {option.name}
      </label>
      <div className="flex flex-wrap gap-2">
        {option.values.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all
              ${
                selectedValue === value
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
              }`}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}
