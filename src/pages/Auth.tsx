import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Mail, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { saveUserProfile, getUserProfile, UserProfile } from "@/lib/localStorage";
import gatexLogo from "@/assets/gatex-logo.png";

// Debug para verificar la importación
console.log("🖼️ Logo disponible:", gatexLogo);

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email") as string;

    setTimeout(() => {
      // Verificar si ya existe un perfil
      let profile = getUserProfile();
      
      if (!profile) {
        // Crear perfil básico si no existe
        profile = {
          id: "user_" + Date.now(),
          name: "Usuario GateX",
          email: email || "usuario@gatex.com",
          phone: "+51 900 000 000",
          picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email || 'default'}`,
          authProvider: "email",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        saveUserProfile(profile);
      }

      localStorage.setItem("isAuthenticated", "true");
      toast({
        title: "¡Bienvenido de vuelta!",
        description: "Has iniciado sesión correctamente",
      });
      navigate("/role-selection");
      setIsLoading(false);
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    setTimeout(() => {
      // Crear perfil de usuario para registro normal
      const userProfile: UserProfile = {
        id: "user_" + Date.now(),
        name: name || "Usuario GateX",
        email: email || "usuario@gatex.com",
        phone: "+51 900 000 000", // Número por defecto peruano
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email || 'default'}`, // Avatar generado
        authProvider: "email",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("isAuthenticated", "true");
      saveUserProfile(userProfile);

      toast({
        title: "¡Cuenta creada!",
        description: "Tu cuenta ha sido creada exitosamente",
      });
      navigate("/role-selection");
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    // Simulación realista de autenticación con Google
    toast({
      title: "Conectando con Google...",
      description: "Redirigiendo a la autenticación de Google",
    });

    // Simular el proceso paso a paso
    setTimeout(() => {
      toast({
        title: "Autenticando...",
        description: "Verificando credenciales con Google",
      });
    }, 800);

    setTimeout(() => {
      // Simular datos del usuario de Google (usuarios peruanos)
      const googleUsers = [
        {
          name: "Juan Carlos Pérez Mamani",
          email: "juan.perez@gmail.com",
          phone: "+51 987 654 321",
          picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
          name: "María Isabel González Quispe",
          email: "maria.gonzalez@gmail.com",
          phone: "+51 976 543 210",
          picture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
          name: "Carlos Eduardo Rodriguez Vargas",
          email: "carlos.rodriguez@gmail.com",
          phone: "+51 965 432 109",
          picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
          name: "Ana Sofía Mendoza Huamán",
          email: "ana.mendoza@gmail.com",
          phone: "+51 954 321 098",
          picture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
          name: "Luis Antonio Silva Chávez",
          email: "luis.silva@gmail.com",
          phone: "+51 943 210 987",
          picture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
          name: "Carmen Rosa Torres Prado",
          email: "carmen.torres@gmail.com",
          phone: "+51 932 109 876",
          picture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        }
      ];

      // Seleccionar un usuario aleatorio para la simulación
      const randomUser = googleUsers[Math.floor(Math.random() * googleUsers.length)];

      // Crear perfil de usuario completo
      const userProfile: UserProfile = {
        id: "user_" + Date.now(),
        name: randomUser.name,
        email: randomUser.email,
        phone: randomUser.phone,
        picture: randomUser.picture,
        authProvider: "google",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Guardar en localStorage
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userGoogleData", JSON.stringify(randomUser)); // Mantener compatibilidad
      saveUserProfile(userProfile);

      toast({
        title: "¡Bienvenido!",
        description: `Autenticación exitosa como ${randomUser.name}`,
      });

      navigate("/role-selection");
      setIsLoading(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-16 w-1 h-1 bg-accent/40 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-10 w-1 h-1 bg-accent/30 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-1/3 left-1/4 w-0.5 h-0.5 bg-primary/25 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-2/3 right-1/3 w-0.5 h-0.5 bg-accent/35 rounded-full animate-pulse" style={{animationDelay: '2.5s'}}></div>
      </div>

      <Card className="w-full max-w-md glass-card px-8 py-4 animate-scale-in relative z-10 shadow-2xl border-primary/20">
        <div className="flex flex-col items-center mb-4 animate-float">
          {/* Logo con estilo del rol selection */}
          <div className="mt-8 mb-4">
            <img 
              src={gatexLogo} 
              alt="GateX Logo" 
              className="h-24 w-24 mx-auto" 
              onError={(e) => {
                console.error("❌ Error loading logo");
                // Reemplazar con fallback
                e.currentTarget.outerHTML = `
                  <div class="h-24 w-24 mx-auto bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                    <div class="text-center">
                      <div class="text-xl">G</div>
                      <div class="text-base">X</div>
                    </div>
                  </div>
                `;
              }}
              onLoad={() => console.log("✅ Logo cargado")}
            />
          </div>
          
          {/* Título con efecto premium */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse-glow">
              GateX
            </h1>
            <div className="flex items-center gap-2 justify-center">
              <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent flex-1"></div>
              <p className="text-xs text-muted-foreground/90 font-medium tracking-widest uppercase px-3">
                Seguridad garantizada por blockchain
              </p>
              <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent flex-1"></div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">O continuar con</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full hover:bg-gray-50 transition-colors"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    Conectando con Google...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC04"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continuar con Google
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Juan Pérez"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">O registrarse con</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full hover:bg-gray-50 transition-colors mb-4"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    Conectando con Google...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC04"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Registrarse con Google
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Al registrarte, aceptas nuestros Términos y Condiciones y Política de Privacidad
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
