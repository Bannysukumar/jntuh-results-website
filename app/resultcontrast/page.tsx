"use client";

import Form from "@/components/forms/resulthtnoform";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer/footer";

const ResultContrast = () => {
  const router = useRouter();
  const [hallticketno, sethallticketno] = useState("");
  const [hallticketno2, sethallticketno2] = useState("");
  const [isCooldown, setIsCooldown] = useState<boolean>(false);
  const onSubmit = async () => {
    if (isCooldown) return;
    if (hallticketno.length < 10 || hallticketno2.length < 10) {
      toast.error("The Hallticket should be of 10 digits");
      return;
    }
    setIsCooldown(true);
    router.push(
      "/resultcontrast/result?htno=" + hallticketno + "&htno2=" + hallticketno2
    );
    setTimeout(() => {
      setIsCooldown(false);
      toast.dismiss();
    }, 5000);
  };

  return (
    <>
      <Form
        title="Result Contrast"
        hallticketno={hallticketno}
        sethallticketno={sethallticketno}
        hallticketno2={hallticketno2}
        sethallticketno2={sethallticketno2}
        onSubmit={onSubmit}
        isDisabled={isCooldown}
      />
      <Footer />
    </>
  );
};
export default ResultContrast;
