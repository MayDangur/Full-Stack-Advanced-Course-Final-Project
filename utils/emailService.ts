import nodemailer from "nodemailer";
import dns from "dns";

// Prefer IPv4 when resolving SMTP hosts
dns.setDefaultResultOrder("ipv4first");

// Get the email configuration from environment variables
const getEmailTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailAppPassword =
    process.env.EMAIL_APP_PASSWORD;

  if (!emailUser || !emailAppPassword) {
    throw new Error(
      "Email credentials are not defined in environment variables"
    );
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: emailUser,
      pass: emailAppPassword,
    },
  });
};

// Send an email verification link to a newly registered user
export const sendVerificationEmail = async (
  email: string,
  verificationUrl: string
) => {
  const transporter = getEmailTransporter();

  await transporter.sendMail({
    from: `"TaxWise Israel" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your TaxWise Israel account",
    html: `
      <div dir="ltr" style="text-align: left;">
        <h2>Welcome to TaxWise Israel</h2>
        <p>Please verify your email address to activate your account.</p>
        <p>
          <a href="${verificationUrl}">
            Verify Email
          </a>
        </p>
        <p>If you did not create this account, you can ignore this email.</p>
      </div>
    `,
  });
};

// Send a secure login link to an existing user
export const sendMagicLoginEmail = async (
  email: string,
  loginUrl: string
) => {
  const transporter = getEmailTransporter();

  await transporter.sendMail({
    from: `"TaxWise Israel" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Sign in to your TaxWise Israel account",
    html: `
      <div dir="ltr" style="text-align: left;">
        <h2>Sign in to TaxWise Israel</h2>
        <p>Click the link below to securely sign in to your account.</p>
        <p>
          <a href="${loginUrl}">
            Sign In To TaxWise Israel
          </a>
        </p>
        <p>If you did not request this login link, you can ignore this email.</p>
      </div>
    `,
  });
};