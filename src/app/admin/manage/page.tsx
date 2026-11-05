import Link from "next/link";
import { ADMIN_NAV_SECTIONS } from "@/lib/admin-navigation";

export default function AdminManagementPage() {
  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">All admin tools</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
          Open any content editor, account tool or site setting here. The full navigation is also available from the menu on mobile.
        </p>
      </div>
      <div className="grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {ADMIN_NAV_SECTIONS.map(section => (
          <section key={section.title} aria-label={section.title} className="min-w-0 rounded-2xl border border-[#243048] bg-[#111622] p-4">
            <h2 className="mb-3 text-base font-semibold text-white">{section.title}</h2>
            <ul className="space-y-1">
              {section.items.filter(item => item.href !== "/admin/manage").map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-[#202b40] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500">
                    <item.icon className="h-4 w-4 shrink-0 text-pink-700 dark:text-pink-300" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <section className="rounded-2xl border border-[#243048] bg-[#111622] p-5">
        <h2 className="font-semibold text-white">Where website changes are managed</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          Articles, guides, game records, radio, map markers, media and site settings use the editors above. Region dossiers, wildlife and world reference pages, legal policies and application layouts currently use reviewed source files and require a code deployment. They do not have a CMS editor yet.
        </p>
        <Link href="/site-map" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-pink-700 dark:text-pink-300 underline underline-offset-4">Browse all public website sections</Link>
      </section>
    </div>
  );
}
