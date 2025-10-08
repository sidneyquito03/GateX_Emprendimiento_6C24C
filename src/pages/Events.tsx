import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventCard } from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Events = () => {
  const events = [
    {
      id: "1",
      title: "Final Copa América 2025",
      date: "15 Julio 2025, 20:00",
      location: "Estadio Monumental, Buenos Aires",
      image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=600&fit=crop",
      availableTickets: 1500,
      minPrice: 150,
    },
    {
      id: "2",
      title: "Clásico River vs Boca",
      date: "22 Junio 2025, 18:00",
      location: "Estadio Monumental, Buenos Aires",
      image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop",
      availableTickets: 800,
      minPrice: 80,
    },
    {
      id: "3",
      title: "Eliminatorias Mundial 2026",
      date: "10 Agosto 2025, 21:00",
      location: "Estadio Nacional, Santiago",
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=600&fit=crop",
      availableTickets: 2000,
      minPrice: 120,
    },
    {
      id: "4",
      title: "Racing vs Independiente",
      date: "5 Septiembre 2025, 19:00",
      location: "Estadio Cilindro, Avellaneda",
      image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=600&fit=crop",
      availableTickets: 600,
      minPrice: 60,
    },
    {
      id: "5",
      title: "Superclásico de América",
      date: "20 Octubre 2025, 17:00",
      location: "La Bombonera, Buenos Aires",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
      availableTickets: 500,
      minPrice: 200,
    },
    {
      id: "6",
      title: "Final Libertadores 2025",
      date: "25 Noviembre 2025, 20:00",
      location: "Estadio Centenario, Montevideo",
      image: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=800&h=600&fit=crop",
      availableTickets: 3000,
      minPrice: 300,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Eventos Disponibles</h1>
            <p className="text-muted-foreground">Descubre los próximos eventos deportivos</p>
          </div>

          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <div
                key={event.id}
                style={{ animationDelay: `${0.2 + index * 0.05}s` }}
              >
                <EventCard {...event} />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Events;
