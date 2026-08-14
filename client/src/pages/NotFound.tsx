import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function NotFound() {
  // Get the current authenticated user from the shared auth context
  const { user } = useAuth();

  return (
    <>
      {/* Navigation bar displayed on the 404 page */}
      <nav className="navbar">
        <div>
          {/* Logo links back to the home page */}
          <Link
            to="/"
            className="logo"
          >
            TaxWise Israel 📈
          </Link>

          {/* Show the logged-in user's name when a user is authenticated */}
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

        {/* Provide a quick way to return to the home page */}
        <div className="nav-controls">
          <Link
            to="/"
            className="btn-filled"
          >
            Back Home
          </Link>
        </div>
      </nav>

      {/* Main 404 error content */}
      <section className="hero-section">
        <div
          className="form-container"
          dir="ltr"
        >
          {/* Display the HTTP-style not found error code */}
          <h1
            style={{
              fontSize: "4rem",
              marginBottom: "10px",
            }}
          >
            404
          </h1>

          {/* Explain that the requested page could not be found */}
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

          {/* Allow the user to recover by navigating back to the home page */}
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