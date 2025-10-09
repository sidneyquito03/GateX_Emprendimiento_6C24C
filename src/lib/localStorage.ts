// LocalStorage utilities for GateX

export interface Ticket {
  id: string;
  eventName: string;
  eventDate: string;
  zone: string;
  status: "custody" | "released" | "resold";
  price: number;
  purchaseDate: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  description: string;
  zones: {
    name: string;
    price: number;
    available: number;
  }[];
}

export interface ResaleOffer {
  id: string;
  ticketId: string;
  eventName: string;
  zone: string;
  originalPrice: number;
  resalePrice: number;
  priceIncrease: number;
  status: "active" | "sold" | "cancelled";
  listedDate: string;
}

// Tickets functions
export const getTickets = (): Ticket[] => {
  const tickets = localStorage.getItem("gatex_tickets");
  return tickets ? JSON.parse(tickets) : [];
};

export const saveTicket = (ticket: Ticket): void => {
  const tickets = getTickets();
  tickets.push(ticket);
  localStorage.setItem("gatex_tickets", JSON.stringify(tickets));
};

export const updateTicket = (ticketId: string, updates: Partial<Ticket>): void => {
  const tickets = getTickets();
  const index = tickets.findIndex(t => t.id === ticketId);
  if (index !== -1) {
    tickets[index] = { ...tickets[index], ...updates };
    localStorage.setItem("gatex_tickets", JSON.stringify(tickets));
  }
};

export const deleteTicket = (ticketId: string): void => {
  const tickets = getTickets().filter(t => t.id !== ticketId);
  localStorage.setItem("gatex_tickets", JSON.stringify(tickets));
};

// Events functions
export const getEvents = (): Event[] => {
  const events = localStorage.getItem("gatex_events");
  if (!events) {
    // Initialize with default events
    const defaultEvents: Event[] = [
      {
        id: "1",
        title: "Final Copa América 2025",
        date: "15 Julio 2025, 20:00",
        location: "Estadio Monumental, Buenos Aires",
        image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&h=600&fit=crop",
        description: "¡No te pierdas la gran final de la Copa América 2025!",
        zones: [
          { name: "Tribuna VIP", price: 250, available: 50 },
          { name: "Platea Alta", price: 120, available: 200 },
          { name: "Platea Baja", price: 180, available: 150 },
          { name: "Campo", price: 80, available: 500 },
        ],
      },
      {
        id: "2",
        title: "Clásico River vs Boca",
        date: "22 Junio 2025, 18:00",
        location: "Estadio River Plate, Buenos Aires",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=600&fit=crop",
        description: "El clásico más apasionante del fútbol argentino",
        zones: [
          { name: "Platea VIP", price: 180, available: 80 },
          { name: "Tribuna", price: 100, available: 300 },
        ],
      },
    ];
    localStorage.setItem("gatex_events", JSON.stringify(defaultEvents));
    return defaultEvents;
  }
  return JSON.parse(events);
};

export const saveEvent = (event: Event): void => {
  const events = getEvents();
  events.push(event);
  localStorage.setItem("gatex_events", JSON.stringify(events));
};

export const updateEvent = (eventId: string, updates: Partial<Event>): void => {
  const events = getEvents();
  const index = events.findIndex(e => e.id === eventId);
  if (index !== -1) {
    events[index] = { ...events[index], ...updates };
    localStorage.setItem("gatex_events", JSON.stringify(events));
  }
};

// Resale offers functions
export const getResaleOffers = (): ResaleOffer[] => {
  const offers = localStorage.getItem("gatex_resale_offers");
  return offers ? JSON.parse(offers) : [];
};

export const saveResaleOffer = (offer: ResaleOffer): void => {
  const offers = getResaleOffers();
  offers.push(offer);
  localStorage.setItem("gatex_resale_offers", JSON.stringify(offers));
};

export const updateResaleOffer = (offerId: string, updates: Partial<ResaleOffer>): void => {
  const offers = getResaleOffers();
  const index = offers.findIndex(o => o.id === offerId);
  if (index !== -1) {
    offers[index] = { ...offers[index], ...updates };
    localStorage.setItem("gatex_resale_offers", JSON.stringify(offers));
  }
};

export const deleteResaleOffer = (offerId: string): void => {
  const offers = getResaleOffers().filter(o => o.id !== offerId);
  localStorage.setItem("gatex_resale_offers", JSON.stringify(offers));
};

// User stats
export const getUserStats = () => {
  const tickets = getTickets();
  const resaleOffers = getResaleOffers();
  
  const fundsInCustody = tickets
    .filter(t => t.status === "custody")
    .reduce((sum, t) => sum + t.price, 0);
  
  const activeTickets = tickets.filter(t => t.status !== "resold").length;
  
  const ticketsResold = tickets.filter(t => t.status === "resold").length;
  
  const activeOffers = resaleOffers.filter(o => o.status === "active").length;
  
  const salesRevenue = resaleOffers
    .filter(o => o.status === "sold")
    .reduce((sum, o) => sum + (o.resalePrice * 0.95), 0);

  return {
    fundsInCustody,
    activeTickets,
    ticketsResold,
    activeOffers,
    salesRevenue,
  };
};
