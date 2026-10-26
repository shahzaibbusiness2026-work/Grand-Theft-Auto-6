import Link from "next/link";
import { SiteShell } from "@/components/shells";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTA 6 Easter Eggs & Hidden Details",
  description: "Every GTA 6 Easter egg spotted so far: the Tommy Vercetti lizard, the Ocean View Hotel, Red Dead presidents on the cash, and the details fans are still hunting.",
  alternates: { canonical: "/easter-eggs" },
};

type Egg = { title: string; desc: string; status: "Confirmed in trailer" | "Community find" | "Speculation"; source: string };

const EGGS: Egg[] = [
  { title: "The Tommy Vercetti Lizard", desc: "At 0:33 in Trailer 2, a painting on a store wall shows a lizard wearing a blue floral Hawaiian shirt — the shirt Tommy wears on the original Vice City box art. It hid in plain sight for over a year before GameVerse spotted it in June 2026.", status: "Community find", source: "Trailer 2, 0:33" },
  { title: "\"Why Did Tommy Disappear?\" Billboard", desc: "A billboard in the trailers asks where the Vice City protagonist went — a direct nod to Tommy, not a promise of a cameo. Ray Liotta passed away in 2022, and Rockstar's universe policy keeps 3D protagonists from crossing over. Expect winks, not returns.", status: "Community find", source: "Trailer breakdowns" },
  { title: "Jason's Floral Shirt at the Ocean View Hotel", desc: "Jason wears a faded blue floral shirt outside the Ocean View Hotel — the same hotel Tommy used as a safehouse in 2002. The hotel itself returns, renovated for the modern era.", status: "Confirmed in trailer", source: "Trailer 2" },
  { title: "The Trunk Scene, Mirrored", desc: "Jason and Lucia retrieving weapons from a car trunk mirrors Tommy and Lance Vance doing exactly the same thing in Vice City. Same posture, same ritual, twenty-four years later.", status: "Confirmed in trailer", source: "Trailer 2" },
  { title: "NINE 1 NINE = E11EVEN", desc: "The nightclub in the trailers is unmistakably based on E11EVEN, the real 24/7 mega-club in downtown Miami. Miami locals clocked it instantly.", status: "Confirmed in trailer", source: "Trailer 2" },
  { title: "Phil Cassidy on the TV", desc: "A TV commercial in the trailer appears to show Phil Cassidy — the one-armed weapons dealer from Vice City — now running Ammu-Nation. Reboot, son, or lookalike: pure speculation for now.", status: "Speculation", source: "Trailer 2 TV ad" },
  { title: "Red Dead Presidents on the Cash", desc: "Freeze the money shots and look at the bills: they feature Thaddeus Waxman and Franklin Hardin, the two presidents named in Red Dead Redemption 2's lore.", status: "Community find", source: "Trailer money shots" },
  { title: "The Kalaga Mountain Lion", desc: "A mountain lion prowls Mount Kalaga National Park in the trailers, alongside confirmed flamingos and gators. Whether it's set dressing or something you'll dodge in the backcountry is one of launch's fun unknowns.", status: "Confirmed in trailer", source: "Trailer 2" },
  { title: "The PS5 Beside the TV", desc: "In a Trailer 2 scene showing an Ammu-Nation ad on TV, a PlayStation 5 sits visible beside the screen. Not a coincidence — Sony holds GTA 6's marketing rights, and the console appears as an in-world prop.", status: "Confirmed in trailer", source: "Trailer 2" },
  { title: "The GTA 5 Yacht Resemblance", desc: "One boat in the footage resembles the yacht from GTA 5's \"Daddy's Little Girl\" mission — harder to verify through the reflections, so file it as likely-but-unproven.", status: "Speculation", source: "Trailer footage" },
  { title: "The Beer Has Bubbles", desc: "Carbonation rising in a bottle of beer in Trailer 2 — zero gameplay function, rendered anyway, in footage Rockstar confirmed was captured on a base PS5. The studio's philosophy in a single frame.", status: "Community find", source: "Trailer 2, spotted by @hxrleysivy" },
];

const STATUS_STYLE: Record<Egg["status"], string> = {
  "Confirmed in trailer": "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
  "Community find": "bg-cyan-500/15 text-cyan-400 border-cyan-500/40",
  "Speculation": "bg-amber-500/15 text-amber-400 border-amber-500/40",
};

export default function EasterEggsPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">Hidden Details</p>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground mt-2">Easter Eggs</h1>
          <p className="text-foreground/70 mt-3">The trailers have been watched hundreds of millions of times and fans are still finding things. Every egg below is labelled: confirmed in a trailer, found by the community, or still speculation.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {EGGS.map((egg) => (
            <article key={egg.title} className="rounded-xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-bold text-lg leading-snug">{egg.title}</h2>
                <span className={`shrink-0 text-xs font-black px-2 py-1 rounded-full border ${STATUS_STYLE[egg.status]}`}>{egg.status}</span>
              </div>
              <p className="text-sm text-foreground/70 mt-2 leading-relaxed">{egg.desc}</p>
              <p className="text-xs text-foreground/50 mt-3">Source: {egg.source}</p>
            </article>
          ))}
        </div>
        <p className="text-sm text-foreground/60 mt-8">Want the full story behind these finds? Read the <Link href="/news/gta-6-easter-eggs-hidden-trailer-details" className="text-primary font-bold underline">Easter eggs deep dive</Link> — and check the <Link href="/map" className="text-primary font-bold underline">interactive map</Link> to visit the locations yourself.</p>
      </div>
    </SiteShell>
  );
}
