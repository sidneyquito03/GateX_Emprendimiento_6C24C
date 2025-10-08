import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Shield, Clock, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const event = {
    title: "Final Copa América 2025",
    date: "15 Julio 2025, 20:00",
    location: "Estadio Monumental, Buenos Aires",
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&h=600&fit=crop",
    description: "¡No te pierdas la gran final de la Copa América 2025! Los mejores equipos del continente se enfrentarán en un partido histórico.",
    zones: [
      { name: "Tribuna VIP", price: 250, available: 50 },
      { name: "Platea Alta", price: 120, available: 200 },
      { name: "Platea Baja", price: 180, available: 150 },
      { name: "Campo", price: 80, available: 500 },
    ],
  };

  const handlePurchase = (zoneName: string) => {
    const isAuth = localStorage.getItem("isAuthenticated") === "true";
    
    if (!isAuth) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para comprar tickets",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setSelectedZone(zoneName);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    toast({
      title: "¡Compra exitosa!",
      description: "Tu pago está en custodia hasta que el evento se complete",
    });
    setShowPurchaseModal(false);
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12">
        {/* Hero Image */}
        <div className="relative h-[400px] overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="container mx-auto max-w-6xl px-4 -mt-32 relative z-10">
          <Card className="glass-card p-8 mb-8 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-5 w-5" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-5 w-5" />
                <span>900 tickets disponibles</span>
              </div>
            </div>

            <p className="text-foreground/80 text-lg">{event.description}</p>
          </Card>

          {/* Security Notice */}
          <Card className="glass-card p-6 mb-8 border-primary/20 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  Protección de Custodia
                  <Badge variant="secondary" className="text-xs">Seguro</Badge>
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tu pago estará en custodia hasta que el evento se complete. Si el evento se cancela o hay algún problema, 
                  recibirás un reembolso automático.
                </p>
              </div>
            </div>
          </Card>

          {/* Zones */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-2xl font-bold mb-6">Selecciona tu zona</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {event.zones.map((zone, index) => (
                <Card key={index} className="glass-card p-6 glow-on-hover">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{zone.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {zone.available} tickets disponibles
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">${zone.price}</p>
                      <p className="text-xs text-muted-foreground">por ticket</p>
                    </div>
                  </div>
                  <Button 
                    variant="hero" 
                    className="w-full"
                    onClick={() => handlePurchase(zone.name)}
                  >
                    Comprar Entrada
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Purchase Modal */}
      <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Compra</DialogTitle>
            <DialogDescription>
              Estás comprando un ticket para {selectedZone}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg">
              <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium mb-1">Pago en Custodia</p>
                <p className="text-muted-foreground">
                  Tu dinero estará seguro en custodia hasta que el evento se complete. 
                  Esto garantiza que no perderás tu inversión.
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Evento</span>
                <span className="font-medium">{event.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Zona</span>
                <span className="font-medium">{selectedZone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha</span>
                <span className="font-medium">{event.date}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-primary">
                  ${event.zones.find(z => z.name === selectedZone)?.price}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowPurchaseModal(false)}>
              Cancelar
            </Button>
            <Button variant="hero" className="flex-1" onClick={confirmPurchase}>
              Confirmar Compra
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default EventDetail;
