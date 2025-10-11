import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Users, Lock, Plus, BarChart3, Edit, Trash2, Eye, Shield, Activity, Star, UserCheck, UserX, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserEvents, getAllEvents, deleteEvent, updateEvent, getTransactions } from "@/lib/localStorage";

const Organizer = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userRole = localStorage.getItem("userRole");
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    if (userRole !== 'organizer') {
      navigate("/role-selection");
      return;
    }
    
    loadData();
  }, []);

  const loadData = () => {
    const userEvents = getUserEvents();
    setMyEvents(userEvents);
    
    const globalEvents = getAllEvents();
    setAllEvents(globalEvents);
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setShowEditModal(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer.")) {
      deleteEvent(eventId);
      loadData();
      toast({
        title: "Evento eliminado",
        description: "El evento ha sido eliminado exitosamente",
      });
    }
  };

  const handleUpdateEvent = (updatedEvent: any) => {
    updateEvent(editingEvent.id, updatedEvent);
    setShowEditModal(false);
    setEditingEvent(null);
    loadData();
    toast({
      title: "Evento actualizado",
      description: "Los cambios han sido guardados exitosamente",
    });
  };

  const stats = [
    {
      icon: DollarSign,
      label: "Eventos Creados",
      value: myEvents.length.toString(),
      change: "Propios",
      color: "text-primary",
    },
    {
      icon: Users,
      label: "Total en Plataforma",
      value: allEvents.length.toString(),
      change: "Global",
      color: "text-success",
    },
    {
      icon: Lock,
      label: "Rol Actual",
      value: "Organizador",
      change: "Verificado",
      color: "text-accent",
    },
    {
      icon: Shield,
      label: "Permisos",
      value: "Admin",
      change: "Completos",
      color: "text-primary",
    },
  ];



  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8 animate-fade-in-up">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                <Shield className="inline h-8 w-8 mr-2 text-primary" />
                Panel de Organizador
              </h1>
              <p className="text-muted-foreground">Gestiona tus eventos y monitorea la plataforma completa</p>
            </div>
            <Link to="/create-event">
              <Button variant="hero" size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Crear Evento
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="glass-card p-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <span className="text-xs text-success font-medium">{stat.change}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </Card>
            ))}
          </div>

          {/* Tabs Content */}
          <Tabs defaultValue="my-events" className="w-full animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="my-events">Mis Eventos</TabsTrigger>
              <TabsTrigger value="all-events">Todos los Eventos</TabsTrigger>
              <TabsTrigger value="users-analytics">Analytics Usuarios</TabsTrigger>
              <TabsTrigger value="resellers">Revendedores</TabsTrigger>
            </TabsList>

            {/* Mis Eventos */}
            <TabsContent value="my-events">
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Eventos que creé</h2>
                  <Badge className="bg-primary/20 text-primary">
                    {myEvents.length} eventos
                  </Badge>
                </div>
                
                {myEvents.length > 0 ? (
                  <div className="grid gap-4">
                    {myEvents.map((event, index) => (
                      <Card key={event.id} className="p-4 border border-border/50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{event.date}</p>
                            <p className="text-sm text-muted-foreground">{event.location}</p>
                            <div className="flex gap-2 mt-2">
                              {event.zones.map((zone: any, zIndex: number) => (
                                <Badge key={zIndex} variant="outline" className="text-xs">
                                  {zone.name}: S/{zone.price}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditEvent(event)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-4">Aún no has creado eventos</p>
                    <Link to="/create-event">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Crear tu primer evento
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Todos los Eventos */}
            <TabsContent value="all-events">
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Vista de Administrador - Todos los Eventos</h2>
                  <Badge className="bg-accent/20 text-accent">
                    {allEvents.length} eventos totales
                  </Badge>
                </div>
                
                <div className="grid gap-4">
                  {allEvents.map((event, index) => (
                    <Card key={event.id} className="p-4 border border-border/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            {myEvents.some(me => me.id === event.id) && (
                              <Badge className="bg-primary/20 text-primary text-xs">
                                Tuyo
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{event.date}</p>
                          <p className="text-sm text-muted-foreground mb-2">{event.location}</p>
                          <div className="flex gap-2">
                            {event.zones.map((zone: any, zIndex: number) => (
                              <Badge key={zIndex} variant="outline" className="text-xs">
                                {zone.name}: S/{zone.price} ({zone.available} disponibles)
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              toast({
                                title: "Vista de evento",
                                description: `Viendo detalles de: ${event.title}`,
                              });
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {myEvents.some(me => me.id === event.id) && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditEvent(event)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteEvent(event.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Analytics de Usuarios */}
            <TabsContent value="users-analytics">
              <div className="space-y-6">
                {/* User Stats Overview */}
                <div className="grid md:grid-cols-4 gap-6">
                  <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <Users className="h-8 w-8 text-blue-600" />
                      <span className="text-xs text-green-600 font-medium">+12%</span>
                    </div>
                    <p className="text-sm text-blue-900 mb-1">Total Fans</p>
                    <p className="text-3xl font-bold text-blue-600">2,847</p>
                  </Card>
                  
                  <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                      <span className="text-xs text-green-600 font-medium">+8%</span>
                    </div>
                    <p className="text-sm text-purple-900 mb-1">Revendedores Activos</p>
                    <p className="text-3xl font-bold text-purple-600">143</p>
                  </Card>
                  
                  <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <div className="flex items-center justify-between mb-4">
                      <Shield className="h-8 w-8 text-orange-600" />
                      <span className="text-xs text-orange-600 font-medium">+2</span>
                    </div>
                    <p className="text-sm text-orange-900 mb-1">Organizadores</p>
                    <p className="text-3xl font-bold text-orange-600">12</p>
                  </Card>
                  
                  <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <Activity className="h-8 w-8 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">87%</span>
                    </div>
                    <p className="text-sm text-green-900 mb-1">Usuarios Activos</p>
                    <p className="text-3xl font-bold text-green-600">2,461</p>
                  </Card>
                </div>

                {/* Detailed Analytics */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                      Actividad de Usuarios (Últimos 30 días)
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Nuevos Registros</span>
                          <span className="font-medium">+287</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Tickets Comprados</span>
                          <span className="font-medium">1,423</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Transacciones Reventa</span>
                          <span className="font-medium">298</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Eye className="h-5 w-5 mr-2 text-accent" />
                      Top Fans por Compras
                    </h3>
                    <div className="space-y-3">
                      {[
                        { name: "María González", purchases: 12, total: "S/1,480", rating: 4.9 },
                        { name: "Carlos Ruiz", purchases: 8, total: "S/960", rating: 4.7 },
                        { name: "Ana Torres", purchases: 6, total: "S/720", rating: 4.8 },
                        { name: "Luis Mendoza", purchases: 5, total: "S/650", rating: 4.6 },
                      ].map((fan, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                              {fan.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{fan.name}</p>
                              <p className="text-xs text-muted-foreground">{fan.purchases} compras</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm">{fan.total}</p>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-xs">{fan.rating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Análisis de Revendedores */}
            <TabsContent value="resellers">
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                    Revendedores por Performance
                  </h3>
                  <div className="space-y-4">
                    {[
                      { 
                        name: "TicketsPro Lima", 
                        sales: 156, 
                        revenue: "S/18,720", 
                        rating: 4.8, 
                        commission: "S/936",
                        status: "verified" 
                      },
                      { 
                        name: "EventMaster", 
                        sales: 98, 
                        revenue: "S/11,760", 
                        rating: 4.6, 
                        commission: "S/588",
                        status: "verified" 
                      },
                      { 
                        name: "QuickTickets", 
                        sales: 45, 
                        revenue: "S/5,400", 
                        rating: 4.3, 
                        commission: "S/270",
                        status: "pending" 
                      },
                      { 
                        name: "SportReseller", 
                        sales: 23, 
                        revenue: "S/2,760", 
                        rating: 4.1, 
                        commission: "S/138",
                        status: "verified" 
                      },
                    ].map((reseller, index) => (
                      <Card key={index} className="p-4 border border-border/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                              <TrendingUp className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{reseller.name}</h4>
                                {reseller.status === 'verified' ? (
                                  <Badge className="bg-green-100 text-green-800 text-xs">Verificado</Badge>
                                ) : (
                                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">Pendiente</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{reseller.sales} ventas</span>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                  <span>{reseller.rating}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{reseller.revenue}</p>
                            <p className="text-sm text-muted-foreground">Comisión: {reseller.commission}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>

                {/* Reseller Actions */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer border-green-200 bg-green-50">
                    <UserCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-medium text-green-900">Verificar Revendedores</h4>
                    <p className="text-xs text-green-700 mt-1">3 pendientes de verificación</p>
                  </Card>
                  
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer border-red-200 bg-red-50">
                    <UserX className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <h4 className="font-medium text-red-900">Suspender Cuentas</h4>
                    <p className="text-xs text-red-700 mt-1">Por actividad sospechosa</p>
                  </Card>
                  
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer border-orange-200 bg-orange-50">
                    <AlertCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <h4 className="font-medium text-orange-900">Reportes</h4>
                    <p className="text-xs text-orange-700 mt-1">1 reporte sin resolver</p>
                  </Card>
                </div>
              </div>
            </TabsContent>


          </Tabs>
        </div>
      </main>

      {/* Modal de Edición */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl glass-card">
          <DialogHeader>
            <DialogTitle>Editar Evento</DialogTitle>
            <DialogDescription>
              Modifica los detalles de tu evento
            </DialogDescription>
          </DialogHeader>
          
          {editingEvent && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Título del Evento</Label>
                <Input
                  id="edit-title"
                  defaultValue={editingEvent.title}
                  onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-date">Fecha</Label>
                  <Input
                    id="edit-date"
                    defaultValue={editingEvent.date}
                    onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-location">Ubicación</Label>
                  <Input
                    id="edit-location"
                    defaultValue={editingEvent.location}
                    onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-image">URL de Imagen</Label>
                <Input
                  id="edit-image"
                  defaultValue={editingEvent.image}
                  onChange={(e) => setEditingEvent({...editingEvent, image: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-description">Descripción</Label>
                <Input
                  id="edit-description"
                  defaultValue={editingEvent.description}
                  onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleUpdateEvent(editingEvent)}
                  className="flex-1"
                >
                  Guardar Cambios
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Organizer;
