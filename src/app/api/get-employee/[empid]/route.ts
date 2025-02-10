import dbConnect from "@/lib/dbConnect";
import EmployeesIDModel from "@/models/EmployeesID";

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

    if (!employee) {
      return new Response(
        JSON.stringify({ success: false, message: "Employee Not Found" }),
        { status: 404 }
      );
    } else {
      return new Response(JSON.stringify({ success: true, employee }), {
        status: 200,
      });
    }
  } catch (error) {
    console.log(error)
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      { status: 500 }
    )
  }
}
