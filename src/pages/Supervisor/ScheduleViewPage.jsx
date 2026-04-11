import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { scheduleAPI, projectsAPI } from "../../services/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, ReferenceLine, Legend
} from "recharts";

const ScheduleViewPage = () => {
  const [searchParams] = useSearchParams();
  const preProject = searchParams.get("project_id") || "";

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(preProject);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [computing, setComputing] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    projectsAPI.list().then((res) => setProjects(res.data.results || res.data));
  }, []);

  useEffect(() => {
    if (selectedProject) loadSchedule();
  }, [selectedProject]);

  const loadSchedule = () => {
    setLoading(true);
    scheduleAPI.get(selectedProject)
      .then((res) => setSchedule(res.data))
      .catch(() => setSchedule(null))
      .finally(() => setLoading(false));
  };

  const handleCompute = async () => {
    setComputing(true);
    try {
      await scheduleAPI.compute(selectedProject);
      setMsg("CPM schedule computed successfully.");
      setTimeout(() => setMsg(""), 3000);
      loadSchedule();
    } finally {
      setComputing(false);
    }
  };

  const tasks = schedule?.tasks || [];
  const criticalTasks = tasks.filter((t) => t.is_critical);
  const nonCriticalTasks = tasks.filter((t) => !t.is_critical);

  const ganttData = [...tasks]
    .sort((a, b) => (a.earliest_start ?? 0) - (b.earliest_start ?? 0))
    .map((t) => ({
      name: t.name.length > 20 ? t.name.slice(0, 20) + "…" : t.name,
      start: t.earliest_start ?? 0,
      duration: t.duration_days,
      slack: t.slack ?? 0,
      is_critical: t.is_critical,
    }));

  const slackData = [...tasks]
    .sort((a, b) => (a.slack ?? 0) - (b.slack ?? 0))
    .map((t) => ({
      name: t.name.length > 16 ? t.name.slice(0, 16) + "…" : t.name,
      slack: t.slack ?? 0,
      is_critical: t.is_critical,
    }));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">CPM Schedule View</h1>
          <p className="page-desc">Critical Path Method schedule computation results. Critical tasks have zero slack and must not be delayed.</p>
        </div>
        {selectedProject && (
          <button className="btn btn-success" onClick={handleCompute} disabled={computing}>
            {computing ? "Computing..." : "⚡ Recompute Schedule"}
          </button>
        )}
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="filter-bar card">
        <label className="filter-label">Select Project:</label>
        <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
          <option value="">Choose a project...</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
      </div>

      {loading && <div className="page-loading"><div className="spinner" /></div>}

      {schedule && !loading && (
        <>
          <div className="schedule-summary-grid">
            <div className="schedule-summary-card">
              <div className="summary-label">Project Start</div>
              <div className="summary-value">{schedule.start_date}</div>
            </div>
            <div className="schedule-summary-card">
              <div className="summary-label">Deadline</div>
              <div className="summary-value">{schedule.deadline}</div>
            </div>
            <div className="schedule-summary-card highlight">
              <div className="summary-label">Predicted Completion</div>
              <div className={`summary-value ${schedule.on_schedule ? "text-success" : "text-danger"}`}>
                {schedule.predicted_end_date}
              </div>
              <div className="summary-sub">{schedule.on_schedule ? "✓ On schedule" : "⚠ Behind schedule"}</div>
            </div>
            <div className="schedule-summary-card">
              <div className="summary-label">Project Duration</div>
              <div className="summary-value">{schedule.project_duration_days} days</div>
            </div>
            <div className="schedule-summary-card critical-card">
              <div className="summary-label">Critical Tasks</div>
              <div className="summary-value text-danger">{schedule.critical_task_count} / {schedule.total_task_count}</div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">Critical Path Tasks</h3>
            <p className="card-desc">These tasks have zero float. Any delay directly delays the project completion date.</p>
            {criticalTasks.length === 0 ? (
              <p className="text-muted">No tasks computed yet. Click Recompute Schedule.</p>
            ) : (
              <div className="critical-tasks-list">
                {criticalTasks.map((t, i) => (
                  <div key={t.id} className="critical-task-chip">
                    <span className="chip-num">{i + 1}</span>
                    <span className="chip-name">{t.name}</span>
                    <span className="chip-duration">{t.duration_days}d</span>
                    <span className="chip-es">ES: {t.earliest_start}</span>
                    <span className="chip-ef">EF: {t.earliest_finish}</span>
                    <span className="badge badge-critical">CRITICAL</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-grid">
            <div className="card chart-card">
              <h3 className="card-title">Gantt-Style Task Timeline</h3>
              <p className="card-desc">Red bars = critical tasks (zero slack). Green bars = non-critical tasks.</p>
              {ganttData.length > 0 ? (
                <ResponsiveContainer width="100%" height={Math.max(300, ganttData.length * 36)}>
                  <BarChart data={ganttData} layout="vertical" margin={{ left: 10, right: 40, top: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" label={{ value: "Days from project start", position: "insideBottom", offset: -5 }} />
                    <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value, name) => [name === "start" ? `Day ${value}` : `${value} days`, name === "start" ? "Starts" : "Duration"]}
                    />
                    <Bar dataKey="start" stackId="a" fill="transparent" />
                    <Bar dataKey="duration" stackId="a" radius={[0, 4, 4, 0]}>
                      {ganttData.map((d, i) => (
                        <Cell key={i} fill={d.is_critical ? "#c0183a" : "#1e6b35"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="empty-text">No tasks with schedule data. Compute schedule first.</p>}
            </div>

            <div className="card chart-card">
              <h3 className="card-title">Slack Distribution</h3>
              <p className="card-desc">Tasks with zero slack are on the critical path and cannot be delayed.</p>
              {slackData.length > 0 ? (
                <ResponsiveContainer width="100%" height={Math.max(300, slackData.length * 28)}>
                  <BarChart data={slackData} layout="vertical" margin={{ left: 10, right: 40, top: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" label={{ value: "Slack (days)", position: "insideBottom", offset: -5 }} />
                    <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value) => [`${value} days`, "Slack"]} />
                    <ReferenceLine x={0} stroke="#c0183a" strokeDasharray="3 3" label={{ value: "Critical", fill: "#c0183a", fontSize: 11 }} />
                    <Bar dataKey="slack" radius={[0, 4, 4, 0]}>
                      {slackData.map((d, i) => (
                        <Cell key={i} fill={d.slack === 0 ? "#c0183a" : d.slack <= 3 ? "#d4a017" : "#c25a1a"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="empty-text">No slack data. Compute schedule first.</p>}
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">Full Schedule Table</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task Name</th>
                  <th>Duration</th>
                  <th>ES</th>
                  <th>EF</th>
                  <th>LS</th>
                  <th>LF</th>
                  <th>Slack</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Critical</th>
                </tr>
              </thead>
              <tbody>
                {tasks
                  .slice()
                  .sort((a, b) => (a.earliest_start ?? 99) - (b.earliest_start ?? 99))
                  .map((t) => (
                    <tr key={t.id} className={t.is_critical ? "critical-row" : ""}>
                      <td><strong>{t.name}</strong></td>
                      <td>{t.duration_days}d</td>
                      <td>{t.earliest_start ?? "-"}</td>
                      <td>{t.earliest_finish ?? "-"}</td>
                      <td>{t.latest_start ?? "-"}</td>
                      <td>{t.latest_finish ?? "-"}</td>
                      <td className={t.slack === 0 ? "text-danger bold" : t.slack <= 3 ? "text-warning" : ""}>
                        {t.slack ?? "-"}
                      </td>
                      <td><span className={`badge badge-${t.status}`}>{t.status?.replace("_", " ")}</span></td>
                      <td>
                        <div className="progress-bar-wrap">
                          <div className="progress-bar" style={{ width: `${t.progress_percent}%` }} />
                          <span>{t.progress_percent}%</span>
                        </div>
                      </td>
                      <td>{t.is_critical ? <span className="badge badge-critical">YES</span> : "-"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="card tooltip-card">
            <h4>Legend</h4>
            <div className="legend-grid">
              <div className="legend-item"><span className="legend-dot" style={{ background: "#c0183a" }} />Critical Task (Slack = 0)</div>
              <div className="legend-item"><span className="legend-dot" style={{ background: "#d4a017" }} />Low Slack (1–3 days)</div>
              <div className="legend-item"><span className="legend-dot" style={{ background: "#c25a1a" }} />Sufficient Slack (&gt;3 days)</div>
            </div>
          </div>
        </>
      )}

      {!selectedProject && !loading && (
        <div className="empty-state card">
          <p>Select a project above to view its CPM schedule.</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleViewPage;
