import React from "react";
import { Link } from "react-router-dom";

const methodSteps = [
  { title: "Forward Pass", desc: "Computes Earliest Start (ES) and Earliest Finish (EF) for every task by traversing the dependency graph from source to sink." },
  { title: "Backward Pass", desc: "Computes Latest Start (LS) and Latest Finish (LF) by traversing in reverse, using the project duration as the boundary." },
  { title: "Float Calculation", desc: "Total Float = LS - ES (or LF - EF). Tasks with zero float lie on the critical path. Any delay directly extends project duration." },
  { title: "Critical Path", desc: "The longest path through the network. ResearchFlow highlights critical tasks in red so supervisors can prioritise monitoring and resource allocation." },
];

const principles = [
  { title: "Algorithmic Precision", desc: "Schedules are computed, not estimated. Every date and float value follows mathematically from task durations and the dependency structure you define." },
  { title: "Risk Before Delay", desc: "Tasks with zero float are surfaced immediately. Supervisors see which tasks cannot slip before any delay actually occurs." },
  { title: "Two Views, One Truth", desc: "Supervisors plan and monitor at project level. Researchers log progress at task level. Both see the same live schedule with no divergence." },
  { title: "Run When Ready", desc: "Define your workflow through the interface. The scheduling engine runs on demand and recomputes the full critical path in seconds." },
];

const AboutPage = () => (
  <div className="about-page">
    <section className="about-hero">
      <div className="section-inner">
        <div className="section-label">About the System</div>
        <h1 className="section-heading">ResearchFlow</h1>
        <p className="about-lead">
          ResearchFlow is a web-based research collaboration platform designed to bring the
          Critical Path Method (CPM) into academic project supervision. Supervisors model
          research workflows as directed acyclic graphs; the system computes the optimal
          schedule and surfaces risks before they become delays.
        </p>
      </div>
    </section>

    <section className="about-cpm">
      <div className="section-inner">
        <div className="section-label">Methodology</div>
        <h2 className="section-heading">The Critical Path Method</h2>
        <p className="section-sub">
          CPM is a deterministic project scheduling algorithm developed in the late 1950s.
          ResearchFlow applies a two pass CPM engine, forward pass then backward pass, on
          the task dependency graph for each project.
        </p>
        <div className="method-grid">
          {methodSteps.map((m) => (
            <div key={m.title} className="method-card">
              <h3 className="method-title">{m.title}</h3>
              <p className="method-desc">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="about-roles">
      <div className="section-inner">
        <div className="section-label">User Roles</div>
        <h2 className="section-heading">Two Roles, One Workflow</h2>
        <div className="roles-grid">
          <div className="role-card role-supervisor">
            <div className="role-icon">🎓</div>
            <h3>Supervisor</h3>
            <ul>
              <li>Create and manage research projects</li>
              <li>Define tasks with estimated durations</li>
              <li>Map task dependencies (precedence constraints)</li>
              <li>Compute and visualise the critical path</li>
              <li>View Gantt-style timeline and slack charts</li>
              <li>Monitor overall project health at a glance</li>
            </ul>
            <Link to="/register" className="btn btn-primary btn-sm">Register as Supervisor</Link>
          </div>
          <div className="role-card role-student">
            <div className="role-icon">🔬</div>
            <h3>Student / Researcher</h3>
            <ul>
              <li>View all tasks assigned to you</li>
              <li>Update completion percentage in real time</li>
              <li>See your task's CPM data (ES, EF, LS, LF, Float)</li>
              <li>Identify which of your tasks are critical</li>
              <li>Track project predicted completion date</li>
              <li>Filter tasks by status and priority</li>
            </ul>
            <Link to="/register" className="btn btn-primary btn-sm">Register as Student</Link>
          </div>
        </div>
      </div>
    </section>

    <section className="about-principles">
      <div className="section-inner">
        <div className="section-label">Why ResearchFlow</div>
        <h2 className="section-heading">Built Around Research, Not Around Software</h2>
        <p className="section-sub">
          Every feature exists to answer one question: is this project on schedule? ResearchFlow gives supervisors and researchers the tools to answer that confidently.
        </p>
        <div className="method-grid">
          {principles.map((p) => (
            <div key={p.title} className="method-card">
              <h3 className="method-title">{p.title}</h3>
              <p className="method-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default AboutPage;
