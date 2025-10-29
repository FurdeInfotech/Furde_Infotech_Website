import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import CertificateModel from "@/models/Certificate";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const admin = session?.admin;

    if (!session || !admin) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Not Authenticated",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { id } = params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid certificate ID format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();
    const { employeeName, certificateType, startDate, endDate, dateAwarded } = body;

    if (!employeeName || !certificateType || !dateAwarded) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Employee name, certificate type, and date awarded are required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate that internship certificates have start and end dates
    if (certificateType === "Internship" && (!startDate || !endDate)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Start date and end date are required for Internship certificates.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const updateData = {
      employeeName,
      certificateType,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      dateAwarded: new Date(dateAwarded),
    };

    const updatedCertificate = await CertificateModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .select("employeeName certificateType startDate endDate dateAwarded createdAt updatedAt")
      .lean()
      .exec();

    if (!updatedCertificate) {
      return new Response(
        JSON.stringify({ success: false, message: "Certificate not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Certificate updated successfully",
        data: updatedCertificate,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating certificate:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : "An error occurred while updating certificate",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
