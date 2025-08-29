// src/pages/RouteDetailPage.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProtectedRoute from "../components/ProtectedRoute";
import { useParams } from "react-router-dom";
import { db, storage, serverTimestamp } from "../services/firebase";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function RouteDetailPage() {
  return (
    <ProtectedRoute>
      <DetailInner />
    </ProtectedRoute>
  );
}

function DetailInner() {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("stUser") || "{}"));
  const [uploading, setUploading] = useState(false);
  const [lastUrl, setLastUrl] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDoc(doc(db, "routes", id));
      setRoute({ id: snap.id, ...snap.data() });
    };
    fetch();
  }, [id]);

  const openMap = () => {
    if (!route) return;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      route.from
    )}&destination=${encodeURIComponent(route.to)}`;
    window.open(url, "_blank");
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.username) return;
    setUploading(true);
    try {
      const path = `checkins/${user.username}/${id}/${Date.now()}_${file.name}`;
      const sref = ref(storage, path);
      await uploadBytes(sref, file);
      const url = await getDownloadURL(sref);

      await addDoc(collection(db, "checkins"), {
        user: user.username,
        routeId: id,
        imageUrl: url,
        createdAt: serverTimestamp(),
      });

      setLastUrl(url);

      // cũng có thể đánh dấu done cho route này
      const uref = doc(db, "users", user.username);
      const usnap = await getDoc(uref);
      const data = usnap.data() || {};
      const arr = new Set(Array.isArray(data.routesDone) ? data.routesDone : []);
      arr.add(id);
      await updateDoc(uref, { routesDone: Array.from(arr) });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (!route) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">Loading...</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-zinc-50">
      <Header user={user?.username} partner={user?.partner} vehicle={user?.vehicle} />
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-6">
        <div className="bg-white rounded-2xl shadow-xl p-5 border border-zinc-100">
          <h1 className="text-xl font-extrabold mb-2">{route.title}</h1>
          <p className="text-sm mb-1"><span className="font-semibold">Từ:</span> {route.from}</p>
          <p className="text-sm mb-1"><span className="font-semibold">Đến:</span> {route.to}</p>
          <p className="text-sm mb-1"><span className="font-semibold">Quãng đường:</span> {route.distance} km</p>
          <p className="text-sm mb-4"><span className="font-semibold">Thời gian:</span> {route.time} h</p>

          <div className="aspect-video w-full overflow-hidden rounded-xl border border-zinc-200">
            <iframe
              title="map"
              className="w-full h-full"
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(route.to)}&output=embed`}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={openMap}
              className="rounded-xl px-5 py-2.5 font-semibold text-white
                         bg-gradient-to-r from-sky-500 to-blue-600 hover:brightness-110 active:scale-95"
            >
              mở google map
            </button>

            <label className="cursor-pointer rounded-xl px-5 py-2.5 font-semibold text-white
                               bg-gradient-to-r from-amber-500 to-orange-600 hover:brightness-110 active:scale-95">
              {uploading ? "đang up..." : "Check-in nè"}
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
          </div>

          {lastUrl && (
            <div className="mt-4">
              <p className="text-sm text-zinc-600 mb-2">File hình gửi:</p>
              <img src={lastUrl} alt="checkin" className="w-full rounded-xl shadow" />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
