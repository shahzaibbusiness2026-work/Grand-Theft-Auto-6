import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "@/lib/auth/assert-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  decryptGoogleRefreshToken,
  googleOAuthConfig,
  SEARCH_CONSOLE_CREDENTIAL_KEY,
} from "@/lib/search-console/credentials";

export const dynamic = "force-dynamic";

type SearchAnalyticsRow = {
  keys?: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function GET(request: NextRequest) {
  try {
    await assertAdmin();
  } catch {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const config = googleOAuthConfig();
  if (config.missing.length) {
    return NextResponse.json({ success: false, connected: false, missingConfig: config.missing }, { status: 503 });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", SEARCH_CONSOLE_CREDENTIAL_KEY)
      .maybeSingle();
    if (error) throw error;
    if (!data?.value || typeof data.value !== "string") {
      return NextResponse.json({ success: false, connected: false, needsAuthorization: true }, { status: 200 });
    }

    const refreshToken = decryptGoogleRefreshToken(data.value);
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: config.clientId!,
        client_secret: config.clientSecret!,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
      cache: "no-store",
    });
    if (!tokenResponse.ok) {
      return NextResponse.json({ success: false, connected: false, needsAuthorization: true, error: "Google authorization expired or was revoked." }, { status: 200 });
    }
    const tokenData = await tokenResponse.json() as { access_token: string };

    const rawDays = Number(request.nextUrl.searchParams.get("days") || 28);
    const days = [7, 28, 90].includes(rawDays) ? rawDays : 28;
    const end = new Date();
    end.setUTCDate(end.getUTCDate() - 3); // Search Console data for the most recent days may still be processing.
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - days + 1);

    async function query(dimensions: string[]): Promise<SearchAnalyticsRow[]> {
      const response = await fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(config.property!)}/searchAnalytics/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ startDate: isoDate(start), endDate: isoDate(end), dimensions, rowLimit: 100 }),
          cache: "no-store",
        },
      );
      if (!response.ok) throw new Error("Search Console query failed.");
      const result = await response.json() as { rows?: SearchAnalyticsRow[] };
      return result.rows || [];
    }

    const [daily, pages, queries] = await Promise.all([
      query(["date"]),
      query(["page"]),
      query(["query"]),
    ]);
    const clicks = daily.reduce((sum, row) => sum + row.clicks, 0);
    const impressions = daily.reduce((sum, row) => sum + row.impressions, 0);
    const weightedPosition = daily.reduce((sum, row) => sum + row.position * row.impressions, 0);

    return NextResponse.json({
      success: true,
      connected: true,
      property: config.property,
      range: { days, startDate: isoDate(start), endDate: isoDate(end) },
      summary: {
        clicks,
        impressions,
        ctr: impressions ? clicks / impressions : 0,
        averagePosition: impressions ? weightedPosition / impressions : 0,
      },
      daily: daily.map((row) => ({ date: row.keys?.[0] || "", clicks: row.clicks, impressions: row.impressions })),
      pages: pages.slice(0, 25).map((row) => ({ page: row.keys?.[0] || "", clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position })),
      queries: queries.slice(0, 25).map((row) => ({ query: row.keys?.[0] || "", clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position })),
      fetchedAt: new Date().toISOString(),
    }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
  } catch {
    return NextResponse.json({ success: false, connected: false, error: "Could not load Search Console data. Check the Google property and server configuration." }, { status: 502 });
  }
}
