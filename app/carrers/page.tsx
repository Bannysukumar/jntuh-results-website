"use client";

import { useEffect, useState, useMemo } from "react";
import CareerFilters from "@/components/carrers/carrerfilters";
import axios from "axios";
import Jobs from "@/components/carrers/jobs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Briefcase, TrendingUp, Users, Search, AlertCircle, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface JobDetail {
  guid: string;
  title: string;
  excerpt: string;
  companyName: string;
  companyLogo: string;
  employmentType: string;
  minSalary: number | null;
  maxSalary: number | null;
  currency: string;
  locationRestrictions: string[];
  description: string;
  applicationLink: string;
  pubDate: number;
  seniority: string;
}

const Carrers = () => {
  const [jobs, setJobs] = useState<JobDetail[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalJobsCount, setTotalJobsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForme] = useState<{ [key: string]: string }>({
    job: "",
    title: "",
    type: "",
    experience: "",
    company: "",
    sortby: "date",
    dateposted: "",
  });

  useEffect(() => {
    const getJobDetails = async () => {
      try {
        if (page <= 1) setIsLoading(true);
        setErrorMsg("");
        const offset = (page - 1) * pageSize;
        const url = `/api/himalayas?limit=${pageSize}&offset=${offset}`;

        const response = await axios.get(url);
        if (response.status === 200) {
          setTotalJobsCount(response.data.totalCount || 0);
          if (page > 1) {
            setJobs((prevJobs) => {
              const prevGuids = new Set(prevJobs.map(j => j.guid));
              const newJobs = response.data.jobs.filter((j: JobDetail) => !prevGuids.has(j.guid));
              return [...prevJobs, ...newJobs];
            });
          } else {
            setJobs(response.data.jobs || []);
          }
        }
      } catch (err: any) {
        console.error("Error occurred while fetching jobs from Himalayas API:", err);
        if (err.response && err.response.status === 429) {
          setErrorMsg("Rate limit exceeded. Please try again later.");
        } else {
          setErrorMsg("Failed to load remote jobs. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    getJobDetails();
  }, [page, pageSize]);

  const incrementPage = () => {
    if (jobs.length < totalJobsCount) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const availableCompanies = useMemo(() => {
    const uniqueCompanies = Array.from(new Set(jobs.map((job) => job.companyName)));
    return uniqueCompanies.sort((a, b) => a.localeCompare(b));
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    if (form.title) {
      const searchLower = form.title.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.companyName.toLowerCase().includes(searchLower)
      );
    }

    if (form.job) {
      if (form.job === "intern") {
        result = result.filter((job) => job.employmentType && job.employmentType.toLowerCase().includes("intern"));
      } else if (form.job === "fulltime") {
        result = result.filter((job) => job.employmentType && job.employmentType.toLowerCase().includes("full"));
      } else if (form.job === "contractor") {
        result = result.filter((job) => job.employmentType && job.employmentType.toLowerCase().includes("contract"));
      } else if (form.job === "parttime") {
        result = result.filter((job) => job.employmentType && job.employmentType.toLowerCase().includes("part"));
      }
    }

    if (form.type === "worldwide") {
      result = result.filter((job) => !job.locationRestrictions || job.locationRestrictions.length === 0);
    } else if (form.type === "restricted") {
      result = result.filter((job) => job.locationRestrictions && job.locationRestrictions.length > 0);
    }

    if (form.experience) {
      result = result.filter((job) => job.seniority && job.seniority.toLowerCase().includes(form.experience));
    }

    if (form.company) {
      result = result.filter((job) => job.companyName === form.company);
    }

    if (form.dateposted) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);

      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      result = result.filter((job) => {
        const jobDate = new Date(job.pubDate * 1000);
        jobDate.setHours(0, 0, 0, 0);

        switch (form.dateposted) {
          case "today":
            return jobDate.getTime() === now.getTime();
          case "yesterday":
            return jobDate.getTime() === yesterday.getTime();
          case "past_7_days":
            return jobDate >= sevenDaysAgo && jobDate <= now;
          case "older":
            return jobDate < sevenDaysAgo;
          default:
            return true;
        }
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (form.sortby === "date") {
        return b.pubDate - a.pubDate;
      }
      return 0; // Default no sort
    });

    return result;
  }, [jobs, form]);

  const totalPages = Math.ceil(totalJobsCount / pageSize) || 1;
  const activeJobs = totalJobsCount;
  const totalJobs = totalJobsCount;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Briefcase className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
              Jobs & Careers
            </h1>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm md:text-base mb-6">
            Discover career opportunities! Find internships, jobs and kick start your journey!
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Available Jobs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalJobs}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Filtered Matches</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {filteredJobs.length} <span className="text-xs font-normal text-gray-500">out of {jobs.length} loaded</span>
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Page Fetched</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {page} / {totalPages || 1}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-4">
          <CareerFilters form={form} setForm={setForme} availableCompanies={availableCompanies} />



          {errorMsg && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">{errorMsg}</p>
            </div>
          )}
        </div>

        {/* Jobs Section */}
        {isLoading && page === 1 ? (
          <Card className="p-4 bg-white dark:bg-gray-800">
            <div className="w-full flex gap-2 lg:mr-2">
              <div className="overflow-y-auto dark:bg-gray-800 rounded bg-gray-50 p-2 w-full lg:max-w-[420px] border-gray-400 h-[83vh] flex">
                <div className="w-full justify-start">
                  {Array.from({ length: 10 }, (_, index) => (
                    <div
                      key={index}
                      className="rounded md:cursor-pointer mb-4 bg-white dark:bg-gray-900 border border-[#dadce0] p-4 gap-6 flex flex-col"
                    >
                      <div className="flex text-sm justify-between font-medium">
                        <Skeleton className="h-6 w-[250px]" />
                        <div>
                          <Skeleton className="h-6 w-[20px]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-10 mr-4">
                        <div className="flex gap-2 text-xs font-normal justify-center">
                          <Skeleton className="h-6 w-[20px]" />
                          <Skeleton className="h-6 w-[100px]" />
                        </div>
                        <div className="flex gap-1 text-xs font-normal justify-center">
                          <Skeleton className="h-6 w-[20px]" />
                          <Skeleton className="h-6 w-[100px]" />
                        </div>
                      </div>
                      <div className="text-xs flex">
                        <Skeleton className="w-[120px] h-[35px]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ) : filteredJobs.length === 0 && jobs.length > 0 ? (
          <Card className="p-12 text-center bg-white dark:bg-gray-800">
            <FilterX className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No matching jobs found</h3>
            <p className="text-gray-500 mb-6">There are no jobs matching your current filters in the loaded batch.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => setForme({ job: "", title: "", type: "", experience: "", company: "", sortby: "date", dateposted: "" })}>
                Clear Filters
              </Button>
              {jobs.length < totalJobsCount && (
                <Button onClick={incrementPage}>
                  Load More Jobs from API
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <Jobs
            jobDetails={filteredJobs}
            incrementPage={incrementPage}
            canIncrement={jobs.length < totalJobsCount}
          />
        )}
      </div>
    </div>
  );
};

export default Carrers;
