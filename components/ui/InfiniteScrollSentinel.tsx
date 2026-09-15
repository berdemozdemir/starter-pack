'use client';

import { useEffect, useRef } from 'react';

export function InfiniteScrollSentinel(props: {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasNextPage = props.hasNextPage;
  const isFetchingNextPage = props.isFetchingNextPage;
  const fetchNextPage = props.fetchNextPage;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        if (isFetchingNextPage) return;
        fetchNextPage();
      },
      { root: null, rootMargin: '200px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (!hasNextPage) return null;

  return (
    <div ref={sentinelRef} className="flex justify-center py-4">
      {props.isFetchingNextPage && (
        <p className="text-muted-foreground text-sm">Loading more…</p>
      )}
    </div>
  );
}
