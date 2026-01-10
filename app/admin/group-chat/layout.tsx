import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Group Chat Management",
  description: "Manage group chat users and messages",
  robots: {
    index: false,
    follow: false,
  },
};

export default function GroupChatAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

