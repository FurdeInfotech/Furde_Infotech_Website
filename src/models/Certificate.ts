import mongoose, { Schema, Document } from "mongoose";

export interface Certificate extends Document {
  employeeName: string;
  certificateType:
    | "Internship"
    | "Appreciation"
    | "Game Changer"
    | "Excellence"
    | "Achievement"
    | "Excellence in Performance"
    | "Dedication"
    | "Team Work"
    | "Employee of the Month"
    | "Employee of the Year"
    | "Outstanding Performance"
    | "Leadership Excellence"
    | "Strategic Achievement"
    | "Excellence in Management"
    | "Inspirational Leadership"
    | "Team Excellence"
    | "Innovation";
  startDate?: Date;
  endDate?: Date;
  dateAwarded: Date;
}

const CertificateSchema: Schema<Certificate> = new mongoose.Schema(
  {
    employeeName: {
      type: String,
      required: [true, "Employee name is required"],
    },
    certificateType: {
      type: String,
      enum: [
        "Internship",
        "Appreciation",
        "Game Changer",
        "Excellence",
        "Achievement",
        "Excellence in Performance",
        "Dedication",
        "Team Work",
        "Employee of the Month",
        "Employee of the Year",
        "Outstanding Performance",
        "Leadership Excellence",
        "Strategic Achievement",
        "Excellence in Management",
        "Inspirational Leadership",
        "Team Excellence",
        "Innovation",
      ],
      required: [true, "Certificate type is required"],
    },
    startDate: {
      type: Date,
      required: false,
    },
    endDate: {
      type: Date,
      required: false,
    },
    dateAwarded: {
      type: Date,
      required: [true, "Date awarded is required"],
    },
  },
  {
    timestamps: true,
  }
);

const CertificateModel =
  mongoose.models.Certificate ||
  mongoose.model<Certificate>("Certificate", CertificateSchema);

export default CertificateModel;
