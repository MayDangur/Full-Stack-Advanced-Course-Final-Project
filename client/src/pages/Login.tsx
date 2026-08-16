import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  // Use the shared authentication context
  const { login } = useAuth();

  // Store the email and password entered by the user
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Control whether the password is visible
  const [showPassword, setShowPassword] =
    useState(false);

  // Store client-side validation errors
  const [validationError, setValidationError] =
    useState("");

  // Show a short success message before automatic navigation
  const [successMessage, setSuccessMessage] =
    useState("");

  // Track whether a magic login email is being sent
  const [sendingMagicLink, setSendingMagicLink] =
    useState(false);

  // Update the matching field while the user types
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear messages when the user changes the form
    setValidationError("");
    setSuccessMessage("");
  };

  // Handle regular email and password login
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    // Validate the login form before sending it to the server
    if (
      !formData.email.trim() &&
      !formData.password
    ) {
      setValidationError(
        "Email and password are required."
      );
      return;
    }

    if (!formData.email.trim()) {
      setValidationError(
        "Email is required."
      );
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email)) {
      setValidationError(
        "Please enter a valid email address."
      );
      return;
    }

    if (!formData.password) {
      setValidationError(
        "Password is required."
      );
      return;
    }

    try {
      // Send the login details to the server
      const response = await api.post(
        "/auth/login",
        formData
      );

      // Save the authenticated user and JWT in the context
      login(
        response.data.user,
        response.data.token
      );

      // Show success feedback without requiring the user to click anything
      setSuccessMessage(
        "Login successful!"
      );

      // Continue automatically to the user's personal area
      setTimeout(() => {
        navigate("/personal-area");
      }, 700);
    } catch (error: any) {
      if (
        error.response?.data?.message ===
        "Invalid credentials"
      ) {
        setValidationError(
          "Incorrect email or password. Please try again."
        );
      } else {
        setValidationError(
          error.response?.data?.message ??
            "Login failed"
        );
      }
    }
  };

  // Send a passwordless login link to the entered email
  const handleMagicLogin = async () => {
    setValidationError("");
    setSuccessMessage("");

    const email = formData.email.trim();

    // Make sure the user entered an email address
    if (!email) {
      setValidationError(
        "Please enter your email address first."
      );
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Make sure the entered email has a valid format
    if (!emailPattern.test(email)) {
      setValidationError(
        "Please enter a valid email address."
      );
      return;
    }

    try {
      setSendingMagicLink(true);

      // Ask the backend to send a secure login link
      const response = await api.post(
        "/auth/magic-login",
        {
          email,
        }
      );

      // Show the response without revealing whether an account exists
      setSuccessMessage(
        response.data.message ||
          "If an account exists for this email, a sign-in link has been sent."
      );
    } catch (error: any) {
      setValidationError(
        error.response?.data?.message ??
          "Failed to send login link"
      );
    } finally {
      setSendingMagicLink(false);
    }
  };

  // Handle a successful response from Google
  const handleGoogleSuccess = async (
    credentialResponse: any
  ) => {
    try {
      // Make sure Google returned a credential
      if (!credentialResponse.credential) {
        alert(
          "Google login failed: no credential received."
        );
        return;
      }

      // Send the Google credential to the backend for verification
      const response = await api.post(
        "/auth/google",
        {
          credential: credentialResponse.credential,
        }
      );

      // Google login uses the same auth context as regular login
      login(
        response.data.user,
        response.data.token
      );

      // Show success feedback without requiring the user to click anything
      setSuccessMessage(
        "Google login successful!"
      );

      // Continue automatically to the user's personal area
      setTimeout(() => {
        navigate("/personal-area");
      }, 700);
    } catch (error: any) {
      alert(
        error.response?.data?.message ??
          "Google login failed"
      );
    }
  };

  // Handle errors returned directly by Google Login
  const handleGoogleError = () => {
    alert("Google login failed");
  };

  return (
    <>
      <nav className="navbar">
        <Link
          to="/"
          className="logo"
          style={{
            color: "inherit",
            textDecoration: "none",
          }}
        >
          TaxWise Israel 📈
        </Link>

        <div className="nav-controls">
          <Link
            to="/"
            className="btn-text"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="btn-text"
          >
            About
          </Link>

          <Link
            to="/faq"
            className="btn-text"
          >
            FAQ
          </Link>

          <Link
            to="/register"
            className="btn-filled"
          >
            Register
          </Link>
        </div>
      </nav>

      <section className="hero-section">
        {/* Keep the English login content left-to-right */}
        <div
          className="form-container"
          dir="ltr"
        >
          <h1>Welcome Back</h1>

          <p className="form-subtitle">
            Sign in to access your personal tax
            management area.
          </p>

          {/* Regular email and password login */}
          <form
            onSubmit={handleSubmit}
            noValidate
          >
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="password-input-wrapper">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                👁
              </button>
            </div>

            {/* Show client-side React validation errors */}
            {validationError && (
              <p className="error-message">
                {validationError}
              </p>
            )}

            {/* Show successful login or email-link feedback */}
            {successMessage && (
              <p
                style={{
                  color: "#16a34a",
                  textAlign: "center",
                  marginBottom: "15px",
                  fontWeight: "600",
                }}
              >
                {successMessage}
              </p>
            )}

            <button
              type="submit"
              className="btn-primary"
            >
              Login
            </button>

            {/* Passwordless login using a secure email link */}
            <button
              type="button"
              className="btn-primary"
              onClick={handleMagicLogin}
              disabled={sendingMagicLink}
              style={{
                marginTop: "10px",
              }}
            >
              {sendingMagicLink
                ? "Sending Login Link..."
                : "Sign in with Email Link"}
            </button>
          </form>

          {/* Alternative login using a Google account */}
          <div
            style={{
              margin: "25px 0",
              textAlign: "center",
            }}
          >
            <p
              style={{
                marginBottom: "15px",
                color: "#64748b",
              }}
            >
              OR
            </p>

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>

          <p className="form-link">
            Don't have an account?{" "}
            <Link to="/register">
              Register
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

export default Login;