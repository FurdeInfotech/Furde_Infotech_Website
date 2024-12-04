"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CareerCard from "./CareerCard";
import Opinion from "./Opinion";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import JobCardLoading from "./JobCardLoading";
import { Skeleton } from "./ui/skeleton";
import JobsNotFound from "./JobsNotFound";

type Job = {
  id: string;
  designation: string;
  department: string;
  description: string;
  location: string;
  type: "Full Time" | "Part Time" | "Internship";
};


export default function CareersCard() {
  const [entryjobs, setEntryJobs] = useState<Job[]>([]);
  const [entryLoading, setEntryLoading] = useState(true);
  const [experiencedjobs, setExperiencedJobs] = useState<Job[]>([]);
  const [experiencedLoading, setExperiencedLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    fetchEntryJobs();
    fetchExperiencedJobs();
  }, []);

  const fetchEntryJobs = async () => {
    setEntryLoading(true);
    try {
      const response = await axios.get<{ jobs: Job[] }>(
        "/api/get-job?level=Entry&limit=3"
      );
      setEntryJobs(response.data.jobs);
    } catch (error) {
      console.log(error);
      toast({
        title: "Try Refreshing",
        description: `Failed to load jobs:- ${error}`,
        variant: "destructive",
      });
    } finally {
      setEntryLoading(false);
    }
  };

  const fetchExperiencedJobs = async () => {
    setExperiencedLoading(true);
    try {
      const response = await axios.get<{ jobs: Job[] }>(
        "/api/get-job?level=Experienced&limit=3"
      );
      setExperiencedJobs(response.data.jobs);
      console.log("Entry data", response.data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Try Refreshing",
        description: `Failed to load jobs:- ${error}`,
        variant: "destructive",
      });
    } finally {
      setExperiencedLoading(false);
    }
  };

  return (
    <div className="bg-white md:pl-20 md:pr-20 px-5 py-10 text-black">
      <h1 className=" text-4xl font-bold leading-tight">
        ENTRY LEVEL INTERNSHIPS
      </h1>
      <div className="mt-10 flex justify-between items-center md:text-base text-[13px]">
        <p className=" text-[#4B5563] ">Kickstart Your Career Journey.</p>
        {entryLoading ? (
          <Skeleton className="sm:w-20 w-14 sm:h-5 h-3" />
        ) : (
          <Link
            href="/entry-level-roles"
            className={` ${
              entryjobs.length === 0
                ? "hidden"
                : "block text-[#1D4ED8] hover:text-[#1E3A8A] duration-200"
            }`}
          >
            View More
          </Link>
        )}
      </div>

      <div className="grid mt-12 grid-cols-1 md:grid-cols-3 gap-10">
        {entryLoading ? (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <JobCardLoading key={index} />
            ))}
          </>
        ) : entryjobs.length === 0 ? (
          <JobsNotFound/>
        ) : (
          entryjobs.map((job) => {
            return (
              <CareerCard
                key={job.id}
                designation={job.designation}
                department={job.department}
                description={job.description}
                location={job.location}
                type={job.type}
              />
            );
          })
        )}
      </div>
      <h1 className="mt-28 text-4xl font-bold leading-tight uppercase">
        Experienced Opportunities
      </h1>
      <div className=" mt-10 flex justify-between items-center md:text-base text-[13px]">
        <p className=" text-[#4B5563] ">
          Bring Your Expertise to Our department.
        </p>

        {experiencedLoading ? (
          <Skeleton className="sm:w-20 w-14 sm:h-5 h-3" />
        ) : (
          <Link
            href="/experienced-level-roles"
            className={` ${
              experiencedjobs.length === 0
                ? "hidden"
                : "block text-[#1D4ED8] hover:text-[#1E3A8A] duration-200"
            }`}
          >
            View More
          </Link>
        )}
      </div>

      <div className="grid mt-12 grid-cols-1 md:grid-cols-3 gap-10">
      {experiencedLoading ? (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <JobCardLoading key={index} />
            ))}
          </>
        ) : entryjobs.length === 0 ? (
          <JobsNotFound/>
        ) : (
          experiencedjobs.map((job) => {
            return (
              <CareerCard
                key={job.id}
                designation={job.designation}
                department={job.department}
                description={job.description}
                location={job.location}
                type={job.type}
              />
            );
          })
        )}
      </div>

      <Opinion />
    </div>
  );
}
