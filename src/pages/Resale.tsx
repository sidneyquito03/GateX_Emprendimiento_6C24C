import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Info, TrendingUp, Users, Building2, Percent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Resale = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [priceIncrease, setPriceIncrease] = useState([2.5]);

  const ticket = {
    eventName: "Final Copa América 2025",
    zone: "Tribuna VIP",
    originalPrice: 250,
    eventDate: "15 Julio 2025, 20:00",
  };

  const calculatePrices = () => {
    const resalePrice = ticket.originalPrice * (1 + priceIncrease[0] / 100);
    const sellerCommission = resalePrice * 0.05;
    const organizerCommission = resalePrice * 0.03;
    const platformCommission = resalePrice * 0.02;
    const sellerReceives = resalePrice - sellerCommission;

    return {
      resalePrice: resalePrice.toFixed(2),
      sellerCommission: sellerCommission.toFixed(2),
      organizerCommission: organizerCommission.toFixed(2),
      platformCommission: platformCommission.toFixed(2),
      sellerReceives: sellerReceives.toFixed(2),
    };
  };

  const prices = calculatePrices();

  const handlePublish = () => {
    toast({
      title: "¡Ticket publicado!",
      description: "Tu ticket está ahora disponible en el mercado de reventa",
    });
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Reventa Justa</h1>
            <p className="text-muted-foreground">Configura tu reventa de manera transparente y justa</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Configuration */}
            <div className="space-y-6">
              <Card className="glass-card p-6 animate-fade-in-up">
                <h2 className="text-xl font-bold mb-4">Información del Ticket</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Evento</p>
                    <p className="font-semibold">{ticket.eventName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Zona</p>
                    <p className="font-semibold">{ticket.zone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p className="font-semibold">{ticket.eventDate}</p>
                  </div>
                  <div className="pt-3 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">Precio Original</p>
                    <p className="text-2xl font-bold text-primary">S/{ticket.originalPrice}</p>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <h2 className="text-xl font-bold mb-4">Configurar Precio</h2>
                
                <div className="space-y-6">
                  <div>
                    <Label className="mb-4 block">
                      Incremento de Precio (Máximo +5%)
                    </Label>
                    <Slider
                      value={priceIncrease}
                      onValueChange={setPriceIncrease}
                      max={5}
                      step={0.5}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>0%</span>
                      <span className="font-medium text-primary">+{priceIncrease[0]}%</span>
                      <span>+5%</span>
                    </div>
                  </div>

                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground/80">
                        El sistema limita automáticamente el precio de reventa para mantener un mercado justo y evitar especulación excesiva.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-6">
              <Card className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <h2 className="text-xl font-bold mb-4">Resumen de Comisiones</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Precio de Reventa</p>
                    <p className="text-3xl font-bold text-primary">S/{prices.resalePrice}</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Tu Comisión (5%)</span>
                      </div>
                      <span className="font-semibold">-S/{prices.sellerCommission}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Organizador (3%)</span>
                      </div>
                      <span className="font-semibold">-S/{prices.organizerCommission}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Plataforma (2%)</span>
                      </div>
                      <span className="font-semibold">-S/{prices.platformCommission}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-success/10 rounded-lg border border-success/20 mt-4">
                    <p className="text-sm text-muted-foreground mb-1">Recibirás</p>
                    <p className="text-2xl font-bold text-success">S/{prices.sellerReceives}</p>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6 border-accent/20 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Estado del Proceso
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-muted-foreground">Ticket verificado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-muted-foreground">Configurando reventa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-muted" />
                    <span className="text-muted-foreground">Transferencia atómica pendiente</span>
                  </div>
                </div>
              </Card>

              <Button 
                variant="hero" 
                size="lg" 
                className="w-full animate-fade-in-up" 
                style={{ animationDelay: "0.4s" }}
                onClick={handlePublish}
              >
                Publicar Reventa
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Resale;
