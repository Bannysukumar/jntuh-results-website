import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Health | Admin",
  description: "Monitor system health and service status",
};

export default function AdminHealthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

