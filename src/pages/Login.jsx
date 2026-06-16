import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      setLoading(true);
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>

        <div style={styles.formSide}>
          <h1 style={styles.heading}>Welcome Back</h1>
          <p style={styles.sub}>Sign in to your account</p>

          {error && <div style={styles.error}>{error}</div>}

          

          <div style={styles.dividerRow}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <div style={styles.dividerLine} />
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={styles.input}
                autoComplete="email"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={styles.input}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
            <br />
          <button onClick={handleGoogleLogin} style={styles.googleBtn}>
            <svg width="18" height="18" viewBox="0 0 18 18" style={{ flexShrink: 0 }}>
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          <p style={styles.signupText}>
            Don't have an account?{" "}
            <Link to="/signup" style={styles.link}>Sign Up</Link>
          </p>
        </div>

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
      padding: "20px" 
  },
  
  wrapper: { 
      display: "flex", 
      width: "35%", 
      maxWidth: "760px", 
      minHeight: "480px", 
      borderRadius: "16px", 
      overflow: "hidden", 
      boxShadow: "0 20px 60px rgba(0,0,0,0.4)" 
  },
  
  formSide: { 
      flex: 1, 
      background: "#000", 
      padding: "48px 40px", 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "center" 
  },
  
  heading: { 
      color: "#f1f5f9", 
      fontSize: "26px", 
      fontWeight: "700", 
      margin: "0 0 6px" 
  },
  
  sub: { 
      color: "#64748b", 
      fontSize: "14px", 
      margin: "0 0 20px" 
  },
  
  error: { 
      background: "#450a0a", 
      border: "1px solid #7f1d1d", 
      color: "#fca5a5", 
      padding: "10px 14px", 
      borderRadius: "8px", 
      fontSize: "13px", 
      marginBottom: "16px" 
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

  dividerRow: { 
      display: "flex", 
      alignItems: "center", 
      gap: "12px", 
      marginBottom: "16px" 
  },
  
  dividerLine: { 
      flex: 1, 
      height: "1px", 
      background: "#334155" 
  },
  
  dividerText: { 
      color: "#64748b", 
      fontSize: "12px" 
  },

  form: { 
      display: "flex", 
      flexDirection: "column", 
      gap: "18px" 
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
      padding: "11px 14px", 
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
      marginTop: "4px" 
  },
  
  signupText: { 
      color: "#64748b", 
      fontSize: "13px", 
      textAlign: "center", 
      marginTop: "20px" 
  },
  
  link: { 
      color: "#38bdf8", 
      textDecoration: "none", 
      fontWeight: "600" 
  },
};

export default Login;