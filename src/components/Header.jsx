// src/components/Header.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header({ user, partner, vehicle }) {
  const location = useLocation();
  const title = "tngh mien tay autumn 2025";

  // Logo về Main nếu đã login; còn lại về Landing
  const to = user ? "/main" : "/";

  return (
    <header className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link to={to} className="font-extrabold tracking-wide text-lg sm:text-xl">
          {title}
        </Link>

        {user ? (
          <div className="text-right">
            <p className="font-bold text-sm sm:text-base">Xin chào, {user}</p>
            <p className="text-xs sm:text-sm opacity-90">ft {partner ?? "…"}, xe {vehicle ?? "…"}</p>
          </div>
        ) : (
          <span className="text-xs opacity-70">
            {location.pathname === "/login" ? "Đăng nhập để bắt đầu" : ""}
          </span>
        )}
      </div>
    </header>
  );
}
