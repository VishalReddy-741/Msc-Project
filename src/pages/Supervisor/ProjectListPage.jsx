import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { projectsAPI } from "../../services/api";

const emptyForm = { title: "", description: "", start_date: "", deadline: "", status: "planning" };

const ProjectListPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchProjects = () => {
    setLoading(true);
    projectsAPI.list()
      .then((res) => setProjects(res.data.results || res.data))
      .finally(() => setLoading(false));
  };

  useEffect(fetchProjects, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await projectsAPI.create(form);
      setShowForm(false);
      setForm(emptyForm);
      fetchProjects();
    } catch (err) {
      const data = err.response?.data;
      setError(typeof data === "object" ? Object.values(data).flat().join(" ") : "Failed to create project.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project and all its tasks?")) return;
    await projectsAPI.delete(id);
    fetchProjects();
  };

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Research Projects</h1>
          <p className="page-desc">Manage research projects and their CPM-based task schedules.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ New Project"}
        </button>
      </div>

      {showForm && (
        <div className="card form-card">
          <h3 className="card-title">Create New Project</h3>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit} className="inline-form">
            <div className="form-row">
              <div className="form-field">
                <label>Project Title</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. CPM Research Implementation" required />
              </div>
              <div className="form-field">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="form-field">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Research project description..." />
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Start Date</label>
                <input type="date" name="start_date" value={form.start_date} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label>Deadline</label>
                <input type="date" name="deadline" value={form.deadline} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Creating..." : "Create Project"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="empty-state card">
          <p>No projects found. Create your first research project to get started.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((p) => (
            <div key={p.id} className="project-card card">
              <div className="project-card-header">
                <h3 className="project-title">{p.title}</h3>
                <span className={`badge badge-${p.status}`}>{p.status.replace("_", " ")}</span>
              </div>
              <p className="project-desc">{p.description || "No description provided."}</p>
              <div className="project-meta">
                <div className="meta-item">
                  <span className="meta-label">Start</span>
                  <span>{p.start_date}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Deadline</span>
                  <span>{p.deadline}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Tasks</span>
                  <span>{p.task_count}</span>
                </div>
              </div>
              <div className="progress-row">
                <div className="progress-bar-wrap full">
                  <div className="progress-bar" style={{ width: `${p.progress}%` }} />
                </div>
                <span className="progress-label">{p.progress}% complete</span>
              </div>
              <div className="project-card-actions">
                <Link to={`/supervisor/projects/${p.id}`} className="btn btn-sm btn-primary">Open</Link>
                <Link to={`/supervisor/tasks?project_id=${p.id}`} className="btn btn-sm btn-outline">Tasks</Link>
                <Link to={`/supervisor/schedule?project_id=${p.id}`} className="btn btn-sm btn-outline">Schedule</Link>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectListPage;
