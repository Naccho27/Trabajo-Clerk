import { SignIn } from "@clerk/clerk-react";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <SignIn redirectUrl="/mapa" />
    </div>
  );
}