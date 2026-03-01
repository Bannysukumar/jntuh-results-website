"use client";
import { Building2Icon, MapPinIcon, Share2Icon, Briefcase, DollarSign, Clock } from "lucide-react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Link from "next/link";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { JobDetail } from "@/app/carrers/page";

interface JobsProps {
  jobDetails: JobDetail[];
  canIncrement: Boolean;
  incrementPage: () => void;
}

const Jobs: React.FC<JobsProps> = ({
  jobDetails,
  canIncrement,
  incrementPage,
}) => {
  const [selectedJob, setSelectedJob] = useState<JobDetail | null>(null);

  const scrollableRef = useRef<HTMLDivElement | null>(null);

  const onScrollEnd = useCallback(() => {
    if (canIncrement) {
      incrementPage();
    }
  }, [canIncrement, incrementPage]);

  useEffect(() => {
    if (jobDetails.length > 0 && (!selectedJob || !jobDetails.find(j => j.guid === selectedJob.guid))) {
      setSelectedJob(jobDetails[0]);
    }
  }, [jobDetails]);

  useEffect(() => {
    const scrollableElement = scrollableRef.current;

    const handleScroll = () => {
      if (
        scrollableElement &&
        scrollableElement.scrollHeight - scrollableElement.scrollTop <=
        scrollableElement.clientHeight + 100
      ) {
        onScrollEnd();
      }
    };

    if (scrollableElement) {
      scrollableElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [jobDetails, onScrollEnd]);

  if (jobDetails.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
          No Internships or Jobs to show
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Try adjusting your filters to see more results
        </p>
      </Card>
    );
  }

  const formatSalary = (min: number | null, max: number | null, currency: string) => {
    if (!min && !max) return null;
    const curr = currency || "USD";
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ${curr}`;
    if (min) return `From ${min.toLocaleString()} ${curr}`;
    return `Up to ${max?.toLocaleString()} ${curr}`;
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4">
      {/* Jobs List */}
      <div
        className="overflow-y-auto rounded-lg bg-white dark:bg-gray-800 p-4 w-full lg:max-w-[450px] border border-gray-200 dark:border-gray-700 max-h-[calc(100vh-280px)] lg:max-h-[calc(100vh-200px)] shadow-sm custom-scrollbar"
        ref={scrollableRef}
      >
        <div className="space-y-4">
          {jobDetails.map((jobDetail) => {
            const isSelected = selectedJob?.guid === jobDetail.guid;
            return (
              <Card
                key={jobDetail.guid}
                onClick={() => setSelectedJob(jobDetail)}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md p-5 border-l-4 ${isSelected
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 shadow-sm"
                    : "border-transparent border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-gray-600"
                  }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3 items-start flex-1 pr-2">
                    <div className="w-10 h-10 rounded border bg-white flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {jobDetail.companyLogo ? (
                        <img
                          src={jobDetail.companyLogo}
                          alt={jobDetail.companyName}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/default-company-icon.png';
                          }}
                        />
                      ) : (
                        <Building2Icon className="text-gray-400" size={20} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {jobDetail.title}
                      </h3>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                        {jobDetail.companyName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (navigator.share) {
                        navigator.share({
                          title: jobDetail.title,
                          text: `Check out this job: ${jobDetail.title} at ${jobDetail.companyName}`,
                          url: jobDetail.applicationLink,
                        });
                      }
                    }}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors self-start text-gray-400 hover:text-gray-600"
                  >
                    <Share2Icon size={14} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {jobDetail.locationRestrictions && jobDetail.locationRestrictions.length > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                      <MapPinIcon size={10} />
                      {jobDetail.locationRestrictions[0]}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                      <MapPinIcon size={10} />
                      Remote
                    </span>
                  )}

                  {jobDetail.employmentType && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-full">
                      <Clock size={10} />
                      {jobDetail.employmentType}
                    </span>
                  )}
                </div>

                {jobDetail.excerpt && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                    {jobDetail.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {formatSalary(jobDetail.minSalary, jobDetail.maxSalary, jobDetail.currency) ? (
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-500">
                        <DollarSign size={12} />
                        {formatSalary(jobDetail.minSalary, jobDetail.maxSalary, jobDetail.currency)}
                      </span>
                    ) : (
                      <span className="text-gray-400 font-normal">Salary not disclosed</span>
                    )}
                  </div>

                  {/* Mobile details drawer trigger */}
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 lg:hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Details
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="h-auto max-h-[85vh] lg:hidden">
                      <DrawerHeader className="flex justify-between border-b pb-4">
                        <div className="flex flex-col gap-3 w-full">
                          <div className="flex gap-4">
                            <div className="border border-gray-200 dark:border-gray-700 p-2 rounded-lg flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-900 flex-shrink-0">
                              {jobDetail.companyLogo ? (
                                <img
                                  src={jobDetail.companyLogo}
                                  alt={jobDetail.companyName}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/default-company-icon.png';
                                  }}
                                />
                              ) : (
                                <Building2Icon className="text-gray-400" size={24} />
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <DrawerTitle className="text-lg leading-tight mb-1">
                                {jobDetail.title}
                              </DrawerTitle>
                              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                {jobDetail.companyName}
                              </p>
                            </div>
                          </div>
                        </div>
                      </DrawerHeader>
                      <div className="overflow-auto p-4 md:p-6 space-y-6">
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-a:text-blue-600 hover:prose-a:text-blue-500"
                          dangerouslySetInnerHTML={{ __html: jobDetail.description || jobDetail.excerpt }} />
                      </div>
                      <div className="border-t p-4 bg-gray-50 dark:bg-gray-900/50">
                        <Link href={jobDetail.applicationLink} target="_blank" className="block">
                          <Button className="w-full shadow-md">Apply for this position</Button>
                        </Link>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>
              </Card>
            );
          })}

          {canIncrement && (
            <div className="w-full flex justify-center pt-2 pb-4">
              <Button
                variant="outline"
                className="w-full border-dashed border-2 hover:border-blue-500 hover:text-blue-600 transition-colors"
                onClick={() => incrementPage()}
              >
                Load More Jobs
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Detail View */}
      {selectedJob && (
        <div className="hidden lg:block flex-1 border border-gray-200 dark:border-gray-700 rounded-lg">
          <Card className="h-[calc(100vh-200px)] overflow-hidden flex flex-col shadow-sm relative rounded-lg border-0">
            <div className="absolute top-0 right-0 p-4">
              <Button
                onClick={() => window.open(selectedJob.applicationLink, '_blank')}
                className="shadow-sm border-2 border-primary"
              >
                Apply Now
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="max-w-3xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex gap-6 pb-8 border-b border-gray-100 dark:border-gray-800">
                  <div className="border border-gray-200 dark:border-gray-700 p-2 rounded-xl flex items-center justify-center w-20 h-20 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex-shrink-0">
                    {selectedJob.companyLogo ? (
                      <img
                        src={selectedJob.companyLogo}
                        alt={selectedJob.companyName}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default-company-icon.png';
                        }}
                      />
                    ) : (
                      <Building2Icon className="text-gray-400" size={32} />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 pr-24 leading-tight">
                      {selectedJob.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                      <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full">
                        <Building2Icon size={16} />
                        <span>{selectedJob.companyName}</span>
                      </div>

                      {selectedJob.locationRestrictions && selectedJob.locationRestrictions.length > 0 ? (
                        <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                          <MapPinIcon size={16} />
                          <span>{selectedJob.locationRestrictions.join(", ")}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
                          <MapPinIcon size={16} />
                          <span>Remote Worldwide</span>
                        </div>
                      )}

                      {formatSalary(selectedJob.minSalary, selectedJob.maxSalary, selectedJob.currency) && (
                        <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full">
                          <DollarSign size={16} />
                          <span>{formatSalary(selectedJob.minSalary, selectedJob.maxSalary, selectedJob.currency)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="prose prose-blue dark:prose-invert max-w-none 
                    prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg 
                    prose-a:text-blue-600 hover:prose-a:text-blue-500
                    prose-li:marker:text-blue-500
                    text-gray-600 dark:text-gray-300 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: selectedJob.description || selectedJob.excerpt || "No description provided." }} />
                </div>
              </div>
            </div>

            {/* Sticky Bottom Apply Action */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900/80 border-t border-gray-200 dark:border-gray-800 flex justify-end items-center gap-4 sticky bottom-0 z-10 backdrop-blur-sm">
              <span className="text-sm text-gray-500 font-medium">Ready to take the next step?</span>
              <Link href={selectedJob.applicationLink} target="_blank">
                <Button size="lg" className="px-8 shadow-md hover:shadow-lg transition-shadow">
                  Apply for this position
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Jobs;
