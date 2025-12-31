"use client";

import { useSearchParams } from "next/navigation";
import NotificationExamCode from "@/components/notifications/notificationExamCode";

export default function ExamcodeClient() {
  const searchParams = useSearchParams();
  const link = searchParams.get("link") || "";
  const date = searchParams.get("date") || "";
  const formatted_date = searchParams.get("formatted_date") || "";
  const title = searchParams.get("title") || "";

  if (!link || !date || !formatted_date || !title) {
    return <p>Invalid notification link</p>;
  }

  return (
    <NotificationExamCode
      link={link.split("?")[1] || ""}
      date={date}
      formatted_date={formatted_date}
      title={title}
    />
  );
}

