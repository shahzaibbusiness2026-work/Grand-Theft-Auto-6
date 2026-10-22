import Link from "next/link";
import { SiteShell } from "@/components/shells";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTA 6 Controls — PS5 & Xbox Button Layout — Tahzaib Gaming",
  description: "Full GTA 6 controls reference for PlayStation 5 and Xbox Series X|S: on foot, driving, flying, swimming and combat. Based on GTA 5's layout, confirmed at launch.",
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

export default function ControlsPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">Reference</p>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground mt-2">Controls</h1>
          <p className="text-foreground/70 mt-3">Rockstar has not published GTA 6&apos;s official control map yet. This reference follows GTA 5&apos;s layout — the scheme Rockstar has kept consistent for a decade — and will be corrected against the real in-game layout at launch.</p>
        </div>
        <div className="grid gap-4">
          <Table title="On Foot" rows={[
            { action: "Move", ps5: "Left Stick", xbox: "Left Stick" },
            { action: "Look / Aim", ps5: "Right Stick", xbox: "Right Stick" },
            { action: "Sprint", ps5: "X (tap repeatedly)", xbox: "A (tap repeatedly)" },
            { action: "Jump / Climb", ps5: "Square", xbox: "X" },
            { action: "Aim weapon", ps5: "L2", xbox: "LT" },
            { action: "Shoot", ps5: "R2", xbox: "RT" },
            { action: "Reload", ps5: "Circle", xbox: "B" },
            { action: "Weapon wheel", ps5: "L1 (hold)", xbox: "LB (hold)" },
            { action: "Take cover", ps5: "R1", xbox: "RB" },
            { action: "Interact / Enter vehicle", ps5: "Triangle", xbox: "Y" },
          ]} />
          <Table title="Driving" rows={[
            { action: "Accelerate", ps5: "R2", xbox: "RT" },
            { action: "Brake / Reverse", ps5: "L2", xbox: "LT" },
            { action: "Steer", ps5: "Left Stick", xbox: "Left Stick" },
            { action: "Handbrake", ps5: "R1", xbox: "RB" },
            { action: "Look behind", ps5: "R3", xbox: "Right Stick press" },
            { action: "Headlights", ps5: "Right D-Pad", xbox: "Right D-Pad" },
            { action: "Radio next station", ps5: "Left D-Pad", xbox: "Left D-Pad" },
            { action: "Exit vehicle", ps5: "Triangle", xbox: "Y" },
          ]} />
          <Table title="Flying & Swimming" rows={[
            { action: "Plane pitch / climb", ps5: "Left Stick", xbox: "Left Stick" },
            { action: "Plane throttle", ps5: "R2 / L2", xbox: "RT / LT" },
            { action: "Helicopter ascend / descend", ps5: "R2 / L2", xbox: "RT / LT" },
            { action: "Swim", ps5: "X (tap)", xbox: "A (tap)" },
            { action: "Dive underwater", ps5: "R1", xbox: "RB" },
            { action: "Surface", ps5: "Circle", xbox: "B" },
          ]} />
          <Table title="Combat" rows={[
            { action: "Melee attack", ps5: "Circle", xbox: "B" },
            { action: "Dodge / roll", ps5: "Square", xbox: "X" },
            { action: "Switch weapon", ps5: "L1 / D-Pad", xbox: "LB / D-Pad" },
            { action: "Throw explosive", ps5: "L2 + R2", xbox: "LT + RT" },
            { action: "Character switch (story)", ps5: "Down D-Pad (hold)", xbox: "Down D-Pad (hold)" },
          ]} />
        </div>
        <p className="text-sm text-foreground/60 mt-8">Pair this with the <Link href="/settings-guide" className="text-primary font-bold underline">settings guide</Link> for sensitivity and aim-assist recommendations, and the <Link href="/weapons" className="text-primary font-bold underline">weapons database</Link> for what each gun does.</p>
      </div>
    </SiteShell>
  );
}
