import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import { useState, useEffect } from "react";
import { getUserProfile, clearUserData } from "@/lib/localStorage";
import gatexLogo from "@/assets/gatex-logo.png";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const isAuth = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole") || "fan";

  useEffect(() => {
    const loadProfile = () => {
      const profile = getUserProfile();
      if (profile) {
        setUserProfile(profile);
      } else {
        const userData = localStorage.getItem("userGoogleData");
        if (userData) {
          setUserProfile(JSON.parse(userData));
        }
      }
    };

    // Cargar perfil inicial
    loadProfile();

    // Escuchar actualizaciones de perfil
    const handleProfileUpdate = () => {
      loadProfile();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    // Cleanup
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const handleLogout = () => {
    clearUserData();
    window.location.href = "/";
  };

  const switchRole = () => {
    window.location.href = "/role-selection";
  };

  const getRoleLabel = () => {
    const roleLabels = {
      fan: "👤 Fan",
      reseller: "💼 Revendedor", 
      organizer: "🏛️ Organizador"
    };
    return roleLabels[userRole as keyof typeof roleLabels] || "👤 Usuario";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <img src={gatexLogo} alt="GateX" className="h-14 w-14 transition-transform group-hover:scale-110" />
            <span className="text-2xl font-bold text-gradient">GateX</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/events" className="text-foreground/80 hover:text-primary transition-colors">
              Eventos
            </Link>
            
            {isAuth ? (
              <>
                {userRole === "fan" && (
                  <>
                    <Link to="/dashboard" className="text-foreground/80 hover:text-primary transition-colors">
                      Mi Dashboard
                    </Link>
                    <Link to="/resale" className="text-foreground/80 hover:text-primary transition-colors">
                      Reventa
                    </Link>
                  </>
                )}
                
                {userRole === "reseller" && (
                  <>
                    <Link to="/reseller" className="text-foreground/80 hover:text-primary transition-colors">
                      Mi Negocio
                    </Link>
                    <Link to="/dashboard" className="text-foreground/80 hover:text-primary transition-colors">
                      Mis Tickets
                    </Link>
                  </>
                )}
                
                {userRole === "organizer" && (
                  <>
                    <Link to="/organizer" className="text-foreground/80 hover:text-primary transition-colors">
                      Panel Admin
                    </Link>
                    <Link to="/create-event" className="text-foreground/80 hover:text-primary transition-colors">
                      Crear Evento
                    </Link>
                  </>
                )}
                
                <Link to="/profile" className="text-foreground/80 hover:text-primary transition-colors">
                  Mi Perfil
                </Link>
                
                <Link to="/settings" className="text-foreground/80 hover:text-primary transition-colors">
                  Configuración
                </Link>
                
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" onClick={switchRole} className="flex items-center gap-2">
                    {userProfile ? (
                      userProfile.profileImage || userProfile.picture ? (
                        <img 
                          src={userProfile.profileImage || userProfile.picture} 
                          alt={userProfile.name}
                          className="h-8 w-8 rounded-full border-2 border-primary/30 object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm border-2 border-primary/30">
                          {userProfile.name.charAt(0).toUpperCase()}
                        </div>
                      )
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <div className="flex flex-col items-start">
                      <span className="text-xs font-medium">{userProfile ? userProfile.name.split(' ')[0] : 'Usuario'}</span>
                      <span className="text-xs text-muted-foreground">{getRoleLabel()}</span>
                    </div>
                  </Button>
                </div>
                
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Link to="/simbiosis" className="text-foreground/80 hover:text-primary transition-colors">
                  ¿Qué es GateX?
                </Link>
                <Link to="/auth">
                  <Button variant="hero" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
              </>
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
            
            {!isAuth && (
              <Link
                to="/simbiosis"
                className="block py-2 text-foreground/80 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                ¿Qué es GateX?
              </Link>
            )}
            
            {isAuth && (
              <>
                {userRole === "fan" && (
                  <>
                    <Link
                      to="/dashboard"
                      className="block py-2 text-foreground/80 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mi Dashboard
                    </Link>
                    <Link
                      to="/resale"
                      className="block py-2 text-foreground/80 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Reventa
                    </Link>
                  </>
                )}
                
                {userRole === "reseller" && (
                  <>
                    <Link
                      to="/reseller"
                      className="block py-2 text-foreground/80 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mi Negocio
                    </Link>
                    <Link
                      to="/dashboard"
                      className="block py-2 text-foreground/80 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mis Tickets
                    </Link>
                  </>
                )}
                
                {userRole === "organizer" && (
                  <>
                    <Link
                      to="/organizer"
                      className="block py-2 text-foreground/80 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Panel Admin
                    </Link>
                    <Link
                      to="/create-event"
                      className="block py-2 text-foreground/80 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Crear Evento
                    </Link>
                  </>
                )}
                
                <Link
                  to="/settings"
                  className="block py-2 text-foreground/80 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Configuración
                </Link>
                
                <div className="py-2 border-t border-border">
                  <p className="text-sm font-medium mb-1">{userProfile ? userProfile.name : 'Usuario'}</p>
                  <p className="text-xs text-muted-foreground mb-2">{getRoleLabel()}</p>
                  <Button variant="ghost" size="sm" className="w-full justify-start" onClick={switchRole}>
                    <User className="mr-2 h-4 w-4" />
                    Cambiar Rol
                  </Button>
                </div>
                
                <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </>
            )}
            
            {!isAuth && (
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
