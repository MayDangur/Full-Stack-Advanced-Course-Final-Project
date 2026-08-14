import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Register() {
  // Used to navigate after a successful Google registration
  const navigate = useNavigate();

  // Use the shared authentication context
  const { login } = useAuth();

  // Store all registration form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Control whether each password field is visible
  const [showPassword, setShowPassword] =
    useState(false);
  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  // Store a separate client-side validation error for each field
  const [validationErrors, setValidationErrors] =
    useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  // Store a success message to display inside the interface
  const [successMessage, setSuccessMessage] =
    useState("");

  // Store server errors to display inside the interface
  const [serverError, setServerError] =
    useState("");

  // Update the matching field while the user types
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear only the validation error of the field being changed
    setValidationErrors({
      ...validationErrors,
      [name]: "",
    });

    // Clear the server error when the user changes the form
    setServerError("");
  };

  // Handle the registration form submission
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    // Collect all validation errors before sending data to the server
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    // Make sure the user entered a name
    if (!formData.name.trim()) {
      newErrors.name =
        "Full name is required.";
    }

    // Make sure the user entered a valid email address
    if (!formData.email.trim()) {
      newErrors.email =
        "Email is required.";
    } else {
      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(formData.email)) {
        newErrors.email =
          "Please enter a valid email address.";
      }
    }

    // Make sure the user entered a valid password
    if (!formData.password) {
      newErrors.password =
        "Password is required.";
    } else if (
      formData.password.length < 6
    ) {
      newErrors.password =
        "Password must be at least 6 characters.";
    }

    // Make sure the confirmation password was entered
    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      formData.password &&
      formData.password !==
        formData.confirmPassword
    ) {
      // Make sure both password fields match
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    // Show all validation errors found in the current form
    setValidationErrors(newErrors);

    // Stop registration when at least one field is invalid
    if (
      Object.values(newErrors).some(
        (error) => error !== ""
      )
    ) {
      return;
    }

    try {
      // Send the registration data to the backend
      const response = await api.post(
        "/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      // Show the success message returned by the server
      setSuccessMessage(
        response.data.message ||
          "Registration successful!"
      );

      // Continue automatically to the login page
      setTimeout(() => {
        navigate("/login");
      }, 700);
    } catch (error: any) {
      // Show an error returned by the server
      const serverMessage =
        error.response?.data?.message;

      setServerError(
        serverMessage ===
          "אימייל זה כבר קיים במערכת"
          ? "This email is already registered."
          : serverMessage ||
              "Registration failed"
      );
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
          "Google registration failed: no credential received."
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

      // Google registration uses the same auth context as Google login
      login(
        response.data.user,
        response.data.token
      );

      // Show a success message after Google registration
      setSuccessMessage(
        "Google registration successful!"
      );

      // Continue to the user's personal area
      setTimeout(() => {
        navigate("/personal-area");
      }, 700);
    } catch (error: any) {
      // Show an error returned during Google registration
      alert(
        error.response?.data?.message ??
          "Google registration failed"
      );
    }
  };

  // Handle errors returned directly by Google Login
  const handleGoogleError = () => {
    alert("Google registration failed");
  };

  return (
    <>
      {/* Main navigation */}
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
            to="/login"
            className="btn-filled"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Registration page */}
      <section className="hero-section">
        <div
          className="form-container"
          dir="ltr"
        >
          <h1>Create Your Account</h1>

          <p className="form-subtitle">
            Join TaxWise and manage your tax
            refund requests easily and securely.
          </p>

          {/* Registration form */}
          <form
            onSubmit={handleSubmit}
            noValidate
          >
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />

            {/* Show the validation error for the name field */}
            {validationErrors.name && (
              <p className="error-message">
                {validationErrors.name}
              </p>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />

            {/* Show the validation error for the email field */}
            {validationErrors.email && (
              <p className="error-message">
                {validationErrors.email}
              </p>
            )}

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

            {/* Show the validation error for the password field */}
            {validationErrors.password && (
              <p className="error-message">
                {validationErrors.password}
              </p>
            )}

            <div className="password-input-wrapper">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                👁
              </button>
            </div>

            {/* Show the validation error for the confirmation field */}
            {validationErrors.confirmPassword && (
              <p className="error-message">
                {
                  validationErrors.confirmPassword
                }
              </p>
            )}

            {/* Show server errors inside the registration interface */}
            {serverError && (
              <p className="error-message">
                {serverError}
              </p>
            )}

            {/* Show successful registration feedback before automatic navigation */}
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
              Register
            </button>
          </form>

          {/* Alternative registration using a Google account */}
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

          {/* Link for users who already have an account */}
          <p className="form-link">
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

export default Register;