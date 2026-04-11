import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const adminLinks = [
  { to: "/admin/dashboard", label: "Overview", icon: "⊞" },
  { to: "/admin/users", label: "User Management", icon: "👥" },
  { to: "/admin/projects", label: "All Projects", icon: "📁" },
  { to: "/profile", label: "My Account", icon: "👤" },
];

const supervisorLinks = [
  { to: "/supervisor/dashboard", label: "Overview", icon: "⊞" },
  { to: "/supervisor/projects", label: "Research Projects", icon: "📁" },
  { to: "/supervisor/tasks", label: "Work Planner", icon: "✔" },
  { to: "/supervisor/dependencies", label: "Precedence Map", icon: "🔗" },
  { to: "/supervisor/schedule", label: "Critical Path", icon: "📅" },
  { to: "/profile", label: "My Account", icon: "👤" },
];

const studentLinks = [
  { to: "/student/dashboard", label: "Overview", icon: "⊞" },
  { to: "/student/tasks", label: "My Assignments", icon: "✔" },
  { to: "/profile", label: "My Account", icon: "👤" },
];

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = user?.role === "supervisor" ? supervisorLinks
    : user?.role === "student" ? studentLinks
    : user?.role === "admin" ? adminLinks
    : [];

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <div className="app-brand">
            <span className="brand-title">ResearchFlow</span>
            <span className="brand-subtitle">Research Scheduling Engine</span>
          </div>
        </div>
        {user && (
          <div className="header-right">
            <div className="user-badge">
              <span className="user-name">{user.name}</span>
              <span className={`role-tag role-${user.role}`}>{user.role}</span>
            </div>
            <button className="btn btn-outline-sm" onClick={handleLogout}>Sign Out</button>
          </div>
        )}
      </header>

      <div className="app-body">
        {user && (
          <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
            <nav className="sidebar-nav">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                >
                  <span className="link-icon">{link.icon}</span>
                  {sidebarOpen && <span className="link-label">{link.label}</span>}
                </NavLink>
              ))}
            </nav>
          </aside>
        )}
        <main className={`app-main ${user ? "with-sidebar" : "full-width"}`}>
          <Outlet />
        </main>
      </div>

      <footer className="app-footer">
        <span>⬡ ResearchFlow · Research Workflow Scheduling Engine</span>
        <span>© {new Date().getFullYear()} ResearchFlow</span>
      </footer>
    </div>
  );
};

export default Layout;
