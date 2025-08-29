// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role = "user" }) {
  const raw = localStorage.getItem("stUser");
  if (!raw) return <Navigate to="/login" replace />;

  const u = JSON.parse(raw);
  if (role === "admin" && u.role !== "admin") return <Navigate to="/main" replace />;
  return children;
}
