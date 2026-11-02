import type { Metadata } from "next";
import { AccountLinkForm } from "./link-form";
export const metadata: Metadata = {
  title: "Confirm account request",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export default async function AccountLinkPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; purpose?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="min-h-screen bg-[#070b14] px-4 py-16 text-slate-100">
      <div className="player-panel mx-auto max-w-md">
        <AccountLinkForm
          token={params.token || ""}
          purpose={params.purpose === "reset" ? "reset" : "verify"}
        />
      </div>
    </div>
  );
}
