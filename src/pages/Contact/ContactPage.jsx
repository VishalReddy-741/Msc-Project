import React, { useState } from "react";

const topics = [
  "General Enquiry",
  "Account and Registration",
  "Project Management",
  "Schedule Planning",
  "Technical Issue",
  "Other",
];

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", topic: topics[0], message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="section-inner">
          <div className="section-label">Get in Touch</div>
          <h1 className="section-heading">Contact Us</h1>
          <p className="section-sub">
            Have a question about ResearchFlow, the CPM scheduling engine, or your account?
            Send a message and we will get back to you.
          </p>
        </div>
      </section>

      <section className="contact-body">
        <div className="section-inner contact-grid">
          <div className="contact-info">
            <div className="contact-info-card">
              <div className="ci-icon">📧</div>
              <h3>Email Support</h3>
              <p>support@researchflow.ac.uk</p>
              <p className="ci-note">Response within 1 to 2 business days</p>
            </div>
            <div className="contact-info-card">
              <div className="ci-icon">🏛</div>
              <h3>Academic Institution</h3>
              <p>Department of Computer Science</p>
              <p className="ci-note">MSc Research Collaboration Platform</p>
            </div>
            <div className="contact-info-card">
              <div className="ci-icon">📖</div>
              <h3>Documentation</h3>
              <p>System documentation and user guides are available from the About page.</p>
            </div>
          </div>

          <div className="contact-form-wrap">
            {sent ? (
              <div className="contact-success">
                <div className="success-icon">✅</div>
                <h2>Message Sent</h2>
                <p>Thank you for reaching out. We will respond to your enquiry shortly.</p>
                <button className="btn btn-primary" onClick={() => setSent(false)}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <h2 className="form-heading">Send a Message</h2>
                <div className="form-row">
                  <div className="form-field">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.ac.uk"
                      required
                    />
                  </div>
                </div>
                <div className="form-field">
                  <label>Topic</label>
                  <select name="topic" value={form.topic} onChange={handleChange}>
                    {topics.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label>Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Describe your question or issue..."
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-full">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
