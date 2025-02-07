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
    const empmobile = formData.get("empmobile") as unknown as number;
    const empemergencymobile = formData.get(
      "empemergencymobile"
    ) as unknown as number;
    const empbloodgroup = formData.get("empbloodgroup") as string;
    const empimage = formData.get("empimage") as File | null;

    const existingEmployee = await EmployeesIDModel.findById(id);
    if (!existingEmployee) {
      return new Response(
        JSON.stringify({ success: false, message: "Employee not found" }),
        { status: 404 }
      );
    }

    let secureUrl = existingEmployee.empimage;
    if (empimage) {
      // Delete old image from Cloudinary
      const oldImagePublicId = existingEmployee.empimage.split("/").pop()?.split(".")[0]; // Extract public_id
      if (oldImagePublicId) {
        await cloudinary.uploader.destroy(`employeesID/${oldImagePublicId}`);
      }
    
      // Upload new image to Cloudinary
      const arrayBuffer = await empimage.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: "employeesID" }, (error, result) => {
          if (error) reject(new Error("Failed to upload image to Cloudinary"));
          resolve(result);
        }).end(buffer);
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
          empmobile: empmobile || existingEmployee.empmobile,
          empemergencymobile:
            empemergencymobile || existingEmployee.empemergencymobile,
          empbloodgroup: empbloodgroup || existingEmployee.empbloodgroup,
          empimage: secureUrl || existingEmployee.empimage,
        },
      },
      { new: true }
    );

    return new Response(
      JSON.stringify({ success: true, data: updatedEmployee }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Error updating employee" }),
      { status: 500 }
    );
  }
}
