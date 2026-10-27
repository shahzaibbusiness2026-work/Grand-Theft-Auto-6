export const dynamic = "force-dynamic";
const MAX_BYTES = 16384;
export async function POST(request: Request) {
  // Reports are untrusted. Bound the body, strip paths/query strings and never
  // echo blocked content, cookies or script samples into logs.
  const reader = request.body?.getReader();
  if (!reader) return new Response(null, { status: 204 });
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > MAX_BYTES) {
        await reader.cancel();
        return new Response(null, { status: 413 });
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    const report = JSON.parse(new TextDecoder().decode(bytes))["csp-report"];
    if (report && typeof report === "object") {
      const directive = String(report["effective-directive"] || "")
        .replace(/[^a-z-]/g, "")
        .slice(0, 60);
      let origin = "inline-or-unknown";
      try {
        origin = new URL(String(report["blocked-uri"])).origin;
      } catch {}
      console.warn(
        "csp-report",
        JSON.stringify({ directive, origin: origin.slice(0, 200) }),
      );
    }
  } catch {
    /* Malformed reports never fail the page or become reflected text. */
  }
  return new Response(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
}
