"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useMemo, useState } from "react";

interface ImageWithFallbackProps extends Omit<
  ImageProps,
  "src" | "width" | "height" | "alt"
> {
  src: string;
  alt: string;
  width: number;
  height: number;
}

function createFallbackDataUri(width: number, height: number, label: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'>
    <defs>
      <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
        <stop offset='0%' stop-color='#1A1A1A' />
        <stop offset='100%' stop-color='#3A0CA3' />
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)' />
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#F5F5F5' font-size='12' font-family='Montserrat, sans-serif'>${label}</text>
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export default function ImageWithFallback({
  src,
  alt,
  width,
  height,
  onError,
  unoptimized,
  ...props
}: ImageWithFallbackProps) {
  const [resolvedSrc, setResolvedSrc] = useState(src);

  useEffect(() => {
    setResolvedSrc(src);
  }, [src]);

  const fallbackDataUri = useMemo(
    () => createFallbackDataUri(width, height, "Media"),
    [height, width],
  );
  const isDataUri = resolvedSrc.startsWith("data:");

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      width={width}
      height={height}
      unoptimized={Boolean(unoptimized) || isDataUri}
      onError={(event) => {
        onError?.(event);
        setResolvedSrc((current) =>
          current.startsWith("data:") ? current : fallbackDataUri,
        );
      }}
      {...props}
    />
  );
}
