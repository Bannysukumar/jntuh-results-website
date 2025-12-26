import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mana JNTUH Results | FAQ",
  description: "Frequently Asked questions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
