"use client";

import Footer from "@/components/footer/footer";
import Form from "@/components/forms/resulthtnoform";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const AcademicAllResult = () => {
  const [hallticketno, sethallticketno] = useState<string>("");
  const [isCooldown, setIsCooldown] = useState<boolean>(false);

  const router = useRouter();

  const onSubmit = async () => {
    if (isCooldown) return;
    if (hallticketno.length < 10) {
      toast.error("The Hallticket should be of 10 digits");
      return;
    }
    setIsCooldown(true);
    router.push("/academicallresult/result?htno=" + hallticketno);
    setTimeout(() => setIsCooldown(false), 5000);
  };

  return (
    <>
      <Form
        title="Academic All Results"
        hallticketno={hallticketno}
        sethallticketno={sethallticketno}
        onSubmit={onSubmit}
        isDisabled={isCooldown}
      />
      {/* Informational content for AdSense and user value */}
      <section className="max-w-2xl mx-auto px-4 pb-12 mt-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            What is Academic All Results?
          </h2>
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <p className="leading-relaxed">
              The Academic All Results tool shows every exam result you have taken at JNTUH in one consolidated view. Instead of checking each semester separately, you enter your hall ticket number once and see all semesters, including regular and supply attempts, in a single page. This makes it easier to track your overall CGPA, identify backlogs, and plan for future exams.
            </p>
            <p className="leading-relaxed">
              Data is fetched directly from official JNTUH servers. We do not store your results on our servers. For official certification, always refer to the mark sheets issued by Jawaharlal Nehru Technological University, Hyderabad.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AcademicAllResult;
