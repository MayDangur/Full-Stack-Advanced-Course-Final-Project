import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import TaxRequestForm from "../components/TaxRequestForm";

function PersonalArea() {
  const { user, logout } = useAuth();

  const [showForm, setShowForm] =
    useState(false);

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
            onClick={logout}
          >
            Logout
          </Link>
        </div>
      </nav>

      <section className="features-section">
        <h1 className="section-title">
          {user?.name}'s Personal Area
        </h1>

        <p className="form-subtitle">
          Welcome back. Here you can manage,
          edit and track all your tax refund
          requests.
        </p>

        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <button
            className="btn-primary"
            onClick={() =>
              setShowForm(!showForm)
            }
          >
            {showForm
              ? "Close Form"
              : "+ Create New Request"}
          </button>
        </div>

        {showForm && <TaxRequestForm />}

        <div className="features-grid">
          {[1, 2, 3].map((card) => (
            <div
              className="f-card"
              key={card}
            >
              <h3>Tax Request</h3>

              <p>
                Request Status:
                <strong> ---</strong>
              </p>

              <div
                style={{
                  marginTop: "20px",
                }}
              >
                <button className="btn-primary">
                  Edit
                </button>

                <button className="btn-secondary">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default PersonalArea;