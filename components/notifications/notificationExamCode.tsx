"use client";

import { rcrvdetails } from "@/constants/rcrvdetails";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import ExamResults from "../examresults/examresults";
import { romanToNumeral } from "@/constants/romantoNumeral";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Clock, 
  ExternalLink, 
  Calendar, 
  AlertCircle,
  Link2,
  FileText
} from "lucide-react";

const NotificationExamCode = ({
  link,
  title,
  date,
  formatted_date,
}: {
  link: string;
  title: string;
  date: string;
  formatted_date: string;
}) => {
  const [resultnew, setResultnew] = useState(false);
  const [rcrvdate, setRcrvdate] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState("");

  if (title === null) {
    redirect("/notifications");
  }

  const rcrv = title.includes("RC");

  useEffect(() => {
    let documentTitle = title;
    for (let key in romanToNumeral) {
      const value = romanToNumeral[key];
      const regex = new RegExp(key, "g");
      documentTitle = documentTitle.replace(regex, value.toString());
    }
    setDocumentTitle("JNTUH " + documentTitle);

    document.title = "JNTUH " + documentTitle;

    if (formatted_date !== null) {
      var rcrvdate = rcrvdetails[formatted_date as keyof typeof rcrvdetails];
      if (rcrvdate !== undefined) {
        setRcrvdate(rcrvdate);
        var parts = rcrvdate.split("-");
        var compareDate = new Date(
          parseInt(parts[2]),
          parseInt(parts[1]) - 1,
          parseInt(parts[0]),
        );
        const today = new Date();
        setResultnew(compareDate > today);
      }
    }
  }, [formatted_date, resultnew, title, setDocumentTitle]);

  return (
    <>
      <Head>
        <meta name="description" content={documentTitle} />
      </Head>

      <article className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Card */}
          <Card className="mb-6 shadow-lg border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                    {title}
                  </CardTitle>
                  
                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm">
                      <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium">MANA JNTUH</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm">
                      <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium">Last Updated: {date}</span>
                    </div>
                    {resultnew && (
                      <Badge variant="destructive" className="animate-pulse">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        New Result
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Direct Links Card */}
          <Card className="mb-6 shadow-xl border-2 hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Link2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Direct Links to Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href={`http://202.63.105.184/results/jsp/SearchResult.jsp?${link.split("?")[1]}`}
                  target="_blank"
                  className="group"
                >
                  <Card className="h-full border-2 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 hover:shadow-lg cursor-pointer bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              Result Link 1
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Primary Server
                            </p>
                          </div>
                        </div>
                        <ExternalLink className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link
                  href={link}
                  target="_blank"
                  className="group"
                >
                  <Card className="h-full border-2 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 hover:shadow-lg cursor-pointer bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              Result Link 2
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Official Server
                            </p>
                          </div>
                        </div>
                        <ExternalLink className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-gray-900 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                OR
              </span>
            </div>
          </div>

          {/* Search Results Card */}
          <Card className="mb-6 shadow-xl border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Search Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ExamResults title={title} query={link} />
            </CardContent>
          </Card>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Publication Date Card */}
            <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-900">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Results Published on
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {date}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RC/RV Date Card */}
            {rcrvdate !== null && rcrvdate !== undefined && (
              <Card className="border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-white dark:from-gray-800 dark:to-gray-900">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                      <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {rcrv
                          ? "Last date for Challenge Valuation"
                          : "Last date for Revaluation/Recounting"}
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {rcrvdate}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Note Card */}
          <Card className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-white dark:from-gray-800 dark:to-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                Important Note
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-amber-700 dark:text-amber-400">
                    Note:
                  </span>{" "}
                  As per prevailing practice since 2012, if difference of marks
                  after revaluation and first valuation is more than or equal to
                  15% of maximum external marks then revaluation marks will be
                  retained. If the change is less than 15% or marks secured in
                  revaluation is less than first valuation marks, the first
                  valuation marks shall be retained.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </article>
    </>
  );
};

export default NotificationExamCode;
