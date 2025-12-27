"use client";
import { useSearchParams, useRouter } from "next/navigation";
import ResultDetails from "@/components/result/details";
import { getFromLocalStorage } from "@/components/customfunctions/localStorage";
import Print from "@/components/download/print";
import { useRef } from "react";

const GraceMarksEligibilityResult = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const htno = searchParams.get("htno");
  const eligibilityData = getFromLocalStorage(htno + "-GraceMarksEligibility");

  const componentRef = useRef(null);
  
  if (eligibilityData === null) {
    router.push("/grace-marks/eligibility");
  }

  return eligibilityData === null ? (
    <>
      <div className="m-2 text-[30%] sm:text-[45%] md:text-[60%] lg:text-[100%]">
        Details not found
      </div>
    </>
  ) : (
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

