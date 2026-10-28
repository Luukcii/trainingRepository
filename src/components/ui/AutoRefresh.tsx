"use client"; // needs the browser: a timer that asks the server for a fresh copy of the page

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Re-renders the server parts of the page every few seconds, while the tab is visible.
export function AutoRefresh({ seconds }: { seconds: number }) {
  const router = useRouter();
  useEffect(() => {
    const timer = setInterval(() => {
      if (!document.hidden) router.refresh();
    }, seconds * 1000);
    return () => clearInterval(timer);
  }, [router, seconds]);
  return null;
}
