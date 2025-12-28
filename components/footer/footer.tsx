"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
// import AdComponent from "../ads/adcomponent";
const Footer = () => {
  const path = usePathname();

  return (
    <>
      <div className="mt-2">
        <div className="font-serif mt-1 block text-left text-[#808080] ml-[17%] text-[55%] md:text-[80%]">
          It does consider the RCRV Results
        </div>
        <div className="font-serif mt-1 block text-left text-[#808080] ml-[17%] mb-4 text-[55%] md:text-[80%]">
          It only works above R18 Regulation
        </div>
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
        
        {/* Privacy Policy Link */}
        <div className="text-center mt-4 mb-4">
          <Link
            href="/privacy"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm md:text-base underline underline-offset-2 transition-colors inline-block px-2 py-1"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
      {/* <AdComponent /> */}
    </>
  );
};

export default Footer;
