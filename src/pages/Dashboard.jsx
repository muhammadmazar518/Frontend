import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../api";
import { useNavigate } from "react-router-dom";

const StatCard = ({ label, value, color, icon, badge }) => (
  <div style={styles.card}>
    <div style={styles.cardTop}>
      <span style={styles.cardIcon}>{icon}</span>
      <span style={{ ...styles.badge, color, borderColor: color }}>{badge}</span>
    </div>
    <p style={{ ...styles.cardValue, color }}>{value ?? "—"}</p>
    <p style={styles.cardLabel}>{label}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Overview</h1>
      <p style={styles.sub}>Good to see you 👋</p>

      <div style={styles.grid}>
        <StatCard label="Plan"         value="Free"     color="#38bdf8" icon="💎" badge="PLAN"         />
        <StatCard label="Status"       value="active"   color="#34d399" icon="🟢" badge="STATUS"       />
        <StatCard label="Member Since" value="Jun 2026" color="#fbbf24" icon="📅" badge="MEMBER SINCE" />
        <StatCard
          label="Locked Courses"
          value={stats?.lockedCourses ?? "Locked"}
          color="#a78bfa"
          icon="📚"
          badge="COURSES"
        />
      </div>

      <div style={styles.actionsCard}>
        <h2 style={styles.actionsTitle}>Quick Actions</h2>
        <div style={styles.actionsRow}>
          <button onClick={() => navigate("/profile")} style={{ ...styles.actionBtn, borderColor: "#38bdf8", color: "#38bdf8" }}>Edit Profile</button>
          <button onClick={() => navigate("/weather")} style={{ ...styles.actionBtn, borderColor: "#34d399", color: "#34d399" }}>Check Weather</button>
          <button style={{ ...styles.actionBtn, borderColor: "#fbbf24", color: "#fbbf24" }}>View Courses</button>
          <button style={{ ...styles.actionBtn, borderColor: "#f472b6", color: "#f472b6" }}>Update Plan</button>
        </div>
      </div>
    </div>
  );
};

// const styles = {
//   page: {
//     width: "100%",
//     boxSizing: "border-box",
//   },
//   heading: {
//     color: "#fff",
//     fontSize: "30px",
//     fontWeight: "800",
//     margin: "0 0 4px",
//     letterSpacing: "-0.5px",
//   },
//   sub: {
//     color: "#fff",
//     fontSize: "14px",
//     marginBottom: "24px",
//   },
//   grid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//     gap: "16px",
//     marginBottom: "24px",
//     width: "100%",
//   },
//   card: {
//     background: "#161824",
//     border: "1px solid #1e2130",
//     borderRadius: "16px",
//     padding: "22px",
//     minHeight: "150px",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-between",
//     boxSizing: "border-box",
//   },
//   cardTop: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "12px",
//   },
//   cardIcon: { fontSize: "24px" },
//   badge: {
//     fontSize: "10px",
//     fontWeight: "700",
//     letterSpacing: "1px",
//     border: "1px solid",
//     padding: "3px 8px",
//     borderRadius: "6px",
//   },
//   cardValue: {
//     fontSize: "28px",
//     fontWeight: "800",
//     margin: "0 0 6px",
//     letterSpacing: "-0.5px",
//   },
//   cardLabel: {
//     color: "#6b7280",
//     fontSize: "12px",
//     margin: 0,
//   },
//   actionsCard: {
//     background: "#161824",
//     border: "1px solid #1e2130",
//     borderRadius: "16px",
//     padding: "24px",
//     width: "100%",
//     boxSizing: "border-box",
//   },
//   actionsTitle: {
//     color: "#fff",
//     fontSize: "16px",
//     fontWeight: "700",
//     marginBottom: "16px",
//     marginTop: 0,
//   },
//   actionsRow: {
//     display: "flex",
//     gap: "12px",
//     flexWrap: "wrap",
//   },
//   actionBtn: {
//     padding: "10px 20px",
//     background: "transparent",
//     border: "1px solid",
//     borderRadius: "10px",
//     fontSize: "13px",
//     fontWeight: "600",
//     cursor: "pointer",
//   },
// };

export default Dashboard;