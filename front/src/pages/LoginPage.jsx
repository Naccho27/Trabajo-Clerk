import AuthHeader from "../components/Navbar/AuthHeader";
import LoginCard from "../components/Auth/LoginCard";

export default function LoginPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">

      {/* VIDEO DE FONDO */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="https://www.villamaria.gob.ar/media/home/video_desktop_1080.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/30" />

      <AuthHeader />
      <LoginCard />

    </div>
  );
}