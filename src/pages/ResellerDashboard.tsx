import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Package, Plus, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { TransactionStatus } from "@/components/TransactionStatus";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const ResellerDashboard = () => {
  const { toast } = useToast();
  const [showCreateOffer, setShowCreateOffer] = useState(false);
  const [priceIncrease, setPriceIncrease] = useState([2.5]);

  const stats = [
    {
      icon: Package,
      label: "Ofertas Activas",
      value: "2",
      color: "text-primary",
    },
    {
      icon: TrendingUp,
      label: "Tickets Vendidos",
      value: "5",
      color: "text-success",
    },
    {
      icon: DollarSign,
      label: "Fondos en Custodia",
      value: "$525",
      color: "text-accent",
    },
  ];

  const activeOffers = [
    {
      id: "1",
      eventName: "Final Copa América 2025",
      zone: "Tribuna VIP",
      originalPrice: 250,
      resalePrice: 262.5,
      status: "active",
      commission: 13.13,
    },
    {
      id: "2",
      eventName: "Clásico Universitario vs Alianza",
      zone: "Platea Alta",
      originalPrice: 120,
      resalePrice: 126,
      status: "active",
      commission: 6.3,
    },
  ];

  const salesHistory = [
    {
      id: "1",
      eventName: "Eliminatorias Mundial 2026",
      zone: "Tribuna Lateral",
      soldPrice: 131.25,
      commission: 6.56,
      date: "18 Abril 2025",
      status: "completed",
    },
    {
      id: "2",
      eventName: "Sporting Cristal vs Melgar",
      zone: "Popular",
      soldPrice: 63,
      commission: 3.15,
      date: "10 Abril 2025",
      status: "completed",
    },
  ];

  const availableTickets = [
    {
      id: "3",
      eventName: "Superclásico de América",
      zone: "Platea Preferencial",
      price: 200,
      date: "20 Octubre 2025",
    },
  ];

  const calculatePrices = (basePrice: number, increase: number) => {
    const resalePrice = basePrice * (1 + increase / 100);
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

  const handleCreateOffer = () => {
    toast({
      title: "¡Oferta publicada!",
      description: "Tu ticket está ahora disponible en el mercado de reventa",
    });
    setShowCreateOffer(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Panel de Revendedor</h1>
            <p className="text-muted-foreground">
              Tu ticket se convierte en oportunidad. La reventa justa protege a todos.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="glass-card p-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="offers" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="offers">Mis Ofertas</TabsTrigger>
                  <TabsTrigger value="create">Crear Oferta</TabsTrigger>
                  <TabsTrigger value="history">Historial</TabsTrigger>
                </TabsList>

                {/* Mis Ofertas */}
                <TabsContent value="offers" className="space-y-4">
                  {activeOffers.map((offer, index) => (
                    <Card
                      key={offer.id}
                      className="glass-card glow-on-hover p-6 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{offer.eventName}</h3>
                          <p className="text-sm text-primary font-medium">{offer.zone}</p>
                        </div>
                        <Badge className="bg-primary/20 text-primary">Activa</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                        <div>
                          <p className="text-xs text-muted-foreground">Precio Original</p>
                          <p className="text-lg font-bold">${offer.originalPrice}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Precio Reventa</p>
                          <p className="text-lg font-bold text-primary">${offer.resalePrice}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Tu Comisión (5%)</p>
                          <p className="text-sm font-semibold text-success">${offer.commission}</p>
                        </div>
                        <div className="flex items-end">
                          <Button variant="outline" size="sm" className="ml-auto">
                            Cancelar Oferta
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                {/* Crear Oferta */}
                <TabsContent value="create" className="space-y-4">
                  <Card className="glass-card p-6">
                    <h3 className="font-semibold text-lg mb-4">Tickets Disponibles para Reventa</h3>
                    {availableTickets.length > 0 ? (
                      <div className="space-y-4">
                        {availableTickets.map((ticket) => (
                          <div
                            key={ticket.id}
                            className="p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold">{ticket.eventName}</h4>
                                <p className="text-sm text-muted-foreground">{ticket.zone}</p>
                                <p className="text-xs text-muted-foreground mt-1">{ticket.date}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Precio</p>
                                <p className="text-xl font-bold text-primary">${ticket.price}</p>
                              </div>
                            </div>
                            <Button
                              variant="hero"
                              size="sm"
                              className="w-full mt-3"
                              onClick={() => setShowCreateOffer(true)}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Publicar Oferta
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground mb-4">
                          No tienes tickets disponibles para revender
                        </p>
                        <Link to="/events">
                          <Button variant="outline">Explorar Eventos</Button>
                        </Link>
                      </div>
                    )}
                  </Card>
                </TabsContent>

                {/* Historial */}
                <TabsContent value="history" className="space-y-4">
                  {salesHistory.map((sale, index) => (
                    <Card
                      key={sale.id}
                      className="glass-card p-6 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{sale.eventName}</h3>
                          <p className="text-sm text-muted-foreground">{sale.zone}</p>
                          <p className="text-xs text-muted-foreground mt-1">{sale.date}</p>
                        </div>
                        <Badge className="bg-success/20 text-success">Completada</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                        <div>
                          <p className="text-xs text-muted-foreground">Precio de Venta</p>
                          <p className="text-lg font-bold">${sale.soldPrice}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Tu Comisión Recibida</p>
                          <p className="text-lg font-bold text-success">${sale.commission}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <TransactionStatus status="custody" />

              <Card className="glass-card p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Reventa Justa
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    El precio de reventa está limitado a un máximo de <strong>+5%</strong> sobre el precio original.
                  </p>
                  <p>
                    Las comisiones se distribuyen automáticamente:
                  </p>
                  <ul className="space-y-1 ml-4">
                    <li>• 5% para ti (revendedor)</li>
                    <li>• 3% para el organizador</li>
                    <li>• 2% para la plataforma</li>
                  </ul>
                  <p className="text-primary font-medium">
                    Los fondos se liberan automáticamente cuando se completa la transferencia del ticket.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Create Offer Modal */}
      <Dialog open={showCreateOffer} onOpenChange={setShowCreateOffer}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Oferta de Reventa</DialogTitle>
            <DialogDescription>
              Configura el precio de tu ticket. El sistema garantiza una reventa justa y transparente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <Label className="mb-4 block">Incremento de Precio (Máximo +5%)</Label>
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

            {availableTickets.length > 0 && (
              <div className="p-4 bg-background/50 rounded-lg space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Precio Original:</span>
                  <span className="font-semibold">${availableTickets[0].price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Precio de Reventa:</span>
                  <span className="font-bold text-primary">
                    ${calculatePrices(availableTickets[0].price, priceIncrease[0]).resalePrice}
                  </span>
                </div>
                <div className="pt-3 border-t border-border/50 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tu comisión (5%):</span>
                    <span className="text-success font-semibold">
                      -${calculatePrices(availableTickets[0].price, priceIncrease[0]).sellerCommission}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Organizador (3%):</span>
                    <span>-${calculatePrices(availableTickets[0].price, priceIncrease[0]).organizerCommission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plataforma (2%):</span>
                    <span>-${calculatePrices(availableTickets[0].price, priceIncrease[0]).platformCommission}</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-border/50">
                  <div className="flex justify-between font-bold">
                    <span>Recibirás:</span>
                    <span className="text-success text-lg">
                      ${calculatePrices(availableTickets[0].price, priceIncrease[0]).sellerReceives}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-foreground/80">
                  Tu oferta será publicada. El pago se liberará automáticamente cuando la transferencia del ticket se complete.
                </p>
              </div>
            </div>

            <Button variant="hero" className="w-full" onClick={handleCreateOffer}>
              Publicar Oferta Segura
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ResellerDashboard;