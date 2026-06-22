import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const getLevelColor = (level) => {
  switch (level?.toLowerCase()) {
    case "beginner":
      return { bg: "#10b98120", text: "#10b981" };
    case "intermediate":
      return { bg: "#3b82f620", text: "#3b82f6" };
    case "advanced":
      return { bg: "#ef444420", text: "#ef4444" };
    default:
      return { bg: "#6b728020", text: "#6b7280" };
  }
};

export default function Courses({ onNavigate }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [levelFilter, setLevelFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoursesFromDB = async () => {
      try {
        setLoading(true);
        const response = await api.get("/courses");
        setCourses(response.data);
        setError(null);
      } catch (err) {
        console.error("Database connection error:", err);
        setError("Cannot connect to the database. Please check the backend server and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesFromDB();
  }, []);

  const filtered = levelFilter === "All"
    ? courses
    : courses.filter((c) => c.level?.toLowerCase() === levelFilter.toLowerCase());

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.spinner}>⏳</div>
        <p style={styles.loadingText}>Fetching premium courses from PostgreSQL...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorBox}>
        <strong>⚠️ Error:</strong> {error}
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      
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

      <div style={styles.mainLayout}>
        
        <div style={{ ...styles.listColumn, flex: activeCourse ? "0 0 360px" : 1 }}>
          <div style={styles.headerRow}>
            <h2 style={styles.heading}>Courses</h2>
            
            <div style={styles.filterTabsWrap}>
              {["All", "Beginner", "Intermediate", "Advanced"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLevelFilter(l)}
                  style={{
                    ...styles.filterBtn,
                    background: levelFilter === l ? "#6366f1" : "transparent",
                    color: levelFilter === l ? "#fff" : "#64748b",
                  }}
                >{l}</button>
              ))}
            </div>
          </div>

          <div style={styles.coursesGrid}>
            {filtered.length === 0 ? (
              <p style={styles.emptyText}>Is category mein abhi koi course nahi hai.</p>
            ) : (
              filtered.map((c) => {
                const lc = getLevelColor(c.level);
                const active = activeCourse?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveCourse(active ? null : c)}
                    style={{
                      ...styles.courseCard,
                      background: active ? "#1e1b4b" : "#0f111a",
                      borderColor: active ? "#6366f1" : "#1e293b",
                    }}
                  >
                    <span style={styles.cardIcon}>
                      {c.icon || "🎓"}
                    </span>
                    <div style={styles.cardMainInfo}>
                      <p style={styles.cardTitle}>{c.title}</p>
                      <div style={styles.cardBadgesRow}>
                        <span style={{ ...styles.levelBadge, background: lc.bg, color: lc.text }}>
                          {c.level}
                        </span>
                        <span style={styles.metaText}>⏱ {c.duration}</span>
                        <span style={styles.ratingText}>★ {c.rating}</span>
                      </div>
                    </div>
                    <span style={{ ...styles.arrowIndicator, color: active ? "#6366f1" : "#475569" }}>
                      {active ? "▼" : "▶"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {activeCourse && (
          <div style={styles.detailsSidebar}>
            <button
              onClick={() => setActiveCourse(null)}
              style={styles.closeSidebarBtn}
            >✕</button>

            <div style={styles.sidebarLargeIcon}>{activeCourse.icon || "🎓"}</div>
            
            <span style={{
              ...styles.sidebarLevelBadge,
              background: getLevelColor(activeCourse.level).bg,
              color: getLevelColor(activeCourse.level).text,
            }}>{activeCourse.level}</span>

            <h2 style={styles.sidebarTitle}>{activeCourse.title}</h2>
            <p style={styles.sidebarDesc}>
              {activeCourse.description || activeCourse.desc}
            </p>
            
            <div style={styles.sidebarStatsBar}>
              <span>⏱ <strong>{activeCourse.duration}</strong></span>
              <span>📹 <strong>{activeCourse.lessons || 0} lessons</strong></span>
              <span style={{ color: "#f59e0b" }}>★ <strong>{activeCourse.rating}</strong></span>
            </div>

            <p style={styles.curriculumHeading}>What you will learn</p>
            
            <ul style={styles.topicsList}>
              {Array.isArray(activeCourse.topics) ? activeCourse.topics.map((t, i) => (
                <li key={i} style={styles.topicItem}>{t}</li>
              )) : <li style={styles.topicItem}>Full course curriculum included.</li>}
            </ul>

            <button
              onClick={() => navigate(`/purchase-success?course=${encodeURIComponent(activeCourse.title)}`)}
              style={styles.buyBtn}
              onMouseEnter={(e) => { e.target.style.background = "#4f46e5"; }}
              onMouseLeave={(e) => { e.target.style.background = "#6366f1"; }}
            >
              Buy Course — Unlock Pro Features
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {

  page: {
    padding: "40px",
    background: "#1B1464",
    minHeight: "100vh",
  },

  pageWrapper: { 
      display: "flex", 
      flexDirection: "column", 
      width: "100%", 
      gap: "1rem" 
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
  },
  
  mainLayout: { 
      display: "flex", 
      gap: "1.5rem", 
      minHeight: "80vh" 
  },
  
  listColumn: { 
      transition: "all 0.3s ease" 
  },
  
  headerRow: { 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between", 
      marginBottom: "1.5rem", 
      flexWrap: "wrap", 
      gap: 12 
  },
  
  heading: { 
      fontSize: "24px", 
      fontWeight: 800, 
      color: "#fff", 
      letterSpacing: "-0.02em", 
      margin: 0 
  },
  
  filterTabsWrap: { 
      display: "flex", 
      gap: 6, 
      background: "#111322", 
      padding: "4px", 
      borderRadius: "24px" 
  },
  
  filterBtn: { 
      padding: "6px 14px", 
      borderRadius: 20, 
      fontSize: 12, 
      fontWeight: 600, 
      border: "none", 
      cursor: "pointer", 
      transition: "all 0.2s" 
  },
  
  coursesGrid: { 
      display: "flex", 
      flexDirection: "column", 
      gap: 12 
  },
  
  emptyText: { 
      color: "#000", 
      textAlign: "center", 
      padding: "2rem" 
  },
  
  courseCard: { 
      border: "1px solid #1e293b", 
      borderRadius: 14, 
      padding: "1.25rem", 
      cursor: "pointer", 
      display: "flex", 
      alignItems: "center", 
      gap: 16, 
      transition: "all 0.2s" 
  },
  
  cardIcon: { 
      fontSize: 28, 
      flexShrink: 0, 
      background: "#1e293b", 
      padding: "8px", 
      borderRadius: "10px" 
  },
  
  cardMainInfo: { 
      flex: 1, 
      minWidth: 0 
  },
  
  cardTitle: { 
      fontSize: 15, 
      fontWeight: 700, 
      color: "#f1f5f9", 
      marginBottom: 6, 
      whiteSpace: "nowrap", 
      overflow: "hidden", 
      textOverflow: "ellipsis", 
      margin: 0 
  },
  
  cardBadgesRow: { 
      display: "flex", 
      gap: 10, 
      fontSize: 11, 
      fontWeight: 600 
  },
  
  levelBadge: { 
      padding: "2px 8px", 
      borderRadius: "12px" 
  },
  
  metaText: { 
      color: "#94a3b8" 
  },
  
  ratingText: { 
      color: "#f59e0b" 
  },
  
  arrowIndicator: { 
      fontSize: 12 
  },
  
  detailsSidebar: { 
      flex: 1, 
      background: "#0f111a", 
      border: "1px solid #1e293b", 
      borderRadius: 16, 
      padding: "2rem", 
      alignSelf: "flex-start", 
      position: "sticky", 
      top: 30, 
      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.5)" 
  },
  
  closeSidebarBtn: { 
      float: "right", 
      background: "#1e293b", 
      border: "none", 
      color: "#94a3b8", 
      width: 28, 
      height: 28, 
      borderRadius: "50%", 
      fontSize: 14, 
      cursor: "pointer", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center" 
  },
  
  sidebarLargeIcon: { 
      fontSize: 48, 
      marginBottom: "1rem" 
  },
  
  sidebarLevelBadge: { 
      fontSize: 11, 
      fontWeight: 700, 
      padding: "4px 12px", 
      borderRadius: "12px", 
      display: "inline-block", 
      marginBottom: "1rem" 
  },
  
  sidebarTitle: { 
      fontSize: 24, 
      fontWeight: 800, 
      color: "#fff", 
      margin: "0 0 1rem", 
      lineHeight: 1.3 
  },
  
  sidebarDesc: { 
      fontSize: 14, 
      color: "#94a3b8", 
      lineHeight: 1.6, 
      marginBottom: "1.5rem" 
  },
  
  sidebarStatsBar: { 
      display: "flex", 
      gap: "1.5rem", 
      fontSize: 13, 
      color: "#64748b", 
      marginBottom: "2rem", 
      borderTop: "1px solid #1e293b", 
      borderBottom: "1px solid #1e293b", 
      padding: "12px 0" 
  },
  
  curriculumHeading: { 
      fontSize: 11, 
      color: "#6366f1", 
      textTransform: "uppercase", 
      fontWeight: 700, 
      letterSpacing: "0.05em", 
      marginBottom: "0.75rem" 
  },
  
  topicsList: { 
      paddingLeft: "1.25rem", 
      display: "flex", 
      flexDirection: "column", 
      gap: 6, 
      marginBottom: "2rem" 
  },
  
  topicItem: { 
      fontSize: 13, 
      color: "#94a3b8" 
  },
  
  buyBtn: { 
      width: "100%", 
      padding: "14px", 
      background: "#6366f1", 
      color: "#fff", 
      border: "none", 
      borderRadius: 12, 
      fontSize: 15, 
      fontWeight: 700, 
      cursor: "pointer", 
      boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.4)", 
      transition: "transform 0.1s" 
  },

  loadingWrap: { 
      color: "#a5b4fc", 
      padding: "3rem", 
      textAlign: "center", 
      fontSize: "16px" 
  },
  
  spinner: { 
      marginBottom: "1rem", 
      fontSize: "24px" 
  },
  
  loadingText: { 
      color: "#000", 
      fontSize: "14px", 
      margin: 0 
  },
  
  errorBox: { 
      background: "#ef444415", 
      border: "1px solid #ef4444", 
      padding: "1.5rem", 
      borderRadius: "12px", 
      color: "#f87171", 
      margin: "2rem" 
  }
};