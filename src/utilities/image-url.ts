export interface ImageUrlOptions {
  /** Desired width in pixels */
  width?: number;
  /** Desired height in pixels */
  height?: number;
  /** Whether to crop the image to fit the dimensions */
  crop?: boolean;
  /** Image format (e.g., 'webp', 'avif', 'jpg', 'png') */
  format?: string;
  /** Image quality (1-100) */
  quality?: number;
}

/**
 * Build a URL for a resized/transformed image.
 *
 * Appends width, height, crop, format, and quality parameters as query strings.
 * Compatible with image CDNs and Vanij's file service.
 *
 * @param src - The original image URL
 * @param options - Transform options
 * @returns The transformed image URL
 *
 * @example
 * ```ts
 * buildImageUrl('https://cdn.vanij.in/img/shoe.jpg', { width: 400, height: 300, crop: true });
 * // => "https://cdn.vanij.in/img/shoe.jpg?w=400&h=300&crop=true"
 * ```
 */
export function buildImageUrl(src: string, options?: ImageUrlOptions): string {
  if (!options) return src;

  const url = new URL(src, 'https://placeholder.local');
  if (options.width) url.searchParams.set('w', String(options.width));
  if (options.height) url.searchParams.set('h', String(options.height));
  if (options.crop) url.searchParams.set('crop', 'true');
  if (options.format) url.searchParams.set('fm', options.format);
  if (options.quality) url.searchParams.set('q', String(options.quality));

  // If the original src was a full URL, return the full URL
  // If it was a relative path, return just the path + query string
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return url.toString();
  }

  return `${url.pathname}${url.search}`;
}
