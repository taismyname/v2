// src/pages/LandingPage.jsx
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import bg from "../assets/522800704_1219165133291946_4124612860038898981_n.jpg";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-zinc-50">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="relative w-full max-w-2xl">
          <img
            src={bg}
            alt="landing"
            className="w-full h-64 object-cover rounded-2xl shadow-2xl"
          />
          <div className="absolute inset-0 bg-white/70 rounded-2xl" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <p className="text-zinc-800 text-base sm:text-lg">
              đây là chuyến đi thứ mấy của mình ròi nhỉ
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-blue-800 mt-1">
              GIA ĐÌNH HEHE - DORAEMON 2025
            </h1>

            <button
              onClick={() => nav("/login")}
              className="mt-6 rounded-full px-6 py-3 text-white font-bold
                        bg-gradient-to-r from-rose-500 to-red-600 shadow-lg
                        hover:brightness-110 active:scale-95"
            >
              GÉT GÔ !!!!!
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
