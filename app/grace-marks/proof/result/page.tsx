"use client";
import { useSearchParams, useRouter } from "next/navigation";
import ResultDetails from "@/components/result/details";
import { getFromLocalStorage } from "@/components/customfunctions/localStorage";
import Print from "@/components/download/print";
import { useRef } from "react";

const GraceMarksProofResult = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const htno = searchParams.get("htno");
  const proofData = getFromLocalStorage(htno + "-GraceMarksProof");

  const componentRef = useRef(null);
  
  if (proofData === null) {
    router.push("/grace-marks/proof");
  }

  return proofData === null ? (
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
          GRACE MARKS PROOF
        </div>
        
        {/* Render Details if available */}
        {proofData.details && (
          <ResultDetails details={proofData.details} />
        )}
        
        {/* Render Proof Information */}
        {proofData.proof !== undefined ? (
          <div className="my-4">
            <table className="dark:border-white my-2 w-full">
              <tbody>
                {proofData.proof.eligible !== undefined && (
                  <tr>
                    <th className="dark:border-white w-[50%] bg-gray-200 dark:bg-[#0b3954] p-2">
                      Eligible
                    </th>
                    <td className="dark:border-white p-2">
                      {proofData.proof.eligible ? (
                        <span className="text-green-600 dark:text-green-400 font-semibold">
                          Yes
                        </span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400 font-semibold">
                          No
                        </span>
                      )}
                    </td>
                  </tr>
                )}
                {proofData.proof.graceMarks !== undefined && (
                  <tr>
                    <th className="dark:border-white bg-gray-200 dark:bg-[#0b3954] p-2">
                      Grace Marks
                    </th>
                    <td className="dark:border-white p-2">
                      {proofData.proof.graceMarks}
                    </td>
                  </tr>
                )}
                {proofData.proof.proofDocument && (
                  <tr>
                    <th className="dark:border-white bg-gray-200 dark:bg-[#0b3954] p-2">
                      Proof Document
                    </th>
                    <td className="dark:border-white p-2">
                      <a 
                        href={proofData.proof.proofDocument} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 underline"
                      >
                        View Document
                      </a>
                    </td>
                  </tr>
                )}
                {proofData.proof.message && (
                  <tr>
                    <th className="dark:border-white bg-gray-200 dark:bg-[#0b3954] p-2" colSpan={2}>
                      {proofData.proof.message}
                    </th>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="my-4">
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">
              {JSON.stringify(proofData, null, 2)}
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

export default GraceMarksProofResult;

