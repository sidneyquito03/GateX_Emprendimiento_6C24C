// LocalStorage utilities for GateX

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dni?: string;
  picture?: string;
  profileImage?: string;
  bio?: string;
  location?: string;
  authProvider: "google" | "email";
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  eventName: string;
  eventDate: string;
  zone: string;
  status: "custody" | "released" | "resold";
  price: number;
  purchaseDate: string;
  seat?: string;
  date?: string;
  seatNumbers?: string[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  description: string;
  category?: string;
  sport?: string;
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

export interface Transaction {
  id: string;
  type: "purchase" | "resale" | "refund";
  amount: number;
  eventName: string;
  status: "pending" | "completed" | "failed";
  date: string;
}

export interface AppSettings {
  theme: "light" | "dark";
  notifications: boolean;
  language: "es" | "en";
  currency: "PEN" | "USD";
}

// Storage keys
const STORAGE_KEYS = {
  USER_PROFILE: 'gatex_user_profile',
  USER_TICKETS: 'gatex_user_tickets',
  USER_EVENTS: 'gatex_user_events',
  RESALE_OFFERS: 'gatex_resale_offers',
  TRANSACTIONS: 'gatex_transactions',
  APP_SETTINGS: 'gatex_app_settings',
  ALL_EVENTS: 'gatex_all_events'
} as const;

// User Profile functions
export const getUserProfile = (): UserProfile | null => {
  const profile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  return profile ? JSON.parse(profile) : null;
};

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  localStorage.setItem("isAuthenticated", "true");
};

export const updateUserProfile = (updates: Partial<UserProfile>): UserProfile | null => {
  const profile = getUserProfile();
  if (!profile) return null;
  
  const updatedProfile = { ...profile, ...updates, updatedAt: new Date().toISOString() };
  saveUserProfile(updatedProfile);
  return updatedProfile;
};

export const clearUserData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  localStorage.removeItem(STORAGE_KEYS.USER_TICKETS);
  localStorage.removeItem(STORAGE_KEYS.USER_EVENTS);
  localStorage.removeItem(STORAGE_KEYS.RESALE_OFFERS);
  localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
  localStorage.removeItem("userGoogleData");
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("userRole");
};

// Tickets functions
export const getTickets = (): Ticket[] => {
  const tickets = localStorage.getItem(STORAGE_KEYS.USER_TICKETS);
  return tickets ? JSON.parse(tickets) : [];
};

export const saveTicket = (ticket: Ticket): void => {
  const tickets = getTickets();
  tickets.push(ticket);
  localStorage.setItem(STORAGE_KEYS.USER_TICKETS, JSON.stringify(tickets));
};

export const updateTicket = (ticketId: string, updates: Partial<Ticket>): void => {
  const tickets = getTickets();
  const index = tickets.findIndex(t => t.id === ticketId);
  if (index !== -1) {
    tickets[index] = { ...tickets[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.USER_TICKETS, JSON.stringify(tickets));
  }
};

export const deleteTicket = (ticketId: string): void => {
  const tickets = getTickets().filter(t => t.id !== ticketId);
  localStorage.setItem(STORAGE_KEYS.USER_TICKETS, JSON.stringify(tickets));
};

// Events functions (for global events)
export const getAllEvents = (): Event[] => {
  const events = localStorage.getItem(STORAGE_KEYS.ALL_EVENTS);
  if (!events) {
    const defaultEvents: Event[] = [
      {
        id: "1",
        title: "Final Copa América 2025",
        date: "15 Julio 2025, 20:00",
        location: "Estadio Nacional, Lima, Perú",
        image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&h=600&fit=crop",
        description: "¡No te pierdas la gran final de la Copa América 2025! El máximo torneo de selecciones sudamericanas llega a su clímax.",
        category: "deportivo",
        sport: "fútbol",
        zones: [
          { name: "Tribuna VIP", price: 250, available: 50 },
          { name: "Platea Alta", price: 120, available: 200 },
          { name: "Platea Baja", price: 180, available: 150 },
          { name: "Campo", price: 80, available: 500 },
        ],
      },
      {
        id: "2",
        title: "Clásico Universitario vs Alianza",
        date: "22 Junio 2025, 18:00",
        location: "Estadio Monumental, Lima, Perú",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=600&fit=crop",
        description: "El clásico más apasionante del fútbol peruano. Una rivalidad centenaria en el estadio más grande del país.",
        category: "deportivo",
        sport: "fútbol",
        zones: [
          { name: "Platea VIP", price: 180, available: 80 },
          { name: "Tribuna", price: 100, available: 300 },
        ],
      },
      {
        id: "3",
        title: "Liga Nacional de Voleibol - Final Femenina",
        date: "5 Agosto 2025, 19:00",
        location: "Polideportivo Nacional, Lima, Perú",
        image: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=1200&h=600&fit=crop",
        description: "La emocionante final del campeonato nacional de voleibol femenino. Las mejores atletas del país compiten por la corona.",
        category: "deportivo",
        sport: "voleibol",
        zones: [
          { name: "Palco Premium", price: 120, available: 40 },
          { name: "Tribuna Central", price: 80, available: 200 },
          { name: "General", price: 45, available: 400 },
        ],
      },
      {
        id: "4",
        title: "Eliminatorias Mundial 2026: Perú vs Brasil",
        date: "15 Noviembre 2025, 20:00",
        location: "Estadio Nacional, Lima, Perú",
        image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&h=600&fit=crop",
        description: "¡Partido decisivo de las Eliminatorias Sudamericanas! Perú recibe a Brasil en un encuentro que definirá el futuro mundialista de ambas selecciones.",
        category: "deportivo",
        sport: "fútbol",
        zones: [
          { name: "GENERAL", price: 50, available: 2500 },
          { name: "OCCIDENTE ALTA", price: 40, available: 800 },
          { name: "OCCIDENTE BAJA", price: 30, available: 1200 },
          { name: "ORIENTE ALTA", price: 25, available: 0 }, // Agotado
          { name: "ORIENTE BAJA", price: 25, available: 1200 },
          { name: "NORTE", price: 15, available: 3000 },
          { name: "SUR", price: 15, available: 3000 },
        ],
      },
    ];
    localStorage.setItem(STORAGE_KEYS.ALL_EVENTS, JSON.stringify(defaultEvents));
    return defaultEvents;
  }
  return JSON.parse(events);
};

// Events functions (created by user)
export const getUserEvents = (): Event[] => {
  const events = localStorage.getItem(STORAGE_KEYS.USER_EVENTS);
  return events ? JSON.parse(events) : [];
};

export const saveEvent = (event: Event): void => {
  const userEvents = getUserEvents();
  userEvents.push(event);
  localStorage.setItem(STORAGE_KEYS.USER_EVENTS, JSON.stringify(userEvents));
  
  const allEvents = getAllEvents();
  allEvents.push(event);
  localStorage.setItem(STORAGE_KEYS.ALL_EVENTS, JSON.stringify(allEvents));
};

export const updateEvent = (eventId: string, updates: Partial<Event>): void => {
  const userEvents = getUserEvents();
  const userIndex = userEvents.findIndex(e => e.id === eventId);
  if (userIndex !== -1) {
    userEvents[userIndex] = { ...userEvents[userIndex], ...updates };
    localStorage.setItem(STORAGE_KEYS.USER_EVENTS, JSON.stringify(userEvents));
  }
  
  const allEvents = getAllEvents();
  const allIndex = allEvents.findIndex(e => e.id === eventId);
  if (allIndex !== -1) {
    allEvents[allIndex] = { ...allEvents[allIndex], ...updates };
    localStorage.setItem(STORAGE_KEYS.ALL_EVENTS, JSON.stringify(allEvents));
  }
};

export const deleteEvent = (eventId: string): void => {
  const userEvents = getUserEvents().filter(e => e.id !== eventId);
  localStorage.setItem(STORAGE_KEYS.USER_EVENTS, JSON.stringify(userEvents));
  
  const allEvents = getAllEvents().filter(e => e.id !== eventId);
  localStorage.setItem(STORAGE_KEYS.ALL_EVENTS, JSON.stringify(allEvents));
};

// Resale offers functions
export const getResaleOffers = (): ResaleOffer[] => {
  const offers = localStorage.getItem(STORAGE_KEYS.RESALE_OFFERS);
  return offers ? JSON.parse(offers) : [];
};

export const saveResaleOffer = (offer: ResaleOffer): void => {
  const offers = getResaleOffers();
  offers.push(offer);
  localStorage.setItem(STORAGE_KEYS.RESALE_OFFERS, JSON.stringify(offers));
};

export const updateResaleOffer = (offerId: string, updates: Partial<ResaleOffer>): void => {
  const offers = getResaleOffers();
  const index = offers.findIndex(o => o.id === offerId);
  if (index !== -1) {
    offers[index] = { ...offers[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.RESALE_OFFERS, JSON.stringify(offers));
  }
};

export const deleteResaleOffer = (offerId: string): void => {
  const offers = getResaleOffers().filter(o => o.id !== offerId);
  localStorage.setItem(STORAGE_KEYS.RESALE_OFFERS, JSON.stringify(offers));
};

// Transactions functions
export const getTransactions = (): Transaction[] => {
  const transactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return transactions ? JSON.parse(transactions) : [];
};

export const saveTransaction = (transaction: Transaction): void => {
  const transactions = getTransactions();
  transactions.unshift(transaction);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const updateTransaction = (transactionId: string, updates: Partial<Transaction>): void => {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === transactionId);
  if (index !== -1) {
    transactions[index] = { ...transactions[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }
};

// App settings functions
export const getAppSettings = (): AppSettings => {
  const settings = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
  return settings ? JSON.parse(settings) : {
    theme: "light",
    notifications: true,
    language: "es",
    currency: "PEN"
  };
};

export const updateAppSettings = (updates: Partial<AppSettings>): void => {
  const settings = getAppSettings();
  const newSettings = { ...settings, ...updates };
  localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(newSettings));
};

// Utility functions
export const purchaseTicket = (eventName: string, zone: string, price: number): string => {
  const ticket: Ticket = {
    id: `ticket_${Date.now()}`,
    eventName,
    eventDate: new Date().toISOString(),
    zone,
    status: "custody",
    price,
    purchaseDate: new Date().toISOString()
  };
  
  saveTicket(ticket);
  
  const transaction: Transaction = {
    id: `tx_${Date.now()}`,
    type: "purchase",
    amount: price,
    eventName,
    status: "completed",
    date: new Date().toISOString()
  };
  
  saveTransaction(transaction);
  
  return ticket.id;
};

export const createResaleOffer = (ticketId: string, newPrice: number): string => {
  const tickets = getTickets();
  const ticket = tickets.find(t => t.id === ticketId);
  
  if (!ticket) throw new Error("Ticket not found");
  
  const offer: ResaleOffer = {
    id: `offer_${Date.now()}`,
    ticketId,
    eventName: ticket.eventName,
    zone: ticket.zone,
    originalPrice: ticket.price,
    resalePrice: newPrice,
    priceIncrease: ((newPrice - ticket.price) / ticket.price) * 100,
    status: "active",
    listedDate: new Date().toISOString()
  };
  
  saveResaleOffer(offer);
  updateTicket(ticketId, { status: "released" });
  
  return offer.id;
};

export const getUserStats = () => {
  const tickets = getTickets();
  const resaleOffers = getResaleOffers();
  
  const fundsInCustody = tickets
    .filter(t => t.status === "custody")
    .reduce((sum, t) => sum + t.price, 0);
  
  const activeTickets = tickets.filter(t => t.status !== "resold").length;
  const ticketsResold = tickets.filter(t => t.status === "resold").length;
  const activeOffers = resaleOffers.filter(o => o.status === "active").length;

  return {
    fundsInCustody,
    activeTickets,
    ticketsResold,
    activeOffers
  };
};