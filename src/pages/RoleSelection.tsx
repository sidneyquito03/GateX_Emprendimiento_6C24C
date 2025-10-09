import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, TrendingUp, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import gatexLogo from "@/assets/gatex-logo.png";

export default function RoleSelection() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role);
    localStorage.setItem("userRole", role);
    
    toast({
      title: "Rol seleccionado",
      description: `Has seleccionado el rol de ${role === "fan" ? "Fan" : role === "reseller" ? "Revendedor" : "Organizador"}`,
    });

    // Redirect based on role
    setTimeout(() => {
      if (role === "fan") {
        navigate("/dashboard");
      } else if (role === "reseller") {
        navigate("/reseller");
      } else if (role === "organizer") {
        navigate("/organizer");
      }
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
        <div className="flex flex-col items-center mb-12 animate-fade-in">
          <img src={gatexLogo} alt="GateX" className="h-24 w-24 mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Selecciona tu <span className="text-gradient">Rol</span>
          </h1>
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
      </div>
    </div>
  );
}
