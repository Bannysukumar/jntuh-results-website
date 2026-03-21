"use client";

import ToolPageEditorial from "@/components/content/ToolPageEditorial";
import Footer from "@/components/footer/footer";
import Form from "@/components/forms/resulthtnoform";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const CreditChecker = () => {
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
    router.push("/creditchecker/result?htno=" + hallticketno);
    setTimeout(() => {
      setIsCooldown(false);
      toast.dismiss();
    }, 5000);
  };

  return (
    <>
      <Form
        title="Credits Checker"
        hallticketno={hallticketno}
        sethallticketno={sethallticketno}
        onSubmit={onSubmit}
        isDisabled={isCooldown}
      />
      <ToolPageEditorial
        heading="How the Credits Checker Helps JNTUH Students"
        paragraphs={[
          "JNTUH programmes require you to earn a minimum number of credits across core, elective, and other categories to move to the next year or to graduate. The Credits Checker reads your academic record and summarises earned credits against what is typically needed, so you can see at a glance whether you are on track.",
          "Enter your 10-digit hall ticket number above to generate your report. The tool is useful when you are planning electives, clearing backlogs, or checking eligibility before placements and higher studies. Regulations (R18, R22, etc.) can differ in credit rules—always confirm final requirements with your college handbook or examination branch.",
          "Data is fetched when you request it and is not permanently stored on our servers. This portal is for guidance only; the university’s official records remain the final authority.",
        ]}
      />
      <Footer />
    </>
  );
};

export default CreditChecker;
