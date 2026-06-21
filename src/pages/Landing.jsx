import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>

      {/* ── NAVBAR ── */}
      <nav style={styles.nav}>
        <span style={styles.logo}>SaaSPanel</span>
        <div style={styles.navBtns}>
          <button onClick={() => navigate("/login")}  style={styles.signInBtn}>Sign In</button>
          <button onClick={() => navigate("/signup")} style={styles.signUpBtn}>Sign Up</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Welcome to <span style={styles.heroAccent}>SaaSPanel</span>
        </h1>
        <p style={styles.heroSub}>
          Learn modern web development, AI, machine learning and real-world skills with
          structured courses. Build your future with confidence.
        </p>
        <div style={styles.heroBtns}>
          <button onClick={() => navigate("/signup")} style={styles.getStartedBtn}>Get Started</button>
          <button onClick={() => navigate("/login")}  style={styles.signInHeroBtn}>Sign In</button>
        </div>
        <p style={styles.heroNote}>Free & Pro courses available • Learn at your own pace</p>
      </div>

      <footer style={styles.footer}>
        <span style={styles.footerLeft}>ⓢ 2026 SaaSPanel. All rights reserved.</span>
        <div style={styles.footerLinks}>
          <button onClick={() => navigate("/contact")} style={styles.footerLink}>Contact</button>
          <button style={styles.footerLink}>Privacy Policy</button>
          <button style={styles.footerLink}>GitHub</button>
        </div>
      </footer>

    </div>
  );
};

// const styles = {
//   page: {
//     minHeight: "100vh",
//     background: "linear-gradient(135deg, #0057ff 0%, #0d7dff 50%, #35a8ff 100%)",
//     fontFamily: "'Segoe UI', sans-serif",
//     display: "flex",
//     flexDirection: "column",
//   },

//   nav: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "20px 48px",
//     background: "#0f172a",
//     borderBottom: "1px solid #1a1a2e",
//   },
//   logo: {
//     color: "#fff",
//     fontWeight: "800",
//     fontSize: "20px",
//     letterSpacing: "-0.3px",
//   },
//   navBtns: { display: "flex", gap: "12px" },
//   signInBtn: {
//     padding: "9px 22px",
//     background: "#2563eb",
//     border: "1px solid #333",
//     borderRadius: "30px",
//     color: "#fff",
//     fontSize: "14px",
//     fontWeight: "600",
//     cursor: "pointer",
//   },
//   signUpBtn: {
//     padding: "9px 22px",
//     background: "#2563eb",
//     border: "none",
//     borderRadius: "30px",
//     color: "#fff",
//     fontSize: "14px",
//     fontWeight: "700",
//     cursor: "pointer",
//   },
//   hero: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     textAlign: "center",
//     padding: "80px 48px",
//   },
//   heroTitle: {
//     fontSize: "62px",
//     fontWeight: "800",
//     color: "#fff",
//     margin: "0 0 24px",
//     letterSpacing: "-1.5px",
//     lineHeight: 1.1,
//   },
//   heroAccent: { color: "#000" },
//   heroSub: {
//     color: "#000",
//     fontSize: "18px",
//     lineHeight: "1.7",
//     maxWidth: "580px",
//     margin: "0 0 36px",
//   },
//   heroBtns: { display: "flex", gap: "16px", marginBottom: "20px" },
//   getStartedBtn: {
//     padding: "14px 32px",
//     background: "#2563eb",
//     border: "none",
//     borderRadius: "30px",
//     color: "#fff",
//     fontSize: "16px",
//     fontWeight: "700",
//     cursor: "pointer",
//   },
//   signInHeroBtn: {
//     padding: "14px 32px",
//     background: "#2563eb",
//     border: "none",
//     borderRadius: "30px",
//     color: "#fff",
//     fontSize: "16px",
//     fontWeight: "600",
//     cursor: "pointer",
//   },
//   heroNote: {
//     color: "#000",
//     fontSize: "13px",
//     margin: 0,
//   },

//   footer: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "20px 48px",
//     borderTop: "1px solid #1a1a2e",
//     background: "#080810",
//   },
//   footerLeft: { color: "#fff", fontSize: "13px" },
//   footerLinks: { display: "flex", gap: "28px" },
//   footerLink: {
//     background: "none",
//     border: "none",
//     color: "#fff",
//     fontSize: "13px",
//     cursor: "pointer",
//   },
// };

export default Landing;