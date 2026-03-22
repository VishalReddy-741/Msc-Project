import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { dependenciesAPI, tasksAPI, projectsAPI, scheduleAPI } from "../../services/api";

const DependencyManagerPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedProject = searchParams.get("project_id") || "";

  const [dependencies, setDependencies] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(preselectedProject);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ predecessor: "", successor: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const fetchAll = () => {
    setLoading(true);
    const params = selectedProject ? { project_id: selectedProject } : {};
    Promise.all([dependenciesAPI.list(params), tasksAPI.list(params), projectsAPI.list()])
      .then(([deps, tsk, proj]) => {
        setDependencies(deps.data.results || deps.data);
        setTasks(tsk.data.results || tsk.data);
        setProjects(proj.data.results || proj.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchAll, [selectedProject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await dependenciesAPI.create({ predecessor: Number(form.predecessor), successor: Number(form.successor) });
      setMsg("Dependency created. Schedule automatically recomputed.");
      setTimeout(() => setMsg(""), 3000);
      setForm({ predecessor: "", successor: "" });
      fetchAll();
    } catch (err) {
      const data = err.response?.data;
      if (typeof data === "object") {
        const msgs = Object.values(data).flat();
        setError(msgs.join(" "));
      } else {
        setError("Failed to create dependency. Check for circular dependency.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this dependency?")) return;
    await dependenciesAPI.delete(id);
    setMsg("Dependency removed and schedule recomputed.");
    setTimeout(() => setMsg(""), 3000);
    fetchAll();
  };

  const handleCompute = async () => {
    if (!selectedProject) return;
    await scheduleAPI.compute(selectedProject);
    setMsg("CPM schedule computed.");
    setTimeout(() => setMsg(""), 3000);
    fetchAll();
  };

  const filteredTasks = tasks.filter((t) => !selectedProject || String(t.project) === String(selectedProject));

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dependency Manager</h1>
          <p className="page-desc">
            Define task predecessors to model execution order. The system validates against circular dependencies automatically.
          </p>
        </div>
        {selectedProject && (
          <button className="btn btn-success" onClick={handleCompute}>⚡ Recompute CPM</button>
        )}
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="filter-bar card">
        <label className="filter-label">Project:</label>
        <select value={selectedProject} onChange={(e) => { setSelectedProject(e.target.value); setForm({ predecessor: "", successor: "" }); }}>
          <option value="">All Projects</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
      </div>

      <div className="card form-card">
        <h3 className="card-title">Add Task Dependency</h3>
        <p className="card-desc">Specify that one task must complete before another can start.</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="inline-form">
          <div className="form-row">
            <div className="form-field">
              <label>Predecessor Task <span className="required">*</span></label>
              <select name="predecessor" value={form.predecessor} onChange={(e) => setForm({ ...form, predecessor: e.target.value })} required>
                <option value="">Select predecessor...</option>
                {filteredTasks.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.duration_days}d)</option>
                ))}
              </select>
              <span className="field-hint">Must complete first</span>
            </div>
            <div className="dep-arrow">→</div>
            <div className="form-field">
              <label>Successor Task <span className="required">*</span></label>
              <select name="successor" value={form.successor} onChange={(e) => setForm({ ...form, successor: e.target.value })} required>
                <option value="">Select successor...</option>
                {filteredTasks.map((t) => (
                  <option key={t.id} value={t.id} disabled={t.id === Number(form.predecessor)}>{t.name} ({t.duration_days}d)</option>
                ))}
              </select>
              <span className="field-hint">Can start after predecessor</span>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving || !form.predecessor || !form.successor}>
              {saving ? "Adding..." : "Add Dependency"}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3 className="card-title">Current Dependencies ({dependencies.length})</h3>
        {dependencies.length === 0 ? (
          <div className="empty-state">
            <p>No dependencies defined yet. Add dependencies above to model task execution order.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Predecessor</th>
                <th></th>
                <th>Successor</th>
                <th>Project</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dependencies.map((d) => (
                <tr key={d.id}>
                  <td>
                    <div className="dep-task-cell">
                      <span className="dep-task-name">{d.predecessor_detail?.name || `Task #${d.predecessor}`}</span>
                      <span className="dep-task-duration">{d.predecessor_detail?.duration_days}d</span>
                    </div>
                  </td>
                  <td className="dep-arrow-cell">→</td>
                  <td>
                    <div className="dep-task-cell">
                      <span className="dep-task-name">{d.successor_detail?.name || `Task #${d.successor}`}</span>
                      <span className="dep-task-duration">{d.successor_detail?.duration_days}d</span>
                    </div>
                  </td>
                  <td className="text-muted">
                    {projects.find((p) => p.id === d.predecessor_detail?.project)?.title || "—"}
                  </td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(d.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card tooltip-card">
        <h4>Circular Dependency Protection</h4>
        <p>The system uses topological sorting (Kahn's algorithm) to detect and reject circular dependencies in real time. Adding a dependency that would create a cycle is automatically prevented.</p>
      </div>
    </div>
  );
};

export default DependencyManagerPage;
