import dbConnect from "@/lib/dbConnect";
import CertificateModel from "@/models/Certificate";
import { revalidateTag } from "next/cache";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Invalid certificate ID format" 
        }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    const certificate = await CertificateModel.findById(id)
      .select("employeeName certificateType startDate endDate dateAwarded createdAt updatedAt")
      .lean()
      .exec();

    if (!certificate) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Certificate not found" 
        }),
        { 
          status: 404, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    revalidateTag(`certificate-${id}`);

    return new Response(
      JSON.stringify({
        success: true,
        certificate,
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
    console.error("Error fetching certificate:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : "Internal Server Error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
