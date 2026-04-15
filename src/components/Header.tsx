import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoCopa from "@/assets/logo-copa-sporting.jpeg";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Categorias", path: "/categorias" },
  { label: "Regulamento", path: "/regulamento" },
  { label: "Contato", path: "/contato" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-field/95 border-b border-primary/20 backdrop-blur-md">
      <div className="container flex items-center justify-between h-14 md:h-16 px-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoCopa} alt="Copa do Mundo Sporting" className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover" />
          <div>
            <span className="font-display text-sm md:text-lg font-bold text-field-foreground tracking-wide leading-tight">COPA DO MUNDO</span>
            <span className="block text-[10px] md:text-xs text-primary font-body -mt-0.5">SPORTING</span>
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

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-field-foreground p-2 active:scale-90 transition-transform"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-field border-t border-primary/20 overflow-hidden"
          >
            {navItems.map((item, i) => (
              <motion.div
                key={item.path}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`block px-6 py-3.5 font-display uppercase tracking-wider text-sm active:bg-primary/20 transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-field-foreground/80"
                  }`}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
