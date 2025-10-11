import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Upload, 
  Camera, 
  Check, 
  X, 
  IdCard, 
  Building2, 
  Phone, 
  Mail,
  Eye,
  EyeOff,
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrganizerVerificationProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const OrganizerVerification = ({ onSuccess, onCancel }: OrganizerVerificationProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationData, setVerificationData] = useState({
    // Datos personales
    fullName: "",
    dni: "",
    phone: "",
    email: "",
    
    // Datos de empresa/organización
    organizationName: "",
    organizationType: "",
    ruc: "",
    address: "",
    
    // Documentos
    dniPhoto: null as File | null,
    selfiePhoto: null as File | null,
    organizationDocument: null as File | null,
    
    // Verificación adicional
    adminCode: "",
    twoFactorCode: "",
    
    // Experiencia
    experience: "",
    previousEvents: "",
  });

  const handleFileUpload = (field: string, file: File | null) => {
    setVerificationData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    console.log("=== DEBUG VERIFICACIÓN ===");
    console.log("Código ingresado:", verificationData.adminCode);
    console.log("Código esperado: GATEX-ADMIN-2025");
    console.log("Datos completos:", {
      fullName: verificationData.fullName,
      dni: verificationData.dni,
      organizationName: verificationData.organizationName,
      dniPhoto: !!verificationData.dniPhoto,
      selfiePhoto: !!verificationData.selfiePhoto
    });
    
    // Validaciones
    if (!verificationData.fullName || !verificationData.dni || !verificationData.organizationName) {
      console.log("❌ Faltan datos personales/organización");
      toast({
        title: "Datos incompletos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    if (verificationData.adminCode !== "GATEX-ADMIN-2025") {
      console.log("❌ Código incorrecto");
      toast({
        title: "Código de administrador incorrecto",
        description: `Ingresaste: "${verificationData.adminCode}" - Debe ser exactamente: "GATEX-ADMIN-2025"`,
        variant: "destructive",
      });
      return;
    }

    // CAMBIO: Hacemos que los documentos sean opcionales para demo
    if (!verificationData.dniPhoto || !verificationData.selfiePhoto) {
      console.log("⚠️ Documentos faltantes, pero continuando para demo");
      toast({
        title: "⚠️ Documentos faltantes",
        description: "Para esta demo continuaremos sin documentos, pero en producción serían obligatorios",
        variant: "default",
      });
      // No hacemos return, continuamos
    }

    // Simular verificación exitosa
    console.log("✅ Verificación exitosa - mostrando toast");
    toast({
      title: "✅ Verificación exitosa",
      description: "Has sido verificado como organizador autorizado de GateX",
    });

    // Guardar datos de verificación
    console.log("💾 Guardando en localStorage");
    localStorage.setItem("organizerVerification", JSON.stringify({
      ...verificationData,
      verificationDate: new Date().toISOString(),
      status: "verified"
    }));

    console.log("🎯 Llamando onSuccess()");
    onSuccess();
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl glass-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Verificación de Organizador - Paso {step}/4
          </DialogTitle>
        </DialogHeader>

        {/* Paso 1: Datos Personales */}
        {step === 1 && (
          <div className="space-y-4">
            <Card className="p-4 border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <IdCard className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Información Personal</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Necesitamos verificar tu identidad antes de otorgarte permisos de organizador
              </p>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Nombre Completo *</Label>
                <Input
                  id="fullName"
                  value={verificationData.fullName}
                  onChange={(e) => setVerificationData(prev => ({...prev, fullName: e.target.value}))}
                  placeholder="Juan Pérez García"
                />
              </div>
              <div>
                <Label htmlFor="dni">DNI *</Label>
                <Input
                  id="dni"
                  value={verificationData.dni}
                  onChange={(e) => setVerificationData(prev => ({...prev, dni: e.target.value}))}
                  placeholder="12345678"
                  maxLength={8}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  value={verificationData.phone}
                  onChange={(e) => setVerificationData(prev => ({...prev, phone: e.target.value}))}
                  placeholder="+51 987654321"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={verificationData.email}
                  onChange={(e) => setVerificationData(prev => ({...prev, email: e.target.value}))}
                  placeholder="juan@empresa.com"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleNext}>
                Siguiente
              </Button>
            </div>
          </div>
        )}

        {/* Paso 2: Datos de Organización */}
        {step === 2 && (
          <div className="space-y-4">
            <Card className="p-4 border border-accent/20 bg-accent/5">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-accent" />
                <h3 className="font-semibold">Información de Organización</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Cuéntanos sobre tu empresa u organización
              </p>
            </Card>

            <div>
              <Label htmlFor="organizationName">Nombre de la Organización *</Label>
              <Input
                id="organizationName"
                value={verificationData.organizationName}
                onChange={(e) => setVerificationData(prev => ({...prev, organizationName: e.target.value}))}
                placeholder="Eventos Deportivos SAC"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organizationType">Tipo de Organización</Label>
                <Input
                  id="organizationType"
                  value={verificationData.organizationType}
                  onChange={(e) => setVerificationData(prev => ({...prev, organizationType: e.target.value}))}
                  placeholder="SAC, EIRL, Asociación, etc."
                />
              </div>
              <div>
                <Label htmlFor="ruc">RUC (opcional)</Label>
                <Input
                  id="ruc"
                  value={verificationData.ruc}
                  onChange={(e) => setVerificationData(prev => ({...prev, ruc: e.target.value}))}
                  placeholder="20123456789"
                  maxLength={11}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={verificationData.address}
                onChange={(e) => setVerificationData(prev => ({...prev, address: e.target.value}))}
                placeholder="Av. Javier Prado Este 4200, Surco, Lima"
              />
            </div>

            <div>
              <Label htmlFor="experience">Experiencia Organizando Eventos</Label>
              <Textarea
                id="experience"
                value={verificationData.experience}
                onChange={(e) => setVerificationData(prev => ({...prev, experience: e.target.value}))}
                placeholder="Describe tu experiencia previa organizando eventos deportivos..."
                rows={3}
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Anterior
              </Button>
              <Button onClick={handleNext}>
                Siguiente
              </Button>
            </div>
          </div>
        )}

        {/* Paso 3: Subir Documentos */}
        {step === 3 && (
          <div className="space-y-4">
            <Card className="p-4 border border-orange/20 bg-orange/5">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="h-5 w-5 text-orange" />
                <h3 className="font-semibold">Documentos de Verificación</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Sube los documentos necesarios para verificar tu identidad
              </p>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              {/* DNI Photo */}
              <Card className="p-4">
                <div className="text-center">
                  <IdCard className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <h4 className="font-semibold mb-2">Foto del DNI</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Sube una foto clara de ambas caras de tu DNI
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('dniPhoto', e.target.files?.[0] || null)}
                    className="hidden"
                    id="dni-upload"
                  />
                  <label htmlFor="dni-upload">
                    <Button variant="outline" className="w-full" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        {verificationData.dniPhoto ? "Cambiar archivo" : "Subir DNI"}
                      </span>
                    </Button>
                  </label>
                  {verificationData.dniPhoto && (
                    <Badge className="mt-2 bg-success/20 text-success">
                      <Check className="h-3 w-3 mr-1" />
                      DNI subido
                    </Badge>
                  )}
                </div>
              </Card>

              {/* Selfie */}
              <Card className="p-4">
                <div className="text-center">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <h4 className="font-semibold mb-2">Selfie de Verificación</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Toma una selfie sosteniendo tu DNI junto a tu rostro
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('selfiePhoto', e.target.files?.[0] || null)}
                    className="hidden"
                    id="selfie-upload"
                  />
                  <label htmlFor="selfie-upload">
                    <Button variant="outline" className="w-full" asChild>
                      <span>
                        <Camera className="h-4 w-4 mr-2" />
                        {verificationData.selfiePhoto ? "Cambiar selfie" : "Tomar selfie"}
                      </span>
                    </Button>
                  </label>
                  {verificationData.selfiePhoto && (
                    <Badge className="mt-2 bg-success/20 text-success">
                      <Check className="h-3 w-3 mr-1" />
                      Selfie tomada
                    </Badge>
                  )}
                </div>
              </Card>
            </div>

            {/* Documento de organización (opcional) */}
            <Card className="p-4">
              <div className="text-center">
                <Building2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <h4 className="font-semibold mb-2">Documento de Organización (Opcional)</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Constitución de empresa, carta de representación, etc.
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload('organizationDocument', e.target.files?.[0] || null)}
                  className="hidden"
                  id="org-upload"
                />
                <label htmlFor="org-upload">
                  <Button variant="outline" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {verificationData.organizationDocument ? "Cambiar documento" : "Subir documento"}
                    </span>
                  </Button>
                </label>
                {verificationData.organizationDocument && (
                  <Badge className="mt-2 bg-success/20 text-success">
                    <Check className="h-3 w-3 mr-1" />
                    Documento subido
                  </Badge>
                )}
              </div>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Anterior
              </Button>
              <Button onClick={handleNext}>
                Siguiente
              </Button>
            </div>
          </div>
        )}

        {/* Paso 4: Verificación Final */}
        {step === 4 && (
          <div className="space-y-4">
            <Card className="p-4 border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Verificación Final</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Completa la verificación de seguridad para activar tu cuenta de organizador
              </p>
            </Card>

            <div>
              <Label htmlFor="adminCode">Código de Administrador *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="adminCode"
                  type={showPassword ? "text" : "password"}
                  value={verificationData.adminCode}
                  onChange={(e) => setVerificationData(prev => ({...prev, adminCode: e.target.value}))}
                  placeholder="Código proporcionado por GateX"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">
                  Para demo, usa: <code className="bg-muted px-1 rounded">GATEX-ADMIN-2025</code>
                </p>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => setVerificationData(prev => ({...prev, adminCode: "GATEX-ADMIN-2025"}))}
                >
                  Usar código demo
                </Button>
              </div>
            </div>

            <Card className="p-4 border border-accent/20">
              <h4 className="font-semibold mb-2">Resumen de Verificación</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Datos personales:</span>
                  <Badge className={verificationData.fullName ? "bg-success/20 text-success" : "bg-muted"}>
                    {verificationData.fullName ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Datos de organización:</span>
                  <Badge className={verificationData.organizationName ? "bg-success/20 text-success" : "bg-muted"}>
                    {verificationData.organizationName ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>DNI subido:</span>
                  <Badge className={verificationData.dniPhoto ? "bg-success/20 text-success" : "bg-muted"}>
                    {verificationData.dniPhoto ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Selfie tomada:</span>
                  <Badge className={verificationData.selfiePhoto ? "bg-success/20 text-success" : "bg-muted"}>
                    {verificationData.selfiePhoto ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  </Badge>
                </div>
              </div>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Anterior
              </Button>
              <div className="flex gap-2">
                <Button 
                  onClick={handleSubmit}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Completar Verificación
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};