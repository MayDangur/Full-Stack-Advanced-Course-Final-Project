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
      <div
        dir="ltr"
        style="
          margin: 0;
          padding: 40px 20px;
          background-color: #f8fafc;
          font-family: Arial, Helvetica, sans-serif;
          color: #1e293b;
        "
      >
        <div
          style="
            max-width: 560px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 40px;
            text-align: center;
          "
        >
          <div
            style="
              font-size: 24px;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 32px;
            "
          >
            TaxWise Israel
          </div>

          <h2
            style="
              margin: 0 0 16px;
              font-size: 26px;
              color: #0f172a;
            "
          >
            Welcome to TaxWise Israel
          </h2>

          <p
            style="
              margin: 0 0 28px;
              font-size: 16px;
              line-height: 1.6;
              color: #64748b;
            "
          >
            Please verify your email address to activate your account
            and access your personal area.
          </p>

          <a
            href="${verificationUrl}"
            style="
              display: inline-block;
              background-color: #00bfa5;
              color: #ffffff;
              text-decoration: none;
              font-size: 16px;
              font-weight: 700;
              padding: 14px 28px;
              border-radius: 8px;
            "
          >
            Verify Email
          </a>

          <p
            style="
              margin: 28px 0 0;
              font-size: 14px;
              line-height: 1.6;
              color: #64748b;
            "
          >
            This verification link is valid for 1 hour.
          </p>

          <div
            style="
              border-top: 1px solid #e2e8f0;
              margin-top: 32px;
              padding-top: 24px;
            "
          >
            <p
              style="
                margin: 0;
                font-size: 13px;
                line-height: 1.6;
                color: #94a3b8;
              "
            >
              If you did not create a TaxWise Israel account,
              you can safely ignore this email.
            </p>
          </div>
        </div>

        <p
          style="
            text-align: center;
            margin: 20px 0 0;
            font-size: 12px;
            color: #94a3b8;
          "
        >
          TaxWise Israel
        </p>
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
      <div
        dir="ltr"
        style="
          margin: 0;
          padding: 40px 20px;
          background-color: #f8fafc;
          font-family: Arial, Helvetica, sans-serif;
          color: #1e293b;
        "
      >
        <div
          style="
            max-width: 560px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 40px;
            text-align: center;
          "
        >
          <div
            style="
              font-size: 24px;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 32px;
            "
          >
            TaxWise Israel
          </div>

          <h2
            style="
              margin: 0 0 16px;
              font-size: 26px;
              color: #0f172a;
            "
          >
            Sign in to your account
          </h2>

          <p
            style="
              margin: 0 0 28px;
              font-size: 16px;
              line-height: 1.6;
              color: #64748b;
            "
          >
            We received a request to securely sign in to your
            TaxWise Israel account.
          </p>

          <a
            href="${loginUrl}"
            style="
              display: inline-block;
              background-color: #00bfa5;
              color: #ffffff;
              text-decoration: none;
              font-size: 16px;
              font-weight: 700;
              padding: 14px 28px;
              border-radius: 8px;
            "
          >
            Sign in to TaxWise Israel
          </a>

          <p
            style="
              margin: 28px 0 0;
              font-size: 14px;
              line-height: 1.6;
              color: #64748b;
            "
          >
            This secure sign-in link is valid for 15 minutes.
          </p>

          <div
            style="
              border-top: 1px solid #e2e8f0;
              margin-top: 32px;
              padding-top: 24px;
            "
          >
            <p
              style="
                margin: 0;
                font-size: 13px;
                line-height: 1.6;
                color: #94a3b8;
              "
            >
              If you did not request this login link,
              you can safely ignore this email.
            </p>
          </div>
        </div>

        <p
          style="
            text-align: center;
            margin: 20px 0 0;
            font-size: 12px;
            color: #94a3b8;
          "
        >
          TaxWise Israel
        </p>
      </div>
    `
  );
};