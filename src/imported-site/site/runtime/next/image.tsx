import React from "react";
import { Img, staticFile } from "remotion";

export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height" | "alt"> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  unoptimized?: boolean;
}

function resolveSrc(src: string) {
  if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) {
    return src;
  }

  return staticFile(src.replace(/^\//, ""));
}

export default function Image({
  src,
  alt,
  width,
  height,
  fill,
  priority: _priority,
  sizes: _sizes,
  unoptimized: _unoptimized,
  className,
  style,
  ...props
}: ImageProps) {
  void _priority;
  void _sizes;
  void _unoptimized;
  const resolvedSrc = resolveSrc(src);
  const mergedStyle = fill
    ? {
        position: "absolute" as const,
        inset: 0,
        width: "100%",
        height: "100%",
        ...style,
      }
    : {
        width,
        height,
        ...style,
      };

  return (
    <Img
      src={resolvedSrc}
      alt={alt}
      className={className}
      style={mergedStyle}
      {...props}
    />
  );
}
