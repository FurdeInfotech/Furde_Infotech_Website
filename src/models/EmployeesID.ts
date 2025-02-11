import mongoose, { Schema, Document } from "mongoose";

export interface EmployeesID extends Document {
  empid: string;
  empname: string;
  emprole: string;
  empmobile: number;
  empemergencymobile: number;
  empbloodgroup: string;
  empimage: string;
  empaddress: string;
  empqrcode: string; 
}

const EmployeesIDSchema: Schema<EmployeesID> = new mongoose.Schema(
  {
    empid: {
      type: String,
      required: [true, "Employee-ID is required"],
      unique: true,
    },
    empname: {
      type: String,
      required: [true, "Employee Name is required"],
    },
    emprole: {
      type: String,
      required: [true, "Employee Role is required"],
    },
    empmobile: {
      type: Number,
      required: [true, "Employee Mobile No. is required"],
    },
    empemergencymobile: {
      type: Number,
      required: [true, "Employee Emergency Mobile No. is required"],
    },
    empbloodgroup: {
      type: String,
      enum: ["A+", "A-", "B-", "O+", "O-", "AB+", "AB-", "B+"],
      required: [true, "Employee Blood Group is required"],
    },
    empimage: {
      type: String,
      required: [true, "Employee Image is required"],
    },
    empaddress: {
      type: String,
      required: [true, "Employee Address is required"],
    },
    empqrcode: {
      type: String,
      required: [true, "Employee QRCode Mobile No. is required"],
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const EmployeesIDModel =
  mongoose.models.EmployeesID ||
  mongoose.model<EmployeesID>("EmployeesID", EmployeesIDSchema);

export default EmployeesIDModel;
