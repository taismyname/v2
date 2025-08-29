// src/pages/RealtimePage.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProtectedRoute from "../components/ProtectedRoute";
import { db } from "../services/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

export default function RealtimePage() {
  return (
    <ProtectedRoute>
      <RealtimeInner />
    </ProtectedRoute>
  );
}

function RealtimeInner() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("stUser") || "{}"));
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "checkins"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPosts(arr);
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-zinc-50">
      <Header user={user?.username} partner={user?.partner} vehicle={user?.vehicle} />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-5">
        {posts.length === 0 ? (
          <p className="text-center text-zinc-500">Chưa có ai check-in.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {posts.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl shadow-md p-3 border border-zinc-100">
                <div className="text-xs text-zinc-500 mb-2">
                  <span className="font-semibold">{p.user}</span> • route {p.routeId}
                </div>
                {p.imageUrl && (
                  <img src={p.imageUrl} alt="checkin" className="w-full aspect-square object-cover rounded-xl" />
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
