import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spinner, Logo } from "../components/ui";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      localStorage.removeItem("token");
      localStorage.removeItem("profile_photo");
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
    <div className="app-bg flex min-h-screen flex-col items-center justify-center gap-8">
      <Logo />
      <div className="text-center">
        <Spinner />
        <p className="mt-4 text-sm text-text-2">Signing you in with Google...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
