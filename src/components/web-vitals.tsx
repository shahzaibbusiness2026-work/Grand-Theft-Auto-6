"use client";
import { useCallback, useEffect, useRef } from "react";
import { useReportWebVitals } from "next/web-vitals";
type Props = Record<string, string | number>;
declare global {
  interface Window {
    plausible?: (name: string, options: { props: Props }) => void;
  }
}
export function WebVitals() {
  const pending = useRef(new Map<string, Props>());
  const ready = useRef(false);
  const flush = useCallback(() => {
    if (!ready.current || !window.plausible) return;
    for (const [key, props] of pending.current) {
      window.plausible("Web Vitals", { props });
      pending.current.delete(key);
    }
  }, []);
  useEffect(() => {
    const onReady = () => {
      ready.current = true;
      flush();
    };
    window.addEventListener("taish:analytics-ready", onReady);
    return () => window.removeEventListener("taish:analytics-ready", onReady);
  }, [flush]);
  useReportWebVitals((metric) => {
    const path = window.location.pathname;
    if (
      /^\/(admin|api|dashboard|login|signup|reset-password|unsubscribe|auth)(\/|$)/.test(
        path,
      )
    )
      return;
    const route = path.replace(
      /\/(news|guides|vehicles|weapons|characters|locations)\/[^/]+/,
      "/$1/[slug]",
    );
    const props = {
      metric: metric.name,
      value: Math.round(metric.value * 1000) / 1000,
      rating: metric.rating,
      route,
    };
    // Memory-only measurements stay on this device until an opted-in provider is ready.
    pending.current.set(metric.name, props);
    window.dispatchEvent(new CustomEvent("taish:web-vital", { detail: props }));
    flush();
  });
  return null;
}
