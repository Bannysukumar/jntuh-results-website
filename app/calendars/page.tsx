"use client";
import { useEffect, useState } from "react";
import {
  AcademicYearDetails,
  CalendarEntry,
  DegreeDetails,
  academicCalendars,
} from "@/constants/academiccalendars";
import Link from "next/link";
import toast from "react-hot-toast";
import Footer from "@/components/footer/footer";
import GoogleDocViewer from "@/components/googledocviewer/GoogleDocViewer";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import { Calendar, GraduationCap, CalendarDays, FileText, Download, ExternalLink } from "lucide-react";

const Calendars = () => {
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [degrees, setDegrees] = useState<DegreeDetails>({});
  const [years, setYears] = useState<AcademicYearDetails>({});
  const [calendars, setCalendars] = useState<CalendarEntry>({});

  const [academicYear, setAcademicYear] = useState<string>("");
  const [degree, setDegree] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [calendar, setCalendar] = useState<string>("");

  const [link, setLink] = useState<string>("");

  useEffect(() => {
    setAcademicYears(Object.keys(academicCalendars));
  }, []);

  useEffect(() => {
    if (academicYear) {
      setDegrees(academicCalendars[academicYear]);
      setDegree("");
      setYears({});
      setCalendars({});
      setYear("");
      setCalendar("");
      setLink("");
    }
  }, [academicYear]);

  useEffect(() => {
    if (degree && degrees != null) {
      setYears(degrees[degree]);
      setCalendars({});
      setYear("");
      setCalendar("");
      setLink("");
    }
  }, [degree, degrees]);

  useEffect(() => {
    if (year) {
      const academicYearDetails = years[year];
      setCalendars(academicYearDetails);
      setCalendar("");
      setLink("");
    }
  }, [year, years]);

  useEffect(() => {
    if (calendar) {
      const link = calendars[calendar];
      setLink(link);
    }
  }, [calendar, calendars]);

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
              <Calendar className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
              Academic Calendars
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Select your academic year, degree, year, and calendar to view or download
          </p>
        </div>

        {/* Main Card */}
        <Card className="p-6 md:p-8 shadow-xl border-2">
          <div className="space-y-6">
            {/* Academic Year */}
            <div className="space-y-2">
              <Label htmlFor="academicYear" className="text-base font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                Academic Year
              </Label>
              <Select value={academicYear} onValueChange={setAcademicYear}>
                <SelectTrigger id="academicYear" className="h-12 text-base">
                  <SelectValue placeholder="Select the Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year, index) => (
                    <SelectItem key={index} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Degree */}
            <div className="space-y-2">
              <Label htmlFor="degree" className="text-base font-semibold flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-purple-500" />
                Degree
              </Label>
              <Select 
                value={degree} 
                onValueChange={setDegree}
                disabled={!academicYear}
              >
                <SelectTrigger id="degree" className="h-12 text-base">
                  <SelectValue placeholder="Select the Degree" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(degrees).map((deg, index) => (
                    <SelectItem key={index} value={deg}>
                      {deg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year */}
            <div className="space-y-2">
              <Label htmlFor="year" className="text-base font-semibold flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-green-500" />
                Year
              </Label>
              <Select 
                value={year} 
                onValueChange={setYear}
                disabled={!degree}
              >
                <SelectTrigger id="year" className="h-12 text-base">
                  <SelectValue placeholder="Select the Year" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(years).map((yr, index) => (
                    <SelectItem key={index} value={yr}>
                      {yr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Calendar */}
            <div className="space-y-2">
              <Label htmlFor="calendar" className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-orange-500" />
                Calendar
              </Label>
              <Select 
                value={calendar} 
                onValueChange={setCalendar}
                disabled={!year}
              >
                <SelectTrigger id="calendar" className="h-12 text-base">
                  <SelectValue placeholder="Select the Calendar" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(calendars).map((cal, index) => (
                    <SelectItem key={index} value={cal}>
                      {cal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                    View Calendar
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95%] max-w-4xl my-2 bg-transparent pt-8 pb-1 px-1">
                  {link && <GoogleDocViewer url={link} splNote={"calendar"} />}
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
                    Download Calendar
                  </Link>
                </Button>
              ) : (
                <Button
                  disabled
                  className="hidden sm:flex w-full sm:w-auto h-12 text-base"
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Calendar
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
                  {[academicYear, degree, year, calendar].filter(Boolean).length} / 4
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${([academicYear, degree, year, calendar].filter(Boolean).length / 4) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <p className="font-semibold mb-1">Note:</p>
              <p>
                Select all four options above to view or download your academic calendar. 
                On mobile devices, you can view the calendar directly. On desktop, you can download or open it in a new tab.
              </p>
            </div>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Calendars;
