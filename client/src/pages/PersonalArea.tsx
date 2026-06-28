import { Link } from "react-router-dom";

function Dashboard() {
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

          <Link to="/login" className="btn-filled">
            Logout
          </Link>
        </div>
      </nav>

      <section className="features-section">
        <h1 className="section-title">
          Personal Area
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
          <button className="btn-primary">
            + Create New Request
          </button>
        </div>

        <div className="features-grid">
          <div className="f-card">
            <h3>Tax Refund 2025</h3>

            <p>
              Request Status:
              <strong> Pending</strong>
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

          <div className="f-card">
            <h3>Workplace Tax Refund</h3>

            <p>
              Request Status:
              <strong> Approved</strong>
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

          <div className="f-card">
            <h3>Freelance Income Report</h3>

            <p>
              Request Status:
              <strong> In Review</strong>
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
        </div>
      </section>
    </>
  );
}

export default Dashboard;