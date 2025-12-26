"use client";

import { useEffect, useState } from "react";
import CareerFilters from "@/components/carrers/carrerfilters";
import axios from "axios";
import Jobs from "@/components/carrers/jobs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Briefcase, TrendingUp, Users, Search } from "lucide-react";

interface JobDetail {
  job_id: string;
  title: string;
  company: string;
  experience: number;
  experience_word: string;
  remote: string;
  posted_date: string; // ISO 8601 date string
  link: string;
  expired: boolean;
  locations: string[];
  abouts: string[];
  qualifications: string[];
  responsibilities: string[];
  preferredqualifications: string[];
  minqualifications: string[];
}

const Carrers = () => {
  const [jobs, setJobs] = useState<JobDetail[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForme] = useState<{ [key: string]: string }>({
    job: "fulltime",
    title: "",
    type: "",
    experience: "",
    location: "India",
    company: "",
    status: "",
    dateposted: "",
  });

  useEffect(() => {
    const getJobDetails = async () => {
      try {
        if (page <= 1) setIsLoading(true);
        var pagination = "page=" + page + "&pageSize=" + pageSize;
        var query = "";
        if (form.job == "intern") {
          query += "&experience_word=intern";
        }
        if (form.type !== "") {
          query += "&remote=" + form.type;
        }
        if (form.experience !== "" && form.job !== "intern") {
          query += "&experience=" + form.experience;
        }
        if (form.location !== "") {
          query += "&location_name=" + form.location;
        }
        if (form.status != "") {
          query += "&expired=" + form.status;
        }
        if (form.company !== "") {
          query += "&company=" + form.company;
        }
        if (form.date_posted !== "") {
          query += "&date_filter=" + form.title;
        }
        if (form.title !== "") {
          query += "&title=" + form.title;
        }

        const url =
          "https://jobss.up.railway.app/job_opportunities?" +
          pagination +
          query;
        const response = await axios.get(url);
        if (response.status === 200) {
          setTotalPages(response.data.totalPages);
          setPage(response.data.currentPage);
          setPageSize(response.data.pageSize);
          if (page > 1) {
            setJobs((jobs) => [...jobs, ...response.data.jobs]);
          } else {
            setJobs(response.data.jobs);
          }
        }
      } catch (err) {
        console.log("Error occured while fetching jobs");
      }
      setIsLoading(false);
    };
    if (page == 1) {
      getJobDetails();
    }

    setPage(1);
  }, [form]);

  useEffect(() => {
    const getJobDetails = async () => {
      try {
        if (page <= 1) setIsLoading(true);
        var pagination = "page=" + page + "&pageSize=" + pageSize;
        var query = "";
        if (form.job == "intern") {
          query += "&experience_word=intern";
        }
        if (form.type !== "") {
          query += "&remote=" + form.type;
        }
        if (form.experience !== "") {
          query += "&experience=" + form.experience;
        }
        if (form.location !== "") {
          query += "&location_name=" + form.location;
        }
        if (form.status != "") {
          query += "&expired=" + form.status;
        }
        if (form.company !== "") {
          query += "&company=" + form.company;
        }
        if (form.title !== "") {
          query += "&title=" + form.title;
        }
        const url =
          "https://jobss.up.railway.app/job_opportunities?" +
          pagination +
          query;
        const response = await axios.get(url);
        if (response.status === 200) {
          setTotalPages(response.data.totalPages);
          setPage(response.data.currentPage);
          setPageSize(response.data.pageSize);
          if (page > 1) {
            setJobs((jobs) => [...jobs, ...response.data.jobs]);
          } else {
            setJobs(response.data.jobs);
          }
        }
      } catch (err) {
        console.log("Error occured while fetching jobs");
      }
      setIsLoading(false);
    };

    getJobDetails();
  }, [page, pageSize]);

  const incrementPage = () => {
    if (page < totalPages) {
      setPage((page) => page + 1);
    }
  };

  const activeJobs = jobs.filter((job) => !job.expired).length;
  const totalJobs = jobs.length;

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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Jobs</p>
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Jobs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeJobs}
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Page</p>
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
          <CareerFilters form={form} setForm={setForme} />
        </div>

        {/* Jobs Section */}
        {isLoading ? (
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
        ) : (
          <Jobs
            jobDetails={jobs}
            incrementPage={incrementPage}
            canIncrement={page < totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default Carrers;
