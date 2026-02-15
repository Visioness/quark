import { useEffect, useRef } from 'react';

export function useInfiniteScrollTop(
  containerRef,
  hasPreviousPage,
  fetchPreviousPage
) {
  const topSentinelRef = useRef(null);

  useEffect(() => {
    if (!hasPreviousPage || !topSentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchPreviousPage();
      },
      { root: containerRef.current, threshold: 0.1 }
    );

    observer.observe(topSentinelRef.current);
    return () => observer.disconnect();
  }, [containerRef, hasPreviousPage, fetchPreviousPage]);

  return topSentinelRef;
}
