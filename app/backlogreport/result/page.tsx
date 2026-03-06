"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ResultDetails from "@/components/result/details";
import { getFromLocalStorage } from "@/components/customfunctions/localStorage";
import AcademicResult from "@/components/result/academicresult";
import Print from "@/components/download/print";
import { fetchBacklogReport } from "@/components/api/fetchResults";

const BacklogReportResult = () => {
  const router = useRouter();
  const htno = (useSearchParams().get("htno") || "").trim().toUpperCase();
  const [backlogreport, setBacklogreport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef(null);

  useEffect(() => {
    if (!htno || htno.length < 10) {
      setLoading(false);
      router.push("/backlogreport");
      return;
    }
    const cached = getFromLocalStorage(htno + "-Backlogreport");
    if (cached) {
      setBacklogreport(cached);
      setLoading(false);
      return;
    }
    const abortController = new AbortController();
    let cancelled = false;
    let retried = false;
    const doFetch = async () => {
      setLoading(true);
      try {
        const ok = await fetchBacklogReport(htno, { signal: abortController.signal });
        if (cancelled || abortController.signal.aborted) return;
        if (ok) {
          const data = getFromLocalStorage(htno + "-Backlogreport");
          if (data) setBacklogreport(data);
        } else {
          router.push("/backlogreport");
        }
      } catch (err: any) {
        const isAbort = err?.name === "AbortError" || err?.code === "ERR_CANCELED";
        if (isAbort && !retried && !cancelled && !abortController.signal.aborted) {
          retried = true;
          await doFetch();
        } else if (!isAbort && !cancelled) router.push("/backlogreport");
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
  if (backlogreport === null) {
    return (
      <div className="m-2 text-[30%] sm:text-[45%] md:text-[60%] lg:text-[100%]">
        Details not found
      </div>
    );
  }
  return (
    <>
      <div
        className="m-2 text-[30%] sm:text-[45%]  md:text-[60%] lg:text-[100%]"
        ref={componentRef}
      >
        <div className="text-center font-bold my-5 text-xs lg:text-2xl">
          BACKLOG REPORT
        </div>
        {/* Render Details */}
        <ResultDetails details={backlogreport.details} />
        {backlogreport.results.totalBacklogs != 0 ? (
          <>
            <table className="dark:border-white my-2">
              <tbody>
                <tr>
                  <th className="dark:border-white w-[50%] bg-gray-200 dark:bg-[#0b3954]">
                    Total Backlogs
                  </th>
                  <th className="dark:border-white">
                    {backlogreport.results.totalBacklogs}
                  </th>
                </tr>
              </tbody>
            </table>
            <AcademicResult result={backlogreport.results} academic={false} />
          </>
        ) : (
          <table className="dark:border-white my-2">
            <tbody>
              <tr>
                <th className="dark:border-white ">No Backlogs</th>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      <Print componentRef={componentRef} />
    </>
  );
};

export default BacklogReportResult;
