import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import EmployeesIDModel from "@/models/EmployeesID";
import cloudinary from "@/lib/cloudinary";

export async function DELETE(
  request: Request,
  { params }: { params: { empid: string } }
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

    const { empid } = params;


    const employee = await EmployeesIDModel.findOne({empid});

    if (!employee) {
      return new Response(
        JSON.stringify({ success: false, message: "Employee Not Found" }),
        { status: 404 }
      );
    }

     // ✅ Function to extract public_id from Cloudinary URL
     const extractPublicId = (imageUrl: string | undefined): string | null => {
      if (!imageUrl) return null;
      const regex = /\/upload\/v\d+\/(.+)\.\w+$/; // Extracts public_id
      const match = imageUrl.match(regex);
      return match && match[1] ? match[1] : null;
    };

    // ✅ Extract public_id for empimage & qrCode
    const empImagePublicId = extractPublicId(employee.empimage);
    const qrCodePublicId = extractPublicId(employee.empqrcode);

    // ✅ Delete images from Cloudinary
    const deleteFromCloudinary = async (publicId: string | null) => {
      if (publicId) {
        try {
          const cloudinaryResponse = await cloudinary.uploader.destroy(publicId);
          if (cloudinaryResponse.result !== "ok") {
            console.error("Cloudinary deletion error:", cloudinaryResponse);
          }
        } catch (err) {
          console.error("Error deleting from Cloudinary:", err);
        }
      }
    };

    await Promise.all([
      deleteFromCloudinary(empImagePublicId),
      deleteFromCloudinary(qrCodePublicId),
    ]);


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
