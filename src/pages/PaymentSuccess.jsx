import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    if (!session_id) { window.location.href = "/pricing"; return; }

    api.post("/payment/verify", { session_id })
      .then((res) => {
        if (res.data.success) {
          setStatus("success");
          // Force full page reload so courses refresh with new pro status
          setTimeout(() => {
            window.location.href = "/courses";
          }, 3000);
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.box}>
        {status === "verifying" && (
          <>
            <div style={styles.spinner} />
            <p style={styles.text}>Verifying your payment...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div style={styles.icon}>🎉</div>
            <h2 style={styles.title}>Payment Successful!</h2>
            <p style={styles.sub}>You are now a Pro member. All courses are unlocked!</p>
            <p style={styles.redirect}>Redirecting to courses in 3 seconds...</p>
            <button onClick={() => { window.location.href = "/courses"; }} style={styles.btn}>
              Go to Courses →
            </button>
          </>
        )}
        {status === "failed" && (
          <>
            <div style={styles.icon}>❌</div>
            <h2 style={styles.title}>Payment Failed</h2>
            <p style={styles.sub}>Something went wrong. Please try again.</p>
            <button onClick={() => { window.location.href = "/pricing"; }} style={styles.btn}>
              Back to Pricing
            </button>
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const styles = {
  page: { minHeight: "100vh", background: "#0d0f14", display: "flex", alignItems: "center", justifyContent: "center" },
  box: { background: "#161824", border: "1px solid #1e2130", borderRadius: "20px", padding: "48px 40px", textAlign: "center", maxWidth: "420px", width: "90%" },
  spinner: { width: "44px", height: "44px", border: "3px solid #1e2130", borderTop: "3px solid #7c3aed", borderRadius: "50%", margin: "0 auto 20px", animation: "spin 0.8s linear infinite" },
  text: { color: "#9ca3af", fontSize: "14px" },
  icon: { fontSize: "56px", marginBottom: "16px" },
  title: { color: "#fff", fontSize: "24px", fontWeight: "800", margin: "0 0 10px" },
  sub: { color: "#6b7280", fontSize: "14px", margin: "0 0 16px", lineHeight: "1.6" },
  redirect: { color: "#4b5563", fontSize: "12px", marginBottom: "16px" },
  btn: { background: "#7c3aed", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 28px", fontSize: "14px", fontWeight: "700", cursor: "pointer" },
};

export default PaymentSuccess;