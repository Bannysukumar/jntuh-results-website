import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hard Refresh Cache | Admin",
  description: "Clear Redis cache for results and force fresh data fetch",
};

export default function AdminHardRefreshLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

