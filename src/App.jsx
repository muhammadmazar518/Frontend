import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import "./App.css";
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
import Contact from "../src/components/Contact";
import PaymentSuccess from "../src/pages/PaymentSuccess";
import Services from "../src/pages/Services";
import Projects from "../src/pages/Projects";


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : children;
};

const App = () => {
  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0d0f14; font-family: 'Segoe UI', sans-serif; }
        a { text-decoration: none; }
      `}</style>

      <BrowserRouter>
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
      </BrowserRouter>
    </>
  );
};

export default App;