import React, { useEffect, useState } from "react";
import { projectsAPI } from "../../services/api";

const AdminProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = () => projectsAPI.list().then(res => setProjects(Array.isArray(res.data) ? res.data : (res.data.results || []))).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete "${p.title}"? All tasks and schedule data will be removed.`)) return;
    await projectsAPI.delete(p.id);
    load();
  };

  const counts = { all: projects.length };
  ["planning", "active", "completed", "on_hold"].forEach(s => { counts[s] = projects.filter(p => p.status === s).length; });

  const filtered = projects.filter(p => {
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const q = search.toLowerCase();
    return matchStatus && (!q || p.title.toLowerCase().includes(q) || (p.created_by_detail?.name || "").toLowerCase().includes(q));
  });

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="breadcrumb">Admin</div>
          <h1 className="page-title">All Projects</h1>
          <p className="page-desc">Platform wide view of every research project across all supervisors.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="filter-bar">
          <input className="search-input" placeholder="Search by title or supervisor..." value={search} onChange={e => setSearch(e.target.value)} />
          <div className="filter-tabs">
            {[["all", "All"], ["active", "Active"], ["planning", "Planning"], ["completed", "Completed"], ["on_hold", "On Hold"]].map(([val, label]) => (
              <button key={val} className={`filter-tab ${statusFilter === val ? "active" : ""}`} onClick={() => setStatusFilter(val)}>
                {label} <span className="filter-count">{counts[val] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="empty-text">No projects match your filter.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr><th>Project</th><th>Supervisor</th><th>Status</th><th>Tasks</th><th>Progress</th><th>Deadline</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(p => (
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
                    <td>{p.deadline}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProjectsPage;
