// Get the Mailjet configuration from environment variables
const getMailjetConfig = () => {
  const apiKey = process.env.MAILJET_API_KEY;
  const secretKey = process.env.MAILJET_SECRET_KEY;
  const emailUser = process.env.EMAIL_USER;

  if (!apiKey || !secretKey || !emailUser) {
    throw new Error(
      "Mailjet email configuration is not defined in environment variables"
    );
  }

  return {
    apiKey,
    secretKey,
    emailUser,
  };
};

// Send an email through the Mailjet HTTPS API
const sendEmail = async (
  email: string,
  subject: string,
  html: string
) => {
  const {
    apiKey,
    secretKey,
    emailUser,
  } = getMailjetConfig();

  const credentials = Buffer.from(
    `${apiKey}:${secretKey}`
  ).toString("base64");

  const response = await fetch(
    "https://api.mailjet.com/v3.1/send",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: emailUser,
              Name: "TaxWise Israel",
            },
            To: [
              {
                Email: email,
              },
            ],
            Subject: subject,
            HTMLPart: html,
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Mailjet email sending failed: ${response.status} ${errorText}`
    );
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