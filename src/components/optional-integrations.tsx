"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
const KEY = "taish-optional-consent";
function useConsent() {
  const [choice, setChoice] = useState<string>("declined");
  useEffect(() => {
    const update = () => {
      try {
        setChoice(localStorage.getItem(KEY) || "declined");
      } catch {
        setChoice("declined");
      }
    };
    update();
    window.addEventListener("taish:privacy", update);
    return () => window.removeEventListener("taish:privacy", update);
  }, []);
  return choice;
}
export function OptionalIntegrations({
  domain,
  adSenseId,
}: {
  domain?: string;
  adSenseId?: string;
}) {
  const choice = useConsent();
  const path = usePathname();
  const privatePage =
    /^\/(admin|api|dashboard|login|signup|auth|unsubscribe|reset-password|forgot-password)(\/|$)/.test(
      path || "",
    );
  useEffect(() => {
    if (choice !== "granted" || privatePage || !domain || window.plausible)
      return;
    const queue: unknown[][] = [];
    const stub = (
      name: string,
      options: { props: Record<string, string | number> },
    ) => {
      queue.push([name, options]);
    };
    window.plausible = Object.assign(stub, { q: queue });
  }, [choice, privatePage, domain]);
  if (choice !== "granted" || privatePage) return null;
  return (
    <>
      {domain && (
        <Script
          id="taish-plausible"
          strategy="afterInteractive"
          data-domain={domain}
          src="https://plausible.io/js/script.js"
          onReady={() => {
            window.dispatchEvent(new Event("taish:analytics-ready"));
          }}
        />
      )}
      {adSenseId && /^ca-pub-\d+$/.test(adSenseId) && (
        <Script
          id="taish-adsense"
          strategy="afterInteractive"
          src={
            "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
            encodeURIComponent(adSenseId)
          }
          crossOrigin="anonymous"
        />
      )}
    </>
  );
}
export function PrivacyControls() {
  const choice = useConsent();
  const change = (value: string) => {
    try {
      localStorage.setItem(KEY, value);
      window.dispatchEvent(new Event("taish:privacy"));
      window.location.reload();
    } catch {}
  };
  return (
    <section
      className="rounded-xl border border-border bg-card p-5 space-y-4"
      aria-labelledby="privacy-controls-title"
    >
      <h2 id="privacy-controls-title" className="text-2xl font-bold">
        Optional service choices
      </h2>
      <p>
        Optional analytics and advertising are currently{" "}
        {choice === "granted" ? "allowed" : "off"} in this browser. Choosing
        Allow permits configured Plausible and Google AdSense scripts to load on
        public pages. Required storage and security requests continue.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => change("declined")}
          className="min-h-11 rounded-xl border border-border px-4 font-semibold"
        >
          Keep optional services off
        </button>
        <button
          type="button"
          onClick={() => change("granted")}
          className="min-h-11 rounded-xl border border-border px-4 font-semibold"
        >
          Allow optional services
        </button>
      </div>
      <p className="text-sm text-muted-foreground">
        Changing this choice reloads the page. It does not delete cookies or
        data already held by third parties; browser settings provide those
        controls.
      </p>
    </section>
  );
}
