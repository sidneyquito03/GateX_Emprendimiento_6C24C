import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard, Bell, Shield, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    ticketSold: true,
    eventReminder: true,
    fundReleased: true,
    resaleActivity: false,
  });

  const handleSave = () => {
    toast({
      title: "Configuración guardada",
      description: "Tus cambios han sido guardados exitosamente",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Configuración</h1>
            <p className="text-muted-foreground">Gestiona tu cuenta y preferencias</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" />
                Perfil
              </TabsTrigger>
              <TabsTrigger value="payment">
                <CreditCard className="mr-2 h-4 w-4" />
                Pagos
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="mr-2 h-4 w-4" />
                Notificaciones
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="mr-2 h-4 w-4" />
                Seguridad
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="glass-card p-6 animate-fade-in-up">
                <h2 className="text-xl font-bold mb-6">Información Personal</h2>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input id="firstName" placeholder="Juan" defaultValue="Juan" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input id="lastName" placeholder="Pérez" defaultValue="Pérez" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="juan@email.com" defaultValue="juan@email.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" placeholder="+54 9 11 1234-5678" />
                  </div>

                  <Button variant="hero" onClick={handleSave} type="button">
                    Guardar Cambios
                  </Button>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="payment">
              <Card className="glass-card p-6 animate-fade-in-up">
                <h2 className="text-xl font-bold mb-6">Métodos de Pago</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="p-4 border border-border rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Visa •••• 4242</p>
                        <p className="text-sm text-muted-foreground">Expira 12/25</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Editar</Button>
                  </div>
                </div>

                <Button variant="outline">
                  Agregar Método de Pago
                </Button>

                <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-accent" />
                    Conectar Wallet Web3
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Conecta tu wallet de criptomonedas para recibir pagos directamente en blockchain
                  </p>
                  <Button variant="outline" size="sm">
                    Conectar Wallet
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="glass-card p-6 animate-fade-in-up">
                <h2 className="text-xl font-bold mb-6">Preferencias de Notificaciones</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="ticketSold">Ticket Vendido</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificarte cuando uno de tus tickets se venda
                      </p>
                    </div>
                    <Switch
                      id="ticketSold"
                      checked={notifications.ticketSold}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, ticketSold: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="eventReminder">Recordatorio de Evento</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibir recordatorios antes de tus eventos
                      </p>
                    </div>
                    <Switch
                      id="eventReminder"
                      checked={notifications.eventReminder}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, eventReminder: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="fundReleased">Fondos Liberados</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificarte cuando se liberen fondos en custodia
                      </p>
                    </div>
                    <Switch
                      id="fundReleased"
                      checked={notifications.fundReleased}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, fundReleased: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="resaleActivity">Actividad de Reventa</Label>
                      <p className="text-sm text-muted-foreground">
                        Actualizaciones sobre tus tickets en reventa
                      </p>
                    </div>
                    <Switch
                      id="resaleActivity"
                      checked={notifications.resaleActivity}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, resaleActivity: checked })
                      }
                    />
                  </div>

                  <Button variant="hero" onClick={handleSave}>
                    Guardar Preferencias
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="glass-card p-6 animate-fade-in-up">
                <h2 className="text-xl font-bold mb-6">Seguridad de la Cuenta</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Cambiar Contraseña</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Contraseña Actual</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Nueva Contraseña</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                      <Button variant="outline">Actualizar Contraseña</Button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h3 className="font-semibold mb-3">Autenticación de Dos Factores</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Agrega una capa extra de seguridad a tu cuenta
                    </p>
                    <Button variant="outline">Habilitar 2FA</Button>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h3 className="font-semibold mb-3 text-destructive">Zona de Peligro</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Eliminar tu cuenta es permanente y no se puede deshacer
                    </p>
                    <Button variant="destructive">Eliminar Cuenta</Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
