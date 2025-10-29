import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import CertificateModel from "@/models/Certificate";

export async function POST(request: Request) {
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

    const certificateData = {
      employeeName,
      certificateType,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      dateAwarded: new Date(dateAwarded),
    };

    const newCertificate = await CertificateModel.create(certificateData);

    // Return lean version
    const certificate = await CertificateModel.findById(newCertificate._id)
      .select("employeeName certificateType startDate endDate dateAwarded createdAt")
      .lean()
      .exec();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Certificate added successfully",
        data: certificate,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error adding certificate:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : "An error occurred while adding certificate",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
