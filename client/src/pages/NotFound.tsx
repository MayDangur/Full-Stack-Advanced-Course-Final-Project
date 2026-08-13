import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function NotFound() {
  const { user } = useAuth();

  return (
    <>
      <nav className="navbar">
        <div>
          <Link
            to="/"
            className="logo"
          >
            TaxWise Israel 📈
          </Link>

          {user && (
            <div
              dir="ltr"
              style={{
                marginTop: "5px",
                fontSize: "14px",
                color: "#64748b",
                fontWeight: "600",
                textAlign: "left",
              }}
            >
              <span>👤</span>{" "}
              <span>User: {user.name}</span>
            </div>
          )}
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

      <section className="hero-section">
        <div
          className="form-container"
          dir="ltr"
        >
          <h1
            style={{
              fontSize: "4rem",
              marginBottom: "10px",
            }}
          >
            404
          </h1>

          <h2
            style={{
              marginBottom: "20px",
            }}
          >
            Page Not Found
          </h2>

          <p className="form-subtitle">
            Sorry, the page you are looking for
            does not exist.
          </p>

          <Link
            to="/"
            className="btn-primary"
            style={{
              display: "inline-block",
              textDecoration: "none",
              marginTop: "20px",
            }}
          >
            Return To Home Page
          </Link>
        </div>
      </section>
    </>
  );
}

export default NotFound;