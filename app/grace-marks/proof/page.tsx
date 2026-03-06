"use client";

import { useState } from "react";
import Form from "@/components/forms/resulthtnoform";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer/footer";

const GraceMarksProof = () => {
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
    router.push("/grace-marks/proof/result?htno=" + hallticketno);
    setTimeout(() => setIsCooldown(false), 5000);
  };

  return (
    <>
      <Form
        onSubmit={onSubmit}
        title="Grace Marks Proof"
        hallticketno={hallticketno}
        sethallticketno={sethallticketno}
        isDisabled={isCooldown}
      />
      <Footer />
    </>
  );
};

export default GraceMarksProof;

