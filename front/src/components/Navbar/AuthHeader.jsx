import { useState } from "react";

const MENU_LINKS = [
  { label: "Transformación Digital", href: "https://www.villamaria.gob.ar/transformacion-digital" },
  { label: "Gobierno Abierto", href: "https://www.villamaria.gob.ar/gobierno-abierto" },
  { label: "ViDi", href: "https://www.villamaria.gob.ar/vidi" },
  { label: "Noticias", href: "https://www.villamaria.gob.ar/noticias" },
  { label: "Contacto", href: "https://www.villamaria.gob.ar/contacto" },
  { label: "UrbanLog", href: "/" },
];

const LOGO_URL = "https://www.villamaria.gob.ar/static/images/logo_escudo_blanco.a6a7c9481ea7.svg";

const HEADER_STYLE = { background: "linear-gradient(to bottom, #3b1fa3, #c2007a)" };

export default function AuthHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-7 md:hidden" 
      style={HEADER_STYLE}>
        <img src={LOGO_URL} alt="Logo Municipalidad" className="h-14 w-auto" />
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white flex flex-col gap-1.5 p-2">
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </header>

      <header className="absolute top-0 left-0 right-0 z-20 hidden md:flex items-center justify-between px-8 lg:px-16 xl:px-32 py-6" 
      style={HEADER_STYLE}>
        <img src={LOGO_URL} alt="Logo Municipalidad" className="h-13 w-auto shrink-0" />
        <nav className="flex items-center gap-3 lg:gap-6 flex-wrap justify-end">
          {MENU_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="text-white text-xs lg:text-sm font-semibold uppercase tracking-wide hover:opacity-75 transition-opacity whitespace-nowrap">
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      {menuOpen && (
        <div className="absolute top-16 right-0 z-30 md:hidden bg-white shadow-2xl rounded-bl-2xl w-64 py-5 px-6 flex flex-col gap-5 border border-gray-100" style={{ animation: "fadeInDown 0.2s ease-out" }}>
          {MENU_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="text-gray-800 font-bold uppercase tracking-wide text-sm hover:text-purple-600 transition-colors" onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}