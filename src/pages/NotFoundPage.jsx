import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NotFoundPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const homeLink = user?.role === "supervisor"
    ? "/supervisor/dashboard"
    : user?.role === "student"
    ? "/student/dashboard"
    : "/";

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--mist, #edf7f2)", padding: "40px 24px" }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontSize: 96, fontWeight: 900, color: "var(--primary, #1e6b35)", lineHeight: 1, marginBottom: 8, letterSpacing: "-4px" }}>404</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--vamp, #0d2818)", marginBottom: 12 }}>Page Not Found</h1>
        <p style={{ fontSize: 15, color: "var(--text-muted, #5a7a63)", lineHeight: 1.7, marginBottom: 32 }}>
          The page you are looking for does not exist or may have been moved. Check the URL or navigate back to a known page.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            className="btn btn-ghost"
            onClick={() => navigate(-1)}
          >
            ← Go Back
          </button>
          <Link className="btn btn-primary" to={homeLink}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
