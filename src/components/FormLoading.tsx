import React from "react";
import { Skeleton } from "./ui/skeleton";

function FormLoading() {
  return (
    <section className="text-gray-900 bg-white md:pt-[12%] pt-[30%] md:pl-20 md:pr-20 pb-20 px-5 w-full min-h-screen">
      <div className="flex flex-row items-center gap-6">
        <Skeleton className=" md:w-16 md:h-12 w-8 h-8" />
        <Skeleton className=" md:w-64 md:h-12 w-28 h-8" />
      </div>
      <div className="mt-8 flex md:flex-row flex-col justify-between md:items-center items-start md:gap-0 gap-2">
        <Skeleton className=" md:w-64 md:h-8 w-28 h-5" />
        <Skeleton className=" md:w-64 md:h-8 w-28 h-5" />
      </div>
      <div className="space-y-7 mt-14 flex flex-col">
        <div className="grid grid-cols-2 md:gap-12 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index}>
              <Skeleton className=" w-20 h-5" />
              <Skeleton className="md:h-10 mt-5 md:col-span-1 col-span-2 h-7" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FormLoading;
