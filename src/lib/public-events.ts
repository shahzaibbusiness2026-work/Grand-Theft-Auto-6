/** Public interaction counts only; never send search text, notes or saved IDs. */
export function trackPublicEvent(
  name: string,
  props: Record<string, string | number> = {},
) {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem("taish-optional-consent") !== "granted") return;
    if (
      /^\/(admin|api|dashboard|auth|login|unsubscribe)(\/|$)/.test(
        window.location.pathname,
      )
    )
      return;
    window.plausible?.(name, { props });
  } catch {
    // Analytics must never prevent a public interaction.
  }
}
