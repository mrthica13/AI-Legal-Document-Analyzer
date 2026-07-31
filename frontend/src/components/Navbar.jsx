import { useState } from "react";
import "./Navbar.css";

function Navbar({ username, email, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        ⚖ AI Legal Document Analyzer
      </div>

      <div className="navbar-right">
        <div
          className="profile"
          onClick={() => setOpen(!open)}
        >
          <span className="avatar">👤</span>

          <div className="profile-info">
            <div className="username">
              {username}
            </div>

            <div className="email">
              {email}
            </div>
          </div>

          <span className="arrow">
            ▼
          </span>

          {open && (
            <div className="profile-dropdown">
              <h4>👤 {username}</h4>

              <p>📧 {email}</p>

              <hr />

              <button
                className="dropdown-btn"
                onClick={onLogout}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;