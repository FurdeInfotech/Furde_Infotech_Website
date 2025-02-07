import dbConnect from "@/lib/dbConnect";
import EmployeesIDModel from "@/models/EmployeesID";

export async function GET(
  request: Request,
  { params }: { params: { empid: string } }
) {
  await dbConnect();
  try {
    const { empid } = params;
    const user = await EmployeesIDModel.findOne({ empid}).select(
        "empname emprole empmobile empemergencymobile empbloodgroup empimage"
      );
    
  } catch (error) {
    
  }
}
