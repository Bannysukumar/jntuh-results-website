"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ResultDetails from "@/components/result/details";
import AcademicAllResult from "@/components/result/academicallresult";
import Print from "@/components/download/print";
import { getFromLocalStorage } from "@/components/customfunctions/localStorage";
import { fetchAllResult } from "@/components/api/fetchResults";

const AcademicAllResultResult = () => {
  const router = useRouter();
  const htno = (useSearchParams().get("htno") || "").trim().toUpperCase();
  const [allResult, setAllResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef(null);

  useEffect(() => {
    if (!htno || htno.length < 10) {
      setLoading(false);
      router.push("/academicallresult");
      return;
    }
    const cached = getFromLocalStorage(htno + "-AllResult");
    if (cached) {
      setAllResult(cached);
      setLoading(false);
      return;
    }

    const abortController = new AbortController();
    let cancelled = false;
    let retried = false;

    const doFetch = async () => {
      setLoading(true);
      try {
        const ok = await fetchAllResult(htno, { signal: abortController.signal });
        if (cancelled || abortController.signal.aborted) return;
        if (ok) {
          const data = getFromLocalStorage(htno + "-AllResult");
          if (data) setAllResult(data);
        } else {
          router.push("/academicallresult");
        }
      } catch (err: any) {
        const isAbort = err?.name === "AbortError" || err?.code === "ERR_CANCELED";
        if (isAbort && !retried && !cancelled && !abortController.signal.aborted) {
          retried = true;
          await doFetch();
        } else if (!isAbort && !cancelled) router.push("/academicallresult");
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
  if (allResult === null) {
    return (
      <div className="m-2 text-[30%] sm:text-[45%] md:text-[60%] lg:text-[100%]">
        Details not found
      </div>
    );
  }
  return (
    <>
      <div
        className="m-2 text-[30%]  sm:text-[45%]  md:text-[60%] lg:text-[100%]"
        ref={componentRef}
      >
        <div className="text-center grid grid-cols-3 font-bold my-5 text-xs lg:text-2xl">
          <div></div>
          <div className="justify-center">ACADEMIC All RESULTS</div>
          <div className="justify-end flex "></div>
        </div>

        <ResultDetails details={allResult.details} />
        <AcademicAllResult
          results={allResult.results}
          htno={allResult.details.rollNumber}
        />

        <div className="flex justify-center text-[6px] text-black">
          jntuhresults.vercel.app
        </div>
      </div>

      <Print componentRef={componentRef} />
    </>
  );
};

export default AcademicAllResultResult;
