import React, { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="public-shell">
      <header className="public-header">
        <div className="public-header-inner">
          <Link to="/" className="pub-brand">
            <span className="pub-brand-icon">⬡</span>
            <div>
              <span className="pub-brand-title">ResearchFlow</span>
              <span className="pub-brand-tagline">Research Scheduling Engine</span>
            </div>
          </Link>

          <button className="pub-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>

          <nav className={`pub-nav ${menuOpen ? "open" : ""}`}>
            <NavLink to="/" end className={({ isActive }) => `pub-nav-link ${isActive ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Platform</NavLink>
            <NavLink to="/about" className={({ isActive }) => `pub-nav-link ${isActive ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Approach</NavLink>
            <NavLink to="/contact" className={({ isActive }) => `pub-nav-link ${isActive ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Support</NavLink>
            {user ? (
              <>
                <NavLink
                  to={user.role === "supervisor" ? "/supervisor/dashboard" : "/student/dashboard"}
                  className="pub-nav-btn"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <button className="pub-nav-btn-outline" onClick={handleLogout}>Sign Out</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="pub-nav-btn-outline" onClick={() => setMenuOpen(false)}>Sign In</NavLink>
                <NavLink to="/register" className="pub-nav-btn" onClick={() => setMenuOpen(false)}>Get Started</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="pub-main">
        <Outlet />
      </main>

      <footer className="pub-footer">
        <div className="pub-footer-inner">
          <div className="pub-footer-brand">
            <span className="pub-footer-logo">⬡ ResearchFlow</span>
            <p>Intelligent scheduling for academic research teams. Plan workflows, track progress and surface risk before it becomes a delay.</p>
          </div>
          <div className="pub-footer-links">
            <div className="pub-footer-col">
              <h4>Navigate</h4>
              <Link to="/">Platform</Link>
              <Link to="/about">Approach</Link>
              <Link to="/contact">Support</Link>
            </div>
            <div className="pub-footer-col">
              <h4>Access</h4>
              <Link to="/login">Sign In</Link>
              <Link to="/register">Register</Link>
            </div>
            <div className="pub-footer-col">
              <h4>Who Uses It</h4>
              <span>Supervisors</span>
              <span>Researchers</span>
            </div>
          </div>
        </div>
        <div className="pub-footer-bar">
          <span>© {new Date().getFullYear()} ResearchFlow. MSc Academic Project.</span>
          <span>Research Workflow Scheduling Engine</span>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
