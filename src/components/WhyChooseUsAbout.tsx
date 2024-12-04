import Image, { StaticImageData } from "next/image";
import React from "react";
import bgin from "@/assets/staticbginverted.jpg";
import who1 from "@/assets/who1.png";
import who2 from "@/assets/who2.png";
import who3 from "@/assets/who3.png";
import who4 from "@/assets/who4.png";

// Define the structure of each feature
interface Feature {
  img: StaticImageData; // Specify the type for image imports
  title: string;
  description: string;
}

// Define the props for FeatureCard component
interface FeatureCardProps {
  img: StaticImageData; // Specify the type for image imports
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    img: who1,
    title: "Client Centered Approach",
    description:
      "We prioritize understanding and addressing the unique needs of every client, ensuring tailored solutions and lasting partnerships.",
  },
  {
    img: who2,
    title: "Operational Excellence",
    description:
      "Focused on optimizing workflows and processes, we drive efficiency and growth for your business with seamless execution.",
  },
  {
    img: who3,
    title: "Quality Commitment",
    description:
      "We uphold the highest standards in service delivery, ensuring precision, reliability, and satisfaction in every project.",
  },
  {
    img: who4,
    title: "Compliance & Reliability",
    description:
      "Adhering to industry regulations, we provide compliant and dependable solutions you can trust for long-term success.",
  },
];

const FeatureCard = ({ img, title, description }: FeatureCardProps) => (
  <div className="group relative border border-white bg-neutral-900 rounded-xl min-h-[350px] overflow-hidden">
    <Image
      src={img}
      alt={title}
      className="transition-all duration-500 ease-in-out group-hover:h-48 h-full w-full object-cover"
    />
    <div className="absolute w-full bottom-0 left-0 py-5 px-5 glass-effectw transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0">
      <p className="font-medium text-xl">{title}</p>
    </div>
    <div className="absolute left-0 w-full py-3 px-3 bg-neutral-900 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100">
      <p className="mt-5 text-sm">{description}</p>
    </div>
  </div>
);

export default function WhyChooseUsAbout() {
  return (
    <div className="relative min-h-screen">
      <Image
        src={bgin}
        alt="Background Image"
        fill
        quality={100}
        className="-z-[10] object-cover"
        priority // Optimizes the background image loading
      />
      <div className="md:pl-20 px-5 md:w-[44.5%] w-full">
        <h1 className="text-white text-4xl font-bold leading-tight">
          WHY CHOOSE US?
        </h1>
        <h2 className="text-white font-semibold text-3xl mt-10 flex items-center gap-2">
          Our Foundation of Success
        </h2>
        <p className="text-[#9CA3AF] mt-5 text-md">
          Our foundation is anchored in four essential pillars of success.
        </p>
      </div>

      <div className="grid text-white md:pl-20 px-5 md:pr-20 grid-cols-1 sm:grid-cols-4 gap-5 mt-12">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            img={feature.img}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>

      <div className="md:pl-20 px-5 mt-12 md:pb-0 pb-12">
        <p className="text-[#9CA3AF] text-md">
          At Furde Infotech, our commitment to excellence drives every aspect of
          our work. By prioritizing client needs, we build lasting partnerships
          rooted in trust and satisfaction. Our team&apos;s focus on high-quality
          standards ensures that each project is delivered with precision and
          care, fostering a culture where continuous improvement is part of
          daily life. We operate with a strong sense of accountability, adhering
          to industry best practices and regulatory standards, which keeps us
          reliable and compliant.
        </p>
      </div>
    </div>
  );
}
