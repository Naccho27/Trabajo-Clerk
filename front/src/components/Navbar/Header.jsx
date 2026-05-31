import { useUser } from "@clerk/clerk-react";
import SignOutButton from "../Buttons/SignOutButton";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  return (
    <div className="absolute top-0 left-0 right-0 z-[1000] bg-white px-4 py-3 flex items-center justify-between shadow-sm">
      <h1 className="text-2xl font-bold">
        Urban<span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Log</span>
      </h1>
      {isSignedIn ? (
        <SignOutButton className="border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-700 hover:bg-gray-100" />
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="border border-blue-500 rounded-full px-4 py-1 text-sm text-blue-500 hover:bg-blue-50"
        >
          Registrarse
        </button>
      )}
    </div>
  );
}