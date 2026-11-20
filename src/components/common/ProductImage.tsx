import React, { useState, useEffect } from 'react';

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
}

const FALLBACK_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
  <rect width="400" height="300" fill="#FAF7F0"/>
  <circle cx="200" cy="145" r="76" fill="#EAE0C8"/>
  <path d="M200 84C178 106 174 136 200 166C226 136 222 106 200 84Z" fill="#2F6B3F"/>
  <path d="M162 152C176 146 192 154 200 176C174 176 162 164 162 152Z" fill="#F29B38"/>
  <path d="M238 152C224 146 208 154 200 176C226 176 238 164 238 152Z" fill="#F29B38"/>
  <text x="200" y="252" text-anchor="middle" fill="#2F6B3F" font-family="sans-serif" font-weight="700" font-size="18">Milletly Baked Crunch</text>
</svg>
`)}`;

export const ProductImage: React.FC<ProductImageProps> = ({ src, alt, className = '' }) => {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_SVG);

  useEffect(() => {
    setImgSrc(src || FALLBACK_SVG);
  }, [src]);

  return (
    <img
      src={imgSrc || FALLBACK_SVG}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => {
        if (imgSrc !== FALLBACK_SVG) {
          setImgSrc(FALLBACK_SVG);
        }
      }}
      className={className}
    />
  );
};
