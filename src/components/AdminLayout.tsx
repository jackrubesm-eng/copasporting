import { useEffect, useState } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Users, Shield, Trophy, Calendar, Handshake, LogOut, Home, Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoCopa from "@/assets/logo-copa-sporting.jpeg";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: Home },
  { title: "Categorias", url: "/admin/categorias", icon: Trophy },
  { title: "Seleções", url: "/admin/times", icon: Shield },
  { title: "Atletas", url: "/admin/atletas", icon: Users },
  { title: "Partidas", url: "/admin/partidas", icon: Calendar },
  { title: "Patrocinadores", url: "/admin/patrocinadores", icon: Handshake },
];

const AdminLayout = () => {
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(() => localStorage.getItem("admin-theme") === "dark");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate("/admin/login");
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/admin/login");
      setLoading(false);
    });
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("admin-theme", dark ? "dark" : "light");
  }, [dark]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        {/* Top header */}
        <header className="sticky top-0 z-50 h-14 flex items-center justify-between border-b border-border bg-card px-3">
          <div className="flex items-center gap-2">
            <img src={logoCopa} alt="Admin" className="h-8 w-8 rounded-full object-cover" />
            <span className="font-display text-sm font-bold">ADMIN</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setDark(!dark)}
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary px-2">
              ← Site
            </Link>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 pb-20 px-3 py-4 md:px-6 md:py-6 bg-muted/30 overflow-x-auto">
          <Outlet />
        </main>

        {/* Bottom navigation — mobile-first */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-bottom">
          <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
            {menuItems.map((item) => {
              const active = location.pathname === item.url;
              return (
                <Link
                  key={item.url}
                  to={item.url}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", active && "drop-shadow-sm")} />
                  <span className="text-[10px] font-display uppercase tracking-wider leading-none">
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AdminLayout;
