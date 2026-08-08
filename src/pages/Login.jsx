import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api";
import { Logo, Input, Field, Button, ErrorBox } from "../components/ui";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" className="shrink-0">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
    <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" />
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" />
  </svg>
);

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
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="app-bg relative flex min-h-screen items-center justify-center p-6">
      <div className="auth-glow" />

      <div className="relative w-full max-w-[430px] animate-fade-up rounded-xl border border-line bg-surface p-7 shadow-lg sm:p-11">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <h1 className="m-0 text-center font-display text-[26px] font-extrabold tracking-tight text-text">
          Welcome back
        </h1>
        <p className="mt-2 mb-7 text-center text-sm text-text-2">Sign in to continue to your dashboard</p>

        {error && <ErrorBox>{error}</ErrorBox>}

        <button
          onClick={handleGoogleLogin}
          className="mb-2 flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-sm border border-line-strong bg-surface px-4 py-3 text-sm font-semibold text-text transition-colors duration-200 hover:bg-surface-2"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-line" />
          <span className="text-xs uppercase tracking-[0.08em] text-text-3">or</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Email">
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </Field>

          <Field label="Password">
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </Field>

          <Button type="submit" size="lg" className="mt-2" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-[13px] text-text-2">
          Don't have an account? <Link to="/signup" className="font-semibold text-primary">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
