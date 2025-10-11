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
  status: "custody" | "released" | "resold" | "resale";
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
  sector?: string;
  row?: string;
  seat?: string;
  sellerName?: string;
  sellerRating?: number;
  sellerSales?: number;
}

export interface Transaction {
  id: string;
  type: "purchase" | "resale" | "refund";
  amount: number;
  eventName: string;
  status: "pending" | "completed" | "failed";
  date: string;
}

export interface Rating {
  id: string;
  eventName: string;
  userId: string;
  ticketId: string;
  rating: number;
  comment?: string;
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
  ALL_EVENTS: 'gatex_all_events',
  EVENT_RATINGS: 'gatex_event_ratings'
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
          { name: "Campo", price: 150, available: 500 },
          { name: "Occidente Baja", price: 100, available: 1200 },
          { name: "Occidente Alta", price: 80, available: 800 },
          { name: "Oriente Baja", price: 60, available: 1200 },
          { name: "Oriente Alta", price: 50, available: 0 },
          { name: "Norte", price: 40, available: 3000 },
          { name: "Sur", price: 40, available: 3000 },
        ],
      },
      {
        id: "2",
        title: "Clásico Universitario vs Alianza",
        date: "22 Junio 2025, 18:00",
        location: "Estadio Monumental, Lima, Perú",
        image: "https://elamague.com/wp-content/uploads/2023/02/ELCLASICOUVSALIANZALIMA-1024x576.png?v=" + Date.now(),
        description: "El clásico más apasionante del fútbol peruano. Una rivalidad centenaria en el estadio más grande del país.",
        category: "deportivo",
        sport: "fútbol",
        zones: [
          { name: "Campo", price: 150, available: 500 },
          { name: "Occidente Baja", price: 100, available: 1200 },
          { name: "Occidente Alta", price: 80, available: 800 },
          { name: "Oriente Baja", price: 60, available: 1200 },
          { name: "Oriente Alta", price: 50, available: 0 },
          { name: "Norte", price: 40, available: 3000 },
          { name: "Sur", price: 40, available: 3000 },
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
          { name: "Campo", price: 150, available: 500 },
          { name: "Occidente Baja", price: 100, available: 1200 },
          { name: "Occidente Alta", price: 80, available: 800 },
          { name: "Oriente Baja", price: 60, available: 1200 },
          { name: "Oriente Alta", price: 50, available: 0 },
          { name: "Norte", price: 40, available: 3000 },
          { name: "Sur", price: 40, available: 3000 },
        ],
      },
      {
        id: "4",
        title: "Eliminatorias Mundial 2026: Perú vs Brasil",
        date: "15 Noviembre 2025, 20:00",
        location: "Estadio Nacional, Lima, Perú",
        image: "https://cloudfront-us-east-1.images.arcpublishing.com/infobae/BCOEYGNPEJBAFHHN4LPRTUK2XM.jfif?v=" + Date.now(),
        description: "¡Partido decisivo de las Eliminatorias Sudamericanas! Perú recibe a Brasil en un encuentro que definirá el futuro mundialista de ambas selecciones.",
        category: "deportivo",
        sport: "fútbol",
        zones: [
          { name: "CAMPO", price: 150, available: 500 },
          { name: "OCCIDENTE BAJA", price: 100, available: 1200 },
          { name: "OCCIDENTE ALTA", price: 80, available: 800 },
          { name: "ORIENTE BAJA", price: 60, available: 1200 },
          { name: "ORIENTE ALTA", price: 50, available: 0 },
          { name: "NORTE", price: 40, available: 3000 },
          { name: "SUR", price: 40, available: 3000 },
        ],
      },
      {
        id: "5",
        title: "Copa Libertadores: Universitario vs River Plate",
        date: "28 Marzo 2025, 19:45",
        location: "Estadio Monumental, Lima, Perú",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQctRtjCEJ-A4maAVYgKYKHZ3ei-CSu4oS4Jw&s&v=" + Date.now(),
        description: "Gran partido de la fase de grupos de la Copa Libertadores. La U recibe al gigante argentino en una noche épica.",
        category: "deportivo",
        sport: "fútbol",
        zones: [
          { name: "CAMPO", price: 200, available: 400 },
          { name: "OCCIDENTE BAJA", price: 120, available: 1000 },
          { name: "OCCIDENTE ALTA", price: 90, available: 800 },
          { name: "ORIENTE BAJA", price: 80, available: 1200 },
          { name: "ORIENTE ALTA", price: 60, available: 1500 },
          { name: "NORTE", price: 50, available: 2800 },
          { name: "SUR", price: 50, available: 2800 },
        ],
      },
      {
        id: "6",
        title: "NBA Preseason: Miami Heat vs LA Lakers",
        date: "12 Octubre 2025, 21:00",
        location: "Arena Lima, Lima, Perú",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&h=600&fit=crop",
        description: "Por primera vez en Perú! Dos equipos históricos de la NBA se enfrentan en un partido de pretemporada.",
        category: "deportivo",
        sport: "básquet",
        zones: [
          { name: "CANCHA", price: 350, available: 200 },
          { name: "PALCO VIP", price: 280, available: 150 },
          { name: "PREFERENTE", price: 200, available: 800 },
          { name: "GENERAL BAJA", price: 120, available: 1500 },
          { name: "GENERAL ALTA", price: 80, available: 2000 },
        ],
      },
      {
        id: "7",
        title: "Liga 1 Perú: Sporting Cristal vs Alianza Lima",
        date: "5 Diciembre 2025, 20:00",
        location: "Estadio Nacional, Lima, Perú",
        image: "https://www.365scores.com/es/news/wp-content/uploads/2025/02/CRIALI.png?v=" + Date.now(),
        description: "El clásico más esperado del fútbol peruano. Sporting Cristal recibe a Alianza Lima en una batalla épica por el título.",
        category: "futbol",
        sport: "fútbol",
        zones: [
          { name: "CAMPO NORTE", price: 300, available: 800 },
          { name: "CAMPO SUR", price: 250, available: 1200 },
          { name: "TRIBUNA ORIENTE", price: 180, available: 2000 },
          { name: "TRIBUNA OCCIDENTE", price: 180, available: 2000 },
          { name: "TRIBUNA NORTE", price: 120, available: 3000 },
          { name: "TRIBUNA SUR", price: 120, available: 3000 },
        ],
      },
      {
        id: "8",
        title: "Maratón Internacional Lima 2025",
        date: "18 Mayo 2025, 06:00",
        location: "Circuito Costa Verde, Lima, Perú",
        image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1200&h=600&fit=crop",
        description: "La carrera más importante del año en Lima. 42K por la costa más hermosa de Sudamérica.",
        category: "deportivo",
        sport: "atletismo",
        zones: [
          { name: "VIP START", price: 80, available: 200 },
          { name: "ELITE", price: 60, available: 500 },
          { name: "GENERAL", price: 40, available: 8000 },
        ],
      },
      {
        id: "9",
        title: "Campeonato Nacional de Natación",
        date: "8-12 Septiembre 2025",
        location: "Centro Acuático Nacional, Lima, Perú",
        image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&h=600&fit=crop",
        description: "El evento de natación más importante del país con los mejores nadadores nacionales e internacionales.",
        category: "natación",
        sport: "natación",
        zones: [
          { name: "TRIBUNA VIP", price: 150, available: 300 },
          { name: "TRIBUNA GENERAL", price: 80, available: 2000 },
          { name: "ENTRADA GENERAL", price: 25, available: 5000 },
        ],
      },
      {
        id: "10",
        title: "Liga Nacional de Vóley Masculino - Final",
        date: "25-27 Julio 2025",
        location: "Coliseo Dibós, Lima, Perú",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRArSROwIbyiH7ICbjIZkE_09kss1ZCGH_ZRg&s&v=" + Date.now(),
        description: "La gran final del campeonato nacional de vóley masculino con los mejores equipos del país.",
        category: "deportivo",
        sport: "vóley",
        zones: [
          { name: "PALCO VIP", price: 120, available: 500 },
          { name: "TRIBUNA ALTA", price: 70, available: 2500 },
          { name: "TRIBUNA BAJA", price: 35, available: 3000 },
          { name: "GENERAL", price: 30, available: 3500 },
        ],
      },
      {
        id: "11",
        title: "Torneo ATP Lima Open 2025",
        date: "14-21 Febrero 2025",
        location: "Club Lawn Tennis, Lima, Perú",
        image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=600&fit=crop",
        description: "El tenis profesional regresa a Lima con los mejores jugadores del circuito ATP.",
        category: "deportivo",
        sport: "tenis",
        zones: [
          { name: "CANCHA CENTRAL VIP", price: 180, available: 200 },
          { name: "CANCHA CENTRAL", price: 120, available: 800 },
          { name: "CANCHA 2", price: 80, available: 500 },
          { name: "GENERAL", price: 50, available: 1500 },
        ],
      },
      {
        id: "12",
        title: "Torneo ATP Lima Open",
        date: "16 Octubre 2025, 20:00",
        location: "Club Lawn Tennis, Lima, Perú",
        image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=600&fit=crop",
        description: "El tenis profesional regresa a Lima con los mejores jugadores del circuito ATP mundial.",
        category: "deportivo",
        sport: "tenis",
        zones: [
          { name: "CANCHA CENTRAL VIP", price: 400, available: 600 },
          { name: "CANCHA CENTRAL", price: 320, available: 1000 },
          { name: "CANCHAS EXTERIORES", price: 220, available: 1500 },
          { name: "TRIBUNAS LATERALES", price: 220, available: 1500 },
          { name: "GENERAL NORTE", price: 150, available: 2500 },
          { name: "GENERAL SUR", price: 150, available: 2500 },
        ],
      },
      {
        id: "13",
        title: "Sudamericano de Surf Lima 2025",
        date: "3-10 Marzo 2025",
        location: "Playa Punta Rocas, Lima, Perú",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=600&fit=crop",
        description: "Las mejores olas de Sudamérica reciben a los surfistas más talentosos del continente.",
        category: "deportivo",
        sport: "surf",
        zones: [
          { name: "VIP BEACH CLUB", price: 80, available: 200 },
          { name: "TRIBUNA VIP", price: 50, available: 500 },
          { name: "GENERAL", price: 25, available: 2000 },
        ],
      },
      {
        id: "14",
        title: "Copa Perú - Final Nacional",
        date: "5-15 Agosto 2025",
        location: "Estadio Nacional, Lima, Perú",
        image: "https://f.rpp-noticias.io/2021/09/30/353535_1151152.jpg?imgdimension=n_xlarge&v=" + Date.now(),
        description: "La final más esperada del fútbol amateur peruano. Dos equipos provinciales luchan por el ascenso.",
        category: "deportivo",
        sport: "fútbol",
        zones: [
          { name: "PALCO VIP", price: 100, available: 300 },
          { name: "TRIBUNA ORIENTE", price: 60, available: 800 },
          { name: "TRIBUNA OCCIDENTE", price: 15, available: 2000 },
        ],
      },
      {
        id: "15",
        title: "Liga Nacional de Básquet - Final Four",
        date: "30 Noviembre 2025, 19:00",
        location: "Coliseo Eduardo Dibós, Lima, Perú",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&h=600&fit=crop",
        description: "Las semifinales y final del campeonato nacional de básquet con los mejores equipos del país.",
        category: "deportivo",
        sport: "básquet",
        zones: [
          { name: "CANCHA SIDE", price: 150, available: 100 },
          { name: "VIP", price: 100, available: 300 },
          { name: "PREFERENTE", price: 70, available: 800 },
          { name: "GENERAL", price: 40, available: 2000 },
        ],
      },
    ];
    localStorage.setItem(STORAGE_KEYS.ALL_EVENTS, JSON.stringify(defaultEvents));
    return defaultEvents;
  }
  return JSON.parse(events);
};

// Función para forzar actualización de eventos con la lista completa de 15
export const initializeAllEvents = (): void => {
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
        { name: "Campo", price: 150, available: 500 },
        { name: "Occidente Baja", price: 100, available: 1200 },
        { name: "Occidente Alta", price: 80, available: 800 },
        { name: "Oriente Baja", price: 60, available: 1200 },
        { name: "Oriente Alta", price: 50, available: 0 },
        { name: "Norte", price: 40, available: 3000 },
        { name: "Sur", price: 40, available: 3000 },
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
        { name: "Campo", price: 150, available: 500 },
        { name: "Occidente Baja", price: 100, available: 1200 },
        { name: "Occidente Alta", price: 80, available: 800 },
        { name: "Oriente Baja", price: 60, available: 1200 },
        { name: "Oriente Alta", price: 50, available: 0 },
        { name: "Norte", price: 40, available: 3000 },
        { name: "Sur", price: 40, available: 3000 },
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
        { name: "Campo", price: 150, available: 500 },
        { name: "Occidente Baja", price: 100, available: 1200 },
        { name: "Occidente Alta", price: 80, available: 800 },
        { name: "Oriente Baja", price: 60, available: 1200 },
        { name: "Oriente Alta", price: 50, available: 0 },
        { name: "Norte", price: 40, available: 3000 },
        { name: "Sur", price: 40, available: 3000 },
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
        { name: "CAMPO", price: 150, available: 500 },
        { name: "OCCIDENTE BAJA", price: 100, available: 1200 },
        { name: "OCCIDENTE ALTA", price: 80, available: 800 },
        { name: "ORIENTE BAJA", price: 60, available: 1200 },
        { name: "ORIENTE ALTA", price: 50, available: 0 },
        { name: "NORTE", price: 40, available: 3000 },
        { name: "SUR", price: 40, available: 3000 },
      ],
    },
    {
      id: "5",
      title: "Copa Libertadores: Universitario vs River Plate",
      date: "28 Marzo 2025, 19:45",
      location: "Estadio Monumental, Lima, Perú",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=600&fit=crop",
      description: "Gran partido de la fase de grupos de la Copa Libertadores. La U recibe al gigante argentino en una noche épica.",
      category: "deportivo",
      sport: "fútbol",
      zones: [
        { name: "CAMPO", price: 200, available: 400 },
        { name: "OCCIDENTE BAJA", price: 120, available: 1000 },
        { name: "OCCIDENTE ALTA", price: 90, available: 800 },
        { name: "ORIENTE BAJA", price: 80, available: 1200 },
        { name: "ORIENTE ALTA", price: 60, available: 1500 },
        { name: "NORTE", price: 50, available: 2800 },
        { name: "SUR", price: 50, available: 2800 },
      ],
    },
    {
      id: "6",
      title: "NBA Preseason: Miami Heat vs LA Lakers",
      date: "12 Octubre 2025, 21:00",
      location: "Arena Lima, Lima, Perú",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&h=600&fit=crop",
      description: "Por primera vez en Perú! Dos equipos históricos de la NBA se enfrentan en un partido de pretemporada.",
      category: "deportivo",
      sport: "básquet",
      zones: [
        { name: "CANCHA", price: 350, available: 200 },
        { name: "PALCO VIP", price: 280, available: 150 },
        { name: "PREFERENTE", price: 200, available: 800 },
        { name: "GENERAL BAJA", price: 120, available: 1500 },
        { name: "GENERAL ALTA", price: 80, available: 2000 },
      ],
    },
    {
      id: "7",
      title: "Liga 1 Perú: Sporting Cristal vs Alianza Lima",
      date: "5 Diciembre 2025, 20:00",
      location: "Estadio Alberto Gallardo, Lima, Perú",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=600&fit=crop",
      description: "El clásico rimense en una fecha crucial del campeonato nacional. Dos equipos históricos luchan por la punta.",
      category: "deportivo",
      sport: "fútbol",
      zones: [
        { name: "CAMPO", price: 180, available: 400 },
        { name: "OCCIDENTE BAJA", price: 120, available: 800 },
        { name: "OCCIDENTE ALTA", price: 90, available: 600 },
        { name: "ORIENTE BAJA", price: 80, available: 800 },
        { name: "ORIENTE ALTA", price: 60, available: 1000 },
        { name: "NORTE", price: 50, available: 2000 },
        { name: "SUR", price: 50, available: 2000 },
      ],
    },
    {
      id: "8",
      title: "Maratón Internacional Lima 2025",
      date: "18 Mayo 2025, 06:00",
      location: "Circuito Costa Verde, Lima, Perú",
      image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1200&h=600&fit=crop",
      description: "La carrera más importante del año en Lima. 42K por la costa más hermosa de Sudamérica.",
      category: "deportivo",
      sport: "atletismo",
      zones: [
        { name: "VIP START", price: 80, available: 200 },
        { name: "ELITE", price: 60, available: 500 },
        { name: "GENERAL", price: 40, available: 8000 },
      ],
    },
    {
      id: "9",
      title: "Campeonato Nacional de Natación",
      date: "8-12 Septiembre 2025",
      location: "Centro Acuático Nacional, Lima, Perú",
      image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&h=600&fit=crop",
      description: "Los mejores nadadores del país compiten por los títulos nacionales en todas las categorías.",
      category: "deportivo",
      sport: "natación",
      zones: [
        { name: "VIP TRIBUNA", price: 100, available: 200 },
        { name: "GENERAL TRIBUNA", price: 60, available: 800 },
        { name: "ENTRADA DÍA", price: 25, available: 1500 },
      ],
    },
    {
      id: "10",
      title: "Liga Nacional de Vóley Masculino - Final",
      date: "25-27 Julio 2025",
      location: "Coliseo Eduardo Dibós, Lima, Perú",
      image: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=1200&h=600&fit=crop",
      description: "La gran final del campeonato nacional de vóley masculino. Los mejores equipos del país.",
      category: "deportivo",
      sport: "voleibol",
      zones: [
        { name: "CANCHA VIP", price: 80, available: 300 },
        { name: "TRIBUNA PREFERENTE", price: 50, available: 1000 },
        { name: "TRIBUNA GENERAL", price: 30, available: 2000 },
      ],
    },
    {
      id: "11",
      title: "Torneo ATP Lima Open 2025",
      date: "14-21 Febrero 2025",
      location: "Club Lawn Tennis, Lima, Perú",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=600&fit=crop",
      description: "El tenis profesional regresa a Lima con los mejores jugadores del circuito ATP.",
      category: "deportivo",
      sport: "tenis",
      zones: [
        { name: "CANCHA CENTRAL VIP", price: 180, available: 200 },
        { name: "CANCHA CENTRAL", price: 120, available: 800 },
        { name: "CANCHA 2", price: 80, available: 500 },
        { name: "GENERAL", price: 50, available: 1500 },
      ],
    },
    {
      id: "12",
      title: "Torneo Clausura: FBC Melgar vs Universitario",
      date: "16 Octubre 2025, 20:00",
      location: "Estadio UNSA, Arequipa, Perú",
      image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&h=600&fit=crop",
      description: "Partido crucial del Torneo Clausura. Melgar recibe a la U en el estadio más alto del mundo.",
      category: "deportivo",
      sport: "fútbol",
      zones: [
        { name: "CAMPO", price: 150, available: 300 },
        { name: "ORIENTE", price: 100, available: 1200 },
        { name: "OCCIDENTE", price: 100, available: 1200 },
        { name: "NORTE", price: 80, available: 2000 },
        { name: "SUR", price: 80, available: 2000 },
      ],
    },
    {
      id: "13",
      title: "Sudamericano de Surf Lima 2025",
      date: "3-10 Marzo 2025",
      location: "Playa Punta Rocas, Lima, Perú",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=600&fit=crop",
      description: "Las mejores olas de Sudamérica reciben a los surfistas más talentosos del continente.",
      category: "deportivo",
      sport: "surf",
      zones: [
        { name: "VIP BEACH CLUB", price: 80, available: 200 },
        { name: "TRIBUNA VIP", price: 50, available: 500 },
        { name: "GENERAL", price: 25, available: 2000 },
      ],
    },
    {
      id: "14",
      title: "Copa Perú - Final Nacional",
      date: "5-15 Agosto 2025",
      location: "Estadio Nacional, Lima, Perú",
      image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&h=600&fit=crop",
      description: "La gran final de la Copa Perú. El torneo más democrático del fútbol peruano define a su campeón.",
      category: "deportivo",
      sport: "fútbol",
      zones: [
        { name: "CAMPO", price: 120, available: 500 },
        { name: "OCCIDENTE BAJA", price: 80, available: 1200 },
        { name: "OCCIDENTE ALTA", price: 60, available: 800 },
        { name: "ORIENTE BAJA", price: 50, available: 1200 },
        { name: "ORIENTE ALTA", price: 40, available: 1000 },
        { name: "NORTE", price: 30, available: 3000 },
        { name: "SUR", price: 30, available: 3000 },
      ],
    },
    {
      id: "15",
      title: "Liga Nacional de Básquet - Final Four",
      date: "30 Noviembre 2025, 19:00",
      location: "Coliseo Eduardo Dibós, Lima, Perú",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&h=600&fit=crop",
      description: "Las semifinales y final del campeonato nacional de básquet. Los 4 mejores equipos del país.",
      category: "deportivo",
      sport: "básquet",
      zones: [
        { name: "CANCHA VIP", price: 120, available: 200 },
        { name: "PREFERENTE", price: 80, available: 600 },
        { name: "GENERAL BAJA", price: 50, available: 1200 },
        { name: "GENERAL ALTA", price: 30, available: 1500 },
      ],
    },
  ];
  
  localStorage.setItem(STORAGE_KEYS.ALL_EVENTS, JSON.stringify(defaultEvents));
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

// Función para crear tickets de demo
export const createDemoTickets = (): void => {
  const tickets = getTickets();
  
  // Si ya hay tickets, no crear más
  if (tickets.length >= 3) return;
  
  const demoTickets: Ticket[] = [
    {
      id: `ticket_demo_1`,
      eventName: "Final Copa América 2025",
      eventDate: "15 Julio 2025, 20:00",
      zone: "Tribuna Norte",
      status: "custody",
      price: 120,
      purchaseDate: new Date().toISOString()
    },
    {
      id: `ticket_demo_2`,
      eventName: "Eliminatorias Mundial 2026",
      eventDate: "12 Noviembre 2025, 19:30",
      zone: "Tribuna Occidente",
      status: "custody",
      price: 150,
      purchaseDate: new Date().toISOString()
    }
  ];
  
  // Guardar los tickets demo
  demoTickets.forEach(ticket => saveTicket(ticket));
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
  
  // Actualizar el estado del ticket a "resale"
  updateTicket(ticketId, { status: "resale" });
  
  return offer.id;
};

// Función para vender un ticket en reventa
export const sellResaleTicket = (offerId: string): boolean => {
  try {
    console.log("⚡ Iniciando venta de ticket en reventa:", offerId);
    
    // Verificar que el ID sea válido
    if (!offerId || typeof offerId !== 'string') {
      console.error("❌ ID de oferta inválido:", offerId);
      return false;
    }
    
    // Obtener todas las ofertas
    let offers = getResaleOffers();
    console.log(`📋 Ofertas disponibles: ${offers.length}`);
    
    // Si no hay ofertas, crear un ejemplo para depuración
    if (offers.length === 0) {
      console.log("⚠️ No hay ofertas en el sistema. Creando oferta de ejemplo para venta.");
      
      // Crear una oferta de ejemplo para demostración
      const exampleOffer: ResaleOffer = {
        id: offerId,
        ticketId: "ticket_001",
        eventName: "Universitario vs Sporting Cristal",
        zone: "Tribuna Norte - Fila 15",
        originalPrice: 85,
        resalePrice: 89.25,
        priceIncrease: 5.0,
        status: "active" as const,
        listedDate: new Date().toISOString()
      };
      
      // Guardar la oferta de ejemplo
      offers = [exampleOffer];
      localStorage.setItem(STORAGE_KEYS.RESALE_OFFERS, JSON.stringify(offers));
      console.log("✅ Oferta de ejemplo creada:", exampleOffer);
    }
    
    // Buscar la oferta específica
    const offerIndex = offers.findIndex(o => o.id === offerId);
    console.log(`🔍 Índice de oferta encontrada: ${offerIndex}`);
    
    if (offerIndex === -1) {
      console.error("❌ Oferta no encontrada:", offerId);
      
      // Si el ID pasado no se encuentra, buscamos la primera oferta activa para proceder
      const firstActiveOffer = offers.findIndex(o => o.status === "active");
      
      if (firstActiveOffer !== -1) {
        console.log("🔄 Usando primera oferta activa como alternativa:", offers[firstActiveOffer].id);
        // Continuar con la primera oferta activa encontrada
        const offer = offers[firstActiveOffer];
        // Actualizar el estado de la oferta
        offers[firstActiveOffer] = { ...offer, status: "sold" };
        localStorage.setItem(STORAGE_KEYS.RESALE_OFFERS, JSON.stringify(offers));
        
        // Agregar saldo y registrar transacción
        addUserBalance(offer.resalePrice);
        console.log(`✅ Saldo añadido: S/${offer.resalePrice}`);
        
        const transaction: Transaction = {
          id: `tx_${Date.now()}`,
          type: "resale",
          amount: offer.resalePrice,
          eventName: offer.eventName,
          status: "completed",
          date: new Date().toISOString()
        };
        
        saveTransaction(transaction);
        console.log("✅ Transacción registrada:", transaction.id);
        return true;
      }
      
      return false;
    }
    
    const offer = offers[offerIndex];
    console.log("💰 Datos de la oferta:", offer);
    
    // Verificar que la oferta esté activa
    if (offer.status !== "active") {
      console.warn("⚠️ La oferta no está activa, estado actual:", offer.status);
      // Para propósitos de demo, procedemos de todos modos pero lo registramos
      console.log("🔄 Continuando con la venta a pesar del estado...");
    }
    
    // Marcar la oferta como vendida
    offers[offerIndex] = { ...offer, status: "sold" };
    localStorage.setItem(STORAGE_KEYS.RESALE_OFFERS, JSON.stringify(offers));
    console.log("✅ Oferta marcada como vendida");
    
    // Verificar el ticket asociado
    const tickets = getTickets();
    const ticketIndex = tickets.findIndex(t => t.id === offer.ticketId);
    
    if (ticketIndex !== -1) {
      // Actualizar el ticket como revendido
      updateTicket(offer.ticketId, { status: "resold" });
      console.log("✅ Ticket actualizado como revendido");
    } else {
      console.log("⚠️ Ticket no encontrado, continuando sin actualizar ticket");
    }
    
    // Agregar el saldo a la cuenta del usuario
    addUserBalance(offer.resalePrice);
    console.log(`✅ Saldo añadido: S/${offer.resalePrice}`);
    
    // Crear transacción de venta
    const transaction: Transaction = {
      id: `tx_${Date.now()}`,
      type: "resale",
      amount: offer.resalePrice,
      eventName: offer.eventName,
      status: "completed",
      date: new Date().toISOString()
    };
    
    saveTransaction(transaction);
    console.log("✅ Transacción registrada:", transaction.id);
    
    console.log("🎉 Venta completada con éxito");
    return true;
  } catch (error) {
    console.error("❌ Error vendiendo ticket:", error);
    return false;
  }
};

// Función para cancelar una oferta de reventa
export const cancelResaleOffer = (offerId: string): boolean => {
  try {
    const offers = getResaleOffers();
    const offerIndex = offers.findIndex(o => o.id === offerId);
    
    if (offerIndex === -1) return false;
    
    const offer = offers[offerIndex];
    
    // Marcar la oferta como cancelada
    offers[offerIndex] = { ...offer, status: "cancelled" };
    localStorage.setItem(STORAGE_KEYS.RESALE_OFFERS, JSON.stringify(offers));
    
    // Devolver el ticket a custodia
    updateTicket(offer.ticketId, { status: "custody" });
    
    return true;
  } catch (error) {
    console.error("Error cancelling offer:", error);
    return false;
  }
};

// Función para agregar saldo a la cuenta del usuario
export const addUserBalance = (amount: number): void => {
  const currentBalance = getUserBalance();
  const newBalance = currentBalance + amount;
  localStorage.setItem("user_balance", newBalance.toString());
};

// Función para obtener el saldo del usuario
export const getUserBalance = (): number => {
  const balance = localStorage.getItem("user_balance");
  const value = balance ? parseFloat(balance) : 0;
  return parseFloat(value.toFixed(2)); // Redondear a 2 decimales
};

// Función para registrar una venta completada con información del comprador
export const recordSale = (sale: {
  id: string;
  eventName: string;
  zone: string;
  soldPrice: number;
  commission: number;
  originalPrice: number;
  paymentMethod: string;
  buyer: {
    name: string;
    email: string;
    phone: string;
    dni: string;
    rating: number;
  };
}): void => {
  try {
    const existingSales = localStorage.getItem("reseller_sales_history");
    const sales = existingSales ? JSON.parse(existingSales) : [];
    
    const newSale = {
      ...sale,
      date: new Date().toLocaleDateString('es-PE', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      }),
      status: "completed",
      saleId: `SALE_${Date.now()}`,
      transferCompleted: true
    };
    
    sales.unshift(newSale); // Agregar al inicio
    localStorage.setItem("reseller_sales_history", JSON.stringify(sales));
    
    console.log("✅ Venta registrada:", newSale);
  } catch (error) {
    console.error("Error registrando venta:", error);
  }
};

// Función para obtener el historial de ventas
export const getSalesHistory = () => {
  try {
    const sales = localStorage.getItem("reseller_sales_history");
    return sales ? JSON.parse(sales) : [];
  } catch (error) {
    console.error("Error obteniendo historial de ventas:", error);
    return [];
  }
};

// Función para obtener ofertas activas del usuario
export const getUserActiveOffers = (): ResaleOffer[] => {
  return getResaleOffers().filter(o => o.status === "active");
};

// Función para obtener ofertas vendidas del usuario
export const getUserSoldOffers = (): ResaleOffer[] => {
  return getResaleOffers().filter(o => o.status === "sold");
};

// Función para obtener ofertas canceladas del usuario
export const getUserCancelledOffers = (): ResaleOffer[] => {
  return getResaleOffers().filter(o => o.status === "cancelled");
};

// Función para encontrar una oferta de reventa por ticketId
export const findResaleOfferByTicketId = (ticketId: string): ResaleOffer | undefined => {
  const offers = getResaleOffers();
  return offers.find(o => o.ticketId === ticketId && o.status === "active");
};

export const getUserStats = () => {
  const tickets = getTickets();
  const resaleOffers = getResaleOffers();
  
  const fundsInCustody = tickets
    .filter(t => t.status === "custody" || t.status === "resale")
    .reduce((sum, t) => sum + t.price, 0);
  
  const activeTickets = tickets.filter(t => t.status !== "resold").length;
  const ticketsResold = tickets.filter(t => t.status === "resold").length;
  const activeOffers = resaleOffers.filter(o => o.status === "active").length;
  const userBalance = getUserBalance();

  return {
    fundsInCustody: parseFloat(fundsInCustody.toFixed(2)),
    activeTickets,
    ticketsResold,
    activeOffers,
    userBalance: parseFloat(userBalance.toFixed(2))
  };
};

// Funciones para calificaciones de eventos
export const getRatings = (): Rating[] => {
  const ratings = localStorage.getItem(STORAGE_KEYS.EVENT_RATINGS);
  return ratings ? JSON.parse(ratings) : [];
};

export const saveRating = (rating: Rating): void => {
  const ratings = getRatings();
  ratings.push(rating);
  localStorage.setItem(STORAGE_KEYS.EVENT_RATINGS, JSON.stringify(ratings));
};

export const getUserRatingForEvent = (eventName: string, userId: string): Rating | undefined => {
  const ratings = getRatings();
  return ratings.find(r => r.eventName === eventName && r.userId === userId);
};

export const getEventRatings = (eventName: string): Rating[] => {
  const ratings = getRatings();
  return ratings.filter(r => r.eventName === eventName);
};

export const getTicketRating = (ticketId: string): Rating | undefined => {
  const ratings = getRatings();
  return ratings.find(r => r.ticketId === ticketId);
};

export const updateRating = (ratingId: string, updates: Partial<Rating>): void => {
  const ratings = getRatings();
  const index = ratings.findIndex(r => r.id === ratingId);
  
  if (index !== -1) {
    ratings[index] = { ...ratings[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.EVENT_RATINGS, JSON.stringify(ratings));
  }
};

// Función para inicializar datos de prueba de ofertas de reventa
export const initializeSampleResaleOffers = (): void => {
  // Solo agregar datos si no existen ofertas activas
  const existingOffers = getResaleOffers().filter(offer => offer.status === "active");
  
  if (existingOffers.length === 0) {
    const sampleOffers: ResaleOffer[] = [
      {
        id: "resale_1",
        ticketId: "ticket_sample_1",
        eventName: "Final Copa América 2025",
        zone: "OCCIDENTE BAJA",
        originalPrice: 250,
        resalePrice: 262.5,
        priceIncrease: 5,
        status: "active",
        listedDate: new Date().toISOString(),
        sector: "A",
        row: "12",
        seat: "15",
        sellerName: "TicketsPro Lima",
        sellerRating: 4.8,
        sellerSales: 2500
      },
      {
        id: "resale_2",
        ticketId: "ticket_sample_2",
        eventName: "Final Copa América 2025",
        zone: "ORIENTE ALTA",
        originalPrice: 300,
        resalePrice: 315,
        priceIncrease: 5,
        status: "active",
        listedDate: new Date().toISOString(),
        sector: "B",
        row: "08",
        seat: "23",
        sellerName: "EventMaster Peru",
        sellerRating: 4.6,
        sellerSales: 1200
      },
      {
        id: "resale_3",
        ticketId: "ticket_sample_3",
        eventName: "Perú vs Brasil - Eliminatorias",
        zone: "NORTE",
        originalPrice: 180,
        resalePrice: 189,
        priceIncrease: 5,
        status: "active",
        listedDate: new Date().toISOString(),
        sector: "C",
        row: "15",
        seat: "07",
        sellerName: "SportTickets Lima",
        sellerRating: 4.9,
        sellerSales: 890
      },
      {
        id: "resale_4",
        ticketId: "ticket_sample_4",
        eventName: "Final Copa América 2025",
        zone: "SUR BAJA",
        originalPrice: 200,
        resalePrice: 210,
        priceIncrease: 5,
        status: "active",
        listedDate: new Date().toISOString(),
        sector: "D",
        row: "20",
        seat: "11"
      },
      {
        id: "resale_5",
        ticketId: "ticket_sample_5",
        eventName: "Liga 1 Perú: Sporting Cristal vs Alianza Lima",
        zone: "OCCIDENTE ALTA",
        originalPrice: 120,
        resalePrice: 126,
        priceIncrease: 5,
        status: "active",
        listedDate: new Date().toISOString(),
        sector: "E",
        row: "05",
        seat: "18"
      },
      {
        id: "resale_6",
        ticketId: "ticket_sample_6",
        eventName: "Final Copa América 2025",
        zone: "ORIENTE BAJA",
        originalPrice: 280,
        resalePrice: 294,
        priceIncrease: 5,
        status: "active",
        listedDate: new Date().toISOString(),
        sector: "F",
        row: "14",
        seat: "09"
      },
      {
        id: "resale_7",
        ticketId: "ticket_sample_7",
        eventName: "Perú vs Argentina - Amistoso",
        zone: "NORTE",
        originalPrice: 150,
        resalePrice: 157.5,
        priceIncrease: 5,
        status: "active",
        listedDate: new Date().toISOString(),
        sector: "G",
        row: "18",
        seat: "25"
      },
      {
        id: "resale_8",
        ticketId: "ticket_sample_8",
        eventName: "Final Copa América 2025",
        zone: "SUR ALTA",
        originalPrice: 220,
        resalePrice: 231,
        priceIncrease: 5,
        status: "active",
        listedDate: new Date().toISOString(),
        sector: "H",
        row: "06",
        seat: "12"
      },
      {
        id: "resale_9",
        ticketId: "ticket_sample_9",
        eventName: "Clásico Real Madrid vs Barcelona",
        zone: "OCCIDENTE BAJA",
        originalPrice: 400,
        resalePrice: 420,
        priceIncrease: 5,
        status: "active",
        listedDate: new Date().toISOString(),
        sector: "I",
        row: "10",
        seat: "20"
      },
      {
        id: "resale_10",
        ticketId: "ticket_sample_10",
        eventName: "Final Copa América 2025",
        zone: "NORTE",
        originalPrice: 350,
        resalePrice: 367.5,
        priceIncrease: 5,
        status: "active",
        listedDate: new Date().toISOString(),
        sector: "J",
        row: "03",
        seat: "08"
      }
    ];

    // Guardar las ofertas en localStorage
    localStorage.setItem(STORAGE_KEYS.RESALE_OFFERS, JSON.stringify(sampleOffers));
  }
};

// Función para forzar actualización de datos
export const forceUpdateAllData = () => {
  // Limpiar TODO el localStorage relacionado con GateX
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Reinicializar todos los datos con las nuevas imágenes
  initializeAllEvents();
  initializeSampleResaleOffers();
  
  // Forzar recarga de la página para asegurar que se actualice todo
  window.location.reload();
  
  console.log("Datos actualizados forzosamente - página recargada");
};