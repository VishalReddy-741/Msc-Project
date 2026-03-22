import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { projectsAPI, tasksAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#1e6b35", "#c25a1a", "#d4a017", "#c0183a", "#27a048"];

const StatCard = ({ label, value, sub, color }) => (
  <div className="stat-card" style={{ borderLeftColor: color }}>
    <div className="stat-value" style={{ color }}>{value}</div>
    <div className="stat-label">{label}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
);

const SupervisorDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([projectsAPI.list(), tasksAPI.list()])
      .then(([proj, tsk]) => {
        setProjects(proj.data.results || proj.data);
        setTasks(tsk.data.results || tsk.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;

  const allProjects = Array.isArray(projects) ? projects : [];
  const allTasks = Array.isArray(tasks) ? tasks : [];

  const activeProjects = allProjects.filter((p) => p.status === "active").length;
  const completedTasks = allTasks.filter((t) => t.status === "completed").length;
  const criticalTasks = allTasks.filter((t) => t.is_critical).length;
  const pendingTasks = allTasks.filter((t) => t.status === "pending").length;

  const taskStatusData = [
    { name: "Completed", value: completedTasks },
    { name: "In Progress", value: allTasks.filter((t) => t.status === "in_progress").length },
    { name: "Pending", value: pendingTasks },
    { name: "Blocked", value: allTasks.filter((t) => t.status === "blocked").length },
  ].filter((d) => d.value > 0);

  const slackData = allTasks
    .filter((t) => t.slack !== null && t.slack !== undefined)
    .slice(0, 10)
    .map((t) => ({ name: t.name.length > 15 ? t.name.slice(0, 15) + "…" : t.name, slack: t.slack }));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Supervisor Dashboard</h1>
          <p className="page-desc">Welcome back, {user.name}. Overview of all research projects and CPM schedule status.</p>
        </div>
        <Link to="/supervisor/projects" className="btn btn-primary">+ New Project</Link>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Projects" value={allProjects.length} sub={`${activeProjects} active`} color="#1e6b35" />
        <StatCard label="Total Tasks" value={allTasks.length} sub={`${completedTasks} completed`} color="#c25a1a" />
        <StatCard label="Critical Tasks" value={criticalTasks} sub="Zero slack — highest priority" color="#c0183a" />
        <StatCard label="Pending Tasks" value={pendingTasks} sub="Awaiting progress" color="#d4a017" />
      </div>

      <div className="dashboard-grid">
        <div className="card chart-card">
          <h3 className="card-title">Task Status Distribution</h3>
          {taskStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={taskStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                  {taskStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="empty-text">No task data available yet.</p>}
        </div>

        <div className="card chart-card">
          <h3 className="card-title">Slack Distribution (Top 10 Tasks)</h3>
          {slackData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={slackData} margin={{ left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-30} textAnchor="end" tick={{ fontSize: 11 }} />
                <YAxis label={{ value: "Slack (days)", angle: -90, position: "insideLeft", fontSize: 12 }} />
                <Tooltip formatter={(v) => [`${v} days`, "Slack"]} />
                <Bar dataKey="slack" fill="#1e6b35" radius={[4, 4, 0, 0]}>
                  {slackData.map((d, i) => <Cell key={i} fill={d.slack === 0 ? "#c0183a" : "#1e6b35"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="empty-text">Compute schedules to see slack data.</p>}
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Projects Overview</h3>
        {allProjects.length === 0 ? (
          <div className="empty-state">
            <p>No projects yet. <Link to="/supervisor/projects">Create your first project.</Link></p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Project Title</th>
                <th>Status</th>
                <th>Tasks</th>
                <th>Progress</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allProjects.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.title}</strong></td>
                  <td><span className={`badge badge-${p.status}`}>{p.status.replace("_", " ")}</span></td>
                  <td>{p.task_count}</td>
                  <td>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar" style={{ width: `${p.progress}%` }} />
                      <span>{p.progress}%</span>
                    </div>
                  </td>
                  <td>{p.deadline}</td>
                  <td>
                    <Link to={`/supervisor/projects/${p.id}`} className="btn btn-sm btn-outline">View</Link>
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

export default SupervisorDashboard;
