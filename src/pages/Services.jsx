import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Services = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", price: "", icon: "🌐" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchServices = async () => {
    const res = await axios.get(`${API}/api/services`, { headers });
    setServices(res.data);
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSubmit = async () => {
    if (!form.title) return;
    setLoading(true);
    if (editId) {
      await axios.put(`${API}/api/services/${editId}`, form, { headers });
      setEditId(null);
    } else {
      await axios.post(`${API}/api/services`, form, { headers });
    }
    setForm({ title: "", description: "", price: "", icon: "🌐" });
    fetchServices();
    setLoading(false);
  };

  const handleEdit = (s) => {
    setEditId(s.id);
    setForm({ title: s.title, description: s.description, price: s.price, icon: s.icon });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    await axios.delete(`${API}/api/services/${id}`, { headers });
    fetchServices();
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ title: "", description: "", price: "", icon: "🌐" });
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Services</h1>
      <p style={styles.sub}>Manage your services</p>

      {/* Form */}
      <div style={styles.formCard}>
        <h3 style={styles.formTitle}>{editId ? "✏️ Edit Service" : "➕ Add Service"}</h3>
        <div style={styles.formRow}>
          <input
            placeholder="Title *"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            style={styles.input}
          />
          <input
            placeholder="Price (e.g. $500)"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            style={styles.input}
          />
          <input
            placeholder="Icon 🌐"
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
      {services.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No services yet. Add one above!</p>
      ) : (
        <div style={styles.grid}>
          {services.map((s) => (
            <div key={s.id} style={styles.card}>
              <div style={styles.icon}>{s.icon}</div>
              <h3 style={styles.title}>{s.title}</h3>
              <p style={styles.desc}>{s.description}</p>
              <div style={styles.cardBottom}>
                <span style={styles.price}>{s.price}</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => handleEdit(s)} style={styles.editBtn}>✏️</button>
                  <button onClick={() => handleDelete(s.id)} style={styles.deleteBtn}>🗑</button>
                </div>
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
  icon: { fontSize: "32px" },
  title: { color: "#fff", fontSize: "16px", fontWeight: "700", margin: 0 },
  desc: { color: "#6b7280", fontSize: "13px", margin: 0, flex: 1 },
  cardBottom: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" },
  price: { color: "#7c3aed", fontSize: "18px", fontWeight: "800" },
  editBtn: { background: "transparent", border: "1px solid #374151", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", fontSize: "14px" },
  deleteBtn: { background: "transparent", border: "1px solid #7f1d1d", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", fontSize: "14px" },
};

export default Services;