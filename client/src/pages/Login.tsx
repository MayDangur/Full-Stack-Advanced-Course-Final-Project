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



  // Store client-side validation errors
  const [validationError, setValidationError] =
    useState("");



  // Show a short success message before automatic navigation
  const [successMessage, setSuccessMessage] =
    useState("");



  // Update the matching field while the user types
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });



    // Clear the validation message when the user changes the form
    setValidationError("");
  };



  // Handle regular email and password login
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();



    // Validate the login form before sending it to the server
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
      alert(
        error.response?.data?.message ??
          "Login failed"
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
        <div className="logo">
          TaxWise Israel 📈
        </div>



        <div className="nav-controls">
          <Link
            to="/"
            className="btn-text"
          >
            Home
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



            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />



            {/* Show client-side React validation errors */}
            {validationError && (
              <p className="error-message">
                {validationError}
              </p>
            )}



            {/* Show successful login feedback before automatic navigation */}
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