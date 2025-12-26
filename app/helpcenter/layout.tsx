import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mana JNTUH Results | HelpCenter",
  description: "Check out academic result with in a go.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
