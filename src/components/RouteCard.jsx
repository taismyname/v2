// src/components/RouteCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function RouteCard({ route, done, onDone }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 flex flex-col w-full max-w-sm
                    border border-zinc-100 transition-transform hover:-translate-y-1">
      <h2 className="text-lg font-bold mb-2">{route.title}</h2>

      <div className="text-sm space-y-1 mb-3">
        <p><span className="font-semibold">Từ:</span> {route.from}</p>
        <p><span className="font-semibold">Đến:</span> {route.to}</p>
        <p><span className="font-semibold">Quãng đường:</span> {route.distance} km, dự kiến {route.time} h</p>
        <p className="text-zinc-500">
          Cần hoàn thành {route.remaining} lộ trình nữa đến đích
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto">
        {/* Nút mở Google Maps bằng link từ Firestore */}
        {route.mapLink && (
          <a
            href={route.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 rounded-xl py-2 font-semibold text-white text-center
                       bg-gradient-to-r from-sky-500 to-blue-600 hover:brightness-110 active:scale-95"
          >
            Mở Google Maps luôn nè
          </a>
        )}

        {/* Link sang trang chi tiết */}
        <Link
          to={`/route/${route.id}`}
          className="rounded-xl py-2 text-center font-semibold
                     bg-zinc-100 hover:bg-zinc-200 active:scale-95"
        >
          Xem chi tiết
        </Link>

        {/* Nút đánh dấu hoàn thành */}
        <button
          onClick={() => onDone(route.id)}
          disabled={!!done}
          className={`rounded-xl py-2 font-semibold text-white active:scale-95
          ${done
              ? "bg-zinc-400 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-500 to-green-600 hover:brightness-110"
          }`}
        >
          {done ? "Đã xong" : "Ôker (Đã xong)"}
        </button>
      </div>
    </div>
  );
}
