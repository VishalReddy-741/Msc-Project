import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { adminAPI } from "../../services/api";

const AdminUsersPage = () => {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [addError, setAddError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" });
  const [editError, setEditError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setSaving(false);
    adminAPI.listUsers().then(res => setUsers(Array.isArray(res.data) ? res.data : (res.data.results || []))).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const counts = { all: users.length, supervisor: 0, student: 0, admin: 0 };
  users.forEach(u => { if (counts[u.role] !== undefined) counts[u.role]++; });

  const filtered = users.filter(u => {
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const q = search.toLowerCase();
    return matchRole && (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    setAddError("");
    setSaving(true);
    try {
      await adminAPI.createUser(addForm);
      setAddForm({ name: "", email: "", password: "", role: "student" });
      setShowAdd(false);
      load();
    } catch (err) {
      const d = err.response?.data;
      setAddError(d && typeof d === "object" ? Object.values(d).flat().join(" ") : "Failed to create user.");
      setSaving(false);
    }
  };

  const startEdit = (u) => {
    setEditId(u.id);
    setEditForm({ name: u.name, email: u.email, role: u.role });
    setEditError("");
  };

  const handleSaveEdit = async () => {
    setEditError("");
    setSaving(true);
    try {
      await adminAPI.updateUser(editId, editForm);
      setEditId(null);
      load();
    } catch (err) {
      const d = err.response?.data;
      setEditError(d && typeof d === "object" ? Object.values(d).flat().join(" ") : "Failed to update.");
      setSaving(false);
    }
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete "${u.name}"? This cannot be undone.`)) return;
    await adminAPI.deleteUser(u.id);
    load();
  };

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;

  const roleOptionLabel = { student: "Researcher", supervisor: "Supervisor", admin: "Admin" };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="breadcrumb">Admin</div>
          <h1 className="page-title">User Management</h1>
          <p className="page-desc">Create, edit and remove platform accounts. Changes take effect immediately.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowAdd(!showAdd); setAddError(""); }}>
          {showAdd ? "Cancel" : "+ Add User"}
        </button>
      </div>

      {showAdd && (
        <div className="card form-card" style={{ marginBottom: 20 }}>
          <h3 className="card-title">New User Account</h3>
          {addError && <div className="alert alert-error">{addError}</div>}
          <form className="inline-form" onSubmit={handleAdd}>
            <div className="form-row">
              <div className="form-field">
                <label>Full Name <span className="required">*</span></label>
                <input value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" required />
              </div>
              <div className="form-field">
                <label>Email <span className="required">*</span></label>
                <input type="email" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} placeholder="user@email.ac.uk" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Password <span className="required">*</span></label>
                <input type="password" value={addForm.password} onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))} placeholder="Min. 6 characters" required autoComplete="new-password" />
              </div>
              <div className="form-field">
                <label>Role <span className="required">*</span></label>
                <select value={addForm.role} onChange={e => setAddForm(f => ({ ...f, role: e.target.value }))}>
                  <option value="student">Researcher</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Creating..." : "Create Account"}</button>
              <button className="btn btn-ghost" type="button" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <div className="filter-bar">
          <input className="search-input" placeholder="Search name or email..." value={search} onChange={e => setSearch(e.target.value)} />
          <div className="filter-tabs">
            {[["all", "All"], ["supervisor", "Supervisors"], ["student", "Researchers"], ["admin", "Admins"]].map(([val, label]) => (
              <button key={val} className={`filter-tab ${roleFilter === val ? "active" : ""}`} onClick={() => setRoleFilter(val)}>
                {label} <span className="filter-count">{counts[val] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="empty-text">No users match your filter.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  editId === u.id ? (
                    <tr key={u.id} style={{ background: "var(--mist)" }}>
                      <td>
                        <input className="search-input" style={{ width: "100%" }} value={editForm.name}
                          onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                      </td>
                      <td>
                        <input type="email" className="search-input" style={{ width: "100%" }} value={editForm.email}
                          onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
                      </td>
                      <td>
                        <select style={{ padding: "7px 10px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: 13 }}
                          value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}>
                          {Object.entries(roleOptionLabel).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                        </select>
                      </td>
                      <td>{new Date(u.created_at).toLocaleDateString("en-GB")}</td>
                      <td>
                        {editError && <div className="text-danger" style={{ fontSize: 11, marginBottom: 4 }}>{editError}</div>}
                        <div className="action-btns">
                          <button className="btn btn-primary btn-sm" onClick={handleSaveEdit} disabled={saving}>{saving ? "..." : "Save"}</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => setEditId(null)}>Cancel</button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={u.id}>
                      <td>
                        <span className="bold">{u.name}</span>
                        {u.id === me?.id && <span style={{ marginLeft: 8, fontSize: 11, color: "var(--text-muted)" }}>(you)</span>}
                      </td>
                      <td>{u.email}</td>
                      <td><span className={`role-tag role-${u.role}`}>{u.role}</span></td>
                      <td>{new Date(u.created_at).toLocaleDateString("en-GB")}</td>
                      <td>
                        <div className="action-btns">
                          <button className="btn btn-outline btn-sm" onClick={() => startEdit(u)}>Edit</button>
                          {u.id !== me?.id && (
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u)}>Delete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
