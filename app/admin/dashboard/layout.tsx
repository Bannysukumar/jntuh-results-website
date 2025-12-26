import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Mana JNTUH Results",
  description: "Admin dashboard for Mana JNTUH Results",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

