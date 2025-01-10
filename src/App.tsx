import React from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Register from "./pages/register";
import AppLayout from "./components/appLayout";
import NotFound from "./pages/notFound";
import UserDashboard from "./pages/user";

const PublicRoutes: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const accessToken = localStorage.getItem("accessToken");
  const user = localStorage.getItem("user");

  if (accessToken || user) {
    const parsedUser = JSON.parse(user || "{}");
    if (parsedUser?.isAdmin) {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/user-dashboard" replace />;
    }
  }

  return <>{children}</>;
};

const AdminRoutes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!accessToken || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const UserRoutes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!accessToken || user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoutes>
              <Register />
            </PublicRoutes>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoutes>
              <AppLayout />
            </AdminRoutes>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <UserRoutes>
              <UserDashboard />
            </UserRoutes>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
