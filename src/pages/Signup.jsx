import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../api";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      setLoading(true);
      const res = await signupUser({ name: form.name, email: form.email, password: form.password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create account</h1>
        <p style={styles.subtitle}>Get started for free</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Muhammad Ali"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              style={styles.input}
            />
          </div>
          <br />
          <button onClick={handleGoogleLogin} style={styles.googleBtn}>
            <svg width="18" height="18" viewBox="0 0 18 18" style={{ flexShrink: 0 }}>
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" />
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" />
            </svg>
            Continue with Google
          </button>
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

const styles = {
  page: { 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #0057ff 0%, #0d7dff 50%, #35a8ff 100%)", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "24px" 
  },
  
  card: { 
      background: "#000", 
      border: "1px solid #334155", 
      borderRadius: "16px", 
      padding: "40px", 
      width: "100%", 
      maxWidth: "420px" 
  },
  
  title: { 
      color: "#f1f5f9", 
      fontSize: "26px", 
      fontWeight: "700", 
      margin: "0 0 6px" 
  },
  
  subtitle: { 
      color: "#64748b", 
      fontSize: "14px", 
      margin: "0 0 28px" 
  },
  
  error: { 
      background: "#450a0a", 
      border: "1px solid #7f1d1d", 
      color: "#fca5a5", 
      padding: "10px 14px", 
      borderRadius: "8px", 
      fontSize: "13px", 
      marginBottom: "20px" 
  },
  
  form: { 
      display: "flex", 
      flexDirection: "column", 
      gap: "16px" 
  },
  
  googleBtn: { 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      gap: "10px", 
      width: "100%", 
      padding: "11px", 
      background: "#fff", 
      border: "none", 
      borderRadius: "8px", 
      fontSize: "14px", 
      fontWeight: "600", 
      color: "#374151", 
      cursor: "pointer", 
      marginBottom: "16px" 
  },
  
  field: { 
      display: "flex", 
      flexDirection: "column", 
      gap: "6px" 
  },
  
  label: { 
      color: "#94a3b8", 
      fontSize: "13px", 
      fontWeight: "500" 
  },
  
  input: { 
      background: "#0f172a", 
      border: "1px solid #334155", 
      borderRadius: "8px", 
      padding: "10px 14px", 
      color: "#f1f5f9", 
      fontSize: "14px", 
      outline: "none" 
  },
  
  btn: { 
      background: "#38bdf8", 
      color: "#0f172a", 
      border: "none", 
      borderRadius: "8px", 
      padding: "12px", 
      fontSize: "15px", 
      fontWeight: "700", 
      cursor: "pointer", 
      marginTop: "6px" 
  },
  
  footer: { 
      color: "#64748b", 
      fontSize: "13px", 
      textAlign: "center", 
      marginTop: "24px" 
  },
  
  link: { 
      color: "#38bdf8", 
      textDecoration: "none", 
      fontWeight: "600" 
  },
};

export default Signup;
