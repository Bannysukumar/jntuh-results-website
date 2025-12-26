import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Settings | Mana JNTUH Results",
  description: "Admin settings management",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

