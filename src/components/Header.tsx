import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoCopa from "@/assets/logo-copa.jpeg";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Categorias", path: "/categorias" },
  { label: "Times", path: "/times" },
  { label: "Regulamento", path: "/regulamento" },
  { label: "Contato", path: "/contato" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-glass border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoCopa} alt="Copa Pampa Fut 7 2026" className="h-10 w-10 rounded-lg object-cover shadow-card" />
          <div>
            <span className="font-display text-2xl leading-none text-foreground tracking-wide">COPA PAMPA</span>
            <span className="block text-[10px] text-muted-foreground font-body font-medium tracking-widest">FUT 7 • 2026</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground shadow-glow-green"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground p-2 rounded-lg hover:bg-muted transition-colors">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden bg-glass border-t border-border/50 pb-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground"
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
