"use client";
import { Building2Icon, MapPinIcon, Share2Icon, Briefcase } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
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
import Image from "next/image";

interface JobDetail {
  job_id: string;
  title: string;
  company: string;
  experience: number;
  experience_word: string;
  remote: string;
  posted_date: string;
  link: string;
  expired: boolean;
  locations: string[];
  abouts: string[];
  qualifications: string[];
  responsibilities: string[];
  preferredqualifications: string[];
  minqualifications: string[];
}

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
  
  useEffect(() => {
    if (jobDetails.length > 0) {
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
  }, [jobDetails]);

  const onScrollEnd = () => {
    if (canIncrement) {
      incrementPage();
    }
  };

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

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4">
      {/* Jobs List */}
      <div
        className="overflow-y-auto rounded-lg bg-white dark:bg-gray-800 p-4 w-full lg:max-w-[450px] border border-gray-200 dark:border-gray-700 max-h-[calc(100vh-280px)] lg:max-h-[calc(100vh-200px)] shadow-sm"
        ref={scrollableRef}
      >
        <div className="space-y-3">
          {jobDetails.map((jobDetail) => (
            <Card
              key={jobDetail.job_id}
              onClick={() => {
                setSelectedJob(jobDetail);
              }}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md p-4 ${
                selectedJob?.job_id === jobDetail.job_id
                  ? "border-blue-500 border-2 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1 pr-2">
                  {jobDetail.title}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (navigator.share) {
                      navigator.share({
                        title: jobDetail.title,
                        text: `Check out this job: ${jobDetail.title} at ${jobDetail.company}`,
                        url: jobDetail.link,
                      });
                    }
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <Share2Icon size={16} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mb-3 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Building2Icon size={14} className="text-blue-500" />
                  <span className="font-medium">{jobDetail.company}</span>
                </div>
                {jobDetail.locations.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <MapPinIcon size={14} className="text-green-500" />
                    <span>{jobDetail.locations[0]}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Button 
                  size="sm" 
                  className="text-xs h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(jobDetail.link, '_blank');
                  }}
                >
                  Apply Now
                </Button>
                {jobDetail.expired && (
                  <span className="text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                    Expired
                  </span>
                )}
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 lg:hidden ml-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Details
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="h-auto max-h-[85vh] lg:hidden">
                    <DrawerHeader className="flex justify-between border-b pb-4">
                      <div className="flex flex-col gap-3 w-full">
                        <div className="flex gap-4">
                          <div className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg flex items-center justify-center w-20 h-20 bg-white dark:bg-gray-900">
                            <Image
                              src={`/${jobDetail.company.toLowerCase()}icon.png`}
                              width={60}
                              height={60}
                              alt={jobDetail.company}
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <DrawerTitle className="text-left text-lg leading-tight mb-2">
                              {jobDetail.title}
                            </DrawerTitle>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-1.5">
                                <Building2Icon size={14} />
                                <span>{jobDetail.company}</span>
                              </div>
                              {jobDetail.locations.length > 0 && (
                                <div className="flex items-center gap-1.5">
                                  <MapPinIcon size={14} />
                                  <span>{jobDetail.locations[0]}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </DrawerHeader>
                    <div className="overflow-auto p-4 space-y-4">
                      {jobDetail.responsibilities.length > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <p className="text-base font-semibold mb-3">Responsibilities:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {jobDetail.responsibilities.map((responsibility: string, index: number) => (
                              <li key={index} className="text-sm">{responsibility}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {(jobDetail.qualifications.length > 0 || jobDetail.minqualifications.length > 0 || jobDetail.preferredqualifications.length > 0) && (
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          {jobDetail.qualifications.length > 0 && (
                            <div className="mb-4">
                              <p className="text-base font-semibold mb-2">Qualifications:</p>
                              <ul className="list-disc pl-5 space-y-1">
                                {jobDetail.qualifications.map((qualification: string, index: number) => (
                                  <li key={index} className="text-sm">{qualification}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {jobDetail.minqualifications.length > 0 && (
                            <div className="mb-4">
                              <p className="text-base font-semibold mb-2">Minimum Qualifications:</p>
                              <ul className="list-disc pl-5 space-y-1">
                                {jobDetail.minqualifications.map((qualification: string, index: number) => (
                                  <li key={index} className="text-sm">{qualification}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {jobDetail.preferredqualifications.length > 0 && (
                            <div>
                              <p className="text-base font-semibold mb-2">Preferred Qualifications:</p>
                              <ul className="list-disc pl-5 space-y-1">
                                {jobDetail.preferredqualifications.map((qualification: string, index: number) => (
                                  <li key={index} className="text-sm">{qualification}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      {jobDetail.abouts.length > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <p className="text-base font-semibold mb-3">About:</p>
                          <div className="space-y-2 text-sm">
                            {jobDetail.abouts.map((about: string, index: number) => (
                              <p key={index} dangerouslySetInnerHTML={{ __html: about }} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="border-t p-4">
                      <Link href={jobDetail.link} target="_blank" className="block">
                        <Button className="w-full">Apply Now</Button>
                      </Link>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </Card>
          ))}
          {canIncrement && (
            <div className="w-full flex justify-center pt-4">
              <Button
                variant="outline"
                className="w-full"
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
        <div className="hidden lg:block flex-1">
          <Card className="h-[calc(100vh-200px)] overflow-y-auto p-6 border-2 border-blue-500">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex gap-4 pb-4 border-b">
                <div className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg flex items-center justify-center w-24 h-24 bg-white dark:bg-gray-900 flex-shrink-0">
                  <Image
                    src={`/${selectedJob.company.toLowerCase()}icon.png`}
                    width={80}
                    height={80}
                    alt={selectedJob.company}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedJob.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <div className="flex items-center gap-2">
                      <Building2Icon size={16} className="text-blue-500" />
                      <span className="font-medium">{selectedJob.company}</span>
                    </div>
                    {selectedJob.locations.length > 0 && (
                      <div className="flex items-center gap-2">
                        <MapPinIcon size={16} className="text-green-500" />
                        <span>{selectedJob.locations.join(", ")}</span>
                      </div>
                    )}
                  </div>
                  <Link href={selectedJob.link} target="_blank">
                    <Button className="mt-3">Apply Now</Button>
                  </Link>
                </div>
              </div>

              {/* Qualifications */}
              {(selectedJob.qualifications.length > 0 || selectedJob.minqualifications.length > 0 || selectedJob.preferredqualifications.length > 0) && (
                <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg">
                  {selectedJob.qualifications.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-3">Qualifications:</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        {selectedJob.qualifications.map((qualification: string, index: number) => (
                          <li key={index} className="text-sm">{qualification}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedJob.minqualifications.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-3">Minimum Qualifications:</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        {selectedJob.minqualifications.map((qualification: string, index: number) => (
                          <li key={index} className="text-sm">{qualification}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedJob.preferredqualifications.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Preferred Qualifications:</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        {selectedJob.preferredqualifications.map((qualification: string, index: number) => (
                          <li key={index} className="text-sm">{qualification}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* About */}
              {selectedJob.abouts.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">About the Job:</h3>
                  <div className="space-y-3 text-sm">
                    {selectedJob.abouts.map((about: string, index: number) => (
                      <p key={index} dangerouslySetInnerHTML={{ __html: about }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Responsibilities */}
              {selectedJob.responsibilities.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Responsibilities:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    {selectedJob.responsibilities.map((responsibility: string, index: number) => (
                      <li key={index} className="text-sm">{responsibility}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Apply Button */}
              <div className="pt-4 border-t">
                <Link href={selectedJob.link} target="_blank" className="block">
                  <Button className="w-full" size="lg">Apply Now</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Jobs;
