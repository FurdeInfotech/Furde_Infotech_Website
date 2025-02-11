"use client";
import { Separator } from "@/components/ui/separator";
import { Globe, Mail, MapPin, Phone, RotateCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import NoResultIcon from "@/assets/noresult.svg";
import { Button } from "@/components/ui/button";

interface EmployeeProfile {
  empid: string;
  empname: string;
  emprole: string;
  empimage?: string;
  empaddress: string;
  empbloodgroup?: string;
  empmobile: number;
  empemergencymobile: number;
}

function Page({ params }: { params: { empid: string } }) {
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<EmployeeProfile | null>(null);
  const [error, setError] = useState("");
  const [found, setFound] = useState("");
  const { toast } = useToast();
  const { empid } = params;

  useEffect(() => {
    console.log(empid);
    async function fetchEmployee() {
      setLoading(true);
      try {
        const response = await axios.get(`/api/get-employee/${empid}`);

        if (response.data.success) {
          setEmployee(response.data.employee);
          setError("");
          setFound("");
        } else {
          throw new Error(response.data.message);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          "An error occurred while fetching user.";

        if (err.response?.status === 404) {
          toast({
            title: "Not Found",
            description: "Employee not found",
            variant: "destructive",
          });
          setFound("Employee Not Found");
        } else {
          toast({
            title: "Try Refreshing",
            description: `error: ${errorMessage}`,
            variant: "destructive",
          });
        }

        setEmployee(null);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployee();
  }, [empid]);

  if (found)
    return (
      <div className=" w-full max-h-screen min-h-screen bg-gray-50 flex items-center flex-col py-5 sm:px-[35rem] gap-5 justify-center px-5">
        <Image src={NoResultIcon} alt="No Result" />
        <h1 className="sm:text-2xl text-xl font-bold text-gray-900">
          Employee Not Found
        </h1>
      </div>
    );

  if (error)
    return (
      <div className=" w-full max-h-screen min-h-screen bg-gray-50 flex items-center flex-col py-5 sm:px-[35rem] gap-5 justify-center px-5">
        <Image src={NoResultIcon} alt="No Result" />
        <h1 className="sm:text-2xl text-xl font-bold text-gray-900">{error}</h1>
        <Button onClick={() => window.location.reload()}>
          <RotateCcw size={16} className=" mr-1" />
          Retry
        </Button>
      </div>
    );

  return (
    <div className=" w-full max-h-screen min-h-screen bg-gray-50 flex items-center flex-col py-5 sm:px-[35rem] justify-between px-5">
      <div className=" max-w-[30rem] h-full w-full flex flex-col justify-center items-center py-4 border-collapse border border-gray-300 shadow-lg rounded-lg">
        <div className="flex justify-center items-center h-40 w-40 rounded-full border border-[#ff2155] overflow-hidden">
          {loading ? (
            // Show logo when loading
            <div className="relative h-full w-full">
              <Image
                src="/fitmain.png"
                fill
                className="object-contain"
                alt="logo"
                priority
              />
            </div>
          ) : (
            // Show animated image when loading completes
            <motion.div
              initial={{ y: 50, opacity: 0, filter: "blur(6px)" }} // Starts below with opacity 0
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} // Moves up and fades in
              transition={{ duration: 0.8, ease: "easeOut" }} // Smooth animation
              className="relative h-full w-full"
            >
              <Image
                src={employee?.empimage || "/fitmain.png"}
                fill
                className="object-contain rounded-full"
                alt="employee"
                priority
                placeholder="blur"
              />
            </motion.div>
          )}
        </div>
        <div className="flex flex-col items-center mt-4">
          {loading ? (
            <Skeleton className=" w-[30%] h-6" />
          ) : (
            <h1 className="text-2xl font-bold text-gray-900">
              {employee?.empname}
            </h1>
          )}

          {loading ? (
            <Skeleton className="w-1/2 h-6 mt-3" />
          ) : (
            <h2 className="text-lg font-semibold text-gray-700">
              {employee?.emprole}
            </h2>
          )}

          <div className="w-full max-w-md mt-10">
            <table className="w-full  overflow-hidden">
              <tbody className="divide-y divide-gray-200 text-sm">
                <tr className="bg-gray-100">
                  <td className="px-4 py-2 font-semibold text-gray-600">
                    Mobile No. :
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {loading ? (
                      <Skeleton className="h-7 sm:w-[150px] w-[80px]" />
                    ) : (
                      <Link href={`tel:${employee?.empmobile}`}>
                        {employee?.empmobile}
                      </Link>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold text-gray-600">
                    Emergency Mobile No. :
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {loading ? (
                      <Skeleton className="h-7 sm:w-[150px] w-[80px]" />
                    ) : (
                      <Link href={`tel:${employee?.empemergencymobile}`}>
                        {employee?.empemergencymobile}
                      </Link>
                    )}
                  </td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="px-4 py-2 font-semibold text-gray-600">
                    Blood Group :
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {loading ? (
                      <Skeleton className="h-7 w-[40px]" />
                    ) : (
                      <> {employee?.empbloodgroup}</>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold text-gray-600">
                    Address :
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {loading ? (
                      <Skeleton className="h-7 sm:w-[210px] w-[100px]" />
                    ) : (
                      <>{employee?.empaddress}</>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Separator orientation="horizontal" className="" />
      <div className=" flex justify-start items-start flex-col max-w-[30rem] sm:px-5 gap-5">
        <Link
          href="https://www.furdeinfotech.com"
          className=" flex justify-center items-center gap-2 flex-row"
        >
          <Globe color="#ff2155" /> www.furdeinfotech.com
        </Link>
        <Link
          href={`tel:9689686686`}
          className=" flex justify-center items-center gap-2 flex-row"
        >
          {" "}
          <Phone color="#ff2155" />
          9689686686
        </Link>
        <Link
          href={`mailto:info@furdeinfotech.com`}
          className=" flex justify-center items-center gap-2 flex-row"
        >
          <Mail color="#ff2155" />
          info@furdeinfotech.com
        </Link>
        <Link
          href={`https://maps.app.goo.gl/XkPbNZdn21rZPWG28`}
          className=" flex justify-center items-center gap-2 flex-row"
        >
          <MapPin color="#ff2155" />
          Furde Complex Damani Nagar, Solapur - 413001
        </Link>
      </div>
    </div>
  );
}

export default Page;
