export default function StatCard({ label, value, color, bg, delay = "0ms" }) {
  return (
    <div
      className="rounded-2xl border border-gray-100 dark:border-gray-700 p-4 md:p-6 flex flex-col items-center gap-2 md:gap-3 shadow-sm"
      style={{ background: bg, animation: `fadeInUp 0.5s ease-out ${delay} both` }}
    >
      <p className="text-3xl md:text-5xl font-bold" style={{ color }}>{value}</p>
      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium text-center">{label}</p>
    </div>
  );
}