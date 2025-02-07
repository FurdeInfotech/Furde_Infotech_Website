import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import EmployeesIDModel from "@/models/EmployeesID";
import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinary";

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
        { status: 401 }
      );
    }

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid Employee ID" }),
        { status: 400 }
      );
    }

    const employee = await EmployeesIDModel.findById(id);

    if (!employee) {
      return new Response(
        JSON.stringify({ success: false, message: "Employee Not Found" }),
        { status: 404 }
      );
    }

    // ✅ Extract Cloudinary public_id from image URL
    if (employee.empimage) {
      try {
        const imageUrl = employee.empimage;
        const regex = /\/upload\/v\d+\/(.+)\.\w+$/; // Extracts public_id
        const match = imageUrl.match(regex);

        if (match && match[1]) {
          const publicId = match[1]; // Extracted "employeesID/shraddha_pawar"



          // ✅ Delete the image from Cloudinary
          const cloudinaryResponse = await cloudinary.uploader.destroy(publicId);

          if (cloudinaryResponse.result !== "ok") {
            console.error("Cloudinary deletion error:", cloudinaryResponse);
          }
        } else {
          console.error("Failed to extract public_id from:", imageUrl);
        }
      } catch (err) {
        console.error("Error extracting Cloudinary public_id:", err);
      }
    }

    // ✅ Delete the employee from the database
    await employee.deleteOne();

    return new Response(
      JSON.stringify({ success: true, message: "Employee and image deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE request error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
