import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Excel Result",
  description: "Upload Excel file to view results",
  robots: { index: false, follow: true },
};

export default function ExcelResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
