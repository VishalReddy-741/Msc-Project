import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { tasksAPI, projectsAPI, authAPI, scheduleAPI } from "../../services/api";

const emptyForm = { project: "", name: "", description: "", duration_days: 1, assigned_to: "", status: "pending" };

const TaskManagerPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedProject = searchParams.get("project_id") || "";

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedProject, setSelectedProject] = useState(preselectedProject);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm, project: preselectedProject });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const fetchAll = () => {
    setLoading(true);
    const params = selectedProject ? { project_id: selectedProject } : {};
    Promise.all([tasksAPI.list(params), projectsAPI.list(), authAPI.getStudents()])
      .then(([tsk, proj, stu]) => {
        setTasks(tsk.data.results || tsk.data);
        setProjects(proj.data.results || proj.data);
        setStudents(stu.data.results || stu.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchAll, [selectedProject]);

  const handleChange = (e) => {
    const val = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setForm({
      project: task.project,
      name: task.name,
      description: task.description || "",
      duration_days: task.duration_days,
      assigned_to: task.assigned_to || "",
      status: task.status,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm, project: selectedProject });
    setShowForm(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.assigned_to) delete payload.assigned_to;
      if (editingId) {
        await tasksAPI.update(editingId, payload);
        setMsg("Task updated successfully.");
      } else {
        await tasksAPI.create(payload);
        setMsg("Task created and schedule recomputed.");
      }
      setTimeout(() => setMsg(""), 3000);
      resetForm();
      fetchAll();
    } catch (err) {
      const data = err.response?.data;
      setError(typeof data === "object" ? Object.values(data).flat().join(" ") : "Failed to save task.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task? This will also remove its dependencies.")) return;
    await tasksAPI.delete(id);
    setMsg("Task deleted and schedule recomputed.");
    setTimeout(() => setMsg(""), 3000);
    fetchAll();
  };

  const handleCompute = async () => {
    if (!selectedProject) return;
    await scheduleAPI.compute(selectedProject);
    setMsg("CPM schedule computed successfully.");
    setTimeout(() => setMsg(""), 3000);
    fetchAll();
  };

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Task Manager</h1>
          <p className="page-desc">Create and manage tasks with duration and assignment. Dependencies defined on the Dependencies page.</p>
        </div>
        <div className="header-actions-row">
          {selectedProject && (
            <button className="btn btn-success" onClick={handleCompute}>⚡ Recompute CPM</button>
          )}
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ ...emptyForm, project: selectedProject }); }}>
            {showForm && !editingId ? "Cancel" : "+ Add Task"}
          </button>
        </div>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="filter-bar card">
        <label className="filter-label">Filter by Project:</label>
        <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
          <option value="">All Projects</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
      </div>

      {showForm && (
        <div className="card form-card">
          <h3 className="card-title">{editingId ? "Edit Task" : "Create New Task"}</h3>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit} className="inline-form">
            <div className="form-row">
              <div className="form-field">
                <label>Project <span className="required">*</span></label>
                <select name="project" value={form.project} onChange={handleChange} required>
                  <option value="">Select project</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Duration (days) <span className="required">*</span></label>
                <input type="number" name="duration_days" value={form.duration_days} onChange={handleChange} min="1" max="365" required />
              </div>
            </div>
            <div className="form-field">
              <label>Task Name <span className="required">*</span></label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Literature Review" required />
            </div>
            <div className="form-field">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows="2" placeholder="Task description..." />
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Assign To (Student)</label>
                <select name="assigned_to" value={form.assigned_to} onChange={handleChange}>
                  <option value="">Unassigned</option>
                  {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : editingId ? "Update Task" : "Create Task"}</button>
              <button type="button" className="btn btn-ghost" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="empty-state card">
          <p>No tasks found. {selectedProject ? "Create tasks for this project." : "Select a project or create tasks."}</p>
        </div>
      ) : (
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Project</th>
                <th>Duration</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Slack</th>
                <th>Critical</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id} className={t.is_critical ? "critical-row" : ""}>
                  <td><strong>{t.name}</strong></td>
                  <td className="text-muted">{projects.find((p) => p.id === t.project)?.title || "—"}</td>
                  <td>{t.duration_days}d</td>
                  <td>{t.assigned_to_detail?.name || <span className="text-muted">Unassigned</span>}</td>
                  <td><span className={`badge badge-${t.status}`}>{t.status.replace("_", " ")}</span></td>
                  <td>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar" style={{ width: `${t.progress_percent}%` }} />
                      <span>{t.progress_percent}%</span>
                    </div>
                  </td>
                  <td className={t.slack === 0 ? "text-danger bold" : ""}>{t.slack ?? "—"}</td>
                  <td>{t.is_critical ? <span className="badge badge-critical">YES</span> : <span className="text-muted">No</span>}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn btn-sm btn-outline" onClick={() => handleEdit(t)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TaskManagerPage;
