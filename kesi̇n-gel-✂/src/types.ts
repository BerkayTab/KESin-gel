export interface BarberService {
  id: string;
  name: string;
  category: 'Saç' | 'Sakal' | 'Saç + Sakal' | 'Çocuk' | 'Boyama' | 'Bakım';
  durationMinutes: number;
  price: number;
  description?: string;
  popular?: boolean;
}

export interface BarberReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  service: string;
}

export interface BarberOpeningHours {
  open: string;
  close: string;
  daysOff: string[];
}

export interface BarberBreakHours {
  start: string;
  end: string;
}

export interface Barber {
  id: string;
  name: string;
  slug: string;
  image: string;
  coverImage?: string;
  rating: number;
  reviewCount: number;
  district: string;
  neighborhood: string;
  city: string;
  address: string;
  phone: string;
  instagram?: string;
  services: BarberService[];
  openingHours: BarberOpeningHours;
  breakHours: BarberBreakHours;
  slotIntervalMinutes: number; // 30 mins
  description: string;
  bio: string;
  startingPrice: number;
  earliestAvailable: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  features: string[];
  reviews: BarberReview[];
}

export interface Appointment {
  id: string;
  barberId: string;
  barberName: string;
  barberImage: string;
  barberDistrict: string;
  services: BarberService[];
  totalPrice: number;
  totalDuration: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'confirmed' | 'cancelled' | 'completed';
  clientName: string;
  clientPhone: string;
  clientNote?: string;
  createdAt: string;
}

export interface ScheduleSlot {
  time: string;
  status: 'available' | 'booked' | 'break';
  appointmentId?: string;
  clientName?: string;
  serviceName?: string;
  price?: number;
}

export type ViewMode = 
  | 'explore'           // Browse barbers & home
  | 'barber-detail'     // Detailed view of selected barber
  | 'booking'           // Step-by-step booking flow
  | 'booking-success'   // Success & confirmation view
  | 'appointments'      // User appointments list
  | 'favorites'         // Saved barbers
  | 'barber-dashboard'  // Barber management dashboard
  | 'profile';          // User profile & preferences
