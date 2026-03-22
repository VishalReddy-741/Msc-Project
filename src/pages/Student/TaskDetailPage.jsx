import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { tasksAPI, scheduleAPI } from "../../services/api";

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ progress_percent: 0, status: "pending" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    tasksAPI.get(id)
      .then((res) => {
        setTask(res.data);
        setForm({ progress_percent: res.data.progress_percent, status: res.data.status });
        return scheduleAPI.get(res.data.project);
      })
      .then((res) => setSchedule(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await tasksAPI.updateProgress(id, form);
      setTask(res.data);
      setMsg("Progress updated. The project CPM schedule has been recomputed.");
      setTimeout(() => setMsg(""), 4000);
    } catch (err) {
      const data = err.response?.data;
      setError(typeof data === "object" ? Object.values(data).flat().join(" ") : "Failed to update progress.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;
  if (!task) return <div className="page"><p>Task not found or not assigned to you.</p></div>;

  const projectDuration = schedule?.project_duration_days || null;
  const progressImpact = projectDuration
    ? Math.round((task.duration_days / projectDuration) * 100)
    : null;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <Link to="/student/tasks">My Tasks</Link> / {task.name}
          </div>
          <h1 className="page-title">{task.name}</h1>
          {task.is_critical && (
            <div className="critical-banner">
              ⚠ This is a CRITICAL task. It is on the project's critical path. Any delay in this task will delay the entire project.
            </div>
          )}
        </div>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="detail-grid">
        <div className="card task-detail-card">
          <h3 className="card-title">Task Information</h3>
          <div className="detail-fields">
            <div className="detail-field">
              <span className="detail-label">Task Name</span>
              <span className="detail-value">{task.name}</span>
            </div>
            {task.description && (
              <div className="detail-field full-width">
                <span className="detail-label">Description</span>
                <span className="detail-value">{task.description}</span>
              </div>
            )}
            <div className="detail-field">
              <span className="detail-label">Duration</span>
              <span className="detail-value">{task.duration_days} days</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Status</span>
              <span className={`badge badge-${task.status}`}>{task.status.replace("_", " ")}</span>
            </div>
          </div>

          <h4 className="sub-section-title">CPM Schedule Data</h4>
          <div className="cpm-data-grid">
            <div className="cpm-data-item">
              <span className="cpm-label">Earliest Start</span>
              <span className="cpm-value">Day {task.earliest_start ?? "—"}</span>
            </div>
            <div className="cpm-data-item">
              <span className="cpm-label">Earliest Finish</span>
              <span className="cpm-value">Day {task.earliest_finish ?? "—"}</span>
            </div>
            <div className="cpm-data-item">
              <span className="cpm-label">Latest Start</span>
              <span className="cpm-value">Day {task.latest_start ?? "—"}</span>
            </div>
            <div className="cpm-data-item">
              <span className="cpm-label">Latest Finish</span>
              <span className="cpm-value">Day {task.latest_finish ?? "—"}</span>
            </div>
            <div className="cpm-data-item">
              <span className="cpm-label">Slack (Float)</span>
              <span className={`cpm-value ${task.slack === 0 ? "text-danger bold" : ""}`}>
                {task.slack ?? "—"} days
              </span>
            </div>
            <div className="cpm-data-item">
              <span className="cpm-label">On Critical Path</span>
              <span className={`cpm-value ${task.is_critical ? "text-danger bold" : ""}`}>
                {task.is_critical ? "YES — Cannot be delayed" : "No"}
              </span>
            </div>
          </div>

          {progressImpact !== null && (
            <div className="impact-note">
              <strong>Timeline Impact:</strong> This task represents approximately {progressImpact}% of the total project duration.
              {task.is_critical && " As a critical task, your progress directly determines the predicted project completion date."}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="card-title">Update Progress</h3>
          <form onSubmit={handleSave} className="progress-form">
            <div className="form-field">
              <label>Progress Percentage</label>
              <div className="range-wrap">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={form.progress_percent}
                  onChange={(e) => setForm({ ...form, progress_percent: Number(e.target.value) })}
                />
                <span className="range-value">{form.progress_percent}%</span>
              </div>
              <div className="progress-bar-wrap full">
                <div className="progress-bar" style={{ width: `${form.progress_percent}%`, background: task.is_critical ? "#c0183a" : undefined }} />
              </div>
            </div>
            <div className="form-field">
              <label>Task Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Progress"}
              </button>
              <Link to="/student/tasks" className="btn btn-ghost">Back to Tasks</Link>
            </div>
          </form>

          {schedule && (
            <div className="project-context">
              <h4>Project Context</h4>
              <div className="context-grid">
                <div className="context-item">
                  <span className="context-label">Project</span>
                  <span>{schedule.project_title}</span>
                </div>
                <div className="context-item">
                  <span className="context-label">Predicted Completion</span>
                  <span className={schedule.on_schedule ? "text-success" : "text-danger"}>
                    {schedule.predicted_end_date}
                  </span>
                </div>
                <div className="context-item">
                  <span className="context-label">Project Duration</span>
                  <span>{schedule.project_duration_days} days</span>
                </div>
                <div className="context-item">
                  <span className="context-label">On Schedule</span>
                  <span className={schedule.on_schedule ? "text-success" : "text-danger"}>
                    {schedule.on_schedule ? "✓ Yes" : "⚠ No"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card tooltip-card">
        <h4>Understanding Your Schedule Data</h4>
        <div className="tooltip-grid">
          <div className="tooltip-item">
            <strong>Slack:</strong> The number of days this task can be delayed without delaying the overall project. If slack is 0, you are on the critical path — your task cannot slip.
          </div>
          <div className="tooltip-item">
            <strong>Critical Path:</strong> The sequence of tasks that determines the minimum completion time for the project. Tasks on the critical path have zero slack.
          </div>
          <div className="tooltip-item">
            <strong>Earliest Start:</strong> The earliest day (from project start) on which this task can begin, given its predecessors.
          </div>
          <div className="tooltip-item">
            <strong>Latest Finish:</strong> The latest day this task can finish without causing the project to miss its deadline.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
