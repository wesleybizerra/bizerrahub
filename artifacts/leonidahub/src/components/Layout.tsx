import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AdminToggle } from "./AdminToggle";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B0B14] flex flex-col font-sans selection:bg-primary selection:text-white">
      <Navbar />
      <main className="flex-1 w-full relative">
        {children}
      </main>
      <Footer />
      <AdminToggle />
    </div>
  );
}
