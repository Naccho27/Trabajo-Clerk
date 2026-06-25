export default function PageHeader({ titulo, subtitulo }) {
  return (
    <div className="mb-1">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{titulo}</h2>
      {subtitulo && <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{subtitulo}</p>}
    </div>
  );
}