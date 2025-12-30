"use client";

import { RefreshCcw, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ResultDetails from "@/components/result/details";
import AcademicResult from "@/components/result/academicresult";
import TotalResult from "@/components/result/totalResult";
import ResultDetailsSkeleton from "@/components/skeleton/ResultDetailsSkeleton";
import AcademicResultSkeleton from "@/components/skeleton/AcademicResultsSkeleton";
import Print from "@/components/download/print";
import { fetchAcademicResult } from "@/components/api/fetchResults";
import { saveResultToLocal, isNative, hapticFeedback } from "@/lib/native-features";
import { ImpactStyle } from "@capacitor/haptics";
import toast from "react-hot-toast";

const AcademicResultResult = () => {
  const router = useRouter();
  const htno = useSearchParams().get("htno");
  const [academicResult, setAcademicResult] =
    useState<AcademicResulProps | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const componentRef = useRef(null);
  const isNativeApp = isNative();

  useEffect(() => {
    const fetchResult = async () => {
      const academicResult = await fetchAcademicResult(htno || "");
      if (academicResult) {
        setAcademicResult(academicResult);
        return;
      }

      if (academicResult === null) {
        router.push("/academicresult");
      }
    };
    fetchResult();
  }, [htno, router]);

  const handleSaveResult = async () => {
    if (!academicResult || !htno) return;

    setIsSaving(true);
    await hapticFeedback(ImpactStyle.Medium);

    try {
      const result = await saveResultToLocal(htno, academicResult);
      if (result.success) {
        toast.success(result.message || 'Result saved successfully!');
      } else {
        toast.error(result.message || 'Failed to save result');
      }
    } catch (error) {
      console.error('Error saving result:', error);
      toast.error('Failed to save result');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div
        className="m-2 text-[30%]  sm:text-[45%]  md:text-[60%] lg:text-[100%]"
        ref={componentRef}
      >
        <div className="text-center grid grid-cols-3 font-bold my-5 text-xs lg:text-2xl">
          <div></div>
          <div className="justify-center">ACADEMIC RESULTS</div>
          <div className="justify-end flex gap-2">
            {isNativeApp && academicResult && (
              <button
                onClick={handleSaveResult}
                disabled={isSaving}
                className="border border-white p-1 md:p-2 rounded cursor-pointer justify-center items-center hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                title="Save Result"
              >
                <Save size={16} className={isSaving ? "animate-pulse" : ""} />
              </button>
            )}
            <div
              className="border border-white p-1 md:p-2 md:hidden rounded cursor-pointer justify-center items-center  hidden"
              onClick={() => {}}
            >
              <RefreshCcw size={6} />
            </div>
          </div>
        </div>
        {academicResult ? (
          <>
            <ResultDetails details={academicResult.details} />
            <AcademicResult result={academicResult.results} academic={true} />
            <TotalResult
              CGPA={academicResult.results.CGPA}
              backlogs={academicResult.results.backlogs}
            />
          </>
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
      {/* <QuickNavigation htno={htno} /> */}
      <Print componentRef={componentRef} />
    </>
  );
};

export default AcademicResultResult;
