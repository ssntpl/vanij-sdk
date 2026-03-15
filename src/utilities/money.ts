/**
 * Format a monetary amount for display.
 *
 * @param amountInCents - The amount in the smallest currency unit (e.g., cents for USD, paise for INR)
 * @param currency - ISO 4217 currency code (default: "USD")
 * @param locale - BCP 47 locale string (default: browser/runtime default)
 * @returns Formatted currency string (e.g., "$12.99", "12,99 EUR")
 *
 * @example
 * ```ts
 * formatMoney(1299);              // "$12.99"
 * formatMoney(1299, 'EUR', 'de'); // "12,99 EUR"
 * formatMoney(50000, 'INR');      // "500.00 INR"
 * ```
 */
export function formatMoney(
  amountInCents: number,
  currency: string = 'USD',
  locale?: string,
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amountInCents / 100);
}
