"use client";

import ToolPageEditorial from "@/components/content/ToolPageEditorial";
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
      <ToolPageEditorial
        heading="Grace Marks Proof — What This Page Shows"
        paragraphs={[
          "After grace marks are applied (where applicable), students sometimes need a clear record of how marks were adjusted. The Grace Marks Proof view summarises proof-related details tied to your hall ticket when the upstream system returns that information.",
          "Use your 10-digit hall ticket number to fetch the report. If no proof data appears, your result may not yet include grace adjustments, or the semester may not be covered yet—check again after full result publication.",
          "Keep a copy of your official grade card from JNTUH for placements and higher studies. This portal is an independent helper and does not replace university-issued documents.",
        ]}
        note="Official proof and corrections are issued by JNTUH; use this page only as a supplementary reference."
      />
      <Footer />
    </>
  );
};

export default GraceMarksProof;

