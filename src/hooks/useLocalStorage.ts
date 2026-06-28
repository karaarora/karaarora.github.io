"use client";

import { useState, useEffect } from "react";

/**
 * useState that persists to localStorage.
 * SSR-safe: starts with defaultValue on both server and first client render,
 * then syncs from localStorage after hydration to avoid mismatches.
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);

  // After mount, pull the stored value (if any)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {}
  }, [key]);

  const setStored = (next: T) => {
    setValue(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {}
  };

  return [value, setStored] as const;
}
