import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getProfile } from "../api";

const navItems = [
  { path: "/dashboard", label: "Overview", icon: "🏠" },
  { path: "/profile", label: "Profile", icon: "👤" },
  { path: "/weather", label: "Weather", icon: "🌤" },
  { path: "/courses", label: "Courses", icon: "📚", pro: true },
  { path: "/pricing", label: "Pricing", icon: "💳" },
  { path: "/services", label: "Services", icon: "🛠️" },
  { path: "/projects", label: "Projects", icon: "📁" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [photo, setPhoto] = useState(null);

useEffect(() => {
    // token change hone pe profile reload karo
    const token = localStorage.getItem("token");
    if (!token) return;

    getProfile()
      .then((res) => {
        setUser(res.data);
        if (res.data?.is_pro || res.data?.isPro || res.data?.has_purchased || res.data?.hasPurchased) {
          setHasPurchased(true);
        } else {
          setHasPurchased(false);
        }
      })
      .catch((err) => {
        console.error("Profile load karne mein error aaya:", err);
      });

    // ✅ photo bhi reset karo naye user ke liye
    const saved = localStorage.getItem("profile_photo");
    setPhoto(saved || null);

    const handleStorage = () => {
      const updated = localStorage.getItem("profile_photo");
      setPhoto(updated || null);
    };
    window.addEventListener("profile_photo_updated", handleStorage);
    return () => window.removeEventListener("profile_photo_updated", handleStorage);
  }, [localStorage.getItem("token")]); // ✅ token change pe re-run karo

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={styles.sidebar}>

      <div style={styles.logo}>
        <div style={styles.logoIcon}>
          <span style={{ fontSize: "18px" }}>S</span>
        </div>
        <span style={styles.logoText}>SaasPanel</span>
      </div>
      <div style={styles.userCard}>
        <div style={styles.userAvatar}>
          {photo ? (
            <img src={photo} alt="avatar" style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} />
          ) : (
            user?.name ? user.name.charAt(0).toUpperCase() : "U"
          )}
        </div>
        <div style={styles.userInfo}>
          <p style={styles.userName}>{user?.name || "User"}</p>
          <p style={styles.userEmail}>
            {user?.email ? user.email.substring(0, 14) + "..." : ""}
          </p>
        </div>
        {!hasPurchased && (
          <span style={styles.freeBadge}>
            FREE
          </span>
        )}
      </div>

      <p style={styles.menuLabel}>MENU</p>

      <nav style={styles.nav}>
        {navItems.map((item) => {
          const isLocked = item.pro && !hasPurchased;

          return (
            <NavLink
              key={item.path}
              to={isLocked ? "#" : item.path}
              onClick={(e) => {
                if (isLocked) {
                  e.preventDefault();
                  alert("Please purchase the course first from Pricing page.");
                  navigate("/pricing");
                }
              }}
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive && !isLocked ? styles.navItemActive : {}),
                opacity: isLocked ? 0.5 : 1,
                cursor: isLocked ? "not-allowed" : "pointer",
              })}
            >
              <span style={{ ...styles.navIcon, opacity: isLocked ? 0.4 : 1 }}>
                {item.icon}
              </span>
              <span style={{ flex: 1, color: isLocked ? "#4b5563" : "inherit" }}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <div style={styles.bottom}>
        <div style={styles.divider} />
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <span style={styles.logoutIcon}>[→</span>
          <span>Sign out</span>
        </button>
      </div>

    </div>
  );
};

const styles = {
  sidebar: {
    width: "240px",
    minHeight: "100vh",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 100,
    borderRight: "1px solid #000",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "20px 16px 16px",
  },
  logoIcon: {
    width: "36px",
    height: "36px",
    background: "#7c3aed",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "800",
    fontSize: "16px",
  },
  logoText: {
    color: "#000",
    fontWeight: "800",
    fontSize: "16px",
    letterSpacing: "-0.3px",
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "0 12px 16px",
    padding: "12px",
    background: "#161824",
    borderRadius: "12px",
    border: "1px solid #1e2130",
  },
  userAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#7c3aed",
    color: "#fff",
    fontWeight: "700",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  userInfo: { flex: 1, overflow: "hidden" },
  userName: { color: "#fff", fontWeight: "700", fontSize: "13px", margin: 0 },
  userEmail: { color: "#fff", fontSize: "11px", margin: "2px 0 0" },
  freeBadge: {
    background: "#1e2130",
    color: "#9ca3af",
    fontSize: "10px",
    fontWeight: "700",
    padding: "3px 8px",
    borderRadius: "6px",
    letterSpacing: "0.5px",
    flexShrink: 0,
  },
  proUserBadge: {
    background: "#f59e0b20",
    color: "#f59e0b",
    border: "1px solid #f59e0b40",
    fontSize: "10px",
    fontWeight: "800",
    padding: "3px 8px",
    borderRadius: "6px",
    letterSpacing: "0.5px",
    flexShrink: 0,
  },
  menuLabel: {
    color: "#4b5563",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    padding: "0 16px 6px",
    margin: 0,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    padding: "0 8px",
    gap: "2px",
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "11px 12px",
    borderRadius: "10px",
    color: "#000",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  navItemActive: {
    background: "#1e2540",
    color: "#818cf8",
    borderLeft: "3px solid #818cf8",
  },
  navIcon: { fontSize: "17px" },
  proBadge: {
    background: "#f59e0b",
    color: "#0d0f14",
    fontSize: "10px",
    fontWeight: "800",
    padding: "2px 8px",
    borderRadius: "6px",
    letterSpacing: "0.5px",
  },
  bottom: { padding: "12px" },
  divider: {
    height: "1px",
    background: "#1e2130",
    marginBottom: "12px",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    padding: "10px 12px",
    background: "transparent",
    border: "10px",
    borderRadius: "20px",
    color: "#ef4444",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  logoutIcon: { fontSize: "16px" },
};

export default Sidebar;