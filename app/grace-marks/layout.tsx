import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grace Marks | JNTUH Results",
  description: "Check grace marks eligibility and proof for JNTUH students",
};

export default function GraceMarksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

