export default function TituloSeccion({ children }) {
  return (
    <div className="flex items-center justify-center">
      <span
        className="text-sm font-semibold px-5 py-1.5 rounded-full text-white"
        style={{ background: "linear-gradient(135deg, #ff3b3b, #3b3bff)" }}
      >
        {children}
      </span>
    </div>
  );
}