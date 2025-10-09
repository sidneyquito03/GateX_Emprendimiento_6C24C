import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Star, 
  Shield, 
  TrendingUp, 
  Users,
  MapPin,
  Clock,
  CreditCard,
  Verified,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { PaymentMethodsModal } from "@/components/PaymentMethodsModal";

interface Reseller {
  id: string;
  name: string;
  rating: number;
  totalSales: number;
  verification: 'verified' | 'pending' | 'none';
  specialization: string[];
  location: string;
  responseTime: string;
  successRate: number;
  tickets: Array<{
    id: string;
    eventName: string;
    zone: string;
    originalPrice: number;
    resalePrice: number;
    markup: number;
    condition: 'excellent' | 'good' | 'fair';
  }>;
  reviews: Array<{
    rating: number;
    comment: string;
    date: string;
  }>;
}

export const ResellerComparison = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedReseller, setSelectedReseller] = useState<Reseller | null>(null);

  const [resellers] = useState<Reseller[]>([
    {
      id: "1",
      name: "TicketsPro Lima",
      rating: 4.8,
      totalSales: 2500,
      verification: 'verified',
      specialization: ['Deportes', 'Conciertos', 'Teatro'],
      location: "Lima, Perú",
      responseTime: "< 5 min",
      successRate: 98.5,
      tickets: [
        {
          id: "t1",
          eventName: "Alianza Lima vs Universitario",
          zone: "Oriente Alta",
          originalPrice: 80,
          resalePrice: 120,
          markup: 50,
          condition: 'excellent'
        }
      ],
      reviews: [
        { rating: 5, comment: "Excelente servicio, entrega rápida", date: "2025-10-01" },
        { rating: 4, comment: "Muy confiable, recomendado", date: "2025-09-28" }
      ]
    },
    {
      id: "2", 
      name: "EventMaster",
      rating: 4.6,
      totalSales: 1800,
      verification: 'verified',
      specialization: ['Conciertos', 'Festivales'],
      location: "Lima, Perú",
      responseTime: "< 10 min",
      successRate: 96.2,
      tickets: [
        {
          id: "t2",
          eventName: "Alianza Lima vs Universitario",
          zone: "Oriente Alta", 
          originalPrice: 80,
          resalePrice: 110,
          markup: 37.5,
          condition: 'good'
        }
      ],
      reviews: [
        { rating: 5, comment: "Precios justos y buen servicio", date: "2025-10-03" },
        { rating: 4, comment: "Proceso de compra fácil", date: "2025-09-30" }
      ]
    },
    {
      id: "3",
      name: "QuickTickets",
      rating: 4.3,
      totalSales: 950,
      verification: 'pending',
      specialization: ['Deportes'],
      location: "Lima, Perú", 
      responseTime: "< 15 min",
      successRate: 94.1,
      tickets: [
        {
          id: "t3",
          eventName: "Alianza Lima vs Universitario",
          zone: "Oriente Alta",
          originalPrice: 80,
          resalePrice: 95,
          markup: 18.8,
          condition: 'fair'
        }
      ],
      reviews: [
        { rating: 4, comment: "Precios competitivos", date: "2025-10-02" },
        { rating: 4, comment: "Buen trato al cliente", date: "2025-09-29" }
      ]
    }
  ]);

  const filteredResellers = resellers
    .filter(reseller => 
      reseller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reseller.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.rating - a.rating;
        case 'price': return (a.tickets[0]?.resalePrice || 0) - (b.tickets[0]?.resalePrice || 0);
        case 'sales': return b.totalSales - a.totalSales;
        default: return 0;
      }
    });

  const getVerificationIcon = (verification: string) => {
    switch (verification) {
      case 'verified': return <Verified className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';  
      case 'fair': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Comparar Revendedores</h1>
          <p className="text-muted-foreground">
            Encuentra los mejores precios y revendedores verificados para tus entradas
          </p>
        </div>

        {/* Filtros y búsqueda */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre o especialización..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select 
                  className="px-3 py-2 border rounded-md"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="rating">Mejor calificación</option>
                  <option value="price">Menor precio</option>
                  <option value="sales">Más ventas</option>
                </select>
                <Button onClick={() => setShowPaymentModal(true)}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Métodos de Pago
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de revendedores */}
        <div className="grid gap-6">
          {filteredResellers.map((reseller) => (
            <Card key={reseller.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Información del revendedor */}
                  <div className="md:col-span-1">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-lg font-semibold">{reseller.name}</h3>
                      {getVerificationIcon(reseller.verification)}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{reseller.rating}</span>
                        <span className="text-muted-foreground">({reseller.totalSales} ventas)</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{reseller.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Responde en {reseller.responseTime}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>{reseller.successRate}% éxito</span>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {reseller.specialization.map((spec) => (
                        <Badge key={spec} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Tickets disponibles */}
                  <div className="md:col-span-1">
                    <h4 className="font-medium mb-3">Tickets Disponibles</h4>
                    <div className="space-y-3">
                      {reseller.tickets.map((ticket) => (
                        <Card key={ticket.id} className="border border-border/50">
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <h5 className="font-medium text-sm">{ticket.eventName}</h5>
                              <p className="text-sm text-muted-foreground">{ticket.zone}</p>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-lg font-bold text-primary">
                                    S/ {ticket.resalePrice}
                                  </span>
                                  <div className="text-xs text-muted-foreground">
                                    Precio original: S/ {ticket.originalPrice}
                                  </div>
                                </div>
                                <Badge className={`text-xs ${getConditionColor(ticket.condition)}`}>
                                  {ticket.condition}
                                </Badge>
                              </div>
                              
                              {ticket.markup > 0 && (
                                <div className="text-xs">
                                  <span className={ticket.markup > 40 ? 'text-red-500' : 'text-orange-500'}>
                                    +{ticket.markup.toFixed(1)}% sobre precio original
                                  </span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Acciones y reseñas */}
                  <div className="md:col-span-1">
                    <div className="space-y-4">
                      <Button className="w-full" onClick={() => setSelectedReseller(reseller)}>
                        Ver Perfil Completo
                      </Button>
                      
                      <Button variant="outline" className="w-full">
                        Contactar Revendedor
                      </Button>
                      
                      <div>
                        <h4 className="font-medium mb-2">Reseñas Recientes</h4>
                        <div className="space-y-2">
                          {reseller.reviews.slice(0, 2).map((review, index) => (
                            <div key={index} className="text-xs border-l-2 border-primary/20 pl-2">
                              <div className="flex items-center gap-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-3 w-3 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                              <p className="text-muted-foreground">{review.comment}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Consejos para compradores */}
        <Card className="mt-8 border-accent/20 bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Consejos para Comprar Seguro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">✅ Qué buscar:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Revendedores verificados con badge verde</li>
                  <li>• Alta calificación (4.5+ estrellas)</li>
                  <li>• Múltiples reseñas positivas recientes</li>
                  <li>• Tiempo de respuesta rápido</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">⚠️ Señales de alerta:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Precios demasiado altos (+50% del original)</li>
                  <li>• Pocas reseñas o muy antiguas</li>
                  <li>• Sin verificación o verificación pendiente</li>
                  <li>• Condición del ticket "fair" o inferior</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <PaymentMethodsModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        userRole="fan"
      />

      <Footer />
    </div>
  );
};