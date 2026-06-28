import { Link } from "react-router-dom";

function Register() {
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

          <form>
            <input
              type="text"
              placeholder="Full Name"
            />

            <input
              type="email"
              placeholder="Email Address"
            />

            <input
              type="password"
              placeholder="Password"
            />

            <input
              type="password"
              placeholder="Confirm Password"
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