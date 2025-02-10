import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";

import cloudinary from "@/lib/cloudinary";
import EmployeesIDModel from "@/models/EmployeesID";

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
        { status: 401 }
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
    const empimage = formData.get("empimage") as File;
    const empaddress = formData.get("empaddress") as string;

    if (
      !empid ||
      !empname ||
      !emprole ||
      !empmobile ||
      !empemergencymobile ||
      !empbloodgroup ||
      !empimage ||
      !empaddress
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "All fields are required.",
        }),
        { status: 400 }
      );
    }

    const existingEmployee = await EmployeesIDModel.findOne({ empid });

    if (existingEmployee) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Employee ID already exists.",
        }),
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const arrayBuffer = await empimage.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract employee name (ensure it's formatted correctly)
    const employeeName = empname.replace(/\s+/g, "_").toLowerCase(); // Example formatting

    // Upload image to Cloudinary with custom public_id
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "employeesID",
            public_id: employeeName, // Set employee name as filename
            overwrite: true, // Optional: Overwrites if the same name exists
            format: "jpg", // Optional: Convert to a specific format
          },
          (error, result) => {
            if (error) {
              return reject(new Error("Failed to upload image to Cloudinary"));
            }
            resolve(result);
          }
        )
        .end(buffer);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { secure_url: secureUrl } = uploadResult as any;

    const newEmployeeID = new EmployeesIDModel({
      empid,
      empname,
      emprole,
      empmobile,
      empemergencymobile,
      empbloodgroup,
      empimage: secureUrl,
      empaddress,
    });

    await newEmployeeID.save();

    return new Response(
      JSON.stringify({
        success: true,
        data: newEmployeeID,
      }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error || "An error occurred while adding Employees ID",
      }),
      { status: 500 }
    );
  }
}
