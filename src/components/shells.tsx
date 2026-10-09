import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

/** Marketing site chrome: sticky navbar + full footer + skip-to-content link. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Skip to main content — keyboard & screen reader users only */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}

export const AppShell = SiteShell;
