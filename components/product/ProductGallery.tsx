'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: { url: string; alt: string }[];
  thumbnail?: string;
  title: string;
}

export function ProductGallery({ images, thumbnail, title }: ProductGalleryProps) {
  const allImages = images.length > 0 ? images : (thumbnail ? [{ url: thumbnail, alt: title }] : []);
  const [selected, setSelected] = useState(0);

  if (allImages.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg bg-muted">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/50">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m3 16 4-4 3 3 5-5 6 6"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <Image
          src={allImages[selected]?.url || allImages[0].url}
          alt={allImages[selected]?.alt || title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={cn(
                'relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-colors',
                i === selected ? 'border-primary' : 'border-transparent hover:border-muted-foreground/30',
              )}
            >
              <Image src={img.url} alt={img.alt || `${title} ${i + 1}`} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
