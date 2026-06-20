export default function DashboardSaludo({ user, rol = "Usuario" }) {
  return (
    <div className="flex items-center justify-center py-10 md:py-20">
      <h1
        className="text-4xl md:text-7xl font-bold text-center"
        style={{ animation: "fadeInDown 0.6s ease-out" }}
      >
        ¡Hola,{" "}
        <span style={{
          background: "linear-gradient(135deg, #ff3b3b, #3b3bff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          {user?.firstName || user?.username || rol}
        </span>
        !
      </h1>
    </div>
  );
}