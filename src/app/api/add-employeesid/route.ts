import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import cloudinary from "@/lib/cloudinary";
import EmployeesIDModel from "@/models/EmployeesID";
import { createCanvas, loadImage } from "canvas"; // For adding logo & customizing QR
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

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

    // Extract base URL dynamically from request
    const baseUrl = new URL(request.url).origin;
    const profileUrl = `${baseUrl}/employees/${empid}`;

    // Generate QR Code with Styling
    const qrSize = 300; // Set QR Code size (adjustable)
    const canvas = createCanvas(qrSize, qrSize);
    const ctx = canvas.getContext("2d");

    await QRCode.toCanvas(canvas, profileUrl, {
      width: qrSize,
      margin: 2,
      color: {
        dark: "#000000", // QR Code color
        light: "#ffffff", // Background color
      },
    });

    // Add a Logo in the center
    const logo = await loadImage(
      "https://res.cloudinary.com/davi6vff3/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1739253905/FIT-JPEG_a9xfvg.jpg"
    ); // Replace with your logo URL
    const logoSize = qrSize * 0.25; // Logo size relative to QR code
    const centerX = (qrSize - logoSize) / 2;
    const centerY = (qrSize - logoSize) / 2;

    ctx.drawImage(logo, centerX, centerY, logoSize, logoSize);

    // Convert canvas to Buffer
    const qrCodeBuffer = canvas.toBuffer("image/png");

    // Upload QR Code to Cloudinary
    const qrCodeUploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "employeesID/qrcodes",
            public_id: `${employeeName}_qrcode`,
            overwrite: true,
            format: "png",
          },
          (error, result) => {
            if (error) {
              return reject(
                new Error("Failed to upload QR code to Cloudinary")
              );
            }
            resolve(result);
          }
        )
        .end(qrCodeBuffer);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { secure_url: qrCodeUrl } = qrCodeUploadResult as any;

    const newEmployeeID = new EmployeesIDModel({
      empid,
      empname,
      emprole,
      empmobile,
      empemergencymobile,
      empbloodgroup,
      empimage: secureUrl,
      empaddress,
      empqrcode: qrCodeUrl,
    });

    await newEmployeeID.save();

  
    // Return success response with employee data & QR code URL
    return new Response(
      JSON.stringify({
        success: true,
        data: newEmployeeID,
        qrCodeUrl, // Send QR Code URL so frontend can trigger download
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.log(error)
    return new Response(
      JSON.stringify({
        success: false,
        message: error || "An error occurred while adding Employees ID",
      }),
      { status: 500 }
    );
  }
}
