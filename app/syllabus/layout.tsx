import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mana JNTUH Results | SYLLABUS",
  description: "Get Syllabus with in a go.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
