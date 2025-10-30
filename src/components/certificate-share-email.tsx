import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface CertificateShareEmailProps {
  recipientName: string;
  certificateType: string;
  dateAwarded: string;
  certificateUrl: string;
  startDate?: string;
  endDate?: string;
}

export const CertificateShareEmail = ({
  recipientName,
  certificateType,
  dateAwarded,
  certificateUrl,
  startDate,
  endDate,
}: CertificateShareEmailProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Html>
      <Head />
      <Preview>
        Certificate of {certificateType} for {recipientName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Img
              src="https://www.furdeinfotech.com/fitmain.png"
              width="200"
              alt="Furde Infotech"
              style={logo}
            />
          </Section>

          {/* Main Content */}
          <Section style={content}>
            {/* Certificate Icon */}
            <div style={iconContainer}>
              <div style={certificateIcon}>🏆</div>
            </div>

            <Heading style={heading}>Certificate Shared With You!</Heading>

            <Text style={paragraph}>
              A Certificate of <strong>{certificateType}</strong> has been
              shared with you.
            </Text>

            {/* Certificate Details Card */}
            <Section style={detailsCard}>
              <Heading as="h2" style={cardHeading}>
                Certificate Details
              </Heading>

              <div style={detailRow}>
                <Text style={detailLabel}>Recipient Name:</Text>
                <Text style={detailValue}>{recipientName}</Text>
              </div>

              <div style={detailRow}>
                <Text style={detailLabel}>Certificate Type:</Text>
                <Text style={detailValue}>{certificateType}</Text>
              </div>

              {certificateType === "Internship" && startDate && endDate && (
                <div style={detailRow}>
                  <Text style={detailLabel}>Duration:</Text>
                  <Text style={detailValue}>
                    {formatDate(startDate)} - {formatDate(endDate)}
                  </Text>
                </div>
              )}

              <div style={detailRow}>
                <Text style={detailLabel}>Date Awarded:</Text>
                <Text style={detailValue}>{formatDate(dateAwarded)}</Text>
              </div>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Link href={certificateUrl} style={button}>
                View Certificate
              </Link>
            </Section>

            <Text style={note}>
              Click the button above to view the complete certificate with all
              official details and verification information.
            </Text>

            <Hr style={hr} />

            {/* Footer */}
            <Text style={footer}>
              This certificate is issued by{" "}
              <Link href={"https://furdeinfotech.com"}>
                <strong>Furde Infotech</strong>
              </Link>{" "}
              and can be verified through our official website.
            </Text>

            <Text style={footerLink}>
              <Link href={certificateUrl} style={link}>
                {certificateUrl}
              </Link>
            </Text>

            <Text style={footerText}>
              © {new Date().getFullYear()} Furde Infotech. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  padding: "32px 48px",
  textAlign: "center" as const,
  backgroundColor: "#fef9f3",
  borderBottom: "3px solid #e2e8f0",
};

const logo = {
  margin: "0 auto",
  display: "block",
  height: "auto",
  maxWidth: "200px",
};

const content = {
  padding: "0 48px",
};

const iconContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const certificateIcon = {
  fontSize: "64px",
  display: "inline-block",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  textAlign: "center" as const,
  color: "#1e293b",
  margin: "16px 0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#475569",
  textAlign: "center" as const,
  margin: "16px 0",
};

const detailsCard = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "24px",
  margin: "32px 0",
  border: "1px solid #e2e8f0",
};

const cardHeading = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#1e293b",
  margin: "0 0 20px 0",
};

const detailRow = {
  marginBottom: "16px",
};

const detailLabel = {
  fontSize: "14px",
  color: "#64748b",
  margin: "0 0 4px 0",
  fontWeight: "500",
};

const detailValue = {
  fontSize: "16px",
  color: "#1e293b",
  margin: "0",
  fontWeight: "600",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#3b82f6",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 40px",
  boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)",
};

const note = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#64748b",
  textAlign: "center" as const,
  margin: "16px 0",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "32px 0",
};

const footer = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#64748b",
  textAlign: "center" as const,
  margin: "16px 0",
};

const footerLink = {
  textAlign: "center" as const,
  margin: "8px 0",
};

const link = {
  color: "#3b82f6",
  textDecoration: "underline",
  fontSize: "14px",
};

const footerText = {
  fontSize: "12px",
  color: "#94a3b8",
  textAlign: "center" as const,
  margin: "24px 0 0 0",
};

export default CertificateShareEmail;
