import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === "supervisor") navigate("/supervisor/dashboard");
      else if (user.role === "student") navigate("/student/dashboard");
      else navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">ResearchFlow</h1>
          <p className="auth-subtitle">CPM-Based Workflow Scheduling for Academic Research</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2 className="form-heading">Sign In</h2>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.ac.uk"
              required
            />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <p className="auth-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </form>
        <div className="auth-demo">
          <p className="demo-label">Demo Credentials</p>
          <div className="demo-creds">
            <span><strong>Supervisor:</strong> supervisor@research.ac.uk / sup123456</span>
            <span><strong>Student:</strong> student1@research.ac.uk / stu123456</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
