import ExamcodeClient from "./ExamcodeClient";

// For static export compatibility, use client component
// Metadata will be handled by the layout or default metadata
export const metadata = {
  title: "Mana JNTUH Results | Notifications",
  description: "Check out JNTUH notifications in one place.",
};

export default function ExamcodePage() {
  return <ExamcodeClient />;
}
