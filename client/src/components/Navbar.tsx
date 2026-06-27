function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        TaxWise Israel <span>📈</span>
      </div>

      <div className="nav-controls">
        <button className="btn-text">
          Login
        </button>

        <button className="btn-filled">
          Register
        </button>
      </div>
    </nav>
  );
}

export default Navbar;