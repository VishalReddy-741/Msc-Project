import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();

  const [profileForm, setProfileForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);

  const [pwForm, setPwForm] = useState({ password: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState(null);
  const [pwSaving, setPwSaving] = useState(false);

  const handleProfileChange = (e) => setProfileForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handlePwChange = (e) => setPwForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    if (!profileForm.name.trim()) {
      setProfileMsg({ type: "error", text: "Name cannot be empty." });
      return;
    }
    setProfileSaving(true);
    try {
      const res = await authAPI.updateMe({ name: profileForm.name, email: profileForm.email });
      await refreshUser();
      setProfileMsg({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      const detail = err.response?.data?.email?.[0] || err.response?.data?.detail || "Failed to update profile.";
      setProfileMsg({ type: "error", text: detail });
    } finally {
      setProfileSaving(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwMsg(null);
    if (pwForm.password.length < 6) {
      setPwMsg({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    if (pwForm.password !== pwForm.confirm) {
      setPwMsg({ type: "error", text: "Passwords do not match." });
      return;
    }
    setPwSaving(true);
    try {
      await authAPI.updateMe({ password: pwForm.password });
      setPwForm({ password: "", confirm: "" });
      setPwMsg({ type: "success", text: "Password changed successfully." });
    } catch (err) {
      const detail = err.response?.data?.password?.[0] || err.response?.data?.detail || "Failed to change password.";
      setPwMsg({ type: "error", text: detail });
    } finally {
      setPwSaving(false);
    }
  };

  const joinedDate = user?.created_at ? new Date(user.created_at).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }) : "N/A";

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="breadcrumb">Account</div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-desc">Manage your account details and security settings.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "24px", alignItems: "start" }}>
        <div className="card" style={{ textAlign: "center", padding: "32px 20px" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--primary)", color: "#fff", fontSize: 28, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "var(--vamp)", marginBottom: 6 }}>{user?.name}</div>
          <div style={{ marginBottom: 12 }}>
            <span className={`role-tag role-${user?.role}`}>{user?.role}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7 }}>
            <div>{user?.email}</div>
            <div>Joined {joinedDate}</div>
          </div>
        </div>

        <div>
          <div className="card form-card" style={{ marginBottom: 20 }}>
            <h2 className="card-title">Account Information</h2>
            <p className="card-desc">Update your display name and email address.</p>
            {profileMsg && (
              <div className={`alert alert-${profileMsg.type}`}>{profileMsg.text}</div>
            )}
            <form className="inline-form" onSubmit={saveProfile}>
              <div className="form-row">
                <div className="form-field">
                  <label>Full Name <span className="required">*</span></label>
                  <input
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    placeholder="Your full name"
                  />
                </div>
                <div className="form-field">
                  <label>Email Address <span className="required">*</span></label>
                  <input
                    name="email"
                    type="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    placeholder="your@email.ac.uk"
                  />
                </div>
              </div>
              <div className="form-field">
                <label>Role</label>
                <input value={user?.role === "supervisor" ? "Supervisor / Researcher" : "Student / Participant"} readOnly style={{ background: "var(--mist)", cursor: "not-allowed" }} />
                <span className="field-hint">Role cannot be changed. Contact an administrator if needed.</span>
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit" disabled={profileSaving}>
                  {profileSaving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          <div className="card form-card">
            <h2 className="card-title">Change Password</h2>
            <p className="card-desc">Choose a strong password with at least 6 characters.</p>
            {pwMsg && (
              <div className={`alert alert-${pwMsg.type}`}>{pwMsg.text}</div>
            )}
            <form className="inline-form" onSubmit={savePassword}>
              <div className="form-row">
                <div className="form-field">
                  <label>New Password <span className="required">*</span></label>
                  <input
                    name="password"
                    type="password"
                    value={pwForm.password}
                    onChange={handlePwChange}
                    placeholder="Min. 6 characters"
                    autoComplete="new-password"
                  />
                </div>
                <div className="form-field">
                  <label>Confirm Password <span className="required">*</span></label>
                  <input
                    name="confirm"
                    type="password"
                    value={pwForm.confirm}
                    onChange={handlePwChange}
                    placeholder="Repeat new password"
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit" disabled={pwSaving}>
                  {pwSaving ? "Saving…" : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
