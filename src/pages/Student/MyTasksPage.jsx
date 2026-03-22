import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { tasksAPI } from "../../services/api";

const MyTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    tasksAPI.list()
      .then((res) => setTasks(res.data.results || res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;

  const allTasks = Array.isArray(tasks) ? tasks : [];
  const filtered = allTasks.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || t.status === filter || (filter === "critical" && t.is_critical);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-desc">All tasks assigned to you. Update your progress and mark completions.</p>
        </div>
      </div>

      <div className="filter-bar card">
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-tabs">
          {["all", "pending", "in_progress", "completed", "critical"].map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "in_progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
              {f === "critical" && allTasks.filter((t) => t.is_critical).length > 0 && (
                <span className="filter-count">{allTasks.filter((t) => t.is_critical).length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state card">
          <p>No tasks match your filter.</p>
        </div>
      ) : (
        <div className="task-cards-grid">
          {filtered.map((t) => (
            <div key={t.id} className={`task-card card ${t.is_critical ? "task-card-critical" : ""}`}>
              <div className="task-card-header">
                <h3 className="task-name">{t.name}</h3>
                {t.is_critical && <span className="badge badge-critical">CRITICAL</span>}
              </div>
              <div className="task-card-body">
                {t.description && <p className="task-desc">{t.description}</p>}
                <div className="task-meta-row">
                  <div className="task-meta-item">
                    <span className="meta-label">Duration</span>
                    <span>{t.duration_days} days</span>
                  </div>
                  <div className="task-meta-item">
                    <span className="meta-label">Earliest Start</span>
                    <span>Day {t.earliest_start ?? "—"}</span>
                  </div>
                  <div className="task-meta-item">
                    <span className="meta-label">Earliest Finish</span>
                    <span>Day {t.earliest_finish ?? "—"}</span>
                  </div>
                  <div className="task-meta-item">
                    <span className={`meta-label${t.slack === 0 ? " text-danger" : ""}`}>Slack</span>
                    <span className={t.slack === 0 ? "text-danger bold" : ""}>{t.slack ?? "—"} days</span>
                  </div>
                </div>
                <div className="progress-section">
                  <div className="progress-header">
                    <span>Progress</span>
                    <span>{t.progress_percent}%</span>
                  </div>
                  <div className="progress-bar-wrap full">
                    <div className="progress-bar" style={{ width: `${t.progress_percent}%`, background: t.is_critical ? "#c0183a" : undefined }} />
                  </div>
                </div>
              </div>
              <div className="task-card-footer">
                <span className={`badge badge-${t.status}`}>{t.status.replace("_", " ")}</span>
                <Link to={`/student/tasks/${t.id}`} className="btn btn-sm btn-primary">Update Progress</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasksPage;
