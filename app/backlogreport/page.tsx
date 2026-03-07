"use client";

import { useState } from "react";
import Form from "@/components/forms/resulthtnoform";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer/footer";

const BacklogReport = () => {
  const [hallticketno, sethallticketno] = useState("");
  const [isCooldown, setIsCooldown] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit = async () => {
    if (isCooldown) return;
    if (hallticketno.length < 10) {
      toast.error("The Hallticket should be of 10 digits");
      return;
    }
    setIsCooldown(true);
    router.push("/backlogreport/result?htno=" + hallticketno);
    setTimeout(() => setIsCooldown(false), 5000);
  };
  return (
    <>
      <Form
        onSubmit={onSubmit}
        title="Backlog Report"
        hallticketno={hallticketno}
        sethallticketno={sethallticketno}
        isDisabled={isCooldown}
      />
      {/* Informational content for AdSense and user value */}
      <section className="max-w-2xl mx-auto px-4 pb-12 mt-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Understanding Your JNTUH Backlog Report
          </h2>
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <p className="leading-relaxed">
              The Backlog Report lists all subjects you have not yet passed across your semesters at JNTUH. Enter your 10-digit hall ticket number above to see a clear, semester-wise breakdown of pending subjects. This helps you plan which supply exams to appear for and stay on track for graduation.
            </p>
            <p className="leading-relaxed">
              Results are fetched from official JNTUH sources. For official records and mark sheets, always refer to the documents issued by Jawaharlal Nehru Technological University, Hyderabad.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
export default BacklogReport;
