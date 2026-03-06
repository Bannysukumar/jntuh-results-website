"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResultDetails from "@/components/result/details";
import QuickNavigation from "@/components/navbar/quicknavigation";
import { getFromLocalStorage } from "@/components/customfunctions/localStorage";
import CreditsCheckerResult from "@/components/result/creditscheckerresult";
import { fetchCreditsCheckerReport } from "@/components/api/fetchResults";

const CreditCheckerResult = () => {
  const router = useRouter();
  const htno = (useSearchParams().get("htno") || "").trim().toUpperCase();
  const [creditsCheckerReport, setCreditsCheckerReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!htno || htno.length < 10) {
      setLoading(false);
      router.push("/creditchecker");
      return;
    }
    const cached = getFromLocalStorage(htno + "-CreditsCheckerreport");
    if (cached) {
      setCreditsCheckerReport(cached);
      setLoading(false);
      return;
    }
    const abortController = new AbortController();
    let cancelled = false;
    let retried = false;
    const doFetch = async () => {
      setLoading(true);
      try {
        const ok = await fetchCreditsCheckerReport(htno, { signal: abortController.signal });
        if (cancelled || abortController.signal.aborted) return;
        if (ok) {
          const data = getFromLocalStorage(htno + "-CreditsCheckerreport");
          if (data) setCreditsCheckerReport(data);
        } else {
          router.push("/creditchecker");
        }
      } catch (err: any) {
        const isAbort = err?.name === "AbortError" || err?.code === "ERR_CANCELED";
        if (isAbort && !retried && !cancelled && !abortController.signal.aborted) {
          retried = true;
          await doFetch();
        } else if (!isAbort && !cancelled) router.push("/creditchecker");
      } finally {
        if (!cancelled && !abortController.signal.aborted) setLoading(false);
      }
    };
    doFetch();
    return () => {
      cancelled = true;
      abortController.abort();
    };
  }, [htno, router]);

  if (loading) {
    return (
      <div className="m-2 text-[30%] sm:text-[45%] md:text-[60%] lg:text-[100%]">
        <div className="text-center font-bold my-5">Loading...</div>
      </div>
    );
  }
  if (creditsCheckerReport === null) {
    return (
      <div className="m-2 text-[30%] sm:text-[45%] md:text-[60%] lg:text-[100%]">
        <div className="text-center font-bold my-5">Details not found</div>
      </div>
    );
  }
  return (
    <>
      <div className="m-2 text-[30%] sm:text-[45%] md:text-[60%] lg:text-[100%]">
        <div className="text-center font-bold my-5 text-xs lg:text-2xl">
          <div className="justify-center">CREDITS CHECKER</div>
        </div>
        <ResultDetails details={creditsCheckerReport.details} />
        <CreditsCheckerResult
          results={creditsCheckerReport.results}
          htno={htno}
        />
      </div>
      <div className="flex justify-center text-[6px] text-black">
        jntuhresults.vercel.app
      </div>
      <QuickNavigation htno={htno} />
    </>
  );
};

export default CreditCheckerResult;
