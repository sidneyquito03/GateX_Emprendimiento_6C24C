import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import { useState } from "react";
import gatexLogo from "@/assets/gatex-logo.png";

export const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuth = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole") || "fan";

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    window.location.href = "/";
  };

  const switchRole = () => {
    // Clear current role and redirect to role selection
    window.location.href = "/role-selection";
  };

  const getRoleLabel = () => {
    return "Cambiar Rol";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <img src={gatexLogo} alt="GateX" className="h-10 w-10 transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold text-gradient">GateX</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/events" className="text-foreground/80 hover:text-primary transition-colors">
              Eventos
            </Link>
            <Link to="/simbiosis" className="text-foreground/80 hover:text-primary transition-colors">
              ¿Qué es GateX?
            </Link>
            {isAuth ? (
              <>
                <Link
                  to={
                    userRole === "fan" 
                      ? "/dashboard" 
                      : userRole === "reseller" 
                      ? "/reseller" 
                      : "/organizer"
                  }
                  className="text-foreground/80 hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <Link to="/settings" className="text-foreground/80 hover:text-primary transition-colors">
                  Configuración
                </Link>
                <Button variant="ghost" size="sm" onClick={switchRole}>
                  <User className="mr-2 h-4 w-4" />
                  {getRoleLabel()}
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="hero" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-md hover:bg-secondary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border">
            <Link
              to="/events"
              className="block py-2 text-foreground/80 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Eventos
            </Link>
            <Link
              to="/simbiosis"
              className="block py-2 text-foreground/80 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              ¿Qué es GateX?
            </Link>
            {isAuth ? (
              <>
                <Link
                  to={
                    userRole === "fan" 
                      ? "/dashboard" 
                      : userRole === "reseller" 
                      ? "/reseller" 
                      : "/organizer"
                  }
                  className="block py-2 text-foreground/80 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/settings"
                  className="block py-2 text-foreground/80 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Configuración
                </Link>
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={switchRole}>
                  <User className="mr-2 h-4 w-4" />
                  {getRoleLabel()}
                </Button>
                <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="hero" size="sm" className="w-full">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
