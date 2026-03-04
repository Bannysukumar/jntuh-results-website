"use client";
import { useEffect, useState } from "react";
import { syllabusDetails } from "@/constants/syllabusdetails";
import Link from "next/link";
import toast from "react-hot-toast";
import Footer from "@/components/footer/footer";
import GoogleDocViewer from "@/components/googledocviewer/GoogleDocViewer";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, GraduationCap, FileText, Download, ExternalLink, Layers } from "lucide-react";

const Syllabus = () => {
  const [degrees, setDegrees] = useState<string[]>([]);
  const [degree, setDegree] = useState<string>("");
  const [regulations, setRegulations] = useState<string[]>([]);
  const [regulation, setRegulation] = useState("");
  const [semesteryears, setSemesterYears] = useState<string[]>([]);
  const [semesteryear, setSemesterYear] = useState("");
  const [syllabus, setSyllabus] = useState<{ title: string; link: string }[]>(
    [],
  );
  const [link, setLink] = useState("");

  useEffect(() => {
    const keys: string[] = Object.keys(syllabusDetails);
    setDegrees(keys);
  }, []);

  const handleDegreechange = (value: string) => {
    setDegree(value);
    const selectedDegree =
      syllabusDetails[value as keyof typeof syllabusDetails];
    setLink("");
    const isArray = Array.isArray(selectedDegree);
    if (isArray) {
      setSyllabus(selectedDegree);
      setRegulations([]);
      setSemesterYears([]);
      setRegulation("");
      setSemesterYear("");
    } else {
      setSyllabus([]);
      setSemesterYears([]);
      setRegulation("");
      setSemesterYear("");
      const regulationkeys = Object.keys(
        syllabusDetails[value as keyof typeof syllabusDetails],
      );
      setRegulations(regulationkeys);
    }
  };

  const handleRegulationChange = (value: string) => {
    setRegulation(value);
    setLink("");
    setSemesterYear("");
    const selectedDegree =
      syllabusDetails[degree as keyof typeof syllabusDetails];
    const selectedregulation =
      selectedDegree[value as keyof typeof selectedDegree];
    const isArray = Array.isArray(selectedregulation);
    if (isArray) {
      setSyllabus(selectedregulation);
      setSemesterYears([]);
    } else {
      setSyllabus([]);
      const yearkeys = Object.keys(selectedregulation);
      setSemesterYears(yearkeys);
    }
  };

  const handleSemesterYearChange = (value: string) => {
    setLink("");
    setSemesterYear(value);
    const selectedDegree =
      syllabusDetails[degree as keyof typeof syllabusDetails];
    const selectedregulation =
      selectedDegree[regulation as keyof typeof selectedDegree];
    const selectedSemesterYear =
      selectedregulation[value as keyof typeof selectedregulation];
    const isArray = Array.isArray(selectedSemesterYear);
    if (isArray) {
      setSyllabus(selectedSemesterYear);
    }
  };

  const handleSyllabusChange = (value: string) => {
    if (value.includes("SYLLABUS")) {
      const val = value.split("SYLLABUS");
      const link = val[0] + "SYLLABUS" + encodeURI(val[1] || "");
      setLink(link);
    } else {
      setLink(value);
    }
  };

  const getProgressCount = () => {
    let count = 0;
    if (degree) count++;
    if (regulations.length > 0 && regulation) count++;
    if (semesteryears.length > 0 && semesteryear) count++;
    if (syllabus.length > 0 && link) count++;
    return count;
  };

  const getMaxProgress = () => {
    let max = 1; // degree
    if (regulations.length > 0) max++;
    if (semesteryears.length > 0) max++;
    if (syllabus.length > 0) max++;
    return max;
  };

  const handleDownload = () => {
    if (!link) {
      toast.error("Please select all required fields");
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <BookOpen className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
              Academic Syllabus
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Select your degree, regulation, semester year, and syllabus to view or download
          </p>
        </div>

        {/* Main Card */}
        <Card className="p-6 md:p-8 shadow-xl border-2">
          <div className="space-y-6">
            {/* Degree */}
            <div className="space-y-2">
              <Label htmlFor="degree" className="text-base font-semibold flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-blue-500" />
                Degree
              </Label>
              <Select value={degree} onValueChange={handleDegreechange}>
                <SelectTrigger id="degree" className="h-12 text-base">
                  <SelectValue placeholder="Select the Degree" />
                </SelectTrigger>
                <SelectContent>
                  {degrees.map((deg: string, index: number) => (
                    <SelectItem key={index} value={deg}>
                      {deg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Regulation - Conditional */}
            {regulations.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="regulation" className="text-base font-semibold flex items-center gap-2">
                  <Layers className="h-4 w-4 text-purple-500" />
                  Regulation
                </Label>
                <Select 
                  value={regulation} 
                  onValueChange={handleRegulationChange}
                  disabled={!degree}
                >
                  <SelectTrigger id="regulation" className="h-12 text-base">
                    <SelectValue placeholder="Select the Regulation" />
                  </SelectTrigger>
                  <SelectContent>
                    {regulations.map((reg: string, index: number) => (
                      <SelectItem key={index} value={reg}>
                        {reg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Semester Year - Conditional */}
            {semesteryears.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="semesteryear" className="text-base font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-500" />
                  Semester Year
                </Label>
                <Select 
                  value={semesteryear} 
                  onValueChange={handleSemesterYearChange}
                  disabled={!regulation}
                >
                  <SelectTrigger id="semesteryear" className="h-12 text-base">
                    <SelectValue placeholder="Select the Semester Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesteryears.map(
                      (semyear: string, index: number) => (
                        <SelectItem key={index} value={semyear}>
                          {semyear}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Syllabus - Conditional */}
            {syllabus.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="syllabus" className="text-base font-semibold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-orange-500" />
                  Syllabus
                </Label>
                <Select 
                  value={link} 
                  onValueChange={handleSyllabusChange}
                  disabled={semesteryears.length > 0 ? !semesteryear : !regulation && !degree}
                >
                  <SelectTrigger id="syllabus" className="h-12 text-base">
                    <SelectValue placeholder="Select the Syllabus" />
                  </SelectTrigger>
                  <SelectContent>
                    {syllabus.map((syl: any, index: number) => (
                      <SelectItem key={index} value={syl?.link || ""}>
                        {syl?.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {/* Mobile: Open in Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    disabled={!link}
                    className="w-full sm:hidden h-12 text-base"
                    onClick={handleDownload}
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    View Syllabus
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95%] max-w-4xl my-2 bg-transparent pt-8 pb-1 px-1">
                  <div className="mt-4">
                    {link === "" ? (
                      <></>
                    ) : (
                      <GoogleDocViewer url={link} splNote={"Syllabus"} />
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Desktop: Download Button */}
              {link ? (
                <Button
                  asChild
                  className="hidden sm:flex w-full sm:w-auto h-12 text-base"
                >
                  <Link href={link} target="_blank">
                    <Download className="mr-2 h-5 w-5" />
                    Download Syllabus
                  </Link>
                </Button>
              ) : (
                <Button
                  disabled
                  className="hidden sm:flex w-full sm:w-auto h-12 text-base"
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Syllabus
                </Button>
              )}

              {/* Desktop: View in New Tab */}
              {link && (
                <Button
                  asChild
                  variant="outline"
                  className="hidden sm:flex w-full sm:w-auto h-12 text-base"
                >
                  <Link href={link} target="_blank">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Open in New Tab
                  </Link>
                </Button>
              )}
            </div>

            {/* Progress Indicator */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Selection Progress:</span>
                <span className="font-semibold">
                  {getProgressCount()} / {getMaxProgress()}
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(getProgressCount() / getMaxProgress()) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <p className="font-semibold mb-1">Note:</p>
              <p>
                Select all required options above to view or download your syllabus. 
                The available options may vary based on your degree selection. 
                On mobile devices, you can view the syllabus directly. On desktop, you can download or open it in a new tab.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Syllabus;
