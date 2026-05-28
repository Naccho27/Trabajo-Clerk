import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function SignOutButton({ className }) {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <button
      onClick={handleSignOut}
      className={className}
    >
      Cerrar Sesión
    </button>
  );
}