import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Lock, ArrowRight, CheckCircle2, Users, TrendingUp } from "lucide-react";
import gatexLogo from "@/assets/gatex-logo.png";

const Simbiosis = () => {
  const steps = [
    {
      number: "01",
      title: "Cliente Paga",
      description: "El comprador realiza el pago del ticket. El dinero NO va directamente al vendedor.",
      icon: Users,
    },
    {
      number: "02",
      title: "Smart Contract Guarda Fondos",
      description: "Los fondos se almacenan de forma segura en un smart contract blockchain. Nadie puede tocarlos.",
      icon: Lock,
    },
    {
      number: "03",
      title: "Evento Completado",
      description: "Una vez que el evento ocurre y se valida la asistencia, el sistema lo detecta automáticamente.",
      icon: CheckCircle2,
    },
    {
      number: "04",
      title: "Fondos Liberados",
      description: "El smart contract libera automáticamente el pago al organizador. Todo es transparente y verificable.",
      icon: TrendingUp,
    },
  ];

  const benefits = [
    {
      title: "Cero Fraude",
      description: "Los tickets son NFTs únicos e infalsificables. Cada ticket tiene una identidad digital verificable en blockchain.",
    },
    {
      title: "Protección del Comprador",
      description: "Si el evento se cancela o hay problemas, recibes tu dinero de vuelta automáticamente. Sin intermediarios.",
    },
    {
      title: "Reventa Transparente",
      description: "El sistema limita el precio de reventa (+5% máximo) y distribuye comisiones justas entre todas las partes.",
    },
    {
      title: "Trazabilidad Total",
      description: "Cada transacción queda registrada en blockchain. Puedes verificar el historial completo de cualquier ticket.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Hero */}
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="flex items-center justify-center gap-6 mb-6">
              <img src={gatexLogo} alt="GateX" className="h-32 w-32 animate-pulse-glow" />
              <h1 className="text-5xl md:text-6xl font-bold text-gradient">GateX</h1>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sistema de Custodia Cíclica
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Un sistema de custodia cíclica de fondos que protege a compradores y vendedores 
              mediante contratos inteligentes en blockchain
            </p>
          </div>

          {/* Main Concept */}
          <Card className="glass-card p-8 mb-12 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-2xl font-bold mb-4 text-center">El Principio de Custodia Cíclica</h2>
            <p className="text-foreground/80 text-center max-w-2xl mx-auto mb-8">
              En GateX, tu dinero no va directamente al vendedor. En su lugar, se almacena 
              de forma segura en un contrato inteligente hasta que se cumplan todas las condiciones 
              del evento. Esto elimina el riesgo y genera confianza absoluta.
            </p>
            
            <div className="bg-background/50 rounded-lg p-6 border border-border/50">
              <p className="text-center text-lg font-semibold text-primary">
                "La confianza no se promete, se programa"
              </p>
            </div>
          </Card>

          {/* Process Steps */}
          <div className="mb-16 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-3xl font-bold text-center mb-12">¿Cómo Funciona?</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <Card className="glass-card p-6 h-full glow-on-hover">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                          <step.icon className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-4xl font-bold text-primary/20">{step.number}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </Card>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden md:flex absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-8 w-8 text-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-16 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <h2 className="text-3xl font-bold text-center mb-12">Beneficios de GateX</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="glass-card p-6 glow-on-hover">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <h3 className="text-xl font-semibold">{benefit.title}</h3>
                  </div>
                  <p className="text-muted-foreground ml-9">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Technical Explanation */}
          <Card className="glass-card p-8 border-primary/20 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <h2 className="text-2xl font-bold mb-6 text-center">Tecnología Blockchain</h2>
            <div className="space-y-4 text-foreground/80">
              <p>
                <strong className="text-primary">NFTs (Non-Fungible Tokens):</strong> Cada ticket es un token único 
                que no puede ser duplicado ni falsificado. Esto garantiza la autenticidad de cada entrada.
              </p>
              <p>
                <strong className="text-primary">Smart Contracts:</strong> Contratos programables que ejecutan 
                automáticamente las condiciones acordadas. No hay intermediarios humanos que puedan manipular el proceso.
              </p>
              <p>
                <strong className="text-primary">Custodia Descentralizada:</strong> Los fondos se almacenan en 
                la blockchain, no en una cuenta bancaria tradicional. Esto elimina el riesgo de que alguien huya con el dinero.
              </p>
              <p>
                <strong className="text-primary">Transparencia Total:</strong> Todas las transacciones son públicas 
                y verificables. Puedes auditar el sistema en cualquier momento.
              </p>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Simbiosis;
