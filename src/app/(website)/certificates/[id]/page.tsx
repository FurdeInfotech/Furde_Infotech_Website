"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CertificateTemplate from "@/components/certificate-template";
import { Award, Calendar, CheckCircle2, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Add print styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media print {
      body * {
        visibility: hidden;
      }
      #certificate-template, #certificate-template * {
        visibility: visible;
      }
      #certificate-template {
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

type Certificate = {
  _id: string;
  employeeName: string;
  certificateType: "Internship" | "Appreciation" | "Game Changer" | "Excellence" | "Achievement";
  startDate?: string;
  endDate?: string;
  dateAwarded: string;
  createdAt: string;
};

export default function CertificatePage() {
  const params = useParams();
  const id = params?.id as string;
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await fetch(`/api/get-certificate/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch certificate");
        }

        setCertificate(data.certificate);
      } catch (err) {
        console.error("Error fetching certificate:", err);
        setError(err instanceof Error ? err.message : "Failed to load certificate");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCertificate();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Certificate Not Found</h1>
          <p className="text-slate-600">{error || "The certificate you're looking for doesn't exist."}</p>
        </div>
      </div>
    );
  }

  const getCertificateTypeDescription = () => {
    switch (certificate.certificateType) {
      case "Internship":
        return "This certificate validates the successful completion of an internship program, demonstrating practical experience and professional development.";
      case "Appreciation":
        return "This certificate acknowledges outstanding contribution, dedication, and exemplary service that has made a significant positive impact.";
      case "Game Changer":
        return "This prestigious recognition honors exceptional innovation, transformative thinking, and groundbreaking contributions that have revolutionized our organization.";
      case "Excellence":
        return "This certificate celebrates exceptional performance, unwavering commitment to quality, and consistently exceeding expectations in all endeavors.";
      case "Achievement":
        return "This certificate commemorates remarkable accomplishments, significant milestones, and noteworthy success in professional pursuits.";
      default:
        return "This certificate recognizes outstanding performance and dedication.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pt-[30%] sm:pt-[12%]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Left Side - Certificate Information */}
          <div className="lg:col-span-2 space-y-6 print:hidden">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-slate-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                    Certificate of {certificate.certificateType}
                  </h1>
                  <p className="text-slate-600 text-sm sm:text-base">
                    Official Recognition Document
                  </p>
                </div>
              </div>
            </div>

            {/* Recipient Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Awarded To
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Recipient Name</p>
                  <p className="text-2xl font-bold text-slate-900 capitalize">
                    {certificate.employeeName}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600 mb-1">Certificate Type</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {certificate.certificateType}
                  </span>
                </div>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Certificate Details
              </h2>
              <div className="space-y-4">
                {certificate.certificateType === "Internship" && certificate.startDate && certificate.endDate && (
                  <>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Program Duration</p>
                      <p className="text-base font-semibold text-slate-900">
                        {new Date(certificate.startDate).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        -{" "}
                        {new Date(certificate.endDate).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-sm text-slate-600 mb-1">Total Duration</p>
                      <p className="text-base font-semibold text-slate-900">
                        {Math.ceil(
                          (new Date(certificate.endDate).getTime() -
                            new Date(certificate.startDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        days
                      </p>
                    </div>
                  </>
                )}
                <div className={certificate.certificateType === "Internship" ? "border-t border-slate-200 pt-4" : ""}>
                  <p className="text-sm text-slate-600 mb-1">Date Awarded</p>
                  <p className="text-base font-semibold text-slate-900">
                    {new Date(certificate.dateAwarded).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <p className="text-sm text-slate-600 mb-1">Certificate ID</p>
                  <p className="text-xs font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">
                    {certificate._id}
                  </p>
                </div>
              </div>
            </div>

            {/* Authenticity Statement */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 sm:p-8 text-white">
              <div className="flex items-start gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-bold mb-2">Certificate Authenticity</h2>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    {getCertificateTypeDescription()}
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-blue-500">
                <p className="text-sm text-blue-100 leading-relaxed">
                  This certificate is <span className="font-bold text-white">100% original</span> and has been
                  officially issued by our organization. It serves as authentic proof of the recipient's
                  accomplishment and can be verified through our official records.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Certificate Template */}
          <div className="lg:col-span-3">
            <div className="sticky top-8">
              <CertificateTemplate
                recipientName={certificate.employeeName}
                certificateType={certificate.certificateType}
                dateAwarded={certificate.dateAwarded}
                organizationName="Furde Infotech"
                startDate={certificate.startDate}
                endDate={certificate.endDate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
