import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      // ✅ pehle sab clear karo
      localStorage.removeItem("token");
      localStorage.removeItem("profile_photo");
      // phir naya save karo
      localStorage.setItem("token", token);
      navigate("/dashboard", { replace: true });
      return;
    }

    if (error) {
      navigate("/login?error=" + error, { replace: true });
      return;
    }

    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login?error=unknown", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div style={styles.page}>
      <div style={styles.box}>
        <div style={styles.spinner} />
        <p style={styles.text}>Signing you in with Google...</p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0d0f14",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  box: { textAlign: "center" },
  spinner: {
    width: "44px",
    height: "44px",
    border: "3px solid #1e2130",
    borderTop: "3px solid #7c3aed",
    borderRadius: "50%",
    margin: "0 auto 16px",
    animation: "spin 0.8s linear infinite",
  },
  text: {
    color: "#9ca3af",
    fontSize: "14px",
  },
};

export default GoogleCallback;