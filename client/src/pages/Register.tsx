import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await api.post(
        "/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      alert(response.data.message);
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
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