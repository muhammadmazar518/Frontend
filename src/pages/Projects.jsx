import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const statusColors = {
  "Live": "#22c55e",
  "In Progress": "#f59e0b",
  "Planning": "#6b7280",
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", status: "Planning", icon: "📁" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchProjects = async () => {
    const res = await axios.get(`${API}/api/projects`, { headers });
    setProjects(res.data);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSubmit = async () => {
    if (!form.title) return;
    setLoading(true);
    if (editId) {
      await axios.put(`${API}/api/projects/${editId}`, form, { headers });
      setEditId(null);
    } else {
      await axios.post(`${API}/api/projects`, form, { headers });
    }
    setForm({ title: "", description: "", status: "Planning", icon: "📁" });
    fetchProjects();
    setLoading(false);
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({ title: p.title, description: p.description, status: p.status, icon: p.icon });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await axios.delete(`${API}/api/projects/${id}`, { headers });
    fetchProjects();
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ title: "", description: "", status: "Planning", icon: "📁" });
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Projects</h1>
      <p style={styles.sub}>Manage your projects</p>

      {/* Form */}
      <div style={styles.formCard}>
        <h3 style={styles.formTitle}>{editId ? "✏️ Edit Project" : "➕ Add Project"}</h3>
        <div style={styles.formRow}>
          <input
            placeholder="Title *"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            style={styles.input}
          />
          <select
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
            style={styles.input}
          >
            <option>Planning</option>
            <option>In Progress</option>
            <option>Live</option>
          </select>
          <input
            placeholder="Icon 📁"
            value={form.icon}
            onChange={e => setForm({ ...form, icon: e.target.value })}
            style={{ ...styles.input, maxWidth: "80px" }}
          />
        </div>
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          style={styles.textarea}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={handleSubmit} style={styles.addBtn} disabled={loading}>
            {loading ? "Saving..." : editId ? "✓ Update" : "+ Add"}
          </button>
          {editId && (
            <button onClick={handleCancel} style={styles.cancelBtn}>Cancel</button>
          )}
        </div>
      </div>

      {/* Cards */}
      {projects.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No projects yet. Add one above!</p>
      ) : (
        <div style={styles.grid}>
          {projects.map((p) => (
            <div key={p.id} style={styles.card}>
              <div style={styles.top}>
                <span style={styles.icon}>{p.icon}</span>
                <span style={{
                  ...styles.badge,
                  color: statusColors[p.status] || "#6b7280",
                  border: `1px solid ${statusColors[p.status] || "#6b7280"}40`,
                  background: `${statusColors[p.status] || "#6b7280"}15`
                }}>
                  {p.status}
                </span>
              </div>
              <h3 style={styles.title}>{p.title}</h3>
              <p style={styles.desc}>{p.description}</p>
              <div style={styles.cardBottom}>
                <button onClick={() => handleEdit(p)} style={styles.editBtn}>✏️ Edit</button>
                <button onClick={() => handleDelete(p.id)} style={styles.deleteBtn}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { padding: "40px", background: "#0d0f14", minHeight: "100vh" },
  heading: { color: "#fff", fontSize: "28px", fontWeight: "800", margin: "0 0 4px" },
  sub: { color: "#6b7280", fontSize: "14px", marginBottom: "24px" },
  formCard: { background: "#161824", border: "1px solid #1e2130", borderRadius: "16px", padding: "20px", marginBottom: "32px", display: "flex", flexDirection: "column", gap: "12px" },
  formTitle: { color: "#fff", fontSize: "15px", fontWeight: "700", margin: 0 },
  formRow: { display: "flex", gap: "12px", flexWrap: "wrap" },
  input: { background: "#0d0f14", border: "1px solid #1e2130", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "14px", outline: "none", flex: 1 },
  textarea: { background: "#0d0f14", border: "1px solid #1e2130", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "14px", outline: "none", resize: "vertical", minHeight: "80px" },
  addBtn: { background: "#7c3aed", border: "none", borderRadius: "8px", padding: "10px 24px", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" },
  cancelBtn: { background: "transparent", border: "1px solid #374151", borderRadius: "8px", padding: "10px 20px", color: "#9ca3af", fontSize: "14px", cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" },
  card: { background: "#161824", border: "1px solid #1e2130", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "10px" },
  top: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  icon: { fontSize: "32px" },
  title: { color: "#fff", fontSize: "16px", fontWeight: "700", margin: 0 },
  desc: { color: "#6b7280", fontSize: "13px", margin: 0, flex: 1 },
  badge: { fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px" },
  cardBottom: { display: "flex", gap: "8px", marginTop: "auto" },
  editBtn: { flex: 1, background: "transparent", border: "1px solid #374151", borderRadius: "8px", padding: "6px 10px", color: "#d1d5db", fontSize: "12px", cursor: "pointer" },
  deleteBtn: { flex: 1, background: "transparent", border: "1px solid #7f1d1d", borderRadius: "8px", padding: "6px 10px", color: "#ef4444", fontSize: "12px", cursor: "pointer" },
};

export default Projects;