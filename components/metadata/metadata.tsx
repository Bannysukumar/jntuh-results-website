"use client";
import { usePathname } from "next/navigation";

import React from "react";

const MetaData = () => {
  const pathname = usePathname();
  return (
    <>
      <meta property="og:url" content="https://manajntuhresults.vercel.app/" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Mana JNTUH Results" />
      <meta
        property="og:description"
        content="Mana JNTUH Results - You can find the Results of your entire semesters here of Jawaharlal Nehru Technological University, Hyderabad (JNTUH). Check your JNTUH results on Mana JNTUH Results portal."
      />
      <meta
        property="og:image"
        content="https://manajntuhresults.vercel.app/FrontPage.png"
      />
      <meta
        property="keywords"
        content="mana jntuh results, mana jntuhresults, manajntuh results, mana jntuh results online, mana jntuh results portal, check mana jntuh results, jntuh, jntuh Results, jntuh vercel, vercel jntuh, jntuh results vercel,  jntuhresults, jntuh notifications, JNTUH Results Engineering, JNTUH Engineering Results, jntuh bpharmacy results, jntuh bphar results, jntuh mtech results, jntuh mba results, jntuh mca results, jntuh all semester results"
      />
      <meta name="publisher" content="Adepu Sukumar" />
      <meta name="creator" content="Adepu Sukumar" />
      <meta name="author" content="Adepu Sukumar" />
      <meta name="twitter:card" content="summary" />
      <meta
        property="twitter:title"
        content="Mana JNTUH Results - Check Your UG and PG Exam Results Online"
      />
      <meta
        property="twitter:description"
        content="Mana JNTUH Results - Check your JNTUH exam results online instantly! Mana jntuh results, mana jntuhresults, manajntuh results, JNTUH Results, JNTUH results vercel, jntuh vercel, vercel jntuh, verceljntuh, jntuhresults, jntuh notifications,  jntuh bpharmacy results, jntuh bphar results, jntuh mtech results, jntuh mba results, jntuh mca results, jntuh all semester results, jntuh all semester results r18"
      />
      {/* <meta */}
      {/*   name="description" */}
      {/*   content="Easily access your JNTUH results for {relevant course and semester} - Find out your grades, CGPA, backlogs, Jobs, Internships and more in one place. Check now!" */}
      {/* /> */}
      <meta
        name="google-site-verification"
        content="19aqihOrD-qf3lECIogsri3a8H8WCd2piEQ7xdq2Akg"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png?v=2"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/manifest.json" />
      <link
        rel="canonical"
        href={`https://manajntuhresults.vercel.app${pathname}`}
      />

      <link rel="manifest" href="/site.webmanifest" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      {/* <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5512897194230969"
        crossOrigin="anonymous"
      ></script> */}
      <link
        href="https://fonts.googleapis.com/css2?family=Delicious+Handrawn&family=Inter:wght@300&family=Roboto+Slab&display=swap"
        rel="stylesheet"
      />
    </>
  );
};

export default MetaData;
