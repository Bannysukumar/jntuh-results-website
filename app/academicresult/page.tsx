"use client";

import Footer from "@/components/footer/footer";
import Form from "@/components/forms/resulthtnoform";
import Loading from "@/components/loading/loading";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchAcademicResult } from "@/components/api/fetchResults";
import { setupPush } from "@/customhooks/setupPush";

const AcademicResult = () => {
  const [hallticketno, sethallticketno] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isCooldown, setIsCooldown] = useState<boolean>(false);

  const router = useRouter();
  useEffect(() => {
    // This function reads text from the clipboard
    async function readClipboard() {
      try {
        const browser = navigator.userAgent.toLowerCase();
        if (browser.includes("android") || browser.includes("iphone")) {
          const text = await navigator.clipboard.readText();
          try {
            const hallticketfirsttwodigits = text.slice(0, 2);
            if (
              text.length === 10 &&
              ["18", "19", "20", "21", "22", "23"].includes(
                hallticketfirsttwodigits,
              )
            ) {
              sethallticketno(text);
            }
          } catch {
            console.log("error");
          }
        }
      } catch (err) {
        console.error("Failed to read clipboard content:", err);
      }
    }
    readClipboard();
  }, []);

  const onSubmit = async () => {
    if (isCooldown) return;
    if (hallticketno.length < 10) {
      toast.error("The Hallticket should be of 10 digits");
      return;
    }

    setIsCooldown(true);
    try {
      await setupPush(hallticketno);
      router.push("/academicresult/result?htno=" + hallticketno);
      // const result = await fetchAcademicResult(hallticketno);
      // if (result) {
      // }
    } catch (error) {
      console.log("Error while fetching the academic result :", error);
    }
    setLoading(false);
    setTimeout(() => {
      setIsCooldown(false);
      toast.dismiss();
    }, 10000);
  };

  return loading ? (
    <Loading />
  ) : (
    <>
      <Form
        title="Academic Result"
        hallticketno={hallticketno}
        sethallticketno={sethallticketno}
        onSubmit={onSubmit}
        isDisabled={isCooldown}
      />

      {/* Informational Content for AdSense Value */}
      <section className="max-w-2xl mx-auto px-4 pb-12 mt-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            How to Check Your JNTUH Results
          </h2>
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <p className="leading-relaxed">
              To check your results on the Mana JNTUH Results portal, follow these simple steps:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Enter your unique 10-digit <strong>Hall Ticket Number</strong> in the form above.</li>
              <li>Click on the <strong>Send</strong> button to initiate the search.</li>
              <li>Our system will interact with the JNTUH official result servers to fetch your latest grades.</li>
            </ul>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-300 font-medium mb-1">Supported Regulations</p>
              <p className="text-xs">
                Currently, we provide result analysis for R18, R19, R21, R22, and R23 regulations. We also include Revaluation (RC) and Recounting (RV) results for a comprehensive view.
              </p>
            </div>
            <p className="text-xs italic text-center text-gray-500 mt-6">
              Note: For official certification, always refer to the original mark sheets issued by Jawaharlal Nehru Technological University, Hyderabad.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
export default AcademicResult;
