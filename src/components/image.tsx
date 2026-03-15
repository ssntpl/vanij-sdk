import React from 'react';
import { buildImageUrl } from '../utilities/image-url';

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
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
 * Builds optimized image URLs using Vanij's image transform parameters.
 *
 * @example
 * ```tsx
 * <Image
 *   src="https://cdn.vanij.in/img/shoe.jpg"
 *   alt="Running shoe"
 *   width={400}
 *   height={300}
 *   widths={[200, 400, 800]}
 * />
 * ```
 */
export function Image({
  src,
  alt,
  width,
  height,
  crop,
  widths,
  ...props
}: ImageProps) {
  const mainSrc = buildImageUrl(src, { width, height, crop });

  const srcSet = widths
    ?.map((w) => {
      const url = buildImageUrl(src, {
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
      alt={alt}
      width={width}
      height={height}
      srcSet={srcSet}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
}
