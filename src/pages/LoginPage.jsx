// src/pages/LoginPage.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const ref = doc(db, "users", username.trim());
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        setErr("Tài khoản không tồn tại.");
        return;
      }
      const u = snap.data();
      if (String(u.password) !== String(password)) {
        setErr("Mật khẩu không đúng.");
        return;
      }
      // Lưu thông tin user
      const info = {
        username: username.trim(),
        partner: u.partner || "",
        vehicle: u.vehicle || "",
        role: u.role || "user",
        routesDone: Array.isArray(u.routesDone) ? u.routesDone : [],
      };
      localStorage.setItem("stUser", JSON.stringify(info));
      nav(info.role === "admin" ? "/admin" : "/main");
    } catch (e) {
      console.error(e);
      setErr("Có lỗi khi đăng nhập.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 border border-zinc-100"
        >
          <h2 className="text-xl font-bold mb-4 text-center">mài là aiiii???????</h2>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="tên"
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none
                         focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="mật khẩu"
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none
                         focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {err && <p className="text-red-600 text-sm mt-3">{err}</p>}

          <button
            type="submit"
            className="w-full mt-5 rounded-full py-2.5 text-white font-bold
                       bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 active:scale-95"
          >
            Ôker
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
