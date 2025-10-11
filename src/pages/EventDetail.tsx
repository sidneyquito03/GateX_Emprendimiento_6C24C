import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Shield, Clock, Info, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QRModal } from "@/components/QRModal";
import { StadiumSeatMap } from "@/components/StadiumSeatMap";
import { SeatSelection } from "@/components/SeatSelection";
import { PaymentMethodsModal } from "@/components/PaymentMethodsModal";
import { getAllEvents, purchaseTicket } from "@/lib/localStorage";
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
  
  // Verificar el rol del usuario con debugging
  const userRole = localStorage.getItem("userRole");
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  
  // Debug info
  console.log("🔍 EventDetail - Estado del usuario:");
  console.log("  - Autenticado:", isAuthenticated);
  console.log("  - Rol:", userRole);
  console.log("  - Puede comprar:", userRole === "fan" || userRole === "reseller");
  
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [purchasedTicket, setPurchasedTicket] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);
  const [pendingPurchase, setPendingPurchase] = useState<{seats: string[], totalPrice: number} | null>(null);

  useEffect(() => {
    const events = getAllEvents();
    const foundEvent = events.find(e => e.id === id);
    if (foundEvent) {
      // TODOS los eventos son deportivos en GateX
      setEvent({
        ...foundEvent,
        category: "deportivo",
        sport: "fútbol"
      });
    } else {
      // Evento por defecto si no se encuentra
      setEvent({
        id: "1",
        title: "Eliminatorias Mundial 2026: Perú vs Brasil",
        date: "15 Noviembre 2025, 20:00",
        location: "Estadio Nacional, Lima, Perú",
        image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&h=600&fit=crop",
        description: "¡Partido decisivo de las Eliminatorias Sudamericanas! Perú recibe a Brasil en un encuentro que definirá el futuro mundialista de ambas selecciones. Una noche histórica en el fútbol peruano.",
        category: "deportivo", // Marcador de que es evento deportivo
        sport: "fútbol",
        zones: [
          { name: "GENERAL", price: 50.00, available: 2500 },
          { name: "OCCIDENTE ALTA", price: 30.00, available: 800 },
          { name: "OCCIDENTE BAJA", price: 40.00, available: 1200 },
          { name: "ORIENTE ALTA", price: 25.00, available: 0 }, // Agotado
          { name: "ORIENTE BAJA", price: 25.00, available: 1200 },
          { name: "NORTE", price: 15.00, available: 3000 },
          { name: "SUR", price: 15.00, available: 3000 },
          // Opciones adicionales que no están en el mapa
          { name: "PALCO VIP", price: 175.00, available: 250 },
          { name: "PLATEA CENTRAL", price: 80.00, available: 500 },
          { name: "CORNER VIP", price: 65.00, available: 300 },
        ],
      });
    }
  }, [id]);

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

    // SIMPLIFICADO: Solo establecer la zona y ir a selección de asientos
    const zone = event.zones.find(z => z.name === zoneName);
    if (zone) {
      setSelectedZone(zoneName);
      setSelectedPrice(zone.price);
      setShowSeatSelection(true);
    }
  };

  const confirmPurchase = () => {
    console.log("🎫 confirmPurchase ejecutándose");
    console.log("🪑 selectedSeats:", selectedSeats);
    console.log("🏟️ selectedZone:", selectedZone);
    console.log("💰 selectedPrice:", selectedPrice);
    
    if (!selectedSeats || selectedSeats.length === 0) {
      toast({
        title: "Error",
        description: "Debes seleccionar al menos un asiento",
        variant: "destructive"
      });
      return;
    }

    const zone = event.zones.find(z => z.name === selectedZone);
    if (zone) {
      // Calcular precio total con comisión
      const basePrice = selectedSeats.length * selectedPrice;
      const totalWithFee = basePrice * 1.05; // 5% de comisión
      
      // Usar la función purchaseTicket de localStorage
      const ticketId = purchaseTicket(event.title, selectedZone!, totalWithFee);
      
      const ticket = {
        id: ticketId,
        eventName: event.title,
        zone: selectedZone,
        date: event.date,
        price: totalWithFee,
        seat: selectedSeats.join(", "), // Asientos específicos seleccionados
        seatNumbers: selectedSeats // Array de asientos para el PDF
      };
      
      setPurchasedTicket(ticket);
      toast({
        title: "¡Compra exitosa!",
        description: `Has comprado ${selectedSeats.length} asiento(s): ${selectedSeats.join(", ")}. Tu pago está en custodia hasta que el evento se complete.`,
      });
      setShowPurchaseModal(false);
      
      // Mostrar QR después de 1 segundo
      setTimeout(() => {
        setShowQRModal(true);
      }, 1000);
    }
  };

  const handleDirectPurchase = (seats: string[], totalPrice: number) => {
    console.log("🎫 Iniciando proceso de compra - Usuario:", userRole, "| Asientos:", seats.join(", "), "| Total: S/", totalPrice.toFixed(2));
    
    // Verificar autenticación
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para comprar entradas",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }
    
    // Solo los organizadores NO pueden comprar
    if (userRole === "organizer") {
      toast({
        title: "Acceso restringido",
        description: "Los organizadores no pueden comprar entradas en sus propios eventos.",
        variant: "destructive"
      });
      navigate("/organizer");
      return;
    }
    
    // Validar asientos seleccionados
    if (!seats || seats.length === 0) {
      toast({
        title: "Error",
        description: "Debes seleccionar al menos un asiento",
        variant: "destructive"
      });
      return;
    }

    // Guardar datos de la compra pendiente y abrir modal de métodos de pago
    setPendingPurchase({ seats, totalPrice });
    setShowPaymentModal(true);
    console.log("💳 Abriendo modal de métodos de pago para:", userRole);
  };

  const processPurchaseAfterPayment = () => {
    if (!pendingPurchase) return;
    
    const { seats, totalPrice } = pendingPurchase;
    console.log("💰 Procesando compra con método de pago confirmado");

    // Procesar la compra
    try {
      // Generar ticket usando localStorage
      const ticketId = purchaseTicket(event.title, selectedZone!, totalPrice);
      console.log("✅ Ticket generado con ID:", ticketId);
      
      // Crear objeto del ticket
      const ticket = {
        id: ticketId,
        eventName: event.title,
        zone: selectedZone,
        date: event.date,
        time: event.time || "Por definir",
        price: totalPrice,
        seat: seats.join(", "),
        seatNumbers: seats,
        userRole: userRole,
        purchaseDate: new Date().toISOString(),
        status: "confirmed"
      };
      
      // Guardar ticket comprado
      setPurchasedTicket(ticket);
      
      // Ocultar selección de asientos y modal de pago
      setShowSeatSelection(false);
      setShowPaymentModal(false);
      setPendingPurchase(null);
      
      // Toast de confirmación según el rol
      const roleText = userRole === 'fan' ? 'Fan' : userRole === 'reseller' ? 'Revendedor' : 'Usuario';
      
      toast({
        title: `¡Compra exitosa! (${roleText})`,
        description: `${seats.length} asiento(s): ${seats.join(", ")} | Total: S/ ${totalPrice.toFixed(2)}`,
      });
      
      console.log("🎉 Compra completada exitosamente para", userRole);
      
      // Mostrar QR modal con el boleto para descargar
      setTimeout(() => {
        setShowQRModal(true);
      }, 1000);
      
    } catch (error) {
      console.error("❌ Error procesando compra:", error);
      toast({
        title: "Error en la compra",
        description: "Hubo un problema procesando tu compra. Intenta nuevamente.",
        variant: "destructive"
      });
      // Limpiar estados en caso de error
      setShowPaymentModal(false);
      setPendingPurchase(null);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 pb-12 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Cargando evento...</h2>
            <p className="text-muted-foreground">Por favor espera un momento</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

          {/* Stadium Seat Map o Seat Selection - TODOS los eventos en GateX son deportivos */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            {userRole === "organizer" ? (
              <Card className="p-6 border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <Info className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                      Vista de Organizador
                    </h3>
                    <p className="text-orange-700 dark:text-orange-200 text-sm">
                      Como organizador, no puedes comprar entradas. Puedes crear y gestionar eventos desde tu dashboard.
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/organizer")}
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    Ir a Dashboard de Organizador
                  </Button>
                </div>
              </Card>
            ) : !isAuthenticated ? (
              <Card className="p-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Info className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                      Inicia sesión para comprar
                    </h3>
                    <p className="text-blue-700 dark:text-blue-200 text-sm">
                      Necesitas una cuenta de GateX para comprar entradas de forma segura.
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/auth")}
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    Iniciar Sesión / Registrarse
                  </Button>
                </div>
              </Card>
            ) : !showSeatSelection ? (
              <div>
                <h3 className="text-xl font-bold mb-4">🏟️ Selecciona tu zona en el estadio</h3>
                <StadiumSeatMap 
                  eventName={event.title}
                  onSeatSelect={(zone, price) => {
                    setSelectedZone(zone);
                    setSelectedPrice(price);
                    setShowSeatSelection(true);
                  }}
                />
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">🪑 Selecciona tus asientos - {selectedZone}</h3>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowSeatSelection(false);
                      setSelectedZone(null);
                      setSelectedPrice(0);
                    }}
                  >
                    🏟️ Volver al Mapa del Estadio
                  </Button>
                </div>
                <SeatSelection
                  zoneName={selectedZone!}
                  zonePrice={selectedPrice}
                  userRole={userRole as 'fan' | 'reseller' | 'organizer'}
                  onBack={() => {
                    setShowSeatSelection(false);
                    setSelectedZone(null);
                    setSelectedPrice(0);
                  }}
                  onConfirmSelection={(seats, totalPrice) => {
                    console.log("🎫 Iniciando compra:", seats.length, "asientos por S/", totalPrice.toFixed(2));
                    setSelectedSeats(seats);
                    handleDirectPurchase(seats, totalPrice);
                  }}
                />
              </div>
            )}
          </div>          {/* Security Notice */}
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

          {/* Zones - TODOS los eventos en GateX son deportivos */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-2xl font-bold mb-6">
              {!showSeatSelection ? "Usa el mapa interactivo o selecciona tu zona" : "Selecciona tu zona"}
            </h2>
            
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm flex items-center gap-2">
                <span className="text-lg">⚽</span>
                <strong>EVENTO DEPORTIVO:</strong> Selecciona tu zona directamente en el mapa interactivo del estadio. 
                Todos los eventos en GateX son deportivos con selección de asientos específicos.
              </p>
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
              {selectedSeats.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Asientos</span>
                  <span className="font-medium">{selectedSeats.join(', ')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cantidad</span>
                <span className="font-medium">{selectedSeats.length || 1} asiento(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha</span>
                <span className="font-medium">{event.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">S/{(selectedPrice * (selectedSeats.length || 1)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Comisión (5%)</span>
                <span className="font-medium">S/{(selectedPrice * (selectedSeats.length || 1) * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-primary">
                  S/{(selectedPrice * (selectedSeats.length || 1) * 1.05).toFixed(2)}
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

      {/* QR Modal */}
      <QRModal 
        isOpen={showQRModal} 
        onClose={() => {
          setShowQRModal(false);
          navigate("/dashboard");
        }}
        ticket={purchasedTicket}
      />

      {/* Payment Methods Modal */}
      <PaymentMethodsModal 
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setPendingPurchase(null);
        }}
        userRole={userRole as 'fan' | 'reseller' | 'organizer'}
        onPaymentConfirmed={processPurchaseAfterPayment}
      />

      <Footer />
    </div>
  );
};

export default EventDetail;
