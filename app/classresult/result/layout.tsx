import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function ClassResultResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
