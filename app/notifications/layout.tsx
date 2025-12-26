import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mana JNTUH Results | NOTIFICATIONS",
  description: "Check out notifications with in a go.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
