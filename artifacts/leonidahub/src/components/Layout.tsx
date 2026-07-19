import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AdminToggle } from "./AdminToggle";
import { GamificationWidget } from "./GamificationWidget";
import { useGamification } from "@/contexts/GamificationContext";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { registerPageVisit } = useGamification();

  useEffect(() => {
    registerPageVisit(location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div className="min-h-screen bg-[#0B0B14] flex flex-col font-sans selection:bg-primary selection:text-white">
      <Navbar />
      <main className="flex-1 w-full relative">
        {children}
      </main>
      <Footer />
      <AdminToggle />
      <GamificationWidget />
    </div>
  );
}
