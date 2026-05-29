import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import ProfileModal from "../Profile/ProfileModal";

export default function Navbar({ onCrearReporte }) {
  const [showProfile, setShowProfile] = useState(false);
  const { user } = useUser();

  return (
    <>
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}

      <div className="absolute bottom-0 left-0 right-0 z-[1000] flex justify-center">
        <div className="bg-white shadow-lg rounded-t-3xl flex items-center justify-around px-4 py-3 w-full max-w-4xl">
          <button className="flex flex-col items-center gap-1">
            <span className="text-xl">🗺️</span>
            <span className="text-xs text-blue-500 font-semibold">Mapa</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <span className="text-xl">🕐</span>
            <span className="text-xs text-gray-500">Historial</span>
          </button>

          <button
            onClick={onCrearReporte}
            className="rounded-full w-14 h-14 flex items-center justify-center shadow-lg -mt-6"
            style={{ background: "linear-gradient(135deg, #ff3b3b, #3b3bff)" }}
          >
            <span className="text-white text-4xl leading-none mb-1">+</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <span className="text-xl">📋</span>
            <span className="text-xs text-gray-500">Mis Reportes</span>
          </button>

          <button
            onClick={() => setShowProfile(true)}
            className="flex flex-col items-center gap-1"
          >
            {user?.imageUrl ? (
              <img src={user.imageUrl} className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <span className="text-xl">👤</span>
            )}
            <span className="text-xs text-gray-500">Perfil</span>
          </button>
        </div>
      </div>
    </>
  );
}