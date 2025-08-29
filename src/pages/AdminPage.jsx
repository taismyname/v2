// src/pages/AdminPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProtectedRoute from "../components/ProtectedRoute";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AdminPage() {
  return (
    <ProtectedRoute role="admin">
      <AdminInner />
    </ProtectedRoute>
  );
}

function AdminInner() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("stUser") || "{}"));
  const [users, setUsers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [checkins, setCheckins] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [uSnap, rSnap, cSnap] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "routes")),
        getDocs(collection(db, "checkins")),
      ]);
      setUsers(uSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setRoutes(rSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setCheckins(cSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchAll();
  }, []);

  const group = useMemo(() => {
    // Map user+route -> list checkins
    const m = new Map();
    for (const c of checkins) {
      const key = `${c.user}__${c.routeId}`;
      if (!m.has(key)) m.set(key, []);
      m.get(key).push(c);
    }
    return m;
  }, [checkins]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-zinc-50">
      <Header user={user?.username} partner={user?.partner} vehicle={user?.vehicle} />
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6">
        <h1 className="text-xl font-extrabold mb-4">Bảng check-in các user</h1>

        <div className="space-y-4">
          {users
            .filter((u) => (u.role || "user") === "user")
            .map((u) => (
              <div key={u.username || u.id} className="bg-white rounded-2xl shadow p-4 border border-zinc-100">
                <div className="font-bold mb-2">
                  {u.username || u.id} • {u.partner}, {u.vehicle}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {routes.map((r) => {
                    const key = `${u.username || u.id}__${r.id}`;
                    const list = group.get(key) || [];
                    return (
                      <div key={r.id} className="border rounded-xl p-3">
                        <div className="text-sm font-semibold mb-2">{r.title}</div>
                        {list.length === 0 ? (
                          <div className="text-zinc-500 text-sm italic">bạn ni chưa có check-in</div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            {list.map((c) => (
                              <img
                                key={c.id}
                                src={c.imageUrl}
                                alt="checkin"
                                className="w-full aspect-video object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
