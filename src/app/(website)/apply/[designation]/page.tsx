"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ApplicationForm from "@/components/ApplicationForm";
import { FaChevronLeft } from "react-icons/fa6";
import axios from "axios";
import FormLoading from "@/components/FormLoading";
import Image from "next/image";
import notfound from "@/assets/noresult.svg";

type ApplyFormProps = {
  params: {
    designation: string;
  };
};

type Job = {
  designation: string;
  // Add other job-related fields as needed
};

export default function ApplyForm({ params }: ApplyFormProps) {
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null); // Ensure proper type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const designation = params.designation.replace(/-/g, " ");
  // Frontend: URL for Apply Now (This is fine for the frontend)
  const encodedDesignation = encodeURIComponent(
    designation.toLowerCase().replace(/ /g, "-")
  );

  // Fetch job data when the component mounts
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(
          `/api/get-job?designation=${encodedDesignation}`
        );

        if (response.data.success && response.data.jobs.length > 0) {
          setJob(response.data.jobs[0]);
        } else {
          setError("Job not found.");
        }
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Job not found or please refresh the page");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [designation]);

  if (loading) {
    return <FormLoading />;
  }

  if (error) {
    return (
      <section className="text-gray-900 bg-white md:pt-[12%] pt-[30%] md:pl-20 md:pr-20 pb-20 px-5 flex justify-center items-center gap-5 flex-col w-full min-h-screen">
        <Image src={notfound} alt="No Results Found" width={300} />
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className="text-gray-900 bg-white md:pt-[12%] pt-[30%] md:pl-20 md:pr-20 pb-20 px-5 w-full scroll-m-0">
      <h1 className="md:text-4xl text-2xl font-bold leading-tight capitalize flex flex-row items-center gap-6">
        <FaChevronLeft
          size={30}
          className="cursor-pointer"
          onClick={() => router.back()}
        />
        {designation}
      </h1>
      <div className="mt-8 flex md:flex-row flex-col justify-between md:items-center items-start md:gap-0 gap-2">
        <p className="text-gray-800 md:text-base text-sm">
          Enter the following details
        </p>
        <p className="text-gray-800 md:text-base text-sm">
          Fields marked with an asterisk <span className="font-bold">*</span>{" "}
          are required.
        </p>
      </div>

      {/* Render ApplicationForm only if job exists */}
      {job && <ApplicationForm designation={job.designation} />}
    </section>
  );
}
