import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  Camera,
  Edit,
  Upload,
  Star,
  Trophy,
  TrendingUp,
  Users,
  Award
} from "lucide-react";
import { PaymentMethodsModal } from "@/components/PaymentMethodsModal";
import { getUserProfile, updateUserProfile } from "@/lib/localStorage";

export const UserProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams(); // Capturar el ID del usuario/vendedor desde la URL
  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentRole, setCurrentRole] = useState<string>("");
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(true); // Si estamos viendo nuestro propio perfil

  const [formData, setFormData] = useState({
    name: "",
    email: "", 
    phone: "",
    bio: "",
    location: ""
  });

  const [notifications, setNotifications] = useState({
    ticketSold: true,
    eventReminder: true,
    fundReleased: true,
    resaleActivity: false,
    newEvents: true,
    priceAlerts: false
  });

  useEffect(() => {
    loadUserData();
    // Cargar configuración de notificaciones guardada
    const savedNotifications = localStorage.getItem('notificationSettings');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, [id]); // Re-cargar cuando cambia el ID en la URL

  const loadUserData = () => {
    // Si hay un ID en la URL, estamos viendo el perfil de otro usuario
    if (id) {
      // En una app real, aquí cargaríamos los datos del usuario específico desde la API
      // Para esta demo, usamos datos de ejemplo para el revendedor
      setIsOwnProfile(false);
      
      // Datos de ejemplo para un revendedor
      const resellerProfile = {
        name: id === "reseller" ? "TicketsPro Lima" : `Revendedor ${id}`,
        email: "contact@ticketspro.pe",
        phone: "+51 987654321",
        bio: "Revendedor verificado con más de 5 años de experiencia en venta de tickets deportivos y conciertos.",
        location: "Lima, Perú",
        profileImage: null,
        rating: 4.8,
        totalSales: 2500,
        verification: 'verified',
        specialization: ['Deportes', 'Conciertos', 'Teatro'],
        successRate: 98.5,
      };
      
      setUserProfile(resellerProfile);
      setCurrentRole("reseller");
      setFormData({
        name: resellerProfile.name,
        email: resellerProfile.email,
        phone: resellerProfile.phone,
        bio: resellerProfile.bio,
        location: resellerProfile.location
      });
      setProfileImage(resellerProfile.profileImage);
    } else {
      // Si no hay ID, estamos viendo nuestro propio perfil
      setIsOwnProfile(true);
      const profile = getUserProfile();
      const role = localStorage.getItem("userRole") || "fan";
      
      if (profile) {
        setUserProfile(profile);
        setCurrentRole(role);
        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          bio: profile.bio || "",
          location: profile.location || ""
        });
        setProfileImage(profile.profileImage || null);
      }
    }
  };

  const handleSave = () => {
    const updatedData = {
      ...formData,
      profileImage: profileImage
    };
    
    updateUserProfile(updatedData);
    loadUserData();
    
    // Emitir evento para que otros componentes se actualicen
    window.dispatchEvent(new CustomEvent('profileUpdated'));
    
    toast({
      title: "Perfil actualizado",
      description: "Tus cambios han sido guardados exitosamente",
    });
  };

  const handleNotificationSave = () => {
    try {
      localStorage.setItem('notificationSettings', JSON.stringify(notifications));
      toast({
        title: "Notificaciones actualizadas",
        description: "Tus preferencias de notificación han sido guardadas",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron guardar las configuraciones",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar el tamaño del archivo (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Archivo muy grande",
          description: "La imagen debe ser menor a 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        toast({
          title: "Imagen cargada",
          description: "Haz clic en 'Guardar Foto' para confirmar los cambios",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getRoleBadge = () => {
    const roleConfig = {
      fan: { label: "Fan", color: "bg-blue-100 text-blue-800", icon: User },
      reseller: { label: "Revendedor", color: "bg-purple-100 text-purple-800", icon: TrendingUp },
      organizer: { label: "Organizador", color: "bg-green-100 text-green-800", icon: Shield }
    };
    
    const config = roleConfig[currentRole as keyof typeof roleConfig] || roleConfig.fan;
    const IconComponent = config.icon;
    
    return (
      <Badge 
        className={`${config.color} flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity`}
        onClick={() => {
          navigate("/role-selection");
          toast({
            title: "Cambiar Rol",
            description: "Redirigiendo a la selección de roles...",
          });
        }}
      >
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getProfileStats = () => {
    switch (currentRole) {
      case "reseller":
        return [
          { icon: Trophy, label: "Ventas Totales", value: "156", color: "text-yellow-600" },
          { icon: Star, label: "Calificación", value: "4.8", color: "text-blue-600" },
          { icon: Award, label: "Nivel", value: "Pro", color: "text-purple-600" }
        ];
      case "organizer":
        return [
          { icon: Users, label: "Eventos Creados", value: "24", color: "text-green-600" },
          { icon: TrendingUp, label: "Asistentes", value: "12.5K", color: "text-blue-600" },
          { icon: Award, label: "Certificado", value: "Verificado", color: "text-purple-600" }
        ];
      default: // fan
        return [
          { icon: Trophy, label: "Eventos Asistidos", value: "12", color: "text-yellow-600" },
          { icon: Star, label: "Favoritos", value: "8", color: "text-blue-600" },
          { icon: Award, label: "Nivel", value: "Activo", color: "text-purple-600" }
        ];
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Profile */}
          <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative group">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow">
                    <AvatarImage src={profileImage || ""} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-accent text-white">
                      {formData.name.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {!profileImage && (
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 bg-white shadow-lg hover:shadow-xl hover:scale-110 transition-all border-2 border-primary/30 hover:border-primary"
                    onClick={() => {
                      setShowImageUpload(true);
                      toast({
                        title: "Subir foto",
                        description: "Selecciona una imagen para tu perfil",
                      });
                    }}
                  >
                    <Camera className="h-5 w-5 text-primary" />
                  </Button>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold">{formData.name || "Usuario"}</h1>
                    {getRoleBadge()}
                  </div>
                  <p className="text-muted-foreground mb-3">{formData.bio || "Sin biografía"}</p>
                  <div className="flex flex-col sm:flex-row gap-2 text-sm text-muted-foreground">
                    {formData.location && (
                      <span>📍 {formData.location}</span>
                    )}
                    <span>✉️ {formData.email}</span>
                  </div>
                </div>
                
                <Button onClick={() => setShowPaymentModal(true)}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Métodos de Pago
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
                {getProfileStats().map((stat, index) => (
                  <div 
                    key={index} 
                    className="text-center cursor-pointer hover:bg-white/10 rounded-lg p-2 transition-colors"
                    onClick={() => {
                      switch (currentRole) {
                        case "reseller":
                          navigate("/reseller");
                          break;
                        case "organizer":
                          navigate("/organizer");
                          break;
                        default:
                          navigate("/dashboard");
                      }
                      toast({
                        title: `Ver ${stat.label}`,
                        description: "Redirigiendo a tu panel principal...",
                      });
                    }}
                  >
                    <div className="flex items-center justify-center mb-1">
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <p className="text-lg font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Configuración con Tabs */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Perfil
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notificaciones
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Seguridad
              </TabsTrigger>
            </TabsList>

            {/* Perfil Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre Completo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Ubicación</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Biografía</Label>
                    <Input
                      id="bio"
                      placeholder="Cuéntanos algo sobre ti..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!isOwnProfile}
                    />
                  </div>
                  <div className="flex gap-2">
                    {isOwnProfile ? (
                      <>
                        <Button onClick={handleSave} className="flex-1">
                          <Edit className="h-4 w-4 mr-2" />
                          Guardar Cambios
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            navigate("/dashboard");
                            toast({
                              title: "Ir al Dashboard",
                              description: "Redirigiendo a tu panel principal...",
                            });
                          }}
                        >
                          Dashboard
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          className="flex-1"
                          onClick={() => {
                            navigate("/events");
                            toast({
                              title: "Ver eventos disponibles",
                              description: "Explorando tickets en reventa de este vendedor...",
                            });
                          }}
                        >
                          Ver Eventos en Reventa
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => navigate(-1)}
                        >
                          Volver
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notificaciones Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Preferencias de Notificación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {key === 'ticketSold' && 'Ticket vendido'}
                          {key === 'eventReminder' && 'Recordatorio de evento'}
                          {key === 'fundReleased' && 'Fondos liberados'}
                          {key === 'resaleActivity' && 'Actividad de reventa'}
                          {key === 'newEvents' && 'Nuevos eventos'}
                          {key === 'priceAlerts' && 'Alertas de precio'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {key === 'ticketSold' && 'Cuando se venda tu ticket'}
                          {key === 'eventReminder' && 'Recordatorio antes del evento'}
                          {key === 'fundReleased' && 'Cuando se liberen tus fondos'}
                          {key === 'resaleActivity' && 'Actividad en el mercado de reventa'}
                          {key === 'newEvents' && 'Nuevos eventos disponibles'}
                          {key === 'priceAlerts' && 'Cambios de precio en tus favoritos'}
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, [key]: checked }))
                        }
                      />
                    </div>
                  ))}
                  <Button onClick={handleNotificationSave} className="w-full mt-4">
                    <Bell className="h-4 w-4 mr-2" />
                    Guardar Preferencias
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Seguridad Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de Seguridad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-900">Cuenta Verificada</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Tu cuenta está completamente verificada y protegida
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        toast({
                          title: "Cambiar Contraseña",
                          description: "Redirigiendo a la configuración de contraseña...",
                        });
                        navigate("/settings");
                      }}
                    >
                      🔑 Cambiar Contraseña
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        toast({
                          title: "Autenticación de Dos Factores",
                          description: "Redirigiendo a la configuración de 2FA...",
                        });
                        navigate("/settings");
                      }}
                    >
                      📱 Configurar 2FA
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        toast({
                          title: "Actividad de la Cuenta",
                          description: "Redirigiendo al historial de actividad...",
                        });
                        navigate("/settings");
                      }}
                    >
                      🔒 Actividad de la Cuenta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Modal de subida de imagen */}
      <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Foto de Perfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <Avatar className="w-32 h-32 mx-auto border-4 border-primary/20">
                <AvatarImage src={profileImage || ""} />
                <AvatarFallback className="text-4xl">
                  {formData.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <Label htmlFor="image-upload" className="cursor-pointer">
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  profileImage 
                    ? "border-green-300 bg-green-50 hover:border-green-400" 
                    : "border-primary/20 hover:border-primary/40"
                }`}>
                  <Upload className={`h-8 w-8 mx-auto mb-2 ${
                    profileImage ? "text-green-600" : "text-muted-foreground"
                  }`} />
                  <p className="text-sm font-medium">
                    {profileImage ? "✅ Imagen seleccionada" : "Haz clic para subir una imagen"}
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG hasta 5MB</p>
                </div>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </Label>
            </div>
            {profileImage && (
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setProfileImage(null);
                    toast({
                      title: "Imagen eliminada",
                      description: "Se ha eliminado la imagen seleccionada",
                    });
                  }}
                >
                  🗑️ Eliminar Imagen
                </Button>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowImageUpload(false);
                  // Restaurar la imagen original si no se guardó
                  const profile = getUserProfile();
                  setProfileImage(profile?.profileImage || null);
                }}
              >
                Cancelar
              </Button>
              <Button 
                className="flex-1"
                onClick={() => {
                  handleSave();
                  setShowImageUpload(false);
                  toast({
                    title: "¡Foto guardada!",
                    description: "Tu foto de perfil ha sido actualizada exitosamente",
                  });
                }}
                disabled={!profileImage}
              >
                Guardar Foto
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PaymentMethodsModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        userRole={currentRole as "fan" | "reseller" | "organizer"}
      />

      <Footer />
    </div>
  );
};