import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { adminAPI, projectsAPI } from "../../services/api";

const ROLE_COLORS = { supervisor: "#d4a017", student: "#c25a1a", admin: "#1e6b35" };

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([adminAPI.listUsers(), projectsAPI.list()])
      .then(([uRes, pRes]) => {
        setUsers(Array.isArray(uRes.data) ? uRes.data : (uRes.data.results || []));
        setProjects(Array.isArray(pRes.data) ? pRes.data : (pRes.data.results || []));
      })
      .catch((err) => {
        setError(err.response?.data?.detail || "Failed to load dashboard data. Check that the backend is running.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;

  if (error) return (
    <div className="page">
      <div className="page-header"><div><h1 className="page-title">Platform Overview</h1></div></div>
      <div className="alert alert-error">{error}</div>
    </div>
  );

  const byRole = (r) => users.filter(u => u.role === r).length;

  const roleData = [
    { name: "Supervisors", value: byRole("supervisor"), color: ROLE_COLORS.supervisor },
    { name: "Researchers", value: byRole("student"), color: ROLE_COLORS.student },
    { name: "Admins", value: byRole("admin"), color: ROLE_COLORS.admin },
  ].filter(d => d.value > 0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Platform Overview</h1>
          <p className="page-desc">System wide statistics across all users and projects.</p>
        </div>
        <Link to="/admin/users" className="btn btn-primary">Manage Users</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeftColor: "var(--primary)" }}>
          <div className="stat-value" style={{ color: "var(--primary)" }}>{users.length}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: "var(--gold)" }}>
          <div className="stat-value" style={{ color: "var(--gold)" }}>{byRole("supervisor")}</div>
          <div className="stat-label">Supervisors</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: "var(--rose)" }}>
          <div className="stat-value" style={{ color: "var(--rose)" }}>{byRole("student")}</div>
          <div className="stat-label">Researchers</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: "var(--vamp)" }}>
          <div className="stat-value" style={{ color: "var(--vamp)" }}>{projects.length}</div>
          <div className="stat-label">Total Projects</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: "var(--success)" }}>
          <div className="stat-value" style={{ color: "var(--success)" }}>{projects.filter(p => p.status === "active").length}</div>
          <div className="stat-label">Active Projects</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: "var(--text-muted)" }}>
          <div className="stat-value" style={{ color: "var(--text-muted)" }}>{projects.filter(p => p.status === "completed").length}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card chart-card">
          <h3 className="card-title">User Breakdown</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                {roleData.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="section-header">
            <h3 className="section-title">Recent Users</h3>
            <Link to="/admin/users" className="btn btn-outline btn-sm">All Users</Link>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Role</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {users.slice(0, 7).map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="bold">{u.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{u.email}</div>
                  </td>
                  <td><span className={`role-tag role-${u.role}`}>{u.role}</span></td>
                  <td>{new Date(u.created_at).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="section-header">
          <h3 className="section-title">All Research Projects</h3>
          <Link to="/admin/projects" className="btn btn-outline btn-sm">View All</Link>
        </div>
        {projects.length === 0 ? (
          <p className="empty-text">No projects have been created yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Project</th><th>Supervisor</th><th>Status</th><th>Tasks</th><th>Progress</th></tr>
            </thead>
            <tbody>
              {projects.slice(0, 6).map(p => (
                <tr key={p.id}>
                  <td className="bold">{p.title}</td>
                  <td>{p.created_by_detail?.name || "-"}</td>
                  <td><span className={`badge badge-${p.status}`}>{p.status.replace("_", " ")}</span></td>
                  <td>{p.task_count}</td>
                  <td>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar" style={{ width: `${p.progress}%` }} />
                      <span>{p.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
