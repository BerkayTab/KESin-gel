import React, { createContext, useContext, useState, useEffect } from 'react';
import { Barber, BarberService, Appointment, ScheduleSlot, ViewMode } from '../types';
import { INITIAL_BARBERS } from '../data/mockBarbers';
import { barberImages } from '../data/images';
import { getTodayDateString, getDateStringOffset } from '../utils/dates';

export { getTodayDateString, getDateStringOffset, formatTurkishDate } from '../utils/dates';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Navigation & Views
  view: ViewMode;
  setView: (view: ViewMode) => void;
  selectedBarber: Barber | null;
  setSelectedBarber: (barber: Barber | null) => void;
  selectedServicesForBooking: BarberService[];
  setSelectedServicesForBooking: React.Dispatch<React.SetStateAction<BarberService[]>>;
  
  // Barber data
  barbers: Barber[];
  updateBarber: (barber: Barber) => void;

  // Favorites
  favorites: string[]; // barber ids
  toggleFavorite: (barberId: string) => void;
  isFavorite: (barberId: string) => boolean;

  // Appointments
  appointments: Appointment[];
  activeAppointment: Appointment | null;
  createAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => Appointment;
  cancelAppointment: (appointmentId: string) => void;
  lastCreatedAppointment: Appointment | null;

  // Schedule Slots (BarberId -> Date -> Slots)
  getSlotsForDate: (barberId: string, date: string) => ScheduleSlot[];
  toggleSlotStatus: (barberId: string, date: string, time: string) => void;
  addWalkInBooking: (barberId: string, date: string, time: string, clientName: string, serviceName: string) => void;

  // Active Barber for Dashboard
  dashboardBarberId: string;
  setDashboardBarberId: (id: string) => void;

  // User Profile
  userProfile: {
    name: string;
    phone: string;
    email: string;
    district: string;
  };
  updateUserProfile: (profile: Partial<AppContextType['userProfile']>) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Action helpers
  startBookingFlow: (barber: Barber, initialService?: BarberService) => void;
  viewBarberDetails: (barber: Barber) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_SCHEDULE_DATA: Record<string, Record<string, ScheduleSlot[]>> = {
  'barber-1': {
    [getTodayDateString()]: [
      { time: '09:00', status: 'available' },
      { time: '09:30', status: 'available' },
      { time: '10:00', status: 'booked', clientName: 'Mehmet Y.', serviceName: 'Saç Kesimi', price: 450 },
      { time: '10:30', status: 'booked', clientName: 'Mehmet Y.', serviceName: 'Saç Kesimi', price: 450 },
      { time: '11:00', status: 'booked', clientName: 'Ali K.', serviceName: 'Saç + Sakal Kombini', price: 650 },
      { time: '11:30', status: 'booked', clientName: 'Ali K.', serviceName: 'Saç + Sakal Kombini', price: 650 },
      { time: '12:00', status: 'break' },
      { time: '12:30', status: 'break' },
      { time: '13:00', status: 'available' },
      { time: '13:30', status: 'available' },
      { time: '14:00', status: 'booked', clientName: 'Can Demir', serviceName: 'Sakal Tıraşı', price: 250 },
      { time: '14:30', status: 'available' },
      { time: '15:00', status: 'available' },
      { time: '15:30', status: 'booked', clientName: 'Tarık Akın', serviceName: 'Saç Kesimi', price: 450 },
      { time: '16:00', status: 'available' },
      { time: '16:30', status: 'available' }, // Earliest promoted
      { time: '17:00', status: 'booked', clientName: 'Serkan A.', serviceName: 'Saç + Sakal', price: 650 },
      { time: '17:30', status: 'available' },
      { time: '18:00', status: 'available' },
      { time: '18:30', status: 'booked', clientName: 'Kemal O.', serviceName: 'Sakal Tıraşı', price: 250 },
      { time: '19:00', status: 'available' },
      { time: '19:30', status: 'available' },
    ]
  }
};

const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-demo-1',
    barberId: 'barber-2',
    barberName: 'Classic Cut',
    barberImage: barberImages.classic,
    barberDistrict: 'Beşiktaş',
    services: [
      {
        id: 'srv-2-1',
        name: 'Klasik Saç Kesimi',
        category: 'Saç',
        durationMinutes: 30,
        price: 450,
      }
    ],
    totalPrice: 450,
    totalDuration: 30,
    date: getDateStringOffset(1),
    time: '17:15',
    status: 'confirmed',
    clientName: 'Berkay Tabak',
    clientPhone: '+90 532 999 88 77',
    clientNote: 'Yanları 2 numara, üstler biraz uzun kalsın lütfen.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt-past-1',
    barberId: 'barber-1',
    barberName: 'Ahmet Barber',
    barberImage: barberImages.ahmet,
    barberDistrict: 'Kadıköy',
    services: [
      {
        id: 'srv-1-3',
        name: 'Saç + Sakal Kombini',
        category: 'Saç + Sakal',
        durationMinutes: 50,
        price: 650,
      }
    ],
    totalPrice: 650,
    totalDuration: 50,
    date: getDateStringOffset(-12),
    time: '14:30',
    status: 'completed',
    clientName: 'Berkay Tabak',
    clientPhone: '+90 532 999 88 77',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<ViewMode>('explore');
  const [barbers, setBarbers] = useState<Barber[]>(() => {
    const saved = localStorage.getItem('kesingel_barbers');
    // Persisted demo records can contain deleted /images paths or old build hashes.
    return saved ? (JSON.parse(saved) as Barber[]).map((barber) => {
      const current = INITIAL_BARBERS.find((item) => item.id === barber.id);
      return current ? { ...barber, image: current.image, coverImage: current.coverImage } : barber;
    }) : INITIAL_BARBERS;
  });
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedServicesForBooking, setSelectedServicesForBooking] = useState<BarberService[]>([]);
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  const [lastCreatedAppointment, setLastCreatedAppointment] = useState<Appointment | null>(null);

  const [dashboardBarberId, setDashboardBarberId] = useState<string>('barber-1');

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('kesingel_favorites');
    return saved ? JSON.parse(saved) : ['barber-1'];
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('kesingel_appointments');
    return saved ? (JSON.parse(saved) as Appointment[]).map((appointment) => {
      const barber = INITIAL_BARBERS.find((item) => item.id === appointment.barberId);
      return barber ? { ...appointment, barberImage: barber.image } : appointment;
    }) : DEFAULT_APPOINTMENTS;
  });

  const [scheduleStore, setScheduleStore] = useState<Record<string, Record<string, ScheduleSlot[]>>>(() => {
    const saved = localStorage.getItem('kesingel_schedules');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE_DATA;
  });

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('kesingel_user_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Berkay Tabak',
      phone: '+90 532 999 88 77',
      email: 'berkaytabaks@gmail.com',
      district: 'Kadıköy',
    };
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem('kesingel_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('kesingel_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('kesingel_schedules', JSON.stringify(scheduleStore));
  }, [scheduleStore]);

  useEffect(() => {
    localStorage.setItem('kesingel_barbers', JSON.stringify(barbers));
  }, [barbers]);

  useEffect(() => {
    localStorage.setItem('kesingel_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const showToast = (title: string, message?: string, type: ToastMessage['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleFavorite = (barberId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(barberId);
      if (exists) {
        showToast('Favorilerden Çıkarıldı', 'Berber favori listenizden kaldırıldı.', 'info');
        return prev.filter((id) => id !== barberId);
      } else {
        showToast('Favorilere Eklendi', 'Berber favorilerinize kaydedildi.', 'success');
        return [...prev, barberId];
      }
    });
  };

  const isFavorite = (barberId: string) => favorites.includes(barberId);

  const updateBarber = (updated: Barber) => {
    setBarbers((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    if (selectedBarber?.id === updated.id) {
      setSelectedBarber(updated);
    }
  };

  const updateUserProfile = (patch: Partial<AppContextType['userProfile']>) => {
    setUserProfile((prev: typeof userProfile) => ({ ...prev, ...patch }));
    showToast('Profil Güncellendi', 'Kullanıcı bilgileriniz kaydedildi.', 'success');
  };

  // Generate default slots for any date & barber if not present
  const getSlotsForDate = (barberId: string, date: string): ScheduleSlot[] => {
    if (scheduleStore[barberId] && scheduleStore[barberId][date]) {
      return scheduleStore[barberId][date];
    }

    const barber = barbers.find((b) => b.id === barberId);
    const startHour = barber ? parseInt(barber.openingHours.open.split(':')[0], 10) : 9;
    const endHour = barber ? parseInt(barber.openingHours.close.split(':')[0], 10) : 20;

    const slots: ScheduleSlot[] = [];
    for (let h = startHour; h < endHour; h++) {
      const hourStr = h < 10 ? `0${h}` : `${h}`;
      slots.push({
        time: `${hourStr}:00`,
        status: (h === 12) ? 'break' : (h % 3 === 0 && h > 13) ? 'booked' : 'available',
        clientName: (h % 3 === 0 && h > 13) ? 'Dolu Randevu' : undefined,
        serviceName: (h % 3 === 0 && h > 13) ? 'Saç & Sakal' : undefined,
      });
      slots.push({
        time: `${hourStr}:30`,
        status: (h === 12) ? 'break' : (h === 16 && barberId === 'barber-1') ? 'available' : (h === 17) ? 'booked' : 'available',
        clientName: (h === 17) ? 'Müşteri Randevusu' : undefined,
        serviceName: (h === 17) ? 'Saç Kesimi' : undefined,
      });
    }

    return slots;
  };

  const createAppointment = (data: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Appointment => {
    const newAppointment: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    // Update appointment list
    setAppointments((prev) => [newAppointment, ...prev]);
    setLastCreatedAppointment(newAppointment);

    // Mark slot as booked in scheduleStore
    setScheduleStore((prev) => {
      const barberSchedules = prev[data.barberId] || {};
      const currentDaySlots = barberSchedules[data.date] || getSlotsForDate(data.barberId, data.date);

      const updatedSlots = currentDaySlots.map((slot) => {
        if (slot.time === data.time) {
          return {
            ...slot,
            status: 'booked' as const,
            appointmentId: newAppointment.id,
            clientName: data.clientName,
            serviceName: data.services.map((s) => s.name).join(' + '),
            price: data.totalPrice,
          };
        }
        return slot;
      });

      return {
        ...prev,
        [data.barberId]: {
          ...barberSchedules,
          [data.date]: updatedSlots,
        },
      };
    });

    showToast('Randevun Oluşturuldu! ✂', `${data.barberName} — ${data.time} için randevunuz kesinleşti.`, 'success');
    setView('booking-success');
    return newAppointment;
  };

  const cancelAppointment = (appointmentId: string) => {
    const targetApt = appointments.find((a) => a.id === appointmentId);
    if (!targetApt) return;

    // Update status to cancelled
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, status: 'cancelled' as const } : a))
    );

    // Free up slot in schedule
    setScheduleStore((prev) => {
      const barberSchedules = prev[targetApt.barberId];
      if (!barberSchedules || !barberSchedules[targetApt.date]) return prev;

      const updatedSlots = barberSchedules[targetApt.date].map((slot) => {
        if (slot.time === targetApt.time) {
          return {
            time: slot.time,
            status: 'available' as const,
          };
        }
        return slot;
      });

      return {
        ...prev,
        [targetApt.barberId]: {
          ...barberSchedules,
          [targetApt.date]: updatedSlots,
        },
      };
    });

    showToast('Randevu İptal Edildi', 'Seçilen randevu iptal edildi ve saat boşa çıkarıldı.', 'info');
  };

  const toggleSlotStatus = (barberId: string, date: string, time: string) => {
    setScheduleStore((prev) => {
      const barberSchedules = prev[barberId] || {};
      const currentSlots = barberSchedules[date] || getSlotsForDate(barberId, date);

      const updatedSlots: ScheduleSlot[] = currentSlots.map((slot) => {
        if (slot.time === time) {
          const nextStatus: ScheduleSlot['status'] = slot.status === 'available' ? 'break' : 'available';
          return { ...slot, status: nextStatus, clientName: undefined, serviceName: undefined };
        }
        return slot;
      });

      return {
        ...prev,
        [barberId]: {
          ...barberSchedules,
          [date]: updatedSlots,
        },
      };
    });
  };

  const addWalkInBooking = (
    barberId: string,
    date: string,
    time: string,
    clientName: string,
    serviceName: string
  ) => {
    setScheduleStore((prev) => {
      const barberSchedules = prev[barberId] || {};
      const currentSlots = barberSchedules[date] || getSlotsForDate(barberId, date);

      const updatedSlots = currentSlots.map((slot) => {
        if (slot.time === time) {
          return {
            ...slot,
            status: 'booked' as const,
            clientName,
            serviceName,
          };
        }
        return slot;
      });

      return {
        ...prev,
        [barberId]: {
          ...barberSchedules,
          [date]: updatedSlots,
        },
      };
    });

    showToast('Randevu Eklendi', `${time} saatine ${clientName} adına randevu işlendi.`, 'success');
  };

  const startBookingFlow = (barber: Barber, initialService?: BarberService) => {
    setSelectedBarber(barber);
    if (initialService) {
      setSelectedServicesForBooking([initialService]);
    } else {
      setSelectedServicesForBooking(barber.services.filter((s) => s.popular).slice(0, 1));
    }
    setView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewBarberDetails = (barber: Barber) => {
    setSelectedBarber(barber);
    setView('barber-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        view,
        setView,
        selectedBarber,
        setSelectedBarber,
        selectedServicesForBooking,
        setSelectedServicesForBooking,
        barbers,
        updateBarber,
        favorites,
        toggleFavorite,
        isFavorite,
        appointments,
        activeAppointment,
        createAppointment,
        cancelAppointment,
        lastCreatedAppointment,
        getSlotsForDate,
        toggleSlotStatus,
        addWalkInBooking,
        dashboardBarberId,
        setDashboardBarberId,
        userProfile,
        updateUserProfile,
        toasts,
        showToast,
        removeToast,
        startBookingFlow,
        viewBarberDetails,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
