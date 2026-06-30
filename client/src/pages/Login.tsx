import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {
      const response = await api.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      alert("Login successful!");

      navigate("/personal-area");
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Login failed"
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
        <div className="form-container">
          <h1>Welcome Back</h1>

          <p className="form-subtitle">
            Sign in to access your personal
            tax management area.
          </p>

          <form onSubmit={handleSubmit}>
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

            <button
              type="submit"
              className="btn-primary"
            >
              Login
            </button>
          </form>

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