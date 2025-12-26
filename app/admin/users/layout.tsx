import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Users | Mana JNTUH Results",
  description: "Admin user management",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminUsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

