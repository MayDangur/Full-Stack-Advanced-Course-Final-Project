import {
  useEffect,
  useState,
} from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function VerifyEmail() {
  // Read the query parameters from the verification link
  const [searchParams] = useSearchParams();

  // Navigate the user after successful verification
  const navigate = useNavigate();

  // Use the existing authentication context for automatic login
  const { login } = useAuth();

  // Track the current email verification state
  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  // Message displayed to the user during the verification process
  const [message, setMessage] = useState(
    "Verifying your email..."
  );

  useEffect(() => {
    // Get the verification token from the URL
    const token = searchParams.get("token");

    // Stop if the verification link does not contain a token
    if (!token) {
      setStatus("error");
      setMessage(
        "Invalid email verification link."
      );
      return;
    }

    // Send the verification token to the backend
    const verifyEmail = async () => {
      try {
        const response = await api.get(
          "/auth/verify-email",
          {
            params: {
              token,
            },
          }
        );

        // Save the authenticated user and JWT in the existing auth context
        login(
          response.data.user,
          response.data.token
        );

        // Show a success message before redirecting
        setStatus("success");
        setMessage(
          "Your email has been verified successfully. Redirecting to your personal area..."
        );

        // Give the user time to see the success message
        setTimeout(() => {
          navigate("/personal-area");
        }, 1500);
      } catch (error: any) {
        // Show the backend error message if verification fails
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Email verification failed."
        );
      }
    };

    verifyEmail();
  }, [searchParams, login, navigate]);

  return (
    <>
      {/* Navigation bar */}
      <nav className="navbar">
        <div className="logo">
          TaxWise Israel 📈
        </div>

        <div className="nav-controls">
          <Link
            to="/"
            className="btn-filled"
          >
            Back Home
          </Link>
        </div>
      </nav>

      {/* Email verification result */}
      <section className="hero-section">
        <div className="form-container">
          {/* Display while the backend verifies the token */}
          {status === "loading" && (
            <>
              <h1>Verifying Email</h1>
              <p>{message}</p>
            </>
          )}

          {/* Display briefly after successful email verification */}
          {status === "success" && (
            <>
              <h1>Email Verified ✓</h1>
              <p>{message}</p>
            </>
          )}

          {/* Display if the verification link is invalid or expired */}
          {status === "error" && (
            <>
              <h1>Verification Failed</h1>
              <p>{message}</p>

              <Link
                to="/"
                className="btn-filled"
              >
                Return To Home Page
              </Link>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default VerifyEmail;