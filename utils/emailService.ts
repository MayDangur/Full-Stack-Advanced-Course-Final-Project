// Get the Brevo configuration from environment variables
const getBrevoConfig = () => {
  const apiKey = process.env.BREVO_API_KEY;
  const emailUser = process.env.EMAIL_USER;

  if (!apiKey || !emailUser) {
    throw new Error(
      "Brevo email configuration is not defined in environment variables"
    );
  }

  return {
    apiKey,
    emailUser,
  };
};

// Send an email through the Brevo HTTPS API
const sendEmail = async (
  email: string,
  subject: string,
  html: string
) => {
  const { apiKey, emailUser } = getBrevoConfig();

  const response = await fetch(
    "https://api.brevo.com/v3/smtp/email",
    {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "TaxWise Israel",
          email: emailUser,
        },
        to: [
          {
            email,
          },
        ],
        subject,
        htmlContent: html,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Brevo email sending failed: ${response.status} ${errorText}`
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