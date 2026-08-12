import { Link } from "react-router-dom";


function Home() {
  // Open WhatsApp directly with a prepared message
  // for scheduling a free initial consultation
  const handleBookConsultation = () => {
    const phoneNumber = "972548064473";
    const message =
      "Hi, I'd like to schedule a free initial tax consultation.";

    const whatsappUrl =
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };


  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          TaxWise Israel <span>📈</span>
        </div>


        <div className="nav-controls">
          <Link to="/login" className="btn-text">
            Login
          </Link>


          <Link to="/register" className="btn-filled">
            Register
          </Link>
        </div>
      </nav>


      {/* Hero */}
      <header className="hero-section">
        {/* Keep English content left-to-right so punctuation appears correctly */}
        <div className="hero-content" dir="ltr">
          <h1>Smart Tax Consulting & Tax Refund Management</h1>


          <p>
            A professional platform for managing tax processes,
            refunds and declarations in a simple, fast and secure
            way.
          </p>


          <div className="hero-btns">
            <Link
              to="/register"
              className="btn-primary"
            >
              Get Started
            </Link>


            {/* Open WhatsApp to schedule a free initial consultation */}
            <button
              className="btn-secondary"
              onClick={handleBookConsultation}
            >
              Book a Free Consultation
            </button>
          </div>
        </div>
      </header>


      {/* Features */}
      {/* Keep English content left-to-right so punctuation appears correctly */}
      <section className="features-section" dir="ltr">
        <h2 className="section-title">
          Why Choose TaxWise?
        </h2>


        <div className="features-grid">
          <div className="f-card">
            <div className="f-icon">🛡️</div>
            <h3>Full Security</h3>
            <p>
              All information is encrypted and securely
              protected.
            </p>
          </div>


          <div className="f-card">
            <div className="f-icon">⏰</div>
            <h3>Time Saving</h3>
            <p>
              A fast and efficient process for maximum
              results.
            </p>
          </div>


          <div className="f-card">
            <div className="f-icon">👥</div>
            <h3>Professional Support</h3>
            <p>
              Certified tax professionals are here to
              help.
            </p>
          </div>


          <div className="f-card">
            <div className="f-icon">📈</div>
            <h3>Maximum Refunds</h3>
            <p>
              We make sure you receive every dollar you
              deserve.
            </p>
          </div>


          <div className="f-card">
            <div className="f-icon">📄</div>
            <h3>Document Management</h3>
            <p>
              Everything in one place, organized and
              accessible.
            </p>
          </div>


          <div className="f-card">
            <div className="f-icon">✔️</div>
            <h3>Fast Service</h3>
            <p>
              Personal support for every question and
              request.
            </p>
          </div>
        </div>
      </section>


      {/* Statistics */}
      <section className="dark-stats" dir="ltr">
        <div className="stat">
          <h3>+15,000</h3>
          <p>Satisfied Clients</p>
        </div>


        <div className="stat">
          <h3>₪42M</h3>
          <p>Annual Tax Refunds</p>
        </div>


        <div className="stat">
          <h3>98%</h3>
          <p>Customer Satisfaction</p>
        </div>


        <div className="stat">
          <h3>72h</h3>
          <p>Average Processing Time</p>
        </div>
      </section>


      {/* Testimonials */}
      <section className="testimonials" dir="ltr">
        <h2 className="section-title">
          What Our Clients Say
        </h2>


        <div className="t-grid">
          <div className="t-card">
            <div className="stars">★★★★★</div>
            <p>"Excellent and professional service!"</p>
            <strong>Danny Cohen</strong>
          </div>


          <div className="t-card">
            <div className="stars">★★★★★</div>
            <p>"The process was simple and clear."</p>
            <strong>Sarah Levy</strong>
          </div>


          <div className="t-card">
            <div className="stars">★★★★★</div>
            <p>
              "Highly recommended for every business
              owner."
            </p>
            <strong>Yossi Mizrahi</strong>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="main-footer" dir="ltr">
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


export default Home;