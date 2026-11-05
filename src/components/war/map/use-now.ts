"use client";
// The current time, refreshed every few seconds, so moving Envoys creep along the map.
// Returns null while the page is first drawn on the server: times only appear once the browser takes over,
// because the server doesn't know the visitor's time zone (showing one would flash the wrong time).
import { useSyncExternalStore } from "react";

let now = 0;

function subscribe(onChange: () => void) {
  now = Date.now();
  onChange();
  const timer = setInterval(() => {
    now = Date.now();
    onChange();
  }, 10_000);
  return () => clearInterval(timer);
}

export function useNow(): number | null {
  return useSyncExternalStore(
    subscribe,
    () => now || null,
    () => null,
  );
}
