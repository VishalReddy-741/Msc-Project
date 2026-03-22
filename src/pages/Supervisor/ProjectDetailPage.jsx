import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { projectsAPI, tasksAPI, scheduleAPI } from "../../services/api";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [computing, setComputing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const loadData = () => {
    setLoading(true);
    Promise.all([projectsAPI.get(id), tasksAPI.list({ project_id: id })])
      .then(([proj, tsk]) => {
        setProject(proj.data);
        setForm(proj.data);
        setTasks(tsk.data.results || tsk.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadData, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await projectsAPI.update(id, form);
      setProject(res.data);
      setEditMode(false);
      setMsg("Project updated successfully.");
      setTimeout(() => setMsg(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleCompute = async () => {
    setComputing(true);
    try {
      await scheduleAPI.compute(id);
      setMsg("Schedule computed successfully. Critical path identified.");
      setTimeout(() => setMsg(""), 4000);
      loadData();
    } finally {
      setComputing(false);
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;
  if (!project) return <div className="page"><p>Project not found.</p></div>;

  const criticalTasks = tasks.filter((t) => t.is_critical);
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <Link to="/supervisor/projects">Projects</Link> / {project.title}
          </div>
          <h1 className="page-title">{project.title}</h1>
        </div>
        <div className="header-actions-row">
          <button className="btn btn-success" onClick={handleCompute} disabled={computing}>
            {computing ? "Computing..." : "⚡ Compute CPM Schedule"}
          </button>
          <Link to={`/supervisor/schedule?project_id=${id}`} className="btn btn-outline">View Schedule</Link>
          <button className="btn btn-outline" onClick={() => setEditMode(!editMode)}>
            {editMode ? "Cancel Edit" : "Edit Project"}
          </button>
        </div>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      {editMode ? (
        <div className="card form-card">
          <h3 className="card-title">Edit Project</h3>
          <form onSubmit={handleSave} className="inline-form">
            <div className="form-row">
              <div className="form-field">
                <label>Title</label>
                <input name="title" value={form.title || ""} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label>Status</label>
                <select name="status" value={form.status || "planning"} onChange={handleChange}>
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="form-field">
              <label>Description</label>
              <textarea name="description" value={form.description || ""} onChange={handleChange} rows="3" />
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Start Date</label>
                <input type="date" name="start_date" value={form.start_date || ""} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label>Deadline</label>
                <input type="date" name="deadline" value={form.deadline || ""} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
              <button type="button" className="btn btn-ghost" onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card">
          <div className="project-info-grid">
            <div className="info-item">
              <span className="info-label">Status</span>
              <span className={`badge badge-${project.status}`}>{project.status.replace("_", " ")}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Start Date</span>
              <span>{project.start_date}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Deadline</span>
              <span>{project.deadline}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Total Tasks</span>
              <span>{tasks.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Critical Tasks</span>
              <span className="text-danger">{criticalTasks.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Progress</span>
              <span>{progress}%</span>
            </div>
          </div>
          {project.description && <p className="project-description">{project.description}</p>}
        </div>
      )}

      <div className="section-header">
        <h2 className="section-title">Task Overview</h2>
        <Link to={`/supervisor/tasks?project_id=${id}`} className="btn btn-sm btn-primary">Manage Tasks</Link>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state card">
          <p>No tasks yet. <Link to={`/supervisor/tasks?project_id=${id}`}>Add tasks to this project.</Link></p>
        </div>
      ) : (
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Duration</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>ES</th>
                <th>EF</th>
                <th>LS</th>
                <th>LF</th>
                <th>Slack</th>
                <th>Critical</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id} className={t.is_critical ? "critical-row" : ""}>
                  <td><strong>{t.name}</strong></td>
                  <td>{t.duration_days}d</td>
                  <td>{t.assigned_to_detail?.name || "—"}</td>
                  <td><span className={`badge badge-${t.status}`}>{t.status.replace("_", " ")}</span></td>
                  <td>{t.earliest_start ?? "—"}</td>
                  <td>{t.earliest_finish ?? "—"}</td>
                  <td>{t.latest_start ?? "—"}</td>
                  <td>{t.latest_finish ?? "—"}</td>
                  <td className={t.slack === 0 ? "text-danger bold" : ""}>{t.slack ?? "—"}</td>
                  <td>{t.is_critical ? <span className="badge badge-critical">CRITICAL</span> : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="card tooltip-card">
        <h4>Understanding the Schedule</h4>
        <div className="tooltip-grid">
          <div className="tooltip-item">
            <strong>ES (Earliest Start):</strong> The earliest day this task can begin.
          </div>
          <div className="tooltip-item">
            <strong>EF (Earliest Finish):</strong> The earliest day this task can complete.
          </div>
          <div className="tooltip-item">
            <strong>LS (Latest Start):</strong> The latest day this task can start without delaying the project.
          </div>
          <div className="tooltip-item">
            <strong>LF (Latest Finish):</strong> The latest day this task can finish without delaying the project.
          </div>
          <div className="tooltip-item">
            <strong>Slack:</strong> The amount of time a task can be delayed without affecting the project deadline. Zero slack = critical.
          </div>
          <div className="tooltip-item">
            <strong>Critical Path:</strong> The longest path of tasks through the project network. Any delay on this path delays the entire project.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
