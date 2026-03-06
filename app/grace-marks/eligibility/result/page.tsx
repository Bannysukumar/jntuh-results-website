"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ResultDetails from "@/components/result/details";
import { getFromLocalStorage } from "@/components/customfunctions/localStorage";
import Print from "@/components/download/print";
import { fetchGraceMarksEligibility } from "@/components/api/fetchResults";

const GraceMarksEligibilityResult = () => {
  const router = useRouter();
  const htno = (useSearchParams().get("htno") || "").trim().toUpperCase();
  const [eligibilityData, setEligibilityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef(null);

  useEffect(() => {
    if (!htno || htno.length < 10) {
      setLoading(false);
      router.push("/grace-marks/eligibility");
      return;
    }
    const cached = getFromLocalStorage(htno + "-GraceMarksEligibility");
    if (cached) {
      setEligibilityData(cached);
      setLoading(false);
      return;
    }
    const abortController = new AbortController();
    let cancelled = false;
    let retried = false;
    const doFetch = async () => {
      setLoading(true);
      try {
        const ok = await fetchGraceMarksEligibility(htno, { signal: abortController.signal });
        if (cancelled || abortController.signal.aborted) return;
        if (ok) {
          const data = getFromLocalStorage(htno + "-GraceMarksEligibility");
          if (data) setEligibilityData(data);
        } else {
          router.push("/grace-marks/eligibility");
        }
      } catch (err: any) {
        const isAbort = err?.name === "AbortError" || err?.code === "ERR_CANCELED";
        if (isAbort && !retried && !cancelled && !abortController.signal.aborted) {
          retried = true;
          await doFetch();
        } else if (!isAbort && !cancelled) router.push("/grace-marks/eligibility");
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
  if (eligibilityData === null) {
    return (
      <div className="m-2 text-[30%] sm:text-[45%] md:text-[60%] lg:text-[100%]">
        Details not found
      </div>
    );
  }
  return (
    <>
      <div
        className="m-2 text-[30%] sm:text-[45%] md:text-[60%] lg:text-[100%]"
        ref={componentRef}
      >
        <div className="text-center font-bold my-5 text-xs lg:text-2xl">
          GRACE MARKS ELIGIBILITY
        </div>
        
        {/* Render Details if available */}
        {eligibilityData.details && (
          <ResultDetails details={eligibilityData.details} />
        )}
        
        {/* Render Eligibility Information */}
        {eligibilityData.eligibility !== undefined ? (
          <div className="my-4">
            <table className="dark:border-white my-2 w-full">
              <tbody>
                <tr>
                  <th className="dark:border-white w-[50%] bg-gray-200 dark:bg-[#0b3954] p-2">
                    Eligibility Status
                  </th>
                  <td className="dark:border-white p-2">
                    {eligibilityData.eligibility ? (
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        Eligible
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 font-semibold">
                        Not Eligible
                      </span>
                    )}
                  </td>
                </tr>
                {eligibilityData.requiredMarks !== undefined && (
                  <tr>
                    <th className="dark:border-white bg-gray-200 dark:bg-[#0b3954] p-2">
                      Required Marks
                    </th>
                    <td className="dark:border-white p-2">
                      {eligibilityData.requiredMarks}
                    </td>
                  </tr>
                )}
                {eligibilityData.currentMarks !== undefined && (
                  <tr>
                    <th className="dark:border-white bg-gray-200 dark:bg-[#0b3954] p-2">
                      Current Marks
                    </th>
                    <td className="dark:border-white p-2">
                      {eligibilityData.currentMarks}
                    </td>
                  </tr>
                )}
                {eligibilityData.message && (
                  <tr>
                    <th className="dark:border-white bg-gray-200 dark:bg-[#0b3954] p-2" colSpan={2}>
                      {eligibilityData.message}
                    </th>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="my-4">
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">
              {JSON.stringify(eligibilityData, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="flex justify-center text-[6px] text-black">
        jntuhresults.vercel.app
      </div>

      <Print componentRef={componentRef} />
    </>
  );
};

export default GraceMarksEligibilityResult;

