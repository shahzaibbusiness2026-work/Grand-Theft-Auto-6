import Link from "next/link";
import { Home, Map as MapIcon, Car, Newspaper, Headphones, Search, ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/shells";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeImage } from "@/components/theme-image";

const links = [
  { icon: Home, title: "Go Home", desc: "Return to the homepage", href: "/" },
  { icon: MapIcon, title: "Explore Map", desc: "Browse the world of GTA 6", href: "/map" },
  { icon: Car, title: "All Vehicles", desc: "Check out all vehicles", href: "/vehicles" },
  { icon: Newspaper, title: "Latest News", desc: "Stay updated with latest articles", href: "/news" },
];

export default function NotFound() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden" aria-labelledby="not-found-title">
        <ThemeImage
          dark="/img/hero-dark.jpg"
          light="/img/hero-dark.jpg"
          alt=""
          role="presentation"
          className="absolute inset-0 h-full w-full object-cover opacity-60 brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/55 via-background/70 to-background" />
        <div className="container-site relative flex flex-col items-center pt-16 text-center">
          <p
            className="font-display text-[110px] font-extrabold leading-none tracking-widest text-transparent sm:text-[160px]"
            style={{ WebkitTextStroke: "3px #0ea5e9", textShadow: "0 0 40px rgba(14,165,233,.5)" }}
            aria-hidden="true"
          >
            404
          </p>
          <h1 id="not-found-title" className="mt-2 font-display text-3xl font-extrabold">
            Page Not Found
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Looks like you&apos;ve taken a wrong turn in Vice City.
            <br />
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <form action="/news" method="GET" className="mt-8 flex w-full max-w-lg gap-2" role="search" aria-label="Search Atlas">
            <label htmlFor="search-404" className="sr-only">
              Search Atlas
            </label>
            <Input
              id="search-404"
              name="q"
              placeholder="Search vehicles, weapons, missions..."
              className="h-12"
            />
            <Button size="lg" type="submit" className="shrink-0">
              Search <Search className="h-4 w-4" aria-hidden="true" />
            </Button>
          </form>

          <h2 className="mt-14 font-display text-lg font-bold">Helpful Links</h2>
          <div className="mt-6 grid w-full grid-cols-1 gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-4">
            {links.map((l) => (
              <Link
                key={l.title}
                href={l.href}
                className="card-surface flex flex-col items-center gap-3 px-4 py-7 text-center transition-colors hover:border-accent/60"
              >
                <span className="icon-tile h-12 w-12 rounded-full border border-accent/50 bg-accent/10 text-accent">
                  <l.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-display text-sm font-bold">{l.title}</span>
                <span className="text-[13px] text-muted-foreground">{l.desc}</span>
              </Link>
            ))}
          </div>

          <div className="card-surface mb-16 mt-8 flex w-full flex-col items-center justify-between gap-5 p-6 md:flex-row">
            <div className="flex items-center gap-4">
              <span className="icon-tile h-14 w-14 rounded-full border border-primary/50 bg-primary/10 text-primary">
                <Headphones className="h-6 w-6" aria-hidden="true" />
              </span>
              <div className="text-left">
                <h3 className="font-display text-base font-bold">Still Need Help?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Can&apos;t find what you&apos;re looking for? Our community and guides can help.
                </p>
              </div>
            </div>
            <Link href="/contact">
              <Button variant="outline" className="shrink-0">
                Contact Support <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
