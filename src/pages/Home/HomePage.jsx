import React from "react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: "🔗",
    title: "Dependency Mapping",
    desc: "Define which tasks must precede others. Visualise the full dependency structure before work begins.",
  },
  {
    icon: "📐",
    title: "Critical Path Engine",
    desc: "Automatic forward and backward pass computation yields Earliest Start, Latest Finish and Total Float for every task.",
  },
  {
    icon: "📅",
    title: "Schedule Visualisation",
    desc: "Gantt style timeline and slack distribution charts give supervisors an instant view of the project health.",
  },
  {
    icon: "👤",
    title: "Dual Role Access",
    desc: "Supervisors manage projects and define workflows. Researchers update progress and inspect their assigned tasks.",
  },
  {
    icon: "📊",
    title: "Progress Tracking",
    desc: "Live progress updates trigger instant schedule recomputation so the timeline always reflects actual work done.",
  },
  {
    icon: "🔔",
    title: "Critical Task Alerts",
    desc: "Tasks with zero float are automatically flagged. Researchers and supervisors are alerted before delays cascade.",
  },
];

const steps = [
  {
    num: "01",
    title: "Create a Project",
    desc: "Supervisors create a research project, set the start date and deadline, and invite students to collaborate.",
  },
  {
    num: "02",
    title: "Define Tasks & Dependencies",
    desc: "Break the project into tasks with estimated durations. Link tasks with dependency rules to capture the workflow.",
  },
  {
    num: "03",
    title: "Compute the Critical Path",
    desc: "ResearchFlow runs the CPM engine automatically. Tasks on the critical path are highlighted. The predicted completion date is shown instantly.",
  },
  {
    num: "04",
    title: "Monitor & Adapt",
    desc: "Students update task progress. The schedule recomputes in real time. Supervisors spot risks early and re-prioritise accordingly.",
  },
];

const HomePage = () => (
  <div className="home-page">
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-badge">Critical Path Method · Academic Research</div>
        <h1 className="hero-heading">
          Intelligent Workflow Scheduling<br />for Research Projects
        </h1>
        <p className="hero-lead">
          ResearchFlow brings dependency aware scheduling to academic supervision.
          Define tasks, map dependencies, and let the scheduling engine calculate the critical path
          so every research milestone is planned, tracked and delivered on schedule.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
          <Link to="/about" className="btn btn-ghost btn-lg">Learn More →</Link>
        </div>
        <div className="hero-stats">
          <div className="hstat"><span className="hstat-val">CPM</span><span className="hstat-lbl">Scheduling Engine</span></div>
          <div className="hstat-div" />
          <div className="hstat"><span className="hstat-val">2</span><span className="hstat-lbl">User Roles</span></div>
          <div className="hstat-div" />
          <div className="hstat"><span className="hstat-val">Live</span><span className="hstat-lbl">Schedule Updates</span></div>
          <div className="hstat-div" />
          <div className="hstat"><span className="hstat-val">Auto</span><span className="hstat-lbl">Critical Path Detection</span></div>
        </div>
      </div>
      <div className="hero-visual">
        <div className="cpm-card">
          <div className="cpm-card-header">
            <span className="cpm-dot red" /><span className="cpm-dot amber" /><span className="cpm-dot green" />
            <span className="cpm-card-title">Critical Path — Project 1</span>
          </div>
          <div className="cpm-rows">
            {[
              { name: "Task 1", es: 0, ef: 14, ls: 0, lf: 14, sl: 0, crit: true },
              { name: "Task 2", es: 14, ef: 21, ls: 14, lf: 21, sl: 0, crit: true },
              { name: "Task 3", es: 21, ef: 31, ls: 23, lf: 33, sl: 2, crit: false },
              { name: "Task 4", es: 21, ef: 29, ls: 21, lf: 29, sl: 0, crit: true },
              { name: "Task 5", es: 29, ef: 41, ls: 29, lf: 41, sl: 0, crit: true },
            ].map((r) => (
              <div key={r.name} className={`cpm-row ${r.crit ? "crit" : ""}`}>
                <span className="cpm-name">{r.name}</span>
                <div className="cpm-cells">
                  <span>ES {r.es}</span><span>EF {r.ef}</span>
                  <span>LS {r.ls}</span><span>LF {r.lf}</span>
                  <span className={`cpm-float ${r.sl === 0 ? "zero" : ""}`}>Float {r.sl}</span>
                </div>
                {r.crit && <span className="cpm-badge">Critical</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="features-section">
      <div className="section-inner">
        <div className="section-label">Core Capabilities</div>
        <h2 className="section-heading">Everything a Research Team Needs</h2>
        <p className="section-sub">
          From dependency modelling to live schedule visualisation — ResearchFlow handles the
          scheduling complexity so supervisors and students can focus on the research.
        </p>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="how-section">
      <div className="section-inner">
        <div className="section-label">Workflow</div>
        <h2 className="section-heading">How ResearchFlow Works</h2>
        <div className="steps-grid">
          {steps.map((s) => (
            <div key={s.num} className="step-card">
              <div className="step-num">{s.num}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="cta-section">
      <div className="cta-inner">
        <h2 className="cta-heading">Ready to Schedule Your Research?</h2>
        <p className="cta-sub">
          Register as a supervisor to create your first project, or join as a researcher to start
          tracking your assignments with precision scheduling.
        </p>
        <div className="cta-actions">
          <Link to="/register" className="btn btn-primary btn-lg">Create an Account</Link>
          <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
        </div>
      </div>
    </section>
  </div>
);

export default HomePage;
