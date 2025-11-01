"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import gulmoharpark from "@/assets/Furde_Construction/GULMOHAR PARK LAYOUT_page-0001.jpg";
import amarparkpark from "@/assets/Furde_Construction/Amar Park Layout_page-0001.jpg";
import furdehight1 from "@/assets/Furde_Construction/Furde-Heights/FH-1.jpg";
import furdehight2 from "@/assets/Furde_Construction/Furde-Heights/FH- 2.jpg";
import furdehight3 from "@/assets/Furde_Construction/Furde-Heights/FH- 3.jpg";
import furdehight4 from "@/assets/Furde_Construction/Furde-Heights/FH- 4.jpg";
import gulmoharplaza1 from "@/assets/Furde_Construction/gulmohar_plaza/Gulmohar Plazza_page-0001.jpg";
import gulmoharplaza2 from "@/assets/Furde_Construction/gulmohar_plaza/Gulmohar Plazza_page-0002.jpg";
import gulmoharplaza3 from "@/assets/Furde_Construction/gulmohar_plaza/Gulmohar Plazza_page-0003.jpg";
import gulmoharplaza4 from "@/assets/Furde_Construction/gulmohar_plaza/Gulmohar Plazza_page-0004.jpg";
import gulmoharplaza5 from "@/assets/Furde_Construction/gulmohar_plaza/Gulmohar Plazza_page-0005.jpg";
import gulmoharplaza6 from "@/assets/Furde_Construction/gulmohar_plaza/Gulmohar Plazza- 6.jpg";
import amarvishwa1 from "@/assets/Furde_Construction/amar_vishwa/Amar Vishwa photos_page-0001.jpg";
import amarvishwa2 from "@/assets/Furde_Construction/amar_vishwa/Amar Vishwa photos_page-0002.jpg";
import amarvishwa3 from "@/assets/Furde_Construction/amar_vishwa/Amar Vishwa photos_page-0003.jpg";
import amarvishwa4 from "@/assets/Furde_Construction/amar_vishwa/Amar Vishwa photos_page-0004.jpg";
import amarvishwa5 from "@/assets/Furde_Construction/amar_vishwa/Amar Vishwa photos_page-0005.jpg";
import amarvishwa6 from "@/assets/Furde_Construction/amar_vishwa/Amar Vishwa photos_page-0006.jpg";
import amarvishwa7 from "@/assets/Furde_Construction/amar_vishwa/Amar Vishwa photos_page-0007.jpg";
import amarvishwa8 from "@/assets/Furde_Construction/amar_vishwa/Amar Vishwa photos_page-0008.jpg";
import amarvishwa9 from "@/assets/Furde_Construction/amar_vishwa/Amar Vishwa photos_page-0009.jpg";
import amarvishwa10 from "@/assets/Furde_Construction/amar_vishwa/Amar Vishwa photos_page-0010.jpg";
import amarvishwa11 from "@/assets/Furde_Construction/amar_vishwa/Amar Vishwa photos_page-0011.jpg";
import amarvishwa12 from "@/assets/Furde_Construction/amar_vishwa/Amar Vishwa photos_page-0012.jpg";
import amarvishwa13 from "@/assets/Furde_Construction/amar_vishwa/Amar Vishwa photos_page-0013.jpg";
import amarvishwa14 from "@/assets/Furde_Construction/amar_vishwa/Amar vishwa 1_page-0001.jpg";
import amarvishwa15 from "@/assets/Furde_Construction/amar_vishwa/Amar Vishwa 2_page-0001.jpg";
import amarvishwa16 from "@/assets/Furde_Construction/amar_vishwa/Amar Vishwa_page-0001.jpg";
import Image, { StaticImageData } from "next/image";

const data = [
  {
    title: "Furde Heights",
    images: [furdehight1, furdehight2, furdehight3, furdehight4],
  },
  {
    title: "Amar Vishwa",
    images: [
      amarvishwa1, amarvishwa2, amarvishwa3, amarvishwa4, amarvishwa5,
      amarvishwa6, amarvishwa7, amarvishwa8, amarvishwa9, amarvishwa10,
      amarvishwa11, amarvishwa12, amarvishwa13, amarvishwa14, amarvishwa15,
      amarvishwa16,
    ],
  },
  {
    title: "Gulmohar Plaza",
    images: [
      gulmoharplaza1, gulmoharplaza2, gulmoharplaza3,
      gulmoharplaza4, gulmoharplaza5, gulmoharplaza6,
    ],
  },
  {
    title: "Amar Park",
    images: [amarparkpark],
  },
  {
    title: "Gulmohar Park",
    images: [gulmoharpark],
  },
];

function Page() {
  const [filter, setFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState<StaticImageData | null>(null);

  // Handle scroll lock
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  const filteredData = filter === "All" 
    ? data 
    : data.filter(item => item.title === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Filter Buttons */}
        <motion.div 
          className="flex flex-wrap gap-2 mb-8 justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            onClick={() => setFilter("All")}
            variant={filter === "All" ? "default" : "outline"}
            className="transition-all duration-300"
          >
            All
          </Button>
          {data.map((item) => (
            <Button
              key={item.title}
              onClick={() => setFilter(item.title)}
              variant={filter === item.title ? "default" : "outline"}
              className="transition-all duration-300"
            >
              {item.title}
            </Button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12"
          >
            {filteredData.map((section) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  {section.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {section.images.map((image, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative aspect-square overflow-hidden rounded-lg shadow-lg cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                    >
                      <Image
                        src={image}
                        alt={`${section.title} ${index + 1}`}
                        fill
                        className="object-cover"
                        priority
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative max-w-[90vw] max-h-[90vh] overflow-hidden">
                  <Image
                    src={selectedImage}
                    alt="Selected image"
                    width={1200}
                    height={800}
                    className="object-contain max-h-[85vh] w-auto h-auto"
                    priority
                  />
                  <button
                    className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Page;