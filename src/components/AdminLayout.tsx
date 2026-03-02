import { useEffect, useState } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Users, Shield, Trophy, Calendar, Handshake, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoCopa from "@/assets/logo-copa.png";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: Home },
  { title: "Categorias", url: "/admin/categorias", icon: Trophy },
  { title: "Times", url: "/admin/times", icon: Shield },
  { title: "Atletas", url: "/admin/atletas", icon: Users },
  { title: "Partidas", url: "/admin/partidas", icon: Calendar },
  { title: "Patrocinadores", url: "/admin/patrocinadores", icon: Handshake },
];

const AdminLayout = () => {
  const [loading, setLoading] = useState(true);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <div className="p-4 flex items-center gap-2">
              <img src={logoCopa} alt="Copa Pampa" className="h-8 w-8 rounded-full object-cover" />
              <span className="font-display text-sm font-bold text-sidebar-foreground">ADMIN</span>
            </div>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                        <Link to={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <div className="mt-auto p-4">
              <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start text-sidebar-foreground/70">
                <LogOut className="h-4 w-4 mr-2" /> Sair
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-card px-4">
            <SidebarTrigger />
            <Link to="/" className="ml-auto text-sm text-muted-foreground hover:text-primary">
              ← Voltar ao site
            </Link>
          </header>
          <main className="flex-1 p-6 bg-muted/30">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
