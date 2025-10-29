"use client";

import { useRef } from "react";
import { Download, FileDown } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface CertificateTemplateProps {
  recipientName: string;
  certificateType:
    | "Internship"
    | "Appreciation"
    | "Game Changer"
    | "Excellence"
    | "Achievement";
  dateAwarded: string;
  organizationName: string;
  organizationLogo?: string;
  startDate?: string;
  endDate?: string;
}

export default function CertificateTemplate({
  recipientName,
  certificateType,
  dateAwarded,
  startDate,
  endDate,
}: CertificateTemplateProps) {
  const getCertificateTitle = () => {
    switch (certificateType) {
      case "Internship":
        return "Internship Completion";
      case "Appreciation":
        return "Appreciation";
      case "Game Changer":
        return "Game Changer";
      case "Excellence":
        return "Excellence";
      case "Achievement":
        return "Achievement";
      default:
        return "Completion";
    }
  };

  const getCertificateDescription = () => {
    switch (certificateType) {
      case "Internship":
        return "Has Successfully Completed the Internship Program with dedication and professionalism.";
      case "Appreciation":
        return "Is Hereby Recognized for Outstanding Contribution and Exceptional Service.";
      case "Game Changer":
        return "Is Honored as a Game Changer for Extraordinary Innovation and Transformative Impact.";
      case "Excellence":
        return "Is Awarded for Demonstrating Remarkable Excellence and Superior Performance.";
      case "Achievement":
        return "Is Recognized for Outstanding Achievement and Significant Success.";
      default:
        return "Has Successfully Completed";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const certificateRef = useRef<HTMLDivElement>(null);
  const certificateUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const handleDownloadPDF = async () => {
    if (typeof window === "undefined") return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      if (certificateRef.current) {
        // Capture certificate at high quality
        const canvas = await html2canvas(certificateRef.current, {
          scale: 3,
          backgroundColor: "#ffffff",
          logging: false,
          useCORS: true,
          allowTaint: true,
          imageTimeout: 0,
          removeContainer: false,
        });

        // Create PDF with landscape orientation (16:12 aspect ratio)
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        const imgData = canvas.toDataURL("image/png");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

        // Add invisible clickable link at QR code position (left bottom of certificate)
        // QR code is approximately at: 16% from left, 85% from top
        const linkX = pdfWidth * 0.16;
        const linkY = pdfHeight * 0.85;
        const linkWidth = pdfWidth * 0.12; // About 12% width for QR area
        const linkHeight = pdfHeight * 0.02; // About 6% height

        pdf.link(linkX, linkY, linkWidth, linkHeight, { url: certificateUrl });

        pdf.save(`certificate-${recipientName.replace(/\s+/g, "-")}.pdf`);
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Unable to download certificate. Please try again.");
    }
  };

  const handleDownloadImage = async () => {
    if (typeof window === "undefined") return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      if (certificateRef.current) {
        const canvas = await html2canvas(certificateRef.current, {
          scale: 3,
          backgroundColor: "#ffffff",
          logging: false,
          useCORS: true,
          allowTaint: true,
          imageTimeout: 0,
          removeContainer: false,
        });

        const link = document.createElement("a");
        link.download = `certificate-${recipientName.replace(/\s+/g, "-")}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Unable to download certificate. Please try again.");
    }
  };
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media print {
            .certificate-inner {
              width: 1200px !important;
              height: 900px !important;
              box-shadow: none !important;
            }
          }
        `,
        }}
      />
      <div className="w-full mx-auto">
        {/* Certificate Container */}
        <div
          ref={certificateRef}
          className="certificate-inner relative bg-white shadow-2xl overflow-hidden w-full"
          style={{ aspectRatio: "16/12" }}
        >
          {/* SVG Background with decorative border */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 900"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Gradient for the border */}
              <linearGradient
                id="borderGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#d4af37" />
                <stop offset="50%" stopColor="#f4e4c1" />
                <stop offset="100%" stopColor="#d4af37" />
              </linearGradient>

              {/* Pattern for decorative elements - Stars instead of circles */}
              <pattern
                id="decorPattern"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 14 L 21.5 18.5 L 26 18.5 L 22.5 21.5 L 24 26 L 20 23 L 16 26 L 17.5 21.5 L 14 18.5 L 18.5 18.5 Z"
                  fill="#d4af37"
                  opacity="0.3"
                />
              </pattern>

              <radialGradient id="sealGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffd700" />
                <stop offset="30%" stopColor="#ffed4e" />
                <stop offset="60%" stopColor="#d4af37" />
                <stop offset="85%" stopColor="#aa8c2c" />
                <stop offset="100%" stopColor="#8b6914" />
              </radialGradient>

              <g id="flowerCorner">
                <circle cx="0" cy="0" r="8" fill="#d4af37" opacity="0.8" />
                <circle cx="8" cy="0" r="6" fill="#d4af37" opacity="0.6" />
                <circle cx="-8" cy="0" r="6" fill="#d4af37" opacity="0.6" />
                <circle cx="0" cy="8" r="6" fill="#d4af37" opacity="0.6" />
                <circle cx="0" cy="-8" r="6" fill="#d4af37" opacity="0.6" />
                <circle cx="5.6" cy="5.6" r="5" fill="#d4af37" opacity="0.5" />
                <circle cx="-5.6" cy="5.6" r="5" fill="#d4af37" opacity="0.5" />
                <circle cx="5.6" cy="-5.6" r="5" fill="#d4af37" opacity="0.5" />
                <circle
                  cx="-5.6"
                  cy="-5.6"
                  r="5"
                  fill="#d4af37"
                  opacity="0.5"
                />
                <circle cx="0" cy="0" r="3" fill="#8b6914" />
              </g>
            </defs>

            {/* Outer decorative border */}
            <rect
              x="30"
              y="30"
              width="1140"
              height="840"
              fill="none"
              stroke="url(#borderGradient)"
              strokeWidth="4"
            />
            <rect
              x="40"
              y="40"
              width="1120"
              height="820"
              fill="none"
              stroke="#d4af37"
              strokeWidth="2"
              opacity="0.7"
            />
            <rect
              x="50"
              y="50"
              width="1100"
              height="800"
              fill="none"
              stroke="#f4e4c1"
              strokeWidth="1"
              opacity="0.5"
            />

            {/* Top-left corner flower */}
            <g transform="translate(70, 70)">
              <use href="#flowerCorner" />
              <circle
                cx="0"
                cy="0"
                r="20"
                fill="none"
                stroke="#d4af37"
                strokeWidth="1"
                opacity="0.3"
              />
            </g>

            {/* Top-right corner flower */}
            <g transform="translate(1130, 70)">
              <use href="#flowerCorner" />
              <circle
                cx="0"
                cy="0"
                r="20"
                fill="none"
                stroke="#d4af37"
                strokeWidth="1"
                opacity="0.3"
              />
            </g>

            {/* Bottom-left corner flower */}
            <g transform="translate(70, 830)">
              <use href="#flowerCorner" />
              <circle
                cx="0"
                cy="0"
                r="20"
                fill="none"
                stroke="#d4af37"
                strokeWidth="1"
                opacity="0.3"
              />
            </g>

            {/* Bottom-right corner flower */}
            <g transform="translate(1130, 830)">
              <use href="#flowerCorner" />
              <circle
                cx="0"
                cy="0"
                r="20"
                fill="none"
                stroke="#d4af37"
                strokeWidth="1"
                opacity="0.3"
              />
            </g>

            {/* Decorative top and bottom flourishes */}
            <path
              d="M 100 50 Q 200 30 300 50 T 500 50 T 700 50 T 900 50 T 1100 50"
              fill="none"
              stroke="#d4af37"
              strokeWidth="2"
              opacity="0.5"
            />
            <path
              d="M 100 850 Q 200 870 300 850 T 500 850 T 700 850 T 900 850 T 1100 850"
              fill="none"
              stroke="#d4af37"
              strokeWidth="2"
              opacity="0.5"
            />

            {/* Subtle background pattern */}
            <rect
              x="50"
              y="50"
              width="1100"
              height="800"
              fill="url(#decorPattern)"
            />
          </svg>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 text-center">
            {/* Header Section */}
            <div className="py-2 sm:py-3">
              <p className="text-[10px] sm:text-sm font-semibold tracking-widest text-amber-700 uppercase">
                This Certifies That
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-start w-full ">
              {/* Certificate Header */}
              <div className="py-2 sm:py-2 md:py-2">
                <svg
                  className="w-full h-7 sm:h-9 md:h-12 lg:h-16"
                  viewBox="0 0 1000 100"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <path
                      id="headerCurve"
                      d="M 20,80 Q 500,15 980,80"
                      fill="none"
                    />
                  </defs>
                  <text
                    fontSize="60"
                    fontWeight="bold"
                    fill="#1e293b"
                    letterSpacing="1"
                    fontFamily="Playfair Display, Georgia, serif"
                  >
                    <textPath
                      href="#headerCurve"
                      startOffset="50%"
                      textAnchor="middle"
                    >
                      Certificate of{" "}
                      <tspan fill="#b45309">{getCertificateTitle()}</tspan>
                    </textPath>
                  </text>
                </svg>
              </div>

              {/* Company Logo */}
              <div className="py-1 sm:py-2 md:py-2">
                <img
                  src="/fitmain.png"
                  alt="Company Logo"
                  className="h-5 sm:h-8 md:h-10 lg:h-12 w-auto object-contain mx-auto"
                />
              </div>

              {/* Recipient Name */}
              <div className="py-1 mt-2 sm:py-2 md:py-3">
                <h3
                  className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 px-2 leading-tight"
                  style={{
                    fontFamily: "Georgia, serif",
                    letterSpacing: "0.05em",
                  }}
                >
                  {recipientName}
                </h3>

                {/* Main Text */}
                <div className="sm:pt-3 pt-1 text-center mx-auto">
                  <p className="text-[8px] sm:text-xs md:text-sm font-semibold text-slate-700 tracking-wide uppercase px-2 leading-tight break-words">
                    {getCertificateDescription()}
                  </p>
                  {certificateType === "Internship" && startDate && endDate && (
                    <p
                      className="text-[7px] sm:text-xs md:text-sm font-medium text-slate-700 pt-1 px-2 leading-tight"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Duration: {formatDate(startDate)} - {formatDate(endDate)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Golden Seal and Details Section */}
            <div className="flex items-center  justify-evenly w-full px-0 sm:px-4 md:px-10 pb-2 sm:pb-4 md:pb-8 gap-1 sm:gap-4 md:gap-8">
              {/* QR Code - Left */}
              <div className="flex flex-col items-center gap-0.5 sm:gap-1 min-h-[50px] sm:min-h-[60px] justify-end">
                <div className="bg-white p-0.5 sm:p-1.5 md:p-2 rounded border border-slate-300">
                  <QRCodeSVG
                    value={certificateUrl}
                    size={48}
                    className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-16 lg:h-16"
                    level="M"
                  />
                </div>
                <p className="text-[6px] sm:text-[8px] md:text-[8px] font-semibold text-slate-600 tracking-wide leading-tight">
                  VERIFY
                </p>
                <a
                  href={certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[5px] sm:text-[7px] md:text-[7px] text-blue-600 hover:text-blue-800 underline max-w-[70px] sm:max-w-[90px] break-words text-center leading-tight"
                  title={certificateUrl}
                  style={{ wordBreak: "break-all", hyphens: "auto" }}
                >
                  {certificateUrl
                    .replace(/^https?:\/\/(www\.)?/, "")
                    .slice(0, 18)}
                  ...
                </a>
              </div>

              {/* Golden Seal - Center */}
              <div className="flex flex-col items-center -mt-1 sm:mt-0">
                <div className="w-16 sm:w-20 md:w-28 lg:w-36 h-16 sm:h-20 md:h-28 lg:h-36 flex items-center justify-center">
                  <img
                    src="/seal.png"
                    alt="Official Seal"
                    className="max-w-full max-h-full object-contain"
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>
              </div>

              {/* Date Section - Right */}
              <div className="flex flex-col items-center gap-0.5 sm:gap-2">
                <div className="flex flex-col items-center gap-1">
                  <p className="text-[7px] sm:text-[10px] md:text-xs lg:text-sm font-semibold text-slate-700 text-center break-words max-w-[60px] sm:max-w-[80px] md:max-w-none leading-tight">
                    {formatDate(dateAwarded)}
                  </p>
                  <div className="w-8 sm:w-12 md:w-16 lg:w-20 border-t border-slate-400 mt-1" />
                </div>
                <p className="text-[7px] sm:text-[9px] md:text-xs font-semibold text-slate-600 tracking-wide">
                  DATE AWARDED
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="mt-6 sm:mt-8 flex justify-center gap-3 sm:gap-4 flex-wrap px-2 print:hidden">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg text-sm sm:text-base"
          >
            <FileDown className="w-4 h-4 sm:w-5 sm:h-5" />
            Download PDF
          </button>
          <button
            onClick={handleDownloadImage}
            className="flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-sm sm:text-base"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            Download Image
          </button>
        </div>
      </div>
    </>
  );
}
