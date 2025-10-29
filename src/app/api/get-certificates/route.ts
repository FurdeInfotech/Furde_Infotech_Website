import dbConnect from "@/lib/dbConnect";
import CertificateModel from "@/models/Certificate";
import { revalidateTag } from "next/cache";

export async function GET() {
  try {
    await dbConnect();

    const certificates = await CertificateModel.find({})
      .select("employeeName certificateType startDate endDate dateAwarded createdAt")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    revalidateTag("certificates");

    return new Response(
      JSON.stringify({
        success: true,
        certificates,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : "Internal Server Error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  }
}
