import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { tasksAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#c25a1a", "#1e6b35", "#d4a017", "#c0183a"];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tasksAPI.list()
      .then((res) => setTasks(res.data.results || res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;

  const allTasks = Array.isArray(tasks) ? tasks : [];
  const completed = allTasks.filter((t) => t.status === "completed");
  const inProgress = allTasks.filter((t) => t.status === "in_progress");
  const pending = allTasks.filter((t) => t.status === "pending");
  const critical = allTasks.filter((t) => t.is_critical);

  const statusData = [
    { name: "Completed", value: completed.length },
    { name: "In Progress", value: inProgress.length },
    { name: "Pending", value: pending.length },
    { name: "Blocked", value: allTasks.filter((t) => t.status === "blocked").length },
  ].filter((d) => d.value > 0);

  const overallProgress = allTasks.length > 0
    ? Math.round(allTasks.reduce((s, t) => s + t.progress_percent, 0) / allTasks.length)
    : 0;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Dashboard</h1>
          <p className="page-desc">Welcome, {user.name}. Your assigned research tasks and schedule overview.</p>
        </div>
        <Link to="/student/tasks" className="btn btn-primary">View All Tasks</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeftColor: "#1e6b35" }}>
          <div className="stat-value" style={{ color: "#1e6b35" }}>{allTasks.length}</div>
          <div className="stat-label">Assigned Tasks</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: "#c25a1a" }}>
          <div className="stat-value" style={{ color: "#c25a1a" }}>{completed.length}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: "#d4a017" }}>
          <div className="stat-value" style={{ color: "#d4a017" }}>{inProgress.length}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: "#c0183a" }}>
          <div className="stat-value" style={{ color: "#c0183a" }}>{critical.length}</div>
          <div className="stat-label">Critical Tasks</div>
          <div className="stat-sub">Cannot be delayed</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card chart-card">
          <h3 className="card-title">Task Status Breakdown</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="empty-text">No tasks assigned yet.</p>}
        </div>

        <div className="card">
          <h3 className="card-title">Overall Progress</h3>
          <div className="big-progress-wrap">
            <div className="big-progress-track">
              <div className="big-progress-bar" style={{ width: `${overallProgress}%` }} />
            </div>
            <div className="big-progress-value">{overallProgress}%</div>
          </div>
          <p className="text-muted" style={{ marginTop: 8 }}>{completed.length} of {allTasks.length} tasks complete</p>
          {critical.length > 0 && (
            <div className="critical-alert">
              <strong>⚠ You have {critical.length} critical task{critical.length > 1 ? "s" : ""}.</strong>
              <p>These tasks are on the project's critical path. Any delay will affect the project deadline.</p>
            </div>
          )}
        </div>
      </div>

      {critical.length > 0 && (
        <div className="card">
          <h3 className="card-title" style={{ color: "#c0183a" }}>Critical Tasks — Priority Action Required</h3>
          <div className="task-cards-grid">
            {critical.map((t) => (
              <Link key={t.id} to={`/student/tasks/${t.id}`} className="task-card-link">
                <div className="task-card task-card-critical">
                  <div className="task-card-header">
                    <span className="task-name">{t.name}</span>
                    <span className="badge badge-critical">CRITICAL</span>
                  </div>
                  <div className="task-card-meta">
                    <span>{t.duration_days} days</span>
                    <span>Slack: 0</span>
                  </div>
                  <div className="progress-bar-wrap full" style={{ marginTop: 8 }}>
                    <div className="progress-bar" style={{ width: `${t.progress_percent}%`, background: "#c0183a" }} />
                  </div>
                  <span className="progress-label">{t.progress_percent}% complete</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="card-title">Recent Tasks</h3>
        {allTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks have been assigned to you yet. Contact your supervisor.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Slack</th>
                <th>Critical</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allTasks.slice(0, 8).map((t) => (
                <tr key={t.id} className={t.is_critical ? "critical-row" : ""}>
                  <td><strong>{t.name}</strong></td>
                  <td><span className={`badge badge-${t.status}`}>{t.status.replace("_", " ")}</span></td>
                  <td>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar" style={{ width: `${t.progress_percent}%` }} />
                      <span>{t.progress_percent}%</span>
                    </div>
                  </td>
                  <td className={t.slack === 0 ? "text-danger bold" : ""}>{t.slack ?? "—"}</td>
                  <td>{t.is_critical ? <span className="badge badge-critical">YES</span> : "—"}</td>
                  <td>
                    <Link to={`/student/tasks/${t.id}`} className="btn btn-sm btn-outline">Update</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {allTasks.length > 8 && (
          <div style={{ padding: "12px 0 0" }}>
            <Link to="/student/tasks" className="btn btn-outline">View All {allTasks.length} Tasks</Link>
          </div>
        )}
      </div>

      <div className="disclaimer">
        <strong>Disclaimer:</strong> This prototype is for academic demonstration purposes only. Schedule data supports but does not replace academic judgement.
      </div>
    </div>
  );
};

export default StudentDashboard;
