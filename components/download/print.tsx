"use client";

import React, { useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { Download, Share2, Save } from "lucide-react";
import { shareContent, saveFile, isNative, hapticFeedback, saveResultToLocal } from "@/lib/native-features";
import { useSearchParams } from "next/navigation";
import { ImpactStyle } from "@capacitor/haptics";
import toast from "react-hot-toast";

const Print = ({ componentRef }: { componentRef: any }) => {
  const [isNativeApp, setIsNativeApp] = useState(false);
  const searchParams = useSearchParams();
  const htno = searchParams.get("htno");

  useEffect(() => {
    setIsNativeApp(isNative());
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleShare = async () => {
    await hapticFeedback(ImpactStyle.Medium);
    
    if (componentRef.current) {
      const htmlContent = componentRef.current.innerHTML;
      const textContent = componentRef.current.innerText || componentRef.current.textContent || '';
      
      await shareContent({
        title: `JNTUH Result - ${htno || 'Hall Ticket'}`,
        text: textContent.substring(0, 500) + (textContent.length > 500 ? '...' : ''),
        url: `https://manajntuhresults.vercel.app/academicresult/result?htno=${htno}`,
        dialogTitle: 'Share Result',
      });
    }
  };

  const handleSave = async () => {
    await hapticFeedback(ImpactStyle.Medium);
    
    if (componentRef.current && htno) {
      try {
        // Try to get result data from localStorage first
        const resultData = localStorage.getItem(`${htno}-AcademicResult`);
        let parsedData = null;
        
        if (resultData) {
          try {
            parsedData = JSON.parse(resultData);
          } catch (e) {
            console.log('Could not parse result data from localStorage');
          }
        }

        // If we have structured data, save it properly
        if (parsedData) {
          const result = await saveResultToLocal(htno, parsedData);
          if (result.success) {
            toast.success(result.message || 'Result saved successfully!');
          } else {
            toast.error(result.message || 'Failed to save result');
          }
        } else {
          // Fallback: save as HTML file
          const htmlContent = componentRef.current.innerHTML;
          const filename = `jntuh-result-${htno}-${new Date().toISOString().split('T')[0]}.html`;
          await saveFile(filename, htmlContent);
          toast.success('Result saved to device');
        }
        
        await hapticFeedback(ImpactStyle.Light);
      } catch (error) {
        console.error('Error saving file:', error);
        toast.error('Failed to save result');
      }
    }
  };

  return (
    <>
      <div className="fixed bottom-0 right-0 m-5 flex gap-2 z-[401]">
        {isNativeApp && (
          <>
            <div
              className="cursor-pointer rounded-full bg-blue-600 dark:bg-blue-500 text-white border p-3 shadow-lg hover:bg-blue-700 transition-colors"
              onClick={handleShare}
              title="Share Result"
            >
              <Share2 size={18} />
            </div>
            <div
              className="cursor-pointer rounded-full bg-green-600 dark:bg-green-500 text-white border p-3 shadow-lg hover:bg-green-700 transition-colors"
              onClick={handleSave}
              title="Save to Device"
            >
              <Save size={18} />
            </div>
          </>
        )}
        <div
          className="cursor-pointer rounded-full bg-black dark:bg-white dark:text-black text-white border p-3 shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          onClick={handlePrint}
          title="Download/Print"
        >
          <Download size={18} />
        </div>
      </div>
    </>
  );
};

export default Print;
