import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";


import api from "../services/api";
import { useAuth } from "../context/AuthContext";


function Register() {
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


  // Update the matching field while the user types
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // Handle the registration form submission
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();


    // Make sure both password fields match
    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match");
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
      alert(response.data.message);
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
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


      alert("Google registration successful!");


      navigate("/personal-area");
    } catch (error: any) {
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
      <nav className="navbar">
        <div className="logo">
          TaxWise Israel 📈
        </div>


        <div className="nav-controls">
          <Link to="/" className="btn-text">
            Home
          </Link>


          <Link
            to="/login"
            className="btn-filled"
          >
            Login
          </Link>
        </div>
      </nav>


      <section className="hero-section">
        <div className="form-container">
          <h1>Create Your Account</h1>


          <p className="form-subtitle">
            Join TaxWise and manage your tax
            refund requests easily and securely.
          </p>


          {/* Registration form */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />


            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />


            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />


            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />


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