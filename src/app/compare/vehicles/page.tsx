import Link from "next/link";
import { SiteShell } from "@/components/shells";
import { EvidenceCatalog } from "@/components/evidence-catalog";
import { getEvidenceCatalog } from "@/lib/services/evidence-catalog";

export const metadata = {
  title: {
    absolute: "GTA 6 Vehicle Comparison Tool | Compare Cars & Evidence",
  },
  description:
    "Compare up to four editorial vehicle identifications with reviewed field-specific evidence. Missing statistics remain unverified.",
  alternates: { canonical: "/compare/vehicles" },
  openGraph: {
    url: "/compare/vehicles",
    title: "GTA 6 Vehicle Comparison Tool | Compare Cars & Evidence",
    description:
      "Compare up to four editorial vehicle identifications with reviewed field-specific evidence. Missing statistics remain unverified.",
    images: ["/img/hero-dark.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GTA 6 Vehicle Comparison Tool | Compare Cars & Evidence",
    description:
      "Compare up to four editorial vehicle identifications with reviewed field-specific evidence. Missing statistics remain unverified.",
    images: ["/img/hero-dark.jpg"],
  },
};

export const revalidate = 3600;

export default async function CompareVehiclesPage() {
  // Live Supabase catalog (admin edits win) + CMS-configured score weights.
  const entries = await getEvidenceCatalog("vehicles");

  return (
    <SiteShell>
      <div className="dark bg-[#070b14]">
        {/* Full-bleed hero, like the reference: edge-to-edge banner, huge title */}
        <section className="relative w-full overflow-hidden">
          <img
            src="/img/hero-vice-skyline-hd.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
          <div className="container-site relative px-4 py-8 sm:px-6 sm:py-20 lg:py-24">
            <nav
              aria-label="Breadcrumb"
              className="mb-4 flex items-center gap-1.5 text-sm font-bold text-white/70"
            >
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span aria-hidden="true">›</span>
              <Link href="/vehicles" className="hover:text-white">
                Vehicles
              </Link>
              <span aria-hidden="true">›</span>
              <span className="text-white">Compare</span>
            </nav>
            <h1 className="font-display text-3xl sm:text-7xl lg:text-8xl font-black leading-none tracking-tight text-white">
              GTA{" "}
              <span className="bg-gradient-to-r from-[#FF2E9A] to-violet-500 bg-clip-text text-transparent">
                6
              </span>{" "}
              Vehicle{" "}
              <span className="bg-gradient-to-r from-[#FF2E9A] to-violet-500 bg-clip-text text-transparent">
                Comparison
              </span>
            </h1>
            <p className="mt-4 max-w-3xl text-base sm:text-lg leading-relaxed text-white/80">
              Select up to four vehicle identifications and inspect their
              reviewed evidence side by side. Unsupported performance figures
              and winners are withheld.
            </p>
          </div>
        </section>
        <div className="container-site py-8">
          <EvidenceCatalog kind="vehicles" entries={entries} compare />
        </div>
      </div>
    </SiteShell>
  );
}
