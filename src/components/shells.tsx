import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

/** Marketing site chrome: sticky navbar + full footer. */
export function SiteShell({
  children,
  footerVariant,
}: {
  children: React.ReactNode;
  footerVariant?: "news";
}) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer variant={footerVariant} />
    </>
  );
}

export const AppShell = SiteShell;
