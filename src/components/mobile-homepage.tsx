import Link from "next/link";
import { ArrowRight, Car, Crosshair, Users, Wrench } from "lucide-react";
import { SafeImage } from "@/components/safe-image";
import { YouTubeLite } from "@/components/youtube-lite";
import { NewsletterForm } from "@/components/newsletter-form";
import { HOME_TRAILERS } from "@/lib/home-content";
import type { Article, Character } from "@/lib/data";
import { toIsoDate } from "@/lib/utils";

const QUICK = [
  { label: "Vehicles", href: "/vehicles", icon: Car },
  { label: "Weapons", href: "/weapons", icon: Crosshair },
  { label: "Characters", href: "/characters", icon: Users },
  { label: "Tools", href: "/tools", icon: Wrench },
];
function Heading({
  id,
  title,
  href,
  label,
}: {
  id: string;
  title: string;
  href: string;
  label: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2
        id={id}
        className="font-display text-lg font-extrabold text-foreground"
      >
        {title}
      </h2>
      <Link
        href={href}
        className="inline-flex min-h-11 shrink-0 items-center gap-1 text-xs font-semibold text-foreground underline underline-offset-4"
      >
        {label}
        <ArrowRight className="h-3 w-3" aria-hidden="true" />
      </Link>
    </div>
  );
}
export function MobileHomepage({
  articles,
  characters,
  sections,
}: {
  articles: Article[];
  characters: Character[];
  sections: string[];
}) {
  const show = (section: string) => sections.includes(section);
  const ranks = ["jason", "lucia", "cal", "brian-heder"];
  const cast = [...characters]
    .sort((a, b) => {
      const x = ranks.indexOf(a.id),
        y = ranks.indexOf(b.id);
      return (x < 0 ? 99 : x) - (y < 0 ? 99 : y);
    })
    .slice(0, 4);
  return (
    <div
      className="container-site space-y-6 pb-7 pt-5 sm:hidden"
      data-mobile-home
    >
      <nav
        aria-label="Explore Taish Gaming"
        className="grid grid-cols-2 gap-2.5"
      >
        {QUICK.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="card-surface flex min-h-[64px] min-w-0 items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <item.icon
              className="h-5 w-5 shrink-0 text-current"
              aria-hidden="true"
            />
            <span>{item.label}</span>
            <ArrowRight
              className="ml-auto h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />
          </Link>
        ))}
      </nav>
      {show("news") && articles.length > 0 && (
        <section aria-labelledby="mobile-news-heading">
          <Heading
            id="mobile-news-heading"
            title="Latest news"
            href="/news"
            label="All articles"
          />
          <div className="card-surface divide-y divide-border rounded-2xl px-4">
            {articles.slice(0, 3).map((article) => (
              <Link
                key={article.slug || article.title}
                href={article.slug ? "/news/" + article.slug : "/news"}
                className="flex min-w-0 items-center gap-3 py-4"
              >
                <div className="relative h-[70px] w-[88px] shrink-0 overflow-hidden rounded-lg">
                  <SafeImage
                    src={article.img}
                    alt={article.title || "GTA 6 news article"}
                    fill
                    sizes="88px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground">
                    {article.title}
                  </h3>
                  <time
                    dateTime={toIsoDate(article.date)}
                    className="mt-2 block text-xs text-muted-foreground"
                  >
                    {article.date}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      {show("trailers") && (
        <section aria-labelledby="mobile-trailer-heading">
          <Heading
            id="mobile-trailer-heading"
            title="Latest trailers"
            href="/news"
            label="Coverage"
          />
          <div className="space-y-4">
            {HOME_TRAILERS.map((trailer) => (
              <figure
                key={trailer.id}
                className="card-surface overflow-hidden rounded-2xl"
              >
                <YouTubeLite
                  videoId={trailer.id}
                  title={"GTA 6 " + trailer.title}
                />
                <figcaption className="px-4 py-3 text-sm font-bold">
                  {trailer.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
      {show("characters") && cast.length > 0 && (
        <section aria-labelledby="mobile-cast-heading">
          <Heading
            id="mobile-cast-heading"
            title="Meet the cast"
            href="/characters"
            label="All profiles"
          />
          <ul
            aria-label="Character profiles"
            className="flex snap-x gap-3 overflow-x-auto pb-3"
          >
            {cast.map((character) => (
              <li key={character.id} className="w-[126px] shrink-0 snap-start">
                <Link
                  href={"/characters/" + character.id}
                  className="card-surface block overflow-hidden rounded-xl"
                >
                  <div className="relative h-[150px]">
                    <SafeImage
                      src={character.img}
                      alt={character.name || "GTA 6 character"}
                      fill
                      sizes="126px"
                      className="object-cover object-top"
                    />
                  </div>
                  <p className="truncate px-3 py-3 text-xs font-bold">
                    {character.name}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      {show("community") && (
        <section
          aria-labelledby="mobile-updates-heading"
          className="card-surface rounded-2xl p-5"
        >
          <h2
            id="mobile-updates-heading"
            className="font-display text-lg font-bold"
          >
            Get site updates
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            GTA VI news and updates to our fan tools.
          </p>
          <NewsletterForm />
          <p className="mt-3 text-xs text-muted-foreground">
            Signing up stores your email.{" "}
            <Link className="underline" href="/privacy">
              Privacy policy
            </Link>
          </p>
        </section>
      )}
    </div>
  );
}
