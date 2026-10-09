import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

/** Marketing site chrome: sticky navbar + full footer. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}

export const AppShell = SiteShell;
