import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mana JNTUH Results | ACADEMIC RESULT",
  description:
    "Find your JNTUH academic results quickly and effortlessly. Easy access, comprehensive information, all in one place",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
