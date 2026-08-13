import { Link } from "react-router-dom";


import { useAuth } from "../context/AuthContext";


function About() {
  // Use the current authentication state to display the correct navigation
  const { user, logout } = useAuth();


  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">
          TaxWise Israel <span>📈</span>
        </Link>


        <div className="nav-controls">
          <Link to="/" className="btn-text">
            Home
          </Link>


          <Link
            to="/faq"
            className="btn-text"
          >
            FAQ
          </Link>


          {user ? (
            <>
              <Link
                to="/personal-area"
                className="btn-text"
              >
                Personal Area
              </Link>


              {/* Show admin navigation only to admin users */}
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="btn-text"
                >
                  Admin Panel
                </Link>
              )}


              <Link
                to="/login"
                className="btn-filled"
                onClick={logout}
              >
                ↪ Logout
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn-text"
              >
                Login
              </Link>


              <Link
                to="/register"
                className="btn-filled"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>


      <main dir="ltr">
        {/* About */}
        <section className="about-hero">
          <div className="about-content">
            <span className="about-label">
              ABOUT TAXWISE
            </span>


            <h1>Tax Management Made Simple</h1>


            <p>
              TaxWise Israel is a digital platform designed to make
              managing tax requests and documents simple, organized
              and accessible.
            </p>


            <p>
              Instead of managing important information across
              different places, TaxWise gives you one secure personal
              area where you can submit requests, manage documents and
              keep your tax information organized.
            </p>
          </div>
        </section>


        {/* How it works */}
        <section className="how-it-works">
          <h2 className="section-title">
            How It Works
          </h2>


          <p className="section-subtitle">
            Get started with TaxWise in four simple steps.
          </p>


          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">
                1
              </div>


              <div className="f-icon">
                👤
              </div>


              <h3>Create Your Account</h3>


              <p>
                Register securely and access your personal TaxWise
                area.
              </p>
            </div>


            <div className="step-card">
              <div className="step-number">
                2
              </div>


              <div className="f-icon">
                📝
              </div>


              <h3>Submit a Tax Request</h3>


              <p>
                Create and manage your tax requests from one
                convenient place.
              </p>
            </div>


            <div className="step-card">
              <div className="step-number">
                3
              </div>


              <div className="f-icon">
                📄
              </div>


              <h3>Upload Documents</h3>


              <p>
                Upload and manage the documents you need directly
                from your personal area.
              </p>
            </div>


            <div className="step-card">
              <div className="step-number">
                4
              </div>


              <div className="f-icon">
                📊
              </div>


              <h3>Stay Organized</h3>


              <p>
                Keep your requests, documents and profile information
                organized in one place.
              </p>
            </div>
          </div>
        </section>


        {/* Call to action */}
        <section className="about-cta">
          <h2>Ready to Get Started?</h2>


          <p>
            Create your account and start managing your tax
            information with TaxWise Israel.
          </p>


          {user ? (
            <Link
              to="/personal-area"
              className="btn-primary"
            >
              Go to Personal Area
            </Link>
          ) : (
            <Link
              to="/register"
              className="btn-primary"
            >
              Create an Account
            </Link>
          )}
        </section>
      </main>


      {/* Footer */}
      <footer
        className="main-footer"
        dir="ltr"
      >
        <div className="footer-grid">
          <div className="f-col">
            <h4>Services</h4>


            <ul>
              <li>Tax Refunds</li>
              <li>Annual Tax Reports</li>
            </ul>
          </div>


          <div className="f-col">
            <h4>Contact Us</h4>


            <p>03-1234567</p>
            <p>Tel Aviv, Israel</p>
          </div>
        </div>


        <div className="footer-bottom">
          © TaxWise Israel 2026. All Rights Reserved.
        </div>
      </footer>
    </>
  );
}


export default About;