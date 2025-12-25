"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDownCircle, AiOutlineUpCircle } from "react-icons/ai";
import { FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";

const Faq = () => {
  const faqs = [
    {
      question: "How do I check my JNTUH results on this website?",
      answer:
        "To check your results, simply navigate to the Academic Result page, enter your roll number (HT number) in the search box, and click on the 'Results' button. The website will fetch and display all your semester results, including regular and supplementary exams, along with your CGPA calculation.",
    },
    {
      question: "Which regulations are supported by this website?",
      answer:
        "This website supports results for R18 regulation and above. It also considers RCRV (Revaluation) results. Please note that results below R18 regulation may not be fully supported.",
    },
    {
      question: "How do I view results for all my semesters at once?",
      answer:
        "You can use the 'Academic All Result' feature to view all your semester results in one place. Just enter your roll number and the website will display a comprehensive view of all your exam results across all semesters.",
    },
    {
      question: "What is the difference between Academic Result and Academic All Result?",
      answer:
        "Academic Result shows your results in a detailed semester-wise format. Academic All Result provides a consolidated view of all your exam results across all semesters in a single page, making it easier to track your overall academic performance.",
    },
    {
      question: "How do I check my backlogs?",
      answer:
        "Use the 'Backlog Report' feature by entering your roll number. This will show you all subjects where you have backlogs (subjects you need to clear) across all semesters, helping you plan your supplementary exams.",
    },
    {
      question: "Can I compare my results with my classmates?",
      answer:
        "Yes! Use the 'Result Contrast' feature to compare your academic performance with your classmates. Enter two roll numbers to see a side-by-side comparison of results, CGPA, and other academic metrics.",
    },
    {
      question: "How do I check class results for multiple students?",
      answer:
        "The 'Class Result' feature allows you to fetch results for multiple students at once. Enter multiple roll numbers separated by commas along with the semester code to get results for your entire class.",
    },
    {
      question: "What is the Credits Checker feature?",
      answer:
        "The Credits Checker helps you verify if you have earned enough credits to graduate or advance to the next academic year. It shows your total credits earned, credits required, and any additional credits needed.",
    },
    {
      question: "Why is my result showing as 'being prepared'?",
      answer:
        "If you see a message that your result is being prepared, it means the JNTUH server is still processing your result. Please wait a few minutes and try again. The result will be available once JNTUH officially releases it.",
    },
    {
      question: "Can I download or print my results?",
      answer:
        "Yes, you can download and print your results. Use the download/print button available on the result pages to save or print your results for offline use.",
    },
    {
      question: "How accurate are the results shown on this website?",
      answer:
        "The results are fetched directly from the official JNTUH servers, so they are as accurate as the official JNTUH website. However, for official purposes, always refer to the original JNTUH results website.",
    },
    {
      question: "What should I do if my result is not showing?",
      answer:
        "If your result is not showing, please check: 1) Your roll number is correct, 2) Your regulation is R18 or above, 3) The result has been officially released by JNTUH. If the issue persists, try clearing your browser cache or contact us through the Help Center.",
    },
    {
      question: "How do I get notifications about new exam results?",
      answer:
        "Visit the 'Notifications' page to see all the latest exam notifications and result announcements from JNTUH. You can filter notifications by degree, regulation, year, and exam type.",
    },
    {
      question: "Is my data stored or shared?",
      answer:
        "Your roll number and results are temporarily cached in your browser's local storage for faster access. We do not store your personal information on our servers, and your data is never shared with third parties. You can clear the cache anytime using the 'Clear cache' button.",
    },
    {
      question: "How can I report a bug or suggest a feature?",
      answer:
        "You can report bugs or suggest new features by visiting the Help Center and clicking on 'Suggestion/Feedback'. You can also contact us via email at thilakreddypothuganti@gmail.com or submit an issue on our GitHub repository.",
    },
    {
      question: "Does this website work on mobile devices?",
      answer:
        "Yes, this website is fully responsive and works on all devices including mobile phones, tablets, and desktops. You can also install it as a Progressive Web App (PWA) for easier access on mobile devices.",
    },
  ];

  const [answerVisibility, setAnswerVisibility] = useState(
    Array(faqs.length).fill(false),
  );
  const clearLocalStorageAndReload = () => {
    localStorage.clear();
    toast.success("Cache has been cleared!!");
  };
  return (
    <>
      <section className="pt-[75px] ">
        <h3 className="text-center text-xl font-bold hidden md:block font-intercursive">
          Frequently Asked Question&apos;s
        </h3>
        <h3 className="text-center text-xl font-bold block md:hidden font-intercursive">
          FAQ&apos;s
        </h3>
        <center>
          <div className="max-w-[1024px] font-interer px-[15px]">
            <div className="max-w-[540px] w-[100%] ">
              {faqs.map(
                (
                  value: { question: String; answer: String },
                  index: number,
                ) => {
                  return (
                    <section
                      key={index}
                      className={`my-[16px] rounded-[4px] border-[1px] border-solid  ${answerVisibility[index] && " border border-black dark:border-white"} `}
                    >
                      <div className="overflow-hidden flex grid-rows-2 p-[13px] bg-[#fff] dark:bg-black rounded-[4px]">
                        <button
                          className="text-[14px] text-black dark:text-white  w-full text-left "
                          onClick={() => {
                            const newVisibility = [...answerVisibility];
                            newVisibility[index] = !newVisibility[index];
                            setAnswerVisibility(newVisibility);
                          }}
                        >
                          {value.question}
                        </button>
                        <AiOutlineDownCircle
                          className={`text-2xl text-right ${
                            answerVisibility[index] ? "hidden" : "block"
                          }`}
                        />
                        <AiOutlineUpCircle
                          className={`text-2xl text-right  ${
                            answerVisibility[index] ? "block" : "hidden"
                          }`}
                        />
                      </div>
                      <div
                        className={`text-justify px-[13px] dark:bg-[#181A20]  border-t border-black dark:border-white overflow-hidden transition-max-height duration-200 ease-out text-[14px] text-[#1a1a1a] dark:text-white py-[17px] ${
                          answerVisibility[index] ? "" : "hidden"
                        }`}
                      >
                        <p>{value.answer}</p>
                      </div>
                    </section>
                  );
                },
              )}
            </div>
          </div>
        </center>
      </section>
      <div className="text-center pb-4">
        <Button onClick={clearLocalStorageAndReload}>Clear cache</Button>
      </div>
      <div className="bottom-0 md:hidden w-full font-interer pt-[10px]">
        <hr />
        <center>
          <div className="flex justify-center mt-4 text-sm text-gray-600">
            <a
              href="https://github.com/thilakreddyy"
              className="mx-2 hover:text-gray-900"
            >
              <FaGithub />
            </a>
            <a
              href="https://twitter.com/thilakreddyonly"
              className="mx-2 hover:text-gray-900"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.instagram.com/__thilak_reddy__/"
              className="mx-2 hover:text-gray-900"
            >
              <FaInstagram />
            </a>
          </div>
          <div className="flex justify-center m-2 text-xs	 text-gray-600">
            <p>&copy; 2026 manajntuhresults.vercel.app</p>
          </div>
        </center>
      </div>
    </>
  );
};

export default Faq;
