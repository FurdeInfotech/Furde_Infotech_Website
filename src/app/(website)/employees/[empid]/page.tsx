"use client"
import { Separator } from "@/components/ui/separator";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";

function Page() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleloading = () => {
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    }
    handleloading()
  })


  return (
    <div className=" w-full max-h-screen min-h-screen bg-gray-50 flex items-center flex-col py-5 sm:px-[35rem] justify-between px-5">
      <div className=" max-w-[30rem] h-full w-full flex flex-col justify-center items-center py-4 border-collapse border border-gray-300 shadow-lg rounded-lg">
        <div className="flex justify-center items-center h-40 w-40 rounded-full border border-[#ff2155] overflow-hidden">
        {loading ? (
            // Show logo when loading
            <div className="relative h-full w-full">
              <Image src="/fitmain.png" fill className="object-contain" alt="logo" priority/>
            </div>
          ) : (
            // Show animated image when loading completes
            <motion.div
              initial={{ y: 50, opacity: 0, filter: "blur(6px)" }} // Starts below with opacity 0
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} // Moves up and fades in
              transition={{ duration: 0.8, ease: "easeOut" }} // Smooth animation
              className="relative h-full w-full"
            >
              <Image src="/AdilPatel.jpg" fill className="object-contain rounded-full" alt="employee" priority/>
            </motion.div>
          )}
        </div>
        <div className="flex flex-col items-center mt-4">
          <h1 className="text-2xl font-bold text-gray-900">Adil Patel</h1>
          <h2 className="text-lg font-semibold text-gray-700">
            Full-Stack Developer
          </h2>

          <div className="w-full max-w-md mt-10">
            <table className="w-full  overflow-hidden">
              <tbody className="divide-y divide-gray-200 text-sm">
                <tr className="bg-gray-100">
                  <td className="px-4 py-2 font-semibold text-gray-600">
                    Mobile No. :
                  </td>
                  <Link href={`Phone`}>
                    <td className="px-4 py-2 text-gray-800">9503304568</td>
                  </Link>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold text-gray-600">
                    Emergency Mobile No. :
                  </td>
                  <Link href={`Phone`}>
                    {" "}
                    <td className="px-4 py-2 text-gray-800">95951847779</td>
                  </Link>
                </tr>
                <tr className="bg-gray-100">
                  <td className="px-4 py-2 font-semibold text-gray-600">
                    Blood Group :
                  </td>
                  <td className="px-4 py-2 text-gray-800">A+</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold text-gray-600">
                    Address :
                  </td>
                  <Link href={`ad`}>
                    <td className="px-4 py-2 text-gray-800">
                      A 27/28 Aditya Nagar, Solapur
                    </td>
                  </Link>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Separator orientation="horizontal" className="" />
      <div className=" flex justify-start items-start flex-col max-w-[30rem] sm:px-5 px-5 gap-5">
        <Link href="https://www.furdeinfotech.com" className=" flex justify-center items-center gap-2 flex-row"><Globe color="#ff2155" /> www.furdeinfotech.com</Link>
        <Link href={`tel:9689686686`} className=" flex justify-center items-center gap-2 flex-row"> <Phone color="#ff2155" />9689686686</Link>
        <Link href={`mailto:info@furdeinfotech.com`} className=" flex justify-center items-center gap-2 flex-row"><Mail color="#ff2155" />info@furdeinfotech.com</Link>
        <Link href={`https://maps.app.goo.gl/XkPbNZdn21rZPWG28`} className=" flex justify-center items-center gap-2 flex-row"><MapPin color="#ff2155" />Furde Complex Damani Nagar, Solapur - 413001</Link>
      </div>
    </div>
  );
}

export default Page;
