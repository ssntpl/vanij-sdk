import React from 'react';
import { buildImageUrl } from '../utilities/image-url';
import type { Image as ImageType } from '../types';

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  /** Image data object with url and altText fields, or a plain URL string */
  data?: ImageType | null;
  /** Fallback: direct image URL (used if `data` is not provided) */
  src?: string;
  /** Fallback: alt text (used if `data` is not provided or has no altText) */
  alt?: string;
  /** Desired display width */
  width?: number;
  /** Desired display height */
  height?: number;
  /** Whether to crop the image to fit dimensions */
  crop?: boolean;
  /** Widths for responsive srcSet generation */
  widths?: number[];
}

/**
 * Responsive image component with automatic srcSet generation.
 *
 * Accepts either a `data` prop (Image object with `url` and `altText`)
 * or traditional `src`/`alt` props for backward compatibility.
 *
 * @example
 * ```tsx
 * // Using Image data object (preferred)
 * <Image data={product.featuredImage} width={400} />
 *
 * // Using src/alt directly
 * <Image src="https://cdn.vanij.in/img/shoe.jpg" alt="Shoe" width={400} />
 * ```
 */
export function Image({
  data,
  src: srcProp,
  alt: altProp,
  width,
  height,
  crop,
  widths,
  ...props
}: ImageProps) {
  const resolvedSrc = data?.url ?? srcProp ?? '';
  const resolvedAlt = data?.altText ?? altProp ?? '';

  if (!resolvedSrc) return null;

  const mainSrc = buildImageUrl(resolvedSrc, { width, height, crop });

  const srcSet = widths
    ?.map((w) => {
      const url = buildImageUrl(resolvedSrc, {
        width: w,
        height: height ? Math.round((w / (width || w)) * height) : undefined,
        crop,
      });
      return `${url} ${w}w`;
    })
    .join(', ');

  return (
    <img
      src={mainSrc}
      alt={resolvedAlt}
      width={width ?? data?.width ?? undefined}
      height={height ?? data?.height ?? undefined}
      srcSet={srcSet}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
}
