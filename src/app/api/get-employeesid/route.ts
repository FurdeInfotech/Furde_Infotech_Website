import dbConnect from "@/lib/dbConnect";
import EmployeesIDModel from "@/models/EmployeesID";
import { revalidateTag } from "next/cache";

export async function GET() {
  try {
    await dbConnect();

    const employees = await EmployeesIDModel.find({}).sort({ createdAt: -1 });

    revalidateTag("employees"); // Invalidate cache for this tag

    return new Response(
      JSON.stringify({
        success: true,
        employees,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate", // Enforce no caching
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error) {

    return new Response(
      JSON.stringify({
        success: false,
        message: error ||  "Internal Server Error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  }
}

