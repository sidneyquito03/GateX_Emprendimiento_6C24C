import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
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
      specialization: ['Fútbol', 'Básquet', 'Tenis'],
      location: "Lima, Perú",
      responseTime: "< 5 min",
      successRate: 98.5,
      tickets: [
        {
          id: "t1",
          eventName: "Final Copa América 2025",
          zone: "Occidente Baja",
          originalPrice: 100,
          resalePrice: 105,
          markup: 5.0,
          condition: 'excellent'
        },
        {
          id: "t1b",
          eventName: "Eliminatorias Mundial: Perú vs Brasil",
          zone: "Norte",
          originalPrice: 40,
          resalePrice: 42,
          markup: 5.0,
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
      specialization: ['Fútbol', 'Voleibol'],
      location: "Lima, Perú",
      responseTime: "< 10 min",
      successRate: 96.2,
      tickets: [
        {
          id: "t2",
          eventName: "Clásico Universitario vs Alianza",
          zone: "Oriente Baja", 
          originalPrice: 60,
          resalePrice: 62.70,
          markup: 4.5,
          condition: 'good'
        },
        {
          id: "t2b",
          eventName: "NBA Preseason: Heat vs Lakers",
          zone: "Preferente",
          originalPrice: 200,
          resalePrice: 210,
          markup: 5.0,
          condition: 'excellent'
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
      specialization: ['Fútbol', 'Atletismo'],
      location: "Lima, Perú", 
      responseTime: "< 15 min",
      successRate: 94.1,
      tickets: [
        {
          id: "t3",
          eventName: "Copa Libertadores: Universitario vs River",
          zone: "Sur",
          originalPrice: 50,
          resalePrice: 51.50,
          markup: 3.0,
          condition: 'fair'
        },
        {
          id: "t3b",
          eventName: "Maratón Internacional Lima 2025",
          zone: "General",
          originalPrice: 40,
          resalePrice: 41.20,
          markup: 3.0,
          condition: 'good'
        }
      ],
      reviews: [
        { rating: 4, comment: "Precios competitivos", date: "2025-10-02" },
        { rating: 4, comment: "Buen trato al cliente", date: "2025-09-29" }
      ]
    },
    {
      id: "4",
      name: "SportsMaster Peru",
      rating: 4.7,
      totalSales: 1200,
      verification: 'verified',
      specialization: ['Fútbol', 'Tenis', 'Básquet'],
      location: "Lima, Perú",
      responseTime: "< 8 min",
      successRate: 97.1,
      tickets: [
        {
          id: "t4",
          eventName: "Final Copa América 2025",
          zone: "Norte",
          originalPrice: 40,
          resalePrice: 42,
          markup: 5.0,
          condition: 'excellent'
        },
        {
          id: "t4b",
          eventName: "NBA Preseason: Heat vs Lakers",
          zone: "General Baja",
          originalPrice: 120,
          resalePrice: 126,
          markup: 5.0,
          condition: 'excellent'
        }
      ],
      reviews: [
        { rating: 5, comment: "Especialistas en eventos deportivos", date: "2025-10-04" },
        { rating: 4, comment: "Muy profesionales y puntuales", date: "2025-10-01" }
      ]
    },
    {
      id: "5",
      name: "ProTickets Deportivos",
      rating: 4.5,
      totalSales: 1600,
      verification: 'verified',
      specialization: ['Voleibol', 'Atletismo', 'Surf'],
      location: "Lima, Perú",
      responseTime: "< 12 min",
      successRate: 95.8,
      tickets: [
        {
          id: "t5",
          eventName: "Liga Nacional de Voleibol - Final",
          zone: "Tribuna VIP",
          originalPrice: 150,
          resalePrice: 157.5,
          markup: 5.0,
          condition: 'excellent'
        },
        {
          id: "t5b",
          eventName: "Sudamericano de Surf Lima 2025",
          zone: "VIP Beach Club",
          originalPrice: 80,
          resalePrice: 84,
          markup: 5.0,
          condition: 'good'
        }
      ],
      reviews: [
        { rating: 5, comment: "Excelente para deportes diversos", date: "2025-10-05" },
        { rating: 4, comment: "Buenos precios en eventos especiales", date: "2025-09-28" }
      ]
    },
    {
      id: "6",
      name: "EliteScore Lima",
      rating: 4.4,
      totalSales: 800,
      verification: 'verified',
      specialization: ['Fútbol', 'Maratón'],
      location: "Lima, Perú",
      responseTime: "< 15 min",
      successRate: 93.7,
      tickets: [
        {
          id: "t6",
          eventName: "Eliminatorias Mundial: Perú vs Brasil",
          zone: "Occidente Baja",
          originalPrice: 100,
          resalePrice: 105,
          markup: 5.0,
          condition: 'excellent'
        },
        {
          id: "t6b",
          eventName: "Maratón Internacional Lima 2025",
          zone: "Elite",
          originalPrice: 60,
          resalePrice: 63,
          markup: 5.0,
          condition: 'good'
        }
      ],
      reviews: [
        { rating: 4, comment: "Precios justos en eliminatorias", date: "2025-10-03" },
        { rating: 5, comment: "Especialistas en maratones", date: "2025-09-26" }
      ]
    },
    {
      id: "7",
      name: "SuperDeporte Plus",
      rating: 4.7,
      totalSales: 2200,
      verification: 'verified',
      specialization: ['Fútbol', 'Básquet', 'Tenis'],
      location: "Lima, Perú",
      responseTime: "< 5 min",
      successRate: 97.8,
      tickets: [
        {
          id: "t7a",
          eventName: "Clásico Real Madrid vs Barcelona",
          zone: "Tribuna Norte",
          originalPrice: 180,
          resalePrice: 185,
          markup: 2.8,
          condition: 'excellent'
        },
        {
          id: "t7b", 
          eventName: "US Open Tenis - Semifinal",
          zone: "Court Central",
          originalPrice: 150,
          resalePrice: 165,
          markup: 10.0,
          condition: 'excellent'
        }
      ],
      reviews: [
        { rating: 5, comment: "Rápidos y confiables, mejores precios", date: "2025-10-08" },
        { rating: 5, comment: "Excelente atención al cliente", date: "2025-10-01" }
      ]
    },
    {
      id: "8",
      name: "TicketMaster Sport",
      rating: 4.2,
      totalSales: 1500,
      verification: 'verified',
      specialization: ['Voleibol', 'Atletismo', 'Natación'],
      location: "Callao, Perú",
      responseTime: "< 8 min",
      successRate: 94.5,
      tickets: [
        {
          id: "t8a",
          eventName: "Campeonato Mundial Voleibol",
          zone: "Platea Baja",
          originalPrice: 85,
          resalePrice: 88,
          markup: 3.5,
          condition: 'good'
        },
        {
          id: "t8b",
          eventName: "Mundial de Natación Lima 2025",
          zone: "Tribuna VIP",
          originalPrice: 120,
          resalePrice: 132,
          markup: 10.0,
          condition: 'excellent'
        }
      ],
      reviews: [
        { rating: 4, comment: "Buenos precios para deportes acuáticos", date: "2025-09-30" },
        { rating: 4, comment: "Especialistas en atletismo", date: "2025-09-25" }
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
              
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ordenar por..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Mejor calificación</SelectItem>
                    <SelectItem value="price">Menor precio</SelectItem>
                    <SelectItem value="sales">Más ventas</SelectItem>
                  </SelectContent>
                </Select>
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
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center shadow-sm">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{reseller.name}</h3>
                        <span className="inline-flex items-center gap-1 bg-opacity-10 px-2 py-0.5 rounded-full" 
                              style={{
                                backgroundColor: reseller.verification === 'verified' ? 'rgba(34, 197, 94, 0.15)' : 
                                                reseller.verification === 'pending' ? 'rgba(234, 179, 8, 0.15)' : 
                                                'rgba(239, 68, 68, 0.15)'
                              }}>
                          {getVerificationIcon(reseller.verification)}
                          <span className={`text-xs font-medium
                            ${reseller.verification === 'verified' ? 'text-green-600' : 
                              reseller.verification === 'pending' ? 'text-yellow-600' : 
                              'text-red-600'}`}>
                            {reseller.verification === 'verified' ? 'Verificado' : 
                             reseller.verification === 'pending' ? 'Verificación pendiente' : 'No verificado'}
                          </span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{reseller.rating}</span>
                        <span className="text-muted-foreground">({reseller.totalSales.toLocaleString()} ventas)</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary/70" />
                        <span>{reseller.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary/70" />
                        <span>Responde en {reseller.responseTime}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-green-600 font-medium">{reseller.successRate}% éxito</span>
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
                    <h4 className="font-medium mb-3 text-base">Tickets Disponibles</h4>
                    <div className="space-y-3">
                      {reseller.tickets.map((ticket) => (
                        <Card key={ticket.id} className="border border-primary/20 hover:border-primary/40 transition-colors shadow-sm">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium">{ticket.eventName}</h5>
                                <Badge className={`${getConditionColor(ticket.condition)} font-medium`}>
                                  {ticket.condition === 'excellent' ? 'Excelente' : 
                                   ticket.condition === 'good' ? 'Bueno' : 'Regular'}
                                </Badge>
                              </div>
                              
                              <p className="text-sm font-medium text-primary/80">{ticket.zone}</p>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-xl font-bold text-primary">
                                    S/ {ticket.resalePrice.toFixed(2)}
                                  </span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm text-muted-foreground line-through">
                                      S/ {ticket.originalPrice.toFixed(2)}
                                    </span>
                                    {ticket.markup > 0 && (
                                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                                        ticket.markup > 5 ? 'bg-red-100 text-red-700' : 
                                        'bg-green-100 text-green-700'}`}>
                                        +{ticket.markup.toFixed(1)}%
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Acciones y reseñas */}
                  <div className="md:col-span-1">
                    <div className="space-y-4">
                      {/* Botones con alto contraste y efecto de hover mejorado */}
                      <Button 
                        className="w-full bg-cyan-600 text-white font-medium shadow-md hover:bg-cyan-700 hover:shadow-lg transition-all py-6"
                        onClick={() => {
                          setSelectedReseller(reseller);
                          navigate(`/resellerProfile/${reseller.id}`);
                        }}
                      >
                        <span className="text-base">Ver Perfil Completo</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full border-2 border-cyan-500 text-cyan-600 font-medium hover:bg-cyan-50 transition-colors py-6"
                        onClick={() => {
                          // Contactar al revendedor
                          setSelectedReseller(reseller);
                          // Podemos abrir un chat en la app o enviar un email
                          navigate(`/resellerProfile/${reseller.id}?action=contact`);
                        }}
                      >
                        <span className="text-base">Contactar Revendedor</span>
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
                  <li>• Precios mayores al 5% del valor original</li>
                  <li>• Pocas reseñas o muy antiguas</li>
                  <li>• Sin verificación o verificación pendiente</li>
                  <li>• Condición del ticket "regular" o inferior</li>
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