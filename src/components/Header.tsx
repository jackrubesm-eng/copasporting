import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoCopa from "@/assets/logo-copa-sporting.jpeg";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Categorias", path: "/categorias" },
  { label: "Seleções", path: "/times" },
  { label: "Regulamento", path: "/regulamento" },
  { label: "Contato", path: "/contato" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-field border-b border-primary/20 backdrop-blur-sm">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoCopa} alt="Copa Sporting 2026" className="h-12 w-12 rounded-full object-cover" />
          <div>
            <span className="font-display text-lg font-bold text-field-foreground tracking-wide">COPA SPORTING</span>
            <span className="block text-xs text-primary font-body -mt-1">Copa do Mundo Esporte • 2026</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 text-sm font-display uppercase tracking-wider transition-colors rounded-md ${
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-field-foreground/80 hover:text-primary-foreground hover:bg-primary/30"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button onClick={() => setOpen(!open)} className="md:hidden text-field-foreground p-2">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden bg-field border-t border-primary/20 pb-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 font-display uppercase tracking-wider text-sm ${
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-field-foreground/80"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
