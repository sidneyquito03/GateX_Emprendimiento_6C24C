import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Wallet, 
  Plus, 
  Trash2, 
  Shield, 
  Check,
  Bitcoin,
  DollarSign,
  Smartphone,
  AlertCircle,
  LockKeyhole
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet' | 'crypto';
  name: string;
  details: string;
  isDefault: boolean;
}

interface PaymentMethodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'fan' | 'reseller' | 'organizer';
  onPaymentConfirmed?: () => void;
}

export const PaymentMethodsModal = ({ isOpen, onClose, userRole, onPaymentConfirmed }: PaymentMethodsModalProps) => {
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa terminada en 4532',
      details: '**** **** **** 4532',
      isDefault: true
    }
  ]);

  const [newCard, setNewCard] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const [newWallet, setNewWallet] = useState({
    address: '',
    type: 'metamask'
  });

  const addCard = () => {
    console.log("🔥 addCard ejecutándose", { newCard, userRole });
    
    if (!newCard.number || !newCard.name || !newCard.expiry || !newCard.cvv) {
      toast({
        title: "Datos incompletos",
        description: "Por favor completa todos los campos de la tarjeta",
        variant: "destructive"
      });
      return;
    }

    const method: PaymentMethod = {
      id: Date.now().toString(),
      type: 'card',
      name: `${newCard.number.slice(-4)} - ${newCard.name}`,
      details: `**** **** **** ${newCard.number.slice(-4)}`,
      isDefault: paymentMethods.length === 0
    };

    setPaymentMethods([...paymentMethods, method]);
    setNewCard({ number: '', name: '', expiry: '', cvv: '' });
    
    toast({
      title: "Tarjeta agregada",
      description: "Tu método de pago ha sido agregado exitosamente",
    });

    // Si estamos en proceso de compra, procesar el pago inmediatamente
    if (onPaymentConfirmed) {
      onPaymentConfirmed();
      onClose();
    }
  };

  const addWallet = () => {
    console.log("🔥 addWallet ejecutándose", { newWallet, userRole });
    
    if (!newWallet.address) {
      toast({
        title: "Dirección requerida",
        description: "Por favor ingresa la dirección de tu wallet",
        variant: "destructive"
      });
      return;
    }

    const method: PaymentMethod = {
      id: Date.now().toString(),
      type: 'wallet',
      name: `${newWallet.type} - ${newWallet.address.slice(0, 6)}...${newWallet.address.slice(-4)}`,
      details: newWallet.address,
      isDefault: paymentMethods.length === 0
    };

    setPaymentMethods([...paymentMethods, method]);
    setNewWallet({ address: '', type: 'metamask' });
    
    toast({
      title: "Wallet agregada",
      description: "Tu wallet ha sido conectada exitosamente",
    });

    // Si estamos en proceso de compra, procesar el pago inmediatamente
    if (onPaymentConfirmed) {
      onPaymentConfirmed();
      onClose();
    }
  };

  const removeMethod = (id: string) => {
    setPaymentMethods(methods => methods.filter(m => m.id !== id));
    toast({
      title: "Método eliminado",
      description: "El método de pago ha sido eliminado",
    });
  };

  const setDefault = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(m => ({ ...m, isDefault: m.id === id }))
    );
    toast({
      title: "Método predeterminado actualizado",
      description: "Se ha establecido como método de pago predeterminado",
    });
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'card': return <CreditCard className="h-5 w-5" />;
      case 'wallet': return <Wallet className="h-5 w-5" />;
      case 'crypto': return <Bitcoin className="h-5 w-5" />;
      default: return <DollarSign className="h-5 w-5" />;
    }
  };

  const roleSpecificMethods = {
    fan: ['card', 'wallet'], // Solo métodos básicos para fans
    reseller: ['card', 'wallet', 'crypto'], // Revendedores pueden usar crypto para diversificar
    organizer: ['business', 'bank'] // Solo organizadores manejan cuentas empresariales
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl glass-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            {userRole === 'organizer' ? 'Métodos de Cobro' : 'Métodos de Pago'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mensaje explicativo según el rol */}
          <div className={`p-4 rounded-lg border ${
            userRole === 'fan' ? 'bg-blue-50 border-blue-200' :
            userRole === 'reseller' ? 'bg-purple-50 border-purple-200' :
            'bg-green-50 border-green-200'
          }`}>
            <p className={`text-sm ${
              userRole === 'fan' ? 'text-blue-800' :
              userRole === 'reseller' ? 'text-purple-800' :
              'text-green-800'
            }`}>
              {userRole === 'fan' && (
                <>
                  <strong>👤 Métodos para Fans:</strong> Configura tus tarjetas de crédito/débito o wallets digitales para comprar entradas de forma segura.
                </>
              )}
              {userRole === 'reseller' && (
                <>
                  <strong>💼 Métodos para Revendedores:</strong> Usa tarjetas, wallets o criptomonedas para comprar entradas que podrás revender. No necesitas cuentas empresariales.
                </>
              )}
              {userRole === 'organizer' && (
                <>
                  <strong>🏛️ Métodos para Organizadores:</strong> Configura tus cuentas empresariales y bancarias para recibir los pagos de las entradas vendidas.
                </>
              )}
            </p>
          </div>

          {/* Métodos existentes */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {userRole === 'organizer' ? 'Cuentas de Cobro Configuradas' : 'Métodos de Pago Guardados'}
            </h3>
            <div className="grid gap-3">
              {paymentMethods.map((method) => (
                <Card key={method.id} className={`${method.isDefault ? 'border-primary' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getMethodIcon(method.type)}
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-muted-foreground">{method.details}</p>
                        </div>
                        {method.isDefault && (
                          <Badge variant="default">Predeterminado</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {/* Solo mostrar botón de pago si hay callback (estamos en proceso de compra) */}
                        {onPaymentConfirmed && userRole !== 'organizer' && (
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => {
                              onPaymentConfirmed();
                              onClose();
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            💳 Pagar con este método
                          </Button>
                        )}
                        {!method.isDefault && (
                          <Button variant="outline" size="sm" onClick={() => setDefault(method.id)}>
                            Hacer predeterminado
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => removeMethod(method.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Agregar nuevos métodos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {userRole === 'organizer' ? 'Agregar Método de Cobro' : 'Agregar Método de Pago'}
            </h3>
            
            <Tabs defaultValue="card">
              <TabsList className={`grid w-full ${
                userRole === 'fan' ? 'grid-cols-2' : 
                userRole === 'reseller' ? 'grid-cols-3' : 
                'grid-cols-2'
              }`}>
                {/* FANS: Solo tarjeta y wallet */}
                {userRole === 'fan' && (
                  <>
                    <TabsTrigger value="card">Tarjeta</TabsTrigger>
                    <TabsTrigger value="wallet">Wallet</TabsTrigger>
                  </>
                )}
                
                {/* REVENDEDORES: Tarjeta, wallet y crypto (NO empresarial) */}
                {userRole === 'reseller' && (
                  <>
                    <TabsTrigger value="card">Tarjeta</TabsTrigger>
                    <TabsTrigger value="wallet">Wallet</TabsTrigger>
                    <TabsTrigger value="crypto">Crypto</TabsTrigger>
                  </>
                )}
                
                {/* ORGANIZADORES: Solo métodos empresariales */}
                {userRole === 'organizer' && (
                  <>
                    <TabsTrigger value="business">Cuenta Empresarial</TabsTrigger>
                    <TabsTrigger value="bank">Cuenta Bancaria</TabsTrigger>
                  </>
                )}
              </TabsList>

              {/* TABS PARA FANS Y REVENDEDORES */}
              {(userRole === 'fan' || userRole === 'reseller') && (
                <>
                  <TabsContent value="card" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          Agregar Tarjeta de Crédito/Débito
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Número de tarjeta</Label>
                            <Input 
                              placeholder="Ingresa el número de tu tarjeta"
                              value={newCard.number}
                              onChange={(e) => setNewCard({...newCard, number: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label>Nombre en la tarjeta</Label>
                            <Input 
                              placeholder="Introduce tu nombre completo"
                              value={newCard.name}
                              onChange={(e) => setNewCard({...newCard, name: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label>Fecha de vencimiento</Label>
                            <Input 
                              placeholder="MM/AA"
                              value={newCard.expiry}
                              onChange={(e) => setNewCard({...newCard, expiry: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label>CVV</Label>
                            <Input 
                              placeholder="Código de seguridad"
                              type="password"
                              value={newCard.cvv}
                              onChange={(e) => setNewCard({...newCard, cvv: e.target.value})}
                            />
                          </div>
                        </div>
                        <Button onClick={addCard} className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Tarjeta
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="wallet" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Wallet className="h-5 w-5" />
                          Conectar Wallet Digital
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Tipo de Wallet</Label>
                          <select 
                            className="w-full p-2 border rounded-md"
                            value={newWallet.type}
                            onChange={(e) => setNewWallet({...newWallet, type: e.target.value})}
                          >
                            <option value="metamask">MetaMask</option>
                            <option value="trust">Trust Wallet</option>
                            <option value="coinbase">Coinbase Wallet</option>
                          </select>
                        </div>
                        <div>
                          <Label>Dirección de Wallet</Label>
                          <Input 
                            placeholder="Ingresa la dirección de tu wallet"
                            value={newWallet.address}
                            onChange={(e) => setNewWallet({...newWallet, address: e.target.value})}
                          />
                        </div>
                        <Button onClick={addWallet} className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Conectar Wallet
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* SOLO PARA REVENDEDORES: Crypto */}
                  {userRole === 'reseller' && (
                    <TabsContent value="crypto" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Bitcoin className="h-5 w-5" />
                            Agregar Criptomoneda
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label>Tipo de Criptomoneda</Label>
                            <select className="w-full p-2 border rounded-md">
                              <option value="bitcoin">Bitcoin (BTC)</option>
                              <option value="ethereum">Ethereum (ETH)</option>
                              <option value="usdt">USDT</option>
                              <option value="usdc">USDC</option>
                            </select>
                          </div>
                          <div>
                            <Label>Dirección de Wallet Crypto</Label>
                            <Input placeholder="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" />
                          </div>
                          <Button className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Criptomoneda
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  )}
                </>
              )}

              {/* TABS SOLO PARA ORGANIZADORES */}
              {userRole === 'organizer' && (
                <>
                  <TabsContent value="business" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Cuenta Empresarial de Cobro
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>RUC/RUT Empresarial</Label>
                            <Input placeholder="20123456789" />
                          </div>
                          <div>
                            <Label>Razón Social</Label>
                            <Input placeholder="Mi Empresa SAC" />
                          </div>
                          <div>
                            <Label>Banco</Label>
                            <select className="w-full p-2 border rounded-md">
                              <option>BCP</option>
                              <option>BBVA</option>
                              <option>Scotiabank</option>
                              <option>Interbank</option>
                            </select>
                          </div>
                          <div>
                            <Label>Número de Cuenta</Label>
                            <Input placeholder="191-123456789-0-12" />
                          </div>
                        </div>
                        <Button className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Configurar Cuenta de Cobro
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="bank" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5" />
                          Cuenta Bancaria Empresarial
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Banco</Label>
                            <select className="w-full p-2 border rounded-md">
                              <option>Banco de Crédito del Perú (BCP)</option>
                              <option>BBVA Continental</option>
                              <option>Scotiabank Perú</option>
                              <option>Interbank</option>
                              <option>Banco de la Nación</option>
                            </select>
                          </div>
                          <div>
                            <Label>Tipo de Cuenta</Label>
                            <select className="w-full p-2 border rounded-md">
                              <option>Cuenta Corriente</option>
                              <option>Cuenta de Ahorros</option>
                              <option>Cuenta CTS</option>
                            </select>
                          </div>
                          <div>
                            <Label>Número de Cuenta</Label>
                            <Input placeholder="Ingresa tu número de cuenta" />
                          </div>
                          <div>
                            <Label>Código CCI</Label>
                            <Input placeholder="Ingresa tu código interbancario" />
                          </div>
                        </div>
                        <Button className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Cuenta Bancaria
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>

          {/* Información de seguridad */}
          <Card className="border-accent/20 bg-accent/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold">Seguridad Garantizada</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Todos tus datos de pago están encriptados con tecnología de grado bancario y 
                    protegidos por blockchain. {userRole === 'organizer' ? 'Los cobros se procesan automáticamente según los términos del evento.' : 'Nunca almacenamos información sensible en nuestros servidores.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};