import dbConnect from "@/lib/dbConnect";
import EmployeesIDModel from "@/models/EmployeesID";
import { revalidateTag } from "next/cache";

export async function GET(
  request: Request,
  { params }: { params: { empid: string } }
) {
  await dbConnect();
  try {
    const { empid } = params;
    const employee = await EmployeesIDModel.findOne({ empid }).select(
      "empname emprole empmobile empemergencymobile empbloodgroup empimage empaddress"
    );

    revalidateTag("employee"); // Invalidate cache for this tag

    if (!employee) {
      return new Response(
        JSON.stringify({ success: false, message: "Employee Not Found" }),
        { status: 404 }
      );
    } else {
      return new Response(JSON.stringify({ success: true, employee }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate", // Enforce no caching
          Pragma: "no-cache",
          Expires: "0",
        },
      });
    }
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate", // Enforce no caching
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }
}
