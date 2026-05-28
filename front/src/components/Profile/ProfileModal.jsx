import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { icons } from "../../assets/icons/icons.js";

const reportesMock = [
  { _id: "1", categoria: "baches", titulo: "Bache en Sabattini" },
  { _id: "2", categoria: "residuos", titulo: "Basura acumulada" },
  { _id: "3", categoria: "inundacion", titulo: "Inundación en San Martín" },
];

export default function ProfileModal({ onClose }) {
  const { user } = useUser();
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 280);
  };

  return (
    <>
      <div className="absolute inset-0 bg-black/40 z-[1001]" onClick={handleClose} />

      <div className="absolute bottom-0 left-0 right-0 z-[1002] flex justify-center">
        <div className={`bg-white rounded-t-3xl p-6 pb-20 max-h-[85vh] overflow-y-auto w-full max-w-2xl ${closing ? "slide-down" : "slide-up"}`}>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-pink-500 font-semibold">Perfil</p>
              <p className="text-lg font-bold">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
            {user?.imageUrl ? (
              <img src={user.imageUrl} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-3xl text-white">👤</div>
            )}
          </div>

          <hr className="mb-3" />
          <p className="text-sm text-gray-700 mb-3"><span className="font-semibold">Rol:</span> citizen</p>
          <hr className="mb-3" />
          <p className="text-sm text-gray-700 mb-4"><span className="font-semibold">Cantidad Reportes:</span> {reportesMock.length}</p>
          <hr className="mb-3" />

          <div className="flex flex-col gap-3 mb-6">
            {reportesMock.map((reporte) => (
              <div key={reporte._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={icons[reporte.categoria]} className="w-8 h-8" />
                  <span className="text-sm text-gray-700">{reporte.titulo}</span>
                </div>
                <button className="border border-red-400 rounded-full w-8 h-8 flex items-center justify-center text-red-400 text-xs">•••</button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}