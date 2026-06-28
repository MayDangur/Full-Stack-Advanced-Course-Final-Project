import { Link } from "react-router-dom";

function Login() {
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
            Sign in to access your personal tax
            management area.
          </p>

          <form>
            <input
              type="email"
              placeholder="Email Address"
            />

            <input
              type="password"
              placeholder="Password"
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