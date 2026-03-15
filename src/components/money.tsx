import React from 'react';
import { formatMoney } from '../utilities/money';

export interface MoneyProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Amount in the smallest currency unit (cents, paise, etc.) */
  amount: number;
  /** ISO 4217 currency code (default: "USD") */
  currency?: string;
  /** BCP 47 locale string for formatting */
  locale?: string;
}

/**
 * Render a formatted price using `Intl.NumberFormat`.
 *
 * @example
 * ```tsx
 * <Money amount={1299} />                    // $12.99
 * <Money amount={1299} currency="EUR" />     // 12,99 EUR
 * <Money amount={50000} currency="INR" />    // 500.00 INR
 * ```
 */
export function Money({ amount, currency = 'USD', locale, ...props }: MoneyProps) {
  const formatted = formatMoney(amount, currency, locale);
  return <span {...props}>{formatted}</span>;
}
