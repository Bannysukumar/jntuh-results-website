import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mana JNTUH Results | JOBS & CARRERS",
  description:
    "Discover career opportunities!! Find internships, jobs and kick start your journey!!!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
