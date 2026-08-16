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

function MagicLogin() {
  // Read the token from the magic login link
  const [searchParams] = useSearchParams();

  // Navigate after successful login
  const navigate = useNavigate();

  // Use the existing authentication context
  const { login } = useAuth();

  // Track the current magic login state
  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  // Message displayed during the login process
  const [message, setMessage] = useState(
    "Signing you in..."
  );

  useEffect(() => {
    // Get the magic login token from the URL
    const token = searchParams.get("token");

    // Stop if the login link does not contain a token
    if (!token) {
      setStatus("error");
      setMessage("Invalid login link.");
      return;
    }

    // Verify the magic login token with the backend
    const verifyMagicLogin = async () => {
      try {
        const response = await api.get(
          "/auth/magic-login/verify",
          {
            params: {
              token,
            },
          }
        );

        // Save the authenticated user and JWT
        login(
          response.data.user,
          response.data.token
        );

        // Show successful login feedback
        setStatus("success");
        setMessage(
          "Login successful. Redirecting to your personal area..."
        );

        // Give the user time to see the success message
        setTimeout(() => {
          navigate("/personal-area");
        }, 1500);
      } catch (error: any) {
        // Show the backend error if the link is invalid or expired
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Magic login failed."
        );
      }
    };

    verifyMagicLogin();
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

      {/* Magic login result */}
      <section className="hero-section">
        <div
          className="form-container"
          dir="ltr"
        >
          {/* Display while the login link is being verified */}
          {status === "loading" && (
            <>
              <h1>Signing In</h1>
              <p>{message}</p>
            </>
          )}

          {/* Display briefly after successful login */}
          {status === "success" && (
            <>
              <h1>Login Successful ✓</h1>
              <p>{message}</p>
            </>
          )}

          {/* Display if the login link is invalid or expired */}
          {status === "error" && (
            <>
              <h1>Login Failed</h1>
              <p>{message}</p>

              <Link
                to="/login"
                className="btn-filled"
              >
                Return To Login
              </Link>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default MagicLogin;