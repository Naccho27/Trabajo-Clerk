import Header from "../Navbar/Header";

export default function PanelLayout({
  sidebarTitle,
  sidebarItems,
  vistaActiva,
  onVistaChange,
  loading,
  children,
}) {
  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />

      <div className="flex flex-1 overflow-hidden pt-[56px]">

        {/* Sidebar desktop */}
        <div className="hidden md:flex w-52 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex-col py-6 px-3 shrink-0">
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-widest px-3 mb-3">
            {sidebarTitle}
          </p>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onVistaChange(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${
                vistaActiva === item.id ? "text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
              style={vistaActiva === item.id
                ? { background: "linear-gradient(135deg, #ff3b3b, #3b3bff)" }
                : {}}
            >
              <span className="flex-1 text-left">{item.label}</span>
              {item.count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  vistaActiva === item.id ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-gray-400 dark:text-gray-500">Cargando...</p>
            </div>
          ) : children}
        </div>
      </div>

      {/* Navbar mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[1000] bg-white dark:bg-gray-900 shadow-lg border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-around px-4 py-4">
          {sidebarItems.map((item) => {
            const isActive = vistaActiva === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onVistaChange(item.id)}
                className="flex flex-col items-center gap-1 relative px-3"
              >
                {item.count > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ background: "linear-gradient(135deg, #ff3b3b, #3b3bff)", fontSize: "10px" }}
                  >
                    {item.count}
                  </span>
                )}
                <span
                  className={`text-sm font-semibold ${isActive ? "" : "text-gray-400 dark:text-gray-500"}`}
                  style={isActive ? {
                    background: "linear-gradient(135deg, #ff3b3b, #3b3bff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  } : {}}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}