"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
// import AdComponent from "../ads/adcomponent";
const Footer = () => {
  const path = usePathname();
  // Check if it's the group-chat page (handles both /group-chat and /group-chat/)
  const normalizedPath = path?.replace(/\/$/, "") || "";
  const isGroupChatPage = normalizedPath === "/group-chat";

  // Debug: uncomment to see pathname in console
  // console.log("Footer path:", path, "normalized:", normalizedPath, "isGroupChat:", isGroupChatPage);

  return (
    <>
      <div className="mt-2">
        {!isGroupChatPage && (
          <>
            <div className="font-serif mt-1 block text-left text-[#808080] ml-[17%] text-[55%] md:text-[80%]">
              It does consider the RCRV Results
            </div>
            <div className="font-serif mt-1 block text-left text-[#808080] ml-[17%] mb-4 text-[55%] md:text-[80%]">
              It only works above R18 Regulation
            </div>
          </>
        )}
        {isGroupChatPage && (
          <div className="mt-3 mb-3 px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r mx-auto max-w-4xl">
            <div className="flex items-start gap-2">
              <div className="text-yellow-600 dark:text-yellow-400 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm md:text-base font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                  ⚠️ Community Guidelines Warning
                </p>
                <p className="text-xs md:text-sm text-yellow-700 dark:text-yellow-400">
                  <strong>You will be permanently banned</strong> if you misbehave with someone else or engage in sexual/inappropriate conversations. Please keep this chat respectful and appropriate for all users.
                </p>
              </div>
            </div>
          </div>
        )}
        <center>
          <hr className="w-[64%] mt-4 mb-1 " />
        </center>
        <center>
          <hr className="w-[64%]  text-[#808080]" />
        </center>

        <span className="mt-4  text-center mx-[18%] mb-4 text-[75%] sm:text-[100%] hidden">
          Made with ❤ by &nbsp;
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/Bannysukumar"
            className=" underline	underline-offset-1"
          >
            Adepu Sukumar
          </a>
          <br />
          <p
          // className={` ${path == "/academicresult" ? "block" : "hidden"}`}
          >
            In collaboration with{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/hemanth-kotagiri/"
              className=" underline	underline-offset-1"
            >
              Hemanth kotagiri
            </a>{" "}
            and{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/Syed-Ansar/"
              className=" underline	underline-offset-1"
            >
              Syed Ansar
            </a>
          </p>
        </span>

        {/* Social Media Links */}
        <div className="flex justify-center mt-4 mb-4 gap-4">
          <a
            href="https://github.com/Bannysukumar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/adepusukumar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={20} />
          </a>
          <a
            href="https://www.instagram.com/hacking_with_banny"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
            aria-label="Instagram"
          >
            <FaInstagram size={20} />
          </a>
        </div>

        {/* <span className="mt-4 block text-center mx-[18%] mb-4 text-[75%] sm:text-[100%]">
          Join us on{" "}
          <Link
            href="https://t.me/s/jntuhvercel"
            className="underline underline-offset-1"
          >
            Telegram
          </Link>
          , thanks!
        </span> */}

        {/* Sitelinks Group */}
        <div className="flex flex-wrap justify-center mt-6 mb-4 gap-x-6 gap-y-2">
          <Link
            href="/about"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xs md:text-sm transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xs md:text-sm transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/disclaimer"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xs md:text-sm transition-colors"
          >
            Disclaimer
          </Link>
          <Link
            href="/privacy"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xs md:text-sm transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/guide"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xs md:text-sm transition-colors"
          >
            Guide
          </Link>
        </div>

        {/* Attribution */}
        <div className="text-center mb-4">
          <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-500">
            &copy; 2026 manajntuhresults.vercel.app - Your Premier JNTUH Results Portal
          </p>
        </div>
      </div>
      {/* <AdComponent /> */}
    </>
  );
};

export default Footer;
