import type { Metadata } from "next";
import { CountdownEmbed } from "./countdown-embed";

/**
 * Public embeddable GTA 6 countdown, served for the iframe code the
 * countdown-widget tool hands out (e.g. ?size=medium).
 * Deliberately bare: no site shell, noindex so embeds never pollute search.
 */
export const metadata: Metadata = {
  title: "GTA 6 Countdown",
  robots: { index: false, follow: false },
};

export default async function EmbedCountdownPage({
  searchParams,
}: {
  searchParams: Promise<{ size?: string }>;
}) {
  const params = await searchParams;
  const size = params.size === "small" || params.size === "large" ? params.size : "medium";
  return (
    <main className="h-screen w-screen overflow-hidden">
      <CountdownEmbed size={size} />
    </main>
  );
}
