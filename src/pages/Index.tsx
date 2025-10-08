import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield, Lock, TrendingUp, CheckCircle2, Star, Users } from "lucide-react";

const Index = () => {
  const benefits = [
    {
      icon: Shield,
      title: "Entradas Infalsificables",
      description: "Cada ticket es un NFT único verificado en blockchain",
    },
    {
      icon: Lock,
      title: "Pagos en Custodia",
      description: "Tu dinero está seguro hasta que el evento se complete",
    },
    {
      icon: TrendingUp,
      title: "Reventa Justa",
      description: "Revende tu ticket con límites justos y transparentes",
    },
  ];

  const testimonials = [
    {
      name: "Javier M.",
      role: "Fanático",
      text: "Finalmente puedo comprar tickets sin miedo a estafas. La custodia me da total tranquilidad.",
      rating: 5,
    },
    {
      name: "Carlos R.",
      role: "Organizador",
      text: "Control total sobre la reventa y comisiones. La plataforma perfecta para eventos deportivos.",
      rating: 5,
    },
    {
      name: "Ana L.",
      role: "Fanática",
      text: "Revendí mi ticket de forma segura cuando no pude asistir. Proceso simple y rápido.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Compra, vende y valida tus entradas con{" "}
            <span className="text-gradient">total seguridad</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            La confianza del fan, garantizada por blockchain
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/events">
              <Button variant="hero" size="xl">
                Explorar Eventos
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="glass" size="xl">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            ¿Por qué elegir SIMBIOSIS?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="glass-card p-8 text-center space-y-4 glow-on-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Lo que dicen nuestros usuarios
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="glass-card p-6 space-y-4 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/90 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para comprar con confianza?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Únete a miles de fans que ya disfrutan de la seguridad de blockchain
          </p>
          <Link to="/events">
            <Button variant="hero" size="xl">
              Ver Eventos Disponibles
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
