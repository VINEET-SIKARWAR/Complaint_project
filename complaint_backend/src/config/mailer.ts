// src/config/mailer.ts
import nodemailer, { Transporter } from "nodemailer";

let transporter: Transporter;

if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
  throw new Error("SMTP_EMAIL and SMTP_PASSWORD must be set in your .env file");
}

transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD, // Use App Password if Gmail 2FA is enabled
  },
});

// Function to send email
const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendEmail;



