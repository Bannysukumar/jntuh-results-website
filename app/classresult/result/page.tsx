"use client";

import { RefreshCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ResultDetails from "@/components/result/details";
import { getFromLocalStorage } from "@/components/customfunctions/localStorage";
import AcademicResult from "@/components/result/academicresult";
import TotalResult from "@/components/result/totalResult";
import ResultDetailsSkeleton from "@/components/skeleton/ResultDetailsSkeleton";
import AcademicResultSkeleton from "@/components/skeleton/AcademicResultsSkeleton";
import Print from "@/components/download/print";
import { fetchClassResult } from "@/components/api/fetchResults";

const ClassResultResult = () => {
  const router = useRouter();
  const htno = (useSearchParams().get("htno") || "").trim().toUpperCase();
  const type = useSearchParams().get("type") || "academicresult";
  const [classResults, setClassResults] = useState<AcademicResulProps[] | null>(null);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef(null);

  useEffect(() => {
    if (!htno || htno.length < 10) {
      setLoading(false);
      router.push("/classresult");
      return;
    }
    const cached = getFromLocalStorage(htno + "-ClassResult-" + type);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      setClassResults(cached);
      setLoading(false);
      return;
    }
    const abortController = new AbortController();
    let cancelled = false;
    let retried = false;
    const doFetch = async () => {
      setLoading(true);
      try {
        const ok = await fetchClassResult(htno, type, { signal: abortController.signal });
        if (cancelled || abortController.signal.aborted) return;
        if (ok) {
          const data = getFromLocalStorage(htno + "-ClassResult-" + type);
          if (data) setClassResults(Array.isArray(data) ? data : []);
        } else {
          router.push("/classresult");
        }
      } catch (err: any) {
        const isAbort = err?.name === "AbortError" || err?.code === "ERR_CANCELED";
        if (isAbort && !retried && !cancelled && !abortController.signal.aborted) {
          retried = true;
          await doFetch();
        } else if (!isAbort && !cancelled) router.push("/classresult");
      } finally {
        if (!cancelled && !abortController.signal.aborted) setLoading(false);
      }
    };
    doFetch();
    return () => {
      cancelled = true;
      abortController.abort();
    };
  }, [htno, type, router]);

  if (loading) {
    return (
      <div className="m-2 text-[30%] sm:text-[45%] md:text-[60%] lg:text-[100%]">
        <div className="text-center font-bold my-5">Loading...</div>
      </div>
    );
  }
  if (!classResults || classResults.length === 0) {
    return (
      <div className="m-2 text-[30%] sm:text-[45%] md:text-[60%] lg:text-[100%]">
        <div className="text-center font-bold my-5">Details not found</div>
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
          <div className="justify-center">CLASS RESULTS</div>
          <div className="justify-end flex ">
            <div
              className="border border-white p-1 md:p-2 md:hidden rounded cursor-pointer justify-center items-center  hidden"
              onClick={() => {}}
            >
              <RefreshCcw size={6} />
            </div>
          </div>
        </div>
        {classResults.length > 0 ? (
          classResults.map((classresult: AcademicResulProps, index: number) => {
            return (
              <div key={index} className=" pb-8">
                <ResultDetails details={classresult.details} />
                <AcademicResult result={classresult.results} academic={true} />
                <TotalResult
                  CGPA={classresult.results.CGPA}
                  backlogs={classresult.results.backlogs}
                />
              </div>
            );
          })
        ) : (
          <>
            <ResultDetailsSkeleton />
            <AcademicResultSkeleton />
          </>
        )}
      </div>
      <div className="flex justify-center text-[6px] text-black">
        jntuhresults.vercel.app
      </div>
      <Print componentRef={componentRef} />
    </>
  );
};

export default ClassResultResult;
