"use client";

import { useState, useEffect } from "react";

const cache = new Map<string, { data: unknown; promise: Promise<unknown> | null; timestamp: number }>();
const TTL = 10 * 60 * 1000;

export async function fetchWithCache<T>(url: string): Promise<T> {
  const cached = cache.get(url);
  if (cached?.data && Date.now() - cached.timestamp < TTL) {
    return cached.data as T;
  }
  if (cached?.promise) {
    return cached.promise as Promise<T>;
  }
  const promise = fetch(url).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });
  cache.set(url, { data: null, promise, timestamp: Date.now() });
  try {
    const data = await promise;
    cache.set(url, { data, promise: null, timestamp: Date.now() });
    return data as T;
  } catch (e) {
    cache.delete(url);
    throw e;
  }
}

export function clearCache(url?: string) {
  if (url) cache.delete(url);
  else cache.clear();
}

export function useCachedFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchWithCache<T>(url)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)));
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}
