import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TicketCard } from "@/components/TicketCard";
import { QRModal } from "@/components/QRModal";
import { TicketTransfer } from "@/components/TicketTransfer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Wallet, TrendingUp, Clock, CheckCircle2, User, Shield, Search, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getTickets, getUserStats, getUserProfile, getUserBalance, createDemoTickets } from "@/lib/localStorage";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showTransfer, setShowTransfer] = useState(false);
  const [ticketToTransfer, setTicketToTransfer] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentRole, setCurrentRole] = useState<string>("");

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userRole = localStorage.getItem("userRole");
    
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    
    // El dashboard del fan funciona para cualquier rol autenticado
    // Crear tickets de demostración
    createDemoTickets();
    
    loadUserData();
  }, [navigate]);

  const loadUserData = () => {
    // Cargar tickets del usuario
    const userTickets = getTickets();
    console.log("Tickets cargados:", userTickets);
    setTickets(userTickets);
    
    // Cargar estadísticas del usuario
    const stats = getUserStats();
    setUserStats(stats);
    
    // Cargar perfil del usuario
    const profile = getUserProfile();
    setUserProfile(profile);
    
    // Obtener rol actual
    const role = localStorage.getItem("userRole") || "fan";
    setCurrentRole(role);
  };

  const handleTransferTicket = (ticket: any) => {
    setTicketToTransfer(ticket);
    setShowTransfer(true);
  };

  const handleTransferComplete = (transferData: any) => {
    // Actualizar el estado del ticket a transferido con todos los datos del destinatario
    const updatedTickets = tickets.map(ticket => 
      ticket.id === transferData.ticketId 
        ? { 
            ...ticket, 
            status: 'transferred', 
            transferredTo: transferData.recipientName + ' ' + transferData.recipientLastName,
            // Datos del nuevo titular para el PDF
            currentOwner: {
              name: `${transferData.recipientName} ${transferData.recipientLastName}`,
              dni: transferData.recipientDni,
              email: transferData.recipientEmail,
              phone: transferData.recipientPhone
            },
            transferInfo: {
              ...transferData,
              transferDate: new Date().toISOString(),
              originalOwner: JSON.parse(localStorage.getItem('gatex_user_profile') || '{}')
            }
          }
        : ticket
    );
    
    setTickets(updatedTickets);
    
    // Actualizar en localStorage
    localStorage.setItem('gatex_user_tickets', JSON.stringify(updatedTickets));
    
    toast({
      title: "¡Transferencia exitosa!",
      description: `Tu ticket ha sido transferido a ${transferData.recipientName} ${transferData.recipientLastName}`,
    });
  };

  const stats = userStats ? [
    {
      icon: Wallet,
      label: "Mi Saldo",
      value: `S/${(userStats.userBalance || 0).toFixed(2)}`,
      color: "text-success",
    },
    {
      icon: Clock,
      label: "Fondos en Custodia",
      value: `S/${userStats.fundsInCustody.toFixed(2)}`,
      color: "text-accent",
    },
    {
      icon: CheckCircle2,
      label: "Tickets Activos",
      value: userStats.activeTickets.toString(),
      color: "text-primary",
    },
    {
      icon: TrendingUp,
      label: "Tickets Revendidos",
      value: userStats.ticketsResold.toString(),
      color: "text-muted-foreground",
    },
  ] : [];

  const handleResell = (ticketId?: string) => {
    // Si tenemos un ID específico de ticket, lo pasamos como parámetro a localStorage
    if (ticketId) {
      localStorage.setItem('selectedTicketForResale', ticketId);
    }
    navigate("/resale");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Mi Dashboard</h1>
                <p className="text-muted-foreground">Gestiona tus tickets y reventas</p>
              </div>
              <div className="flex items-center gap-2">
                {currentRole === "organizer" ? (
                  <Shield className="h-5 w-5 text-primary" />
                ) : currentRole === "reseller" ? (
                  <TrendingUp className="h-5 w-5 text-accent" />
                ) : (
                  <User className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="text-sm font-medium capitalize bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {currentRole === "organizer" ? "Organizador" : 
                   currentRole === "reseller" ? "Revendedor" : "Fan"}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

            {/* Marketplace Card - Solo para fans */}
            {currentRole === "fan" && (
              <Card className="glass-card p-6 animate-fade-in-up bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Marketplace</p>
                    <ShoppingBag className="h-5 w-5 text-primary" />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start hover:bg-primary/20"
                    onClick={() => navigate('/reseller-comparison')}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Comparar Revendedores
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Encuentra los mejores precios
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Custody Progress */}
          <Card className="glass-card p-6 mb-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <h3 className="font-semibold mb-4 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-accent" />
              Proceso de Custodia
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Fondos en Custodia</span>
                <span className="text-primary font-medium">En progreso</span>
              </div>
              <Progress value={33} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>✓ Pago realizado</span>
                <span className="text-primary">● Evento pendiente</span>
                <span>○ Fondos liberados</span>
              </div>
            </div>
          </Card>

          {/* Tickets Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Mis Tickets</h2>
              <Link to="/events">
                <Button variant="outline">
                  Explorar Más Eventos
                </Button>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {tickets.length > 0 ? (
                tickets.map((ticket, index) => (
                  <div
                    key={ticket.id}
                    style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                  >
                    <TicketCard
                      {...ticket}
                      onViewDetails={() => {
                        navigate(`/purchase/${ticket.id}`);
                      }}
                      onViewQR={() => {
                        setSelectedTicket({
                          id: ticket.id,
                          eventName: ticket.eventName,
                          zone: ticket.zone,
                          date: ticket.eventDate,
                          price: ticket.price
                        });
                        setShowQR(true);
                      }}
                      onResell={() => {
                        toast({
                          title: "Redirigiendo a reventa",
                          description: "Te llevamos a la página de reventa de tickets",
                        });
                        handleResell(ticket.id);
                      }}
                      onTransfer={() => handleTransferTicket(ticket)}
                    />
                  </div>
                ))
              ) : (
                <div className="md:col-span-2 py-12 text-center">
                  <p className="text-muted-foreground mb-4">No tienes tickets activos</p>
                  <Button variant="outline" onClick={() => navigate('/events')}>Explorar eventos</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* QR Code Modal */}
      <QRModal 
        isOpen={showQR} 
        onClose={() => setShowQR(false)}
        ticket={selectedTicket}
      />

      {ticketToTransfer && (
        <TicketTransfer
          isOpen={showTransfer}
          onClose={() => {
            setShowTransfer(false);
            setTicketToTransfer(null);
          }}
          ticket={ticketToTransfer}
          onTransferComplete={handleTransferComplete}
        />
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;
