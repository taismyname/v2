// src/pages/MainPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RouteCard from "../components/RouteCard";
import ProtectedRoute from "../components/ProtectedRoute";
import { db } from "../services/firebase";
import { collection, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  return (
    <ProtectedRoute>
      <MainInner />
    </ProtectedRoute>
  );
}

function MainInner() {
  const nav = useNavigate();
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("stUser");
    return raw ? JSON.parse(raw) : null;
  });
  const [routes, setRoutes] = useState([]);
  const [routesDone, setRoutesDone] = useState(new Set());

  // Listen routes
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "routes"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRoutes(list);
    });
    return () => unsub();
  }, []);

  // Listen user routesDone in realtime
  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "users", user.username);
    const unsub = onSnapshot(ref, (snap) => {
      const u = snap.data() || {};
      const arr = Array.isArray(u.routesDone) ? u.routesDone : [];
      setRoutesDone(new Set(arr));
      // sync header info if changed
      const merged = {
        ...user,
        partner: u.partner || user.partner,
        vehicle: u.vehicle || user.vehicle,
      };
      setUser(merged);
      localStorage.setItem("stUser", JSON.stringify(merged));
    });
    return () => unsub();
  }, [user?.username]);

  const onOpenMap = (r) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      r.from
    )}&destination=${encodeURIComponent(r.to)}`;
    window.open(url, "_blank");
  };

  const onDone = async (routeId) => {
    if (!user) return;
    const ref = doc(db, "users", user.username);
    const snap = await getDoc(ref);
    const u = snap.data() || {};
    const arr = new Set(Array.isArray(u.routesDone) ? u.routesDone : []);
    if (!arr.has(routeId)) arr.add(routeId);
    await updateDoc(ref, { routesDone: Array.from(arr) });
  };

  const headerProps = useMemo(
    () => ({
      user: user?.username,
      partner: user?.partner,
      vehicle: user?.vehicle,
    }),
    [user]
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-zinc-50">
      <Header {...headerProps} />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {routes.map((r) => (
            <RouteCard
              key={r.id}
              route={r}
              done={routesDone.has(r.id)}
              onDone={onDone}
              onOpenMap={onOpenMap}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => nav("/realtime")}
            className="rounded-full px-6 py-2.5 font-semibold text-white
                       bg-gradient-to-r from-fuchsia-500 to-purple-600 shadow-lg
                       hover:brightness-110 active:scale-95"
          >
            realtime
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
