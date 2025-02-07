import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import EmployeesIDModel from "@/models/EmployeesID";
import cloudinary from "@/lib/cloudinary";
import mongoose from "mongoose";

// Update Employee ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session?.admin) {
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

    const formData = await request.formData();
    const empid = formData.get("empid") as string;
    const empname = formData.get("empname") as string;
    const emprole = formData.get("emprole") as string;
    const empmobile = formData.get("empmobile") as unknown as number;
    const empemergencymobile = formData.get(
      "empemergencymobile"
    ) as unknown as number;
    const empbloodgroup = formData.get("empbloodgroup") as string;
    const empimage = formData.get("empimage") as File | null;
    const empaddress = formData.get("empaddress") as string;

    const existingEmployee = await EmployeesIDModel.findById(id);
    if (!existingEmployee) {
      return new Response(
        JSON.stringify({ success: false, message: "Employee not found" }),
        { status: 404 }
      );
    }

    let secureUrl = existingEmployee.empimage;
    if (empimage) {
      let oldImagePublicId: string | undefined;
      if (existingEmployee.empimage) {
        oldImagePublicId = existingEmployee.empimage
          .split("/")
          .pop()
          ?.split(".")[0];
      }

      if (oldImagePublicId) {
        await cloudinary.uploader.destroy(`employeesID/${oldImagePublicId}`);
      }

      // Generate a public_id based on empname or fallback to existing name
      const imageName = (empname || existingEmployee.empname)
        .toLowerCase()
        .replace(/\s+/g, "_") // Replace spaces with underscores
        .replace(/[^a-z0-9_]/g, ""); // Remove special characters

      // Upload new image with the specified name
      const arrayBuffer = await empimage.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "employeesID",
              public_id: imageName, // Use the custom name
              overwrite: true, // Ensure it replaces the old image if needed
              resource_type: "image",
            },
            (error, result) => {
              if (error)
                reject(new Error("Failed to upload image to Cloudinary"));
              resolve(result);
            }
          )
          .end(buffer);
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      secureUrl = (uploadResult as any).secure_url;
    }

    const updatedEmployee = await EmployeesIDModel.findByIdAndUpdate(
      id,
      {
        $set: {
          empid: empid || existingEmployee.empid,
          empname: empname || existingEmployee.empname,
          emprole: emprole || existingEmployee.emprole,
          empmobile: empmobile || existingEmployee.empmobile,
          empemergencymobile:
            empemergencymobile || existingEmployee.empemergencymobile,
          empbloodgroup: empbloodgroup || existingEmployee.empbloodgroup,
          empimage: secureUrl || existingEmployee.empimage,
          empaddress: empaddress || existingEmployee.empaddress,
        },
      },
      { new: true }
    );

    return new Response(
      JSON.stringify({ success: true, data: updatedEmployee }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: "Error updating employee" }),
      { status: 500 }
    );
  }
}
