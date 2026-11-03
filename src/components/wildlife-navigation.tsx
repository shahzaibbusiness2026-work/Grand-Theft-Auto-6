import Link from "next/link";
const links = [
  ["/gta-6-world/animals-wildlife", "All wildlife"],
  ["/gta-6-world/birds", "Birds"],
  ["/gta-6-world/mammals", "Mammals"],
  ["/gta-6-world/marine-life", "Marine life"],
];
export function WildlifeNavigation({ active }: { active?: string }) {
  return (
    <nav aria-label="Wildlife sections" className="flex flex-wrap gap-2">
      {links.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          aria-current={active === href ? "page" : undefined}
          className={
            active === href
              ? "inline-flex min-h-11 items-center rounded-full border border-emerald-300 bg-emerald-300 px-4 text-sm font-bold text-slate-950"
              : "inline-flex min-h-11 items-center rounded-full border border-white/30 bg-black/40 px-4 text-sm font-semibold text-white hover:bg-white/10"
          }
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
