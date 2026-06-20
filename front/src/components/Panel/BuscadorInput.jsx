export default function BuscadorInput({ value, onChange, placeholder = "Buscar..." }) {
  return (
    <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-white">
      <span className="text-gray-400 text-sm">🔍</span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="outline-none text-sm w-full bg-transparent"
      />
    </div>
  );
}