'use client';

import { useCallback, useRef } from 'react';

export function useInfiniteScroll(callback: () => void, options?: { threshold?: number }) {
  const { threshold = 200 } = options || {};
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();

      if (!node) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            callback();
          }
        },
        { rootMargin: `${threshold}px` },
      );

      observerRef.current.observe(node);
    },
    [callback, threshold],
  );

  return sentinelRef;
}
