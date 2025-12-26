import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Mana JNTUH Results",
  description: "Admin login page for Mana JNTUH Results",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

