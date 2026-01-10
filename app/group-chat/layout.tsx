import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mana JNTUH Results | Group Chat",
  description: "Connect with fellow students through real-time group chatting.",
};

export default function GroupChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

