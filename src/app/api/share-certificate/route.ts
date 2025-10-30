import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CertificateShareEmail } from "@/components/certificate-share-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { recipientEmail, recipientName, certificateType, dateAwarded, certificateUrl, startDate, endDate } = body;

    if (!recipientEmail || !recipientName || !certificateType || !certificateUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send the email
    const { data, error } = await resend.emails.send({
      from: "Furde Infotech <info@furdeinfotech.com>",
      to: recipientEmail,
      subject: `Certificate of ${certificateType} - ${recipientName}`,
      react: CertificateShareEmail({
        recipientName,
        certificateType,
        dateAwarded,
        certificateUrl,
        startDate,
        endDate,
      }),
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Unexpected error in POST function:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
