"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "@/components/navbar/navbar";
import SideMenubar from "@/components/sidemenubar/sidemenubar";
import { SidebarProvider } from "@/customhooks/sidebarhook";
import { NavBarProvider } from "@/customhooks/navbarhook";

const NotificationPopUp = dynamic(
  () => import("@/components/notifications/popup").then((m) => m.default),
  { ssr: false }
);

export default function AdminWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    // Admin routes - no navbar/sidebar
    return <>{children}</>;
  }

  // Regular routes - with navbar/sidebar (layout stays mounted; only children change on navigation)
  return (
    <SidebarProvider>
      <NavBarProvider>
        <Navbar />
        <main className="pt-16">
          <SideMenubar />
          <div className="lg:ml-64">
            <NotificationPopUp />
            {children}
          </div>
        </main>
      </NavBarProvider>
    </SidebarProvider>
  );
}

