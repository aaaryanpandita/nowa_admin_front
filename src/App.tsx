import React, { useState } from "react";
import LoginScreen from "./components/auth/LoginScreen";
import AdminDashboard from "./components/AdminDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
  return sessionStorage.getItem("isAuthenticated") === "true";
});

const handleLogin = () => {
  setIsAuthenticated(true);
  sessionStorage.setItem("isAuthenticated", "true");
};

const handleLogout = () => {
  setIsAuthenticated(false);
  sessionStorage.removeItem("isAuthenticated");
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("currentUser");
};
  return (
    <>
      <>
        <ToastContainer /* ...props */ />
        <div className="min-h-screen bg-gray-900">
          <Router>
            <Routes>
              <Route
                path="/login"
                element={
                  !isAuthenticated ? (
                    <LoginScreen onLogin={handleLogin} />
                  ) : (
                    <Navigate to="/dashboard" />
                  )
                }
              />
              <Route
                path="/dashboard"
                element={
                  isAuthenticated ? (
                    <AdminDashboard
                      onLogout={handleLogout}
                      activeTab="dashboard"
                    />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/token-rewards"
                element={
                  isAuthenticated ? (
                    <AdminDashboard
                      onLogout={handleLogout}
                      activeTab="Token_Reward"
                    />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/tasks"
                element={
                  isAuthenticated ? (
                    <AdminDashboard onLogout={handleLogout} activeTab="tasks" />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/analytics"
                element={
                  isAuthenticated ? (
                    <AdminDashboard
                      onLogout={handleLogout}
                      activeTab="analytics"
                    />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/"
                element={
                  <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
                }
              />
            </Routes>
          </Router>
        </div>
      </>
      
    </>
  );
}

export default App;
