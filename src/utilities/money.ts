import type { MoneyV2 } from '../types';

/**
 * Format a MoneyV2 value for display using `Intl.NumberFormat`.
 *
 * @param money - A MoneyV2 object with amount (string) and currencyCode
 * @param locale - BCP 47 locale string (default: browser/runtime default)
 * @returns Formatted currency string (e.g., "$12.99", "12,99 EUR")
 *
 * @example
 * ```ts
 * formatMoney({ amount: "12.99", currencyCode: "USD" });  // "$12.99"
 * formatMoney({ amount: "12.99", currencyCode: "EUR" }, 'de-DE');  // "12,99 €"
 * formatMoney({ amount: "500.00", currencyCode: "INR" });  // "₹500.00"
 * ```
 */
export function formatMoney(money: MoneyV2, locale?: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: money.currencyCode,
  }).format(parseFloat(money.amount));
}
