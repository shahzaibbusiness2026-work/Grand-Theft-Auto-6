import { getSiteSettings } from "@/lib/services/queries";

import { Radio, ChevronRight } from "lucide-react";
import Link from "next/link";

export async function AnnouncementBanner() {
  const settings = await getSiteSettings();

  if (!settings.announcementBanner || settings.announcementBanner.trim() === "") {
    return null;
  }

  return (
    <div className="relative z-50 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 py-1.5 px-4 text-center text-xs font-bold shadow-md">
      <div className="container-site flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950" />
        </span>
        <span className="truncate">{settings.announcementBanner}</span>
        <Link
          href="/news"
          className="inline-flex items-center gap-0.5 text-[11px] underline font-extrabold hover:text-white transition-colors ml-1"
        >
          <span>Learn More</span>
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
