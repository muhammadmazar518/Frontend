import React, { useEffect, useState, useRef } from "react";
import { getProfile, updateProfile } from "../api";

const Profile = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", website: "", profession: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    getProfile()
      .then((res) => setForm({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        website: res.data.website || "",
        profession: res.data.profession || "",
      }))
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));

    // ✅ photo sirf tab load karo jab same user ho
    const token = localStorage.getItem("token");
    const savedPhoto = localStorage.getItem("profile_photo");
    const savedToken = localStorage.getItem("photo_token");

    if (savedPhoto && savedToken === token) {
      setPhoto(savedPhoto);
    } else {
      // naya user hai — photo clear karo
      setPhoto(null);
      localStorage.removeItem("profile_photo");
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess(""); setError("");
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target.result);
      localStorage.setItem("profile_photo", ev.target.result);
      // ✅ is photo ka token save karo
      localStorage.setItem("photo_token", localStorage.getItem("token"));
      window.dispatchEvent(new CustomEvent("profile_photo_updated"));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) { setError("Name and email are required."); return; }
    try {
      setSaving(true);
      await updateProfile(form);
      setSuccess("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally { setSaving(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <button
          onClick={() => navigate("/dashboard")}
          style={styles.dashboardBtn}
          onMouseEnter={(e) => { e.target.style.background = "#1d4ed8"; }}
          onMouseLeave={(e) => { e.target.style.background = "#2563eb"; }}
        >
          Home
        </button>
      </div>
      <h1 style={styles.heading}>My Profile</h1>
      <p style={styles.sub}>Manage your account information</p>

      <div style={styles.card}>
        <div style={styles.topSection}>
          <div style={styles.avatarWrap} onClick={() => fileRef.current.click()}>
            {photo ? (
              <img src={photo} alt="Profile" style={styles.avatarImg} />
            ) : (
              <div style={styles.avatarFallback}>
                {form.name ? form.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div style={styles.cameraBtn}>
              <span style={{ fontSize: "14px" }}>📷</span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />
          </div>

          <div style={styles.userInfo}>
            <h2 style={styles.userName}>{form.name || "User"}</h2>
            <p style={styles.userEmail}>{form.email}</p>
            <span style={styles.freeBadge}>FREE</span>
          </div>
        </div>

        <div style={styles.divider} />

        {loading ? (
          <p style={styles.info}>Loading...</p>
        ) : editMode ? (

          <form onSubmit={handleSubmit} style={styles.form}>
            {error && <div style={styles.error}>{error}</div>}
            {success && <div style={styles.successMsg}>{success}</div>}

            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.fieldLabel}>FULL NAME</label>
                <input name="name" value={form.name} onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.field}>
                <label style={styles.fieldLabel}>EMAIL</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.field}>
                <label style={styles.fieldLabel}>PHONE</label>
                <input name="phone" value={form.phone} onChange={handleChange} style={styles.input} placeholder="—" />
              </div>
              <div style={styles.field}>
                <label style={styles.fieldLabel}>WEBSITE</label>
                <input name="website" value={form.website} onChange={handleChange} style={styles.input} placeholder="—" />
              </div>
              <div style={styles.field}>
                <label style={styles.fieldLabel}>PROFESSION</label>
                <input name="profession" value={form.profession} onChange={handleChange} style={styles.input} placeholder="—" />
              </div>
            </div>

            <div style={styles.btnRow}>
              <button type="submit" style={styles.saveBtn} disabled={saving}>
                {saving ? "Saving..." : "✓ Save Changes"}
              </button>
              <button type="button" onClick={() => setEditMode(false)} style={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <p style={styles.infoLabel}>FULL NAME</p>
                <p style={styles.infoValue}>{form.name || "—"}</p>
              </div>
              <div style={styles.infoItem}>
                <p style={styles.infoLabel}>EMAIL</p>
                <p style={styles.infoValue}>{form.email || "—"}</p>
              </div>
              <div style={styles.infoItem}>
                <p style={styles.infoLabel}>PHONE</p>
                <p style={styles.infoValue}>{form.phone || "—"}</p>
              </div>
              <div style={styles.infoItem}>
                <p style={styles.infoLabel}>WEBSITE</p>
                <p style={styles.infoValue}>{form.website || "—"}</p>
              </div>
              <div style={styles.infoItem}>
                <p style={styles.infoLabel}>PROFESSION</p>
                <p style={styles.infoValue}>{form.profession || "—"}</p>
              </div>
            </div>

            <button onClick={() => setEditMode(true)} style={styles.editBtn}>
              ✏️ Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  heading: {
    color: "#fff",
    fontSize: "28px",
    fontWeight: "800",
    margin: "0 0 4px",
    letterSpacing: "-0.5px"
  },

  sub: {
    color: "#000",
    fontSize: "14px",
    marginBottom: "24px"
  },

  card: {
    background: "#161824",
    border: "1px solid #1e2130",
    borderRadius: "16px",
    padding: "28px",
    maxWidth: "700px"
  },

  topSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "24px"
  },

  avatarWrap: {
    position: "relative",
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    cursor: "pointer",
    flexShrink: 0
  },

  avatarImg: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    objectFit: "cover"
  },

  avatarFallback: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background: "#7c3aed",
    color: "#fff",
    fontSize: "36px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  cameraBtn: {
    position: "absolute",
    bottom: "2px",
    right: "2px",
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    background: "#1e2130",
    border: "2px solid #0d0f14",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  },

  userInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },

  userName: {
    color: "#fff",
    fontSize: "22px",
    fontWeight: "800",
    margin: 0
  },

  userEmail: {
    color: "#6b7280",
    fontSize: "14px",
    margin: "0 0 8px"
  },

  freeBadge: {
    display: "inline-block",
    background: "#1e2130",
    color: "#9ca3af",
    fontSize: "11px",
    fontWeight: "700",
    padding: "4px 12px",
    borderRadius: "20px",
    border: "1px solid #374151",
    width: "fit-content"
  },

  divider: {
    height: "1px",
    background: "#1e2130",
    marginBottom: "24px"
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "20px 32px",
    marginBottom: "28px"
  },

  infoItem: {},

  infoLabel: {
    color: "#4b5563",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1px",
    margin: "0 0 6px"
  },

  infoValue: {
    color: "#d1d5db",
    fontSize: "15px",
    fontWeight: "500",
    margin: 0
  },

  editBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    background: "transparent",
    border: "1px solid #374151",
    borderRadius: "10px",
    color: "#d1d5db",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px"
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },

  fieldLabel: {
    color: "#4b5563",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1px"
  },

  input: {
    background: "#0d0f14",
    border: "1px solid #1e2130",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#fff",
    fontSize: "14px",
    outline: "none"
  },

  btnRow: {
    display: "flex",
    gap: "10px"
  },

  saveBtn: {
    padding: "10px 24px",
    background: "#7c3aed",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer"
  },

  cancelBtn: {
    padding: "10px 20px",
    background: "transparent",
    border: "1px solid #374151",
    borderRadius: "8px",
    color: "#9ca3af",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer"
  },

  error: {
    background: "#1f0a0a",
    border: "1px solid #7f1d1d",
    color: "#fca5a5",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px"
  },

  successMsg: {
    background: "#052e16",
    border: "1px solid #166534",
    color: "#86efac",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px"
  },

  info: {
    color: "#6b7280",
    fontSize: "14px"
  },

  topRow: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
    marginBottom: "10px",
    marginTop: "-10px"
  },

  dashboardBtn: {
    background: "#000",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background 0.2s"
  }
};

export default Profile;