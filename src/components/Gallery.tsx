"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import { X } from "lucide-react";

type Gallery = {
  id: string;
  title: string;
  category: string;
  image: string;
  orientation: string;
};

const Filters = ["All", "Office", "Events", "Client Visits"];

function Gallery() {
  const [filterValue, setFilterValue] = useState("All");
  const [galleryItems, setGalleryItems] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [openImage, setOpenImage] = useState<{
    image: string;
    orientation: string;
  } | null>(null); // Store the clicked image and orientation

  const handleImageClick = (image: string, orientation: string) => {
    setOpenImage({ image, orientation }); // Set the clicked image and orientation
    document.body.style.overflow = "hidden"; // Disable scrolling
  };

  const closeOverlay = () => {
    setOpenImage(null); // Clear the image
    document.body.style.overflow = ""; // Enable scrolling
  };

  const { toast } = useToast();

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/get-photo", {
        method: "GET",
        cache: "no-store", // Disable caching for fresh data
      });

      if (!response.ok) {
        throw new Error("Failed to fetch gallery items");
      }

      const data = await response.json();
      setGalleryItems(data.gallery);
      console.log(data.gallery);
    } catch (error) {
      console.error(error);
      toast({
        title: "Try Refreshing",
        description: `Failed to load Gallery: ${error}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtered items based on the selected filter value
  const filteredItems =
    filterValue === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === filterValue);

  return (
    <div className="relative w-full h-auto">
      {/* Filter Buttons */}
      <div className="glass-effect z-20 w-full absolute -top-20 sm:-top-14 md:pl-[30%] px-5 py-5 md:pr-[30%] flex items-center justify-between">
        {Filters.map((filter) => (
          <motion.button
            className={clsx(
              "relative z-10 cursor-pointer md:text-base text-sm font-semibold px-4 py-1.5 transition rounded-full",
              {
                "text-black font-bold": filter === filterValue,
                "text-white": filter !== filterValue,
              }
            )}
            key={filter}
            onClick={() => setFilterValue(filter)}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            {filter}
            {filter === filterValue && (
              <motion.span
                className="absolute inset-0 -z-10 rounded-full bg-white"
                layoutId="galleryAtiveFilter"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Grid Container */}
      {/* Wrap grid with AnimatePresence */}

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 md:px-20 px-5 lg:grid-cols-4 sm:gap-8 gap-4 pt-10 sm:pt-20 pb-10 sm:pb-12">
        {loading ? (
          <>
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton
                className=" bg-gray-200 rounded-lg  sm:h-80 w-full h-56"
                key={index}
              />
            ))}
          </>
        ) : (
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={`${item.id}`}
                className={clsx(
                  "relative group overflow-hidden flex rounded-lg",
                  item.orientation === "vertical"
                    ? "col-span-1 row-span-2"
                    : "col-span-1 row-span-1"
                )}
                initial={{ opacity: 0, scale: 0.5, y: 200 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 200 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  layout="responsive"
                  width={100}
                  height={100}
                  className="rounded-lg object-cover transition group-hover:blur-sm"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                  className="absolute z-40 hidden bg-black/50 h-full w-full px-2 transition group-hover:flex flex-col rounded-lg items-center justify-center"
                  onClick={() => handleImageClick(item.image, item.orientation)} // Open overlay on click
                >
                  <p className="sm:text-base text-[10px] font-semibold text-white">
                    {item.title}
                  </p>
                  <p className=" sm:text-xs text-[7px] text-white mt-5">click to view</p>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      <AnimatePresence>
        {openImage && (
          <motion.div
            className="fixed inset-0 bg-[#1f1f1f] bg-opacity-85 z-[1000] flex items-center justify-center transition-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOverlay}
          >
            <X
              className="text-white absolute right-10 top-10 cursor-pointer"
              size={30}
              strokeWidth={2.5}
              onClick={closeOverlay} // Close overlay on X click
            />
            <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
              <Image
                src={openImage.image}
                alt="Selected"
                width={openImage.orientation === "vertical" ? 500 : 950} // Dynamically set width
                height={openImage.orientation === "vertical" ? 800 : 600} // Adjust height accordingly
                className="rounded-md"
                placeholder="blur"
                blurDataURL={openImage.image}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Gallery;
