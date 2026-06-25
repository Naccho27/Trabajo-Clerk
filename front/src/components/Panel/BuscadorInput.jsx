export default function BuscadorInput({ value, onChange, placeholder = "Buscar..." }) {
  return (
    <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 bg-white dark:bg-gray-800">
      <span className="text-gray-400 dark:text-gray-500 text-sm"></span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="outline-none text-sm w-full bg-transparent text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
      />
    </div>
  );
}