import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import CertificateModel from "@/models/Certificate";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const admin = session?.admin;

    if (!session || !admin) {
      return new Response(
        JSON.stringify({ success: false, message: "Not Authenticated" }),
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

    const certificate = await CertificateModel.findByIdAndDelete(id).lean().exec();

    if (!certificate) {
      return new Response(
        JSON.stringify({ success: false, message: "Certificate Not Found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Certificate deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("DELETE request error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error instanceof Error ? error.message : "Internal Server Error" 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
