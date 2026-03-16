import React from 'react';
import type { MoneyV2 } from '../types';

export interface MoneyProps extends React.HTMLAttributes<HTMLElement> {
  /** MoneyV2 data object containing amount and currencyCode */
  data: MoneyV2;
  /** Remove trailing zeros (e.g., "$12" instead of "$12.00") */
  withoutTrailingZeros?: boolean;
  /** Format as plain number without currency symbol */
  withoutCurrency?: boolean;
}

/**
 * Render a formatted price from a MoneyV2 object.
 *
 * Matches the Shopify Hydrogen `<Money>` component API.
 *
 * @example
 * ```tsx
 * <Money data={{ amount: "12.99", currencyCode: "USD" }} />
 * // renders: <span>$12.99</span>
 *
 * <Money data={product.priceRange.minVariantPrice} as="p" />
 * // renders: <p>$29.99</p>
 *
 * <Money data={price} withoutTrailingZeros />
 * // renders: <span>$12</span> (for $12.00)
 * ```
 */
export function Money({
  data,
  withoutTrailingZeros,
  withoutCurrency,
  ...props
}: MoneyProps) {
  const { amount, currencyCode } = data;

  const formatted = new Intl.NumberFormat(undefined, {
    style: withoutCurrency ? 'decimal' : 'currency',
    currency: withoutCurrency ? undefined : currencyCode,
    minimumFractionDigits: withoutTrailingZeros ? 0 : undefined,
    maximumFractionDigits: withoutTrailingZeros ? 0 : undefined,
  }).format(parseFloat(amount));

  return <span {...props}>{formatted}</span>;
}
