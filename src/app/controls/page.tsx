import Link from "next/link";
import { SiteShell } from "@/components/shells";
import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/page-metadata";

export const metadata: Metadata = {
  openGraph: pageOpenGraph("/controls"),
  title: "GTA 6 PS5 & Xbox Controls (Provisional)",
  description: "Full PS5 and Xbox control tables for GTA 6, provisional from GTA V. Rockstar has not published the official GTA VI layout.",
  alternates: { canonical: "/controls" },
};

type Row = { action: string; ps5: string; xbox: string };
function Table({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <section className="rounded-xl border border-white/10 bg-black/20 p-5 sm:p-6">
      <h2 className="font-bold text-xl mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-foreground/60 border-b border-white/10">
              <th className="py-2 pr-4 font-bold">Action</th>
              <th className="py-2 pr-4 font-bold">PS5</th>
              <th className="py-2 font-bold">Xbox</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.action} className="border-b border-white/5">
                <td className="py-2.5 pr-4 font-semibold">{r.action}</td>
                <td className="py-2.5 pr-4 font-mono text-primary">{r.ps5}</td>
                <td className="py-2.5 font-mono text-primary">{r.xbox}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-5 sm:p-6">
      <h3 className="font-bold">{q}</h3>
      <p className="text-sm text-foreground/70 mt-2">{a}</p>
    </div>
  );
}

export default function ControlsPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">Reference</p>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground mt-2">Controls</h1>
          <p className="text-foreground/70 mt-3">Rockstar has not published GTA 6&apos;s official control layout. This reference follows GTA 5&apos;s default layout — the scheme Rockstar has kept consistent for a decade — and will be corrected against the real in-game layout at launch, from PS5 play on 19 November 2026. Anything GTA VI has actually shown is labelled as shown; everything else is the GTA V layout, provisionally.</p>
        </div>

        <section className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-5 sm:p-6 mb-4">
          <h2 className="font-bold text-xl mb-3">What GTA VI has actually shown</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
            <li><strong className="text-foreground">Character switching is shown.</strong> Trailer 2 switches between Lucia and Jason mid-mission. The button to switch is not confirmed — the GTA V method (hold Down D-Pad) is our provisional guess.</li>
            <li><strong className="text-foreground">The weapon wheel is shown</strong> in the trailers. Its exact layout is unconfirmed.</li>
            <li><strong className="text-foreground">The phone is shown</strong> throughout the trailers, with social-media apps. The button to open it is unconfirmed.</li>
            <li><strong className="text-foreground">First-person mode is not confirmed</strong> for GTA VI. Neither are special abilities for Lucia or Jason.</li>
          </ul>
        </section>

        <div className="grid gap-4">
          <Table title="General & Menus" rows={[
            { action: "Pause menu", ps5: "Options", xbox: "Menu" },
            { action: "Change camera (cycles to first-person in GTA V)", ps5: "Touchpad (press)", xbox: "View (press)" },
            { action: "Interaction menu (GTA Online)", ps5: "Touchpad (hold)", xbox: "View (hold)" },
            { action: "Open map", ps5: "Options, then Map", xbox: "Menu, then Map" },
          ]} />
          <Table title="On Foot" rows={[
            { action: "Move", ps5: "Left Stick", xbox: "Left Stick" },
            { action: "Look / camera", ps5: "Right Stick", xbox: "Right Stick" },
            { action: "Sprint", ps5: "X (tap repeatedly, or hold — depends on Sprint Mode)", xbox: "A (tap repeatedly, or hold)" },
            { action: "Jump / Climb", ps5: "Square", xbox: "X" },
            { action: "Stealth mode", ps5: "L3 (press left stick)", xbox: "Left Stick (press)" },
            { action: "Look behind", ps5: "R3 (press right stick)", xbox: "Right Stick (press)" },
            { action: "Enter / exit vehicle", ps5: "Triangle", xbox: "Y" },
            { action: "Take cover", ps5: "R1", xbox: "RB" },
            { action: "Contextual interaction (talk, pick up, open doors)", ps5: "D-Pad Right", xbox: "D-Pad Right" },
          ]} />
          <Table title="Combat" rows={[
            { action: "Aim weapon", ps5: "L2", xbox: "LT" },
            { action: "Fire weapon", ps5: "R2", xbox: "RT" },
            { action: "Reload", ps5: "Circle", xbox: "B" },
            { action: "Melee attack (close to a target)", ps5: "Circle", xbox: "B" },
            { action: "Dodge / combat roll (while aiming)", ps5: "Square", xbox: "X" },
            { action: "Weapon wheel", ps5: "L1 (hold)", xbox: "LB (hold)" },
            { action: "Quick weapon cycle", ps5: "L1 (tap)", xbox: "LB (tap)" },
            { action: "Switch weapon within a category (wheel open)", ps5: "D-Pad Left / Right", xbox: "D-Pad Left / Right" },
            { action: "Throw equipped explosive", ps5: "R2 (with a throwable equipped)", xbox: "RT" },
            { action: "Throw explosive while aiming a gun", ps5: "D-Pad Left", xbox: "D-Pad Left" },
            { action: "Weapon flashlight (while aiming)", ps5: "D-Pad Right", xbox: "D-Pad Right" },
            { action: "Sniper scope zoom in / out (while aiming)", ps5: "D-Pad Up / Down", xbox: "D-Pad Up / Down" },
            { action: "Drop weapon / drop ammo (wheel open)", ps5: "Triangle / Square", xbox: "Y / X" },
            { action: "Special ability — GTA V protagonists only", ps5: "L3 + R3", xbox: "Left Stick + Right Stick (press)" },
          ]} />
          <p className="text-sm text-foreground/60 -mt-1">Lucia and Jason&apos;s abilities, if any, are unconfirmed — the special-ability row is GTA V only.</p>
          <Table title="Driving" rows={[
            { action: "Steer", ps5: "Left Stick", xbox: "Left Stick" },
            { action: "Accelerate", ps5: "R2", xbox: "RT" },
            { action: "Brake / Reverse", ps5: "L2", xbox: "LT" },
            { action: "Handbrake", ps5: "R1", xbox: "RB" },
            { action: "Horn", ps5: "L3 (press left stick)", xbox: "Left Stick (press)" },
            { action: "Look behind", ps5: "R3 (hold)", xbox: "Right Stick (press, hold)" },
            { action: "Change camera", ps5: "R3 (tap)", xbox: "Right Stick (press, tap)" },
            { action: "Duck inside vehicle", ps5: "X", xbox: "A" },
            { action: "Headlights", ps5: "D-Pad Right", xbox: "D-Pad Right" },
            { action: "Radio — next / previous station", ps5: "D-Pad Left / Right (tap)", xbox: "D-Pad Left / Right (tap)" },
            { action: "Radio wheel", ps5: "D-Pad Left (hold)", xbox: "D-Pad Left (hold)" },
            { action: "Cinematic camera (while driving)", ps5: "Circle", xbox: "B" },
            { action: "Phone", ps5: "D-Pad Up", xbox: "D-Pad Up" },
            { action: "Exit vehicle", ps5: "Triangle", xbox: "Y" },
          ]} />
          <Table title="Drive-By & Vehicle Weapons" rows={[
            { action: "Aim drive-by weapon", ps5: "L1", xbox: "LB" },
            { action: "Fire drive-by weapon", ps5: "R1", xbox: "RB" },
            { action: "Fire mounted vehicle weapon", ps5: "X", xbox: "A" },
            { action: "Switch vehicle weapon", ps5: "Square", xbox: "X" },
            { action: "Aim mounted weapon", ps5: "Right Stick", xbox: "Right Stick" },
            { action: "Drop mine / secondary weapon", ps5: "D-Pad Right", xbox: "D-Pad Right" },
            { action: "Vehicle boost (where equipped)", ps5: "L3", xbox: "Left Stick (press)" },
          ]} />
          <Table title="Motorcycles & Bicycles" rows={[
            { action: "Lean forward / back (wheelie)", ps5: "Left Stick Up / Down", xbox: "Left Stick Up / Down" },
            { action: "Bicycle sprint", ps5: "X (tap repeatedly)", xbox: "A (tap repeatedly)" },
            { action: "Bicycle jump", ps5: "R1", xbox: "RB" },
          ]} />
          <p className="text-sm text-foreground/60 -mt-1">All other motorcycle inputs match the driving table.</p>
          <Table title="Flying — Planes" rows={[
            { action: "Throttle up / down", ps5: "R2 / L2", xbox: "RT / LT" },
            { action: "Pitch & roll", ps5: "Left Stick", xbox: "Left Stick" },
            { action: "Yaw left / right", ps5: "L1 / R1", xbox: "LB / RB" },
            { action: "Landing gear", ps5: "D-Pad Right", xbox: "D-Pad Right" },
            { action: "Fire aircraft weapon", ps5: "X", xbox: "A" },
            { action: "Next aircraft weapon", ps5: "Square", xbox: "X" },
            { action: "Change camera / look behind", ps5: "R3", xbox: "Right Stick (press)" },
            { action: "Exit aircraft", ps5: "Triangle", xbox: "Y" },
          ]} />
          <Table title="Flying — Helicopters" rows={[
            { action: "Ascend / descend", ps5: "R2 / L2", xbox: "RT / LT" },
            { action: "Pitch & roll", ps5: "Left Stick", xbox: "Left Stick" },
            { action: "Yaw left / right", ps5: "L1 / R1", xbox: "LB / RB" },
            { action: "Fire weapon", ps5: "X", xbox: "A" },
            { action: "Switch weapon", ps5: "Square", xbox: "X" },
            { action: "Exit helicopter", ps5: "Triangle", xbox: "Y" },
          ]} />
          <Table title="Swimming & Diving" rows={[
            { action: "Swim (direction)", ps5: "Left Stick", xbox: "Left Stick" },
            { action: "Swim faster", ps5: "X (tap repeatedly)", xbox: "A (tap repeatedly)" },
            { action: "Ascend / surface", ps5: "Left Stick Up, or X", xbox: "Left Stick Up, or A" },
            { action: "Descend / dive", ps5: "Left Stick Down", xbox: "Left Stick Down" },
          ]} />
          <Table title="Parachute" rows={[
            { action: "Deploy parachute", ps5: "X", xbox: "A" },
            { action: "Steer", ps5: "Left Stick", xbox: "Left Stick" },
            { action: "Sharp turn left / right", ps5: "L1 / R1", xbox: "LB / RB" },
            { action: "Precision landing brake", ps5: "L1 + R1", xbox: "LB + RB" },
            { action: "Detach parachute", ps5: "Triangle", xbox: "Y" },
            { action: "Smoke trail", ps5: "X", xbox: "A" },
          ]} />
          <Table title="Phone" rows={[
            { action: "Open phone", ps5: "D-Pad Up", xbox: "D-Pad Up" },
            { action: "Navigate phone", ps5: "D-Pad", xbox: "D-Pad" },
            { action: "Select", ps5: "X", xbox: "A" },
            { action: "Back / hang up", ps5: "Circle", xbox: "B" },
            { action: "Answer call", ps5: "X", xbox: "A" },
            { action: "Decline call", ps5: "Circle", xbox: "B" },
          ]} />
        </div>

        <section className="mt-8">
          <h2 className="font-bold text-xl mb-3">How to change controls</h2>
          <p className="text-sm text-foreground/70">Pause the game and open <strong className="text-foreground">Settings → Controls</strong>. On PS5 and Xbox you can change targeting mode, sprint behaviour (tap vs hold), aiming sensitivity, vibration, adaptive trigger strength (PS5 DualSense) and aircraft control type. Consoles do not offer full button-by-button remapping — for that, use your console&apos;s accessibility controller remapping.</p>
        </section>

        <section className="mt-8">
          <h2 className="font-bold text-xl mb-4">Frequently asked questions</h2>
          <div className="grid gap-4">
            <Faq q="Is this the official GTA 6 control layout?" a="No. Rockstar has not published one. This is GTA 5's default layout, which Rockstar has kept consistent for a decade. It will be corrected against the real in-game layout from PS5 play at launch on 19 November 2026." />
            <Faq q="How do you switch between Lucia and Jason?" a="Switching is shown in Trailer 2, mid-mission — but the button is not confirmed. The GTA V method, holding Down on the D-Pad and picking with the right stick, is the provisional guess." />
            <Faq q="Does GTA 6 have first-person mode?" a="Not confirmed. GTA 5 added first-person on PS4, Xbox One and PC; Rockstar has said nothing about it for GTA VI." />
            <Faq q="Can I remap controls on PS5 or Xbox?" a="Only through presets and settings (targeting mode, sprint mode, sensitivity, adaptive triggers). Full button-by-button remapping needs the console's accessibility controller settings." />
            <Faq q="Will this page change at launch?" a="Yes. Every mapping will be checked against the real game on PS5 from 19 November and corrected where Rockstar changed it." />
          </div>
        </section>

        <p className="text-sm text-foreground/60 mt-8">Pair this with the <Link href="/settings-guide" className="text-primary font-bold underline">settings guide</Link> for sensitivity and aim-assist recommendations, the <Link href="/weapons" className="text-primary font-bold underline">weapons database</Link> for what each gun does, and the <Link href="/tools/wanted-level-guide" className="text-primary font-bold underline">wanted-level guide</Link> for escaping the police once the shooting starts.</p>
      </div>
    </SiteShell>
  );
}
