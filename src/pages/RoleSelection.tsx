import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, TrendingUp, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUserProfile } from "@/lib/localStorage";
import { OrganizerVerification } from "@/components/OrganizerVerification";
import gatexLogo from "@/assets/gatex-logo.png";

export default function RoleSelection() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showOrganizerVerification, setShowOrganizerVerification] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya está autenticado y tiene un rol seleccionado
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const existingRole = localStorage.getItem("userRole");
    
    if (isAuthenticated && existingRole) {
      // Mostrar estado de redirección
      setIsRedirecting(true);
      
      // Redireccionar automáticamente según el rol existente
      setTimeout(() => {
        if (existingRole === "fan") {
          navigate("/dashboard");
        } else if (existingRole === "reseller") {
          navigate("/reseller");
        } else if (existingRole === "organizer") {
          navigate("/organizer");
        }
      }, 1500); // Dar tiempo para mostrar el mensaje
      return;
    }

    // Verificar si hay datos del perfil guardados
    const profile = getUserProfile();
    if (profile) {
      setUserProfile(profile);
    } else {
      // Fallback a datos de Google para compatibilidad
      const userData = localStorage.getItem("userGoogleData");
      if (userData) {
        setUserProfile(JSON.parse(userData));
      }
    }
  }, [navigate]);

  const handleRoleSelection = (role: string) => {
    if (role === "organizer") {
      // Para organizador, mostrar verificación avanzada
      setShowOrganizerVerification(true);
      return;
    }

    setSelectedRole(role);
    localStorage.setItem("userRole", role);
    
    const roleNames = {
      fan: "Fan",
      reseller: "Revendedor"
    };
    
    toast({
      title: "Rol seleccionado",
      description: `Has seleccionado el rol de ${roleNames[role as keyof typeof roleNames]}`,
    });

    // Redirect based on role
    setTimeout(() => {
      if (role === "fan") {
        navigate("/dashboard");
      } else if (role === "reseller") {
        navigate("/reseller");
      }
    }, 1000);
  };

  const handleOrganizerVerificationSuccess = () => {
    console.log("🎉 handleOrganizerVerificationSuccess ejecutándose");
    setShowOrganizerVerification(false);
    setSelectedRole("organizer");
    localStorage.setItem("userRole", "organizer");
    
    toast({
      title: "✅ Verificación exitosa",
      description: "Has sido verificado como organizador profesional",
    });

    console.log("🚀 Navegando a /organizer en 1 segundo");
    setTimeout(() => {
      navigate("/organizer");
    }, 1000);
  };

  const roles = [
    {
      id: "fan",
      title: "Fan",
      description: "Compra y revende entradas de forma segura",
      icon: Users,
      color: "from-primary to-accent",
      features: [
        "Comprar tickets NFT verificados",
        "Revender con límite justo (+5%)",
        "Protección con custodia de pagos",
        "Acceso anticipado a eventos"
      ]
    },
    {
      id: "reseller",
      title: "Revendedor",
      description: "Gestiona tu mercado de reventa de forma transparente",
      icon: TrendingUp,
      color: "from-accent to-orange",
      features: [
        "Publica ofertas de reventa",
        "Control de comisiones (5%)",
        "Dashboard de ventas en tiempo real",
        "Transacciones protegidas por blockchain"
      ]
    },
    {
      id: "organizer",
      title: "Organizador",
      description: "Crea y gestiona eventos deportivos",
      icon: Building2,
      color: "from-orange to-destructive",
      features: [
        "Crear eventos con zonas personalizadas",
        "Control total de ventas y aforo",
        "Monitoreo de mercado secundario",
        "Comisiones automáticas (3%)"
      ],
      secure: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card">
      <div className="container mx-auto px-4 py-16">
        {/* Bienvenida para usuarios autenticados */}
        {userProfile && (
          <div className="flex justify-center mb-8 animate-fade-in">
            <Card className="glass-card p-4 border-primary/20">
              <div className="flex items-center gap-3">
                <img 
                  src={userProfile.picture} 
                  alt={userProfile.name}
                  className="h-12 w-12 rounded-full border-2 border-primary/20"
                />
                <div>
                  <h3 className="font-semibold text-primary">¡Bienvenido, {userProfile.name.split(' ')[0]}!</h3>
                  <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                  {userProfile.phone && (
                    <p className="text-xs text-muted-foreground">{userProfile.phone}</p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {isRedirecting ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
              <img src={gatexLogo} alt="GateX" className="h-32 w-32 animate-pulse" />
              <h1 className="text-5xl md:text-6xl font-bold text-gradient">GateX</h1>
            </div>
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold mb-2">Redirigiendo automáticamente...</h2>
              <p className="text-muted-foreground">
                Ya tienes una sesión activa. Te estamos llevando a tu dashboard.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-12 animate-fade-in">
              <div className="flex items-center gap-4 mb-6">
                <img src={gatexLogo} alt="GateX" className="h-32 w-32" />
                <h1 className="text-5xl md:text-6xl font-bold text-gradient">GateX</h1>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                Selecciona tu <span className="text-gradient">Rol</span>
              </h2>
              <p className="text-muted-foreground text-center max-w-2xl">
                Elige cómo quieres participar en el ecosistema de GateX. Cada rol tiene beneficios únicos y está protegido por blockchain.
              </p>
            </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {roles.map((role, index) => (
            <Card 
              key={role.id}
              className={`glass-card glow-on-hover cursor-pointer border-2 transition-all duration-300 animate-fade-in-up ${
                selectedRole === role.id ? 'border-primary shadow-glow' : 'border-border/50'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleRoleSelection(role.id)}
            >
              <CardHeader>
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center mb-4`}>
                  <role.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="flex items-center gap-2">
                  {role.title}
                  {role.secure && <Shield className="h-5 w-5 text-primary" />}
                </CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {role.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-1">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="hero" 
                  className="w-full mt-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleSelection(role.id);
                  }}
                >
                  Seleccionar {role.title}
                </Button>
              </CardContent>
            </Card>
          ))}
            </div>

            <div className="mt-12 text-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
              >
                ← Volver al inicio
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Modal de verificación de organizador */}
      {showOrganizerVerification && (
        <OrganizerVerification
          onSuccess={handleOrganizerVerificationSuccess}
          onCancel={() => setShowOrganizerVerification(false)}
        />
      )}
    </div>
  );
}
