import { google } from "googleapis";

// Get the Gmail API configuration from environment variables
const getGmailConfig = () => {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Gmail API configuration is not defined in environment variables"
    );
  }

  return {
    clientId,
    clientSecret,
    refreshToken,
  };
};

// Convert an email message to the base64url format required by Gmail API
const encodeMessage = (message: string) => {
  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

// Send an email through the Gmail HTTPS API
const sendEmail = async (
  email: string,
  subject: string,
  html: string
) => {
  const {
    clientId,
    clientSecret,
    refreshToken,
  } = getGmailConfig();

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
  });

  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString(
    "base64"
  )}?=`;

  const message = [
    `From: TaxWise Israel <taxwiseisrael@gmail.com>`,
    `To: ${email}`,
    `Subject: ${encodedSubject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "",
    html,
  ].join("\r\n");

  try {
    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodeMessage(message),
      },
    });
  } catch (error) {
    console.error("Gmail API email sending failed:", error);
    throw new Error("Email sending failed");
  }
};

// Send an email verification link to a newly registered user
export const sendVerificationEmail = async (
  email: string,
  verificationUrl: string
) => {
  await sendEmail(
    email,
    "Verify your TaxWise Israel account",
    `
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
    `
  );
};

// Send a secure login link to an existing user
export const sendMagicLoginEmail = async (
  email: string,
  loginUrl: string
) => {
  await sendEmail(
    email,
    "Sign in to your TaxWise Israel account",
    `
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
    `
  );
};