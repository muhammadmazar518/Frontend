import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Weather from "./pages/Weather";
import Landing from "./pages/Landing";
import Courses from "./pages/Courses";
import Pricing from "./pages/Pricing";
import GoogleCallback from "./pages/GoogleCallback";
import Contact from "./components/Contact";
import PaymentSuccess from "./pages/PaymentSuccess";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import { ToastProvider } from "./components/Toast";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : children;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ScrollToTop />
        <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          }
        />

        <Route
          path="/landing"
          element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          }
        />

        <Route
          path="/contact"
          element={
            <PublicRoute>
              <Contact />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        <Route
          path="/services"
          element={
            <PrivateRoute>
              <Layout>
                <Services />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Layout>
                <Projects />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route path="/auth/callback" element={<GoogleCallback />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Layout>
                <Profile />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/weather"
          element={
            <PrivateRoute>
              <Layout>
                <Weather />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <PrivateRoute>
              <Layout>
                <Courses />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/pricing"
          element={
            <PrivateRoute>
              <Layout>
                <Pricing />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/PaymentSuccess"
          element={
            <PrivateRoute>
              <Layout>
                <PaymentSuccess />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
