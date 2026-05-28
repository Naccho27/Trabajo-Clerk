import { useState } from "react";

const MENU_LINKS = [
  { label: "Transformación Digital", href: "https://www.villamaria.gob.ar/transformacion-digital" },
  { label: "Gobierno Abierto", href: "https://www.villamaria.gob.ar/gobierno-abierto" },
  { label: "ViDi", href: "https://www.villamaria.gob.ar/vidi" },
  { label: "Noticias", href: "https://www.villamaria.gob.ar/noticias" },
  { label: "Contacto", href: "https://www.villamaria.gob.ar/contacto" },
  { label: "UrbanLog", href: "/" },
];

const LOGO_URL =
  "https://www.villamaria.gob.ar/static/images/logo_escudo_blanco.a6a7c9481ea7.svg";

const HEADER_STYLE = {
  background: "linear-gradient(to bottom, #3b1fa3, #c2007a)",
};

export default function AuthHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* HEADER MOBILE */}
      <header
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-7 md:hidden"
        style={HEADER_STYLE}
      >
        <img
          src={LOGO_URL}
          alt="Logo Municipalidad"
          className="h-14 w-auto"
        />

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white flex flex-col gap-1 p-2"
        >
          <span className="block w-6 h-0.5 bg-white" />
          <span className="block w-6 h-0.5 bg-white" />
          <span className="block w-6 h-0.5 bg-white" />
        </button>
      </header>

      {/* HEADER DESKTOP */}
      <header
        className="absolute top-0 left-0 right-0 z-20 hidden md:flex items-center justify-between px-60 py-6"
        style={HEADER_STYLE}
      >
        <img
          src={LOGO_URL}
          alt="Logo Municipalidad"
          className="h-13 w-auto"
        />

        <nav className="flex items-center gap-6">
          {MENU_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-white text-sm font-semibold uppercase tracking-wide hover:opacity-75 transition-opacity"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      {menuOpen && (
        <div className="absolute top-16 right-0 z-30 md:hidden bg-white/95 shadow-lg rounded-bl-xl w-64 py-4 px-6 flex flex-col gap-4">
          {MENU_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-gray-800 font-medium hover:text-purple-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}