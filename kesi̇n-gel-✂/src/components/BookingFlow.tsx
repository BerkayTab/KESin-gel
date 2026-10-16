import React, { useState, useMemo } from 'react';
import { useApp, getTodayDateString, getDateStringOffset, formatTurkishDate } from '../context/AppContext';
import { BarberService } from '../types';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Scissors,
  Check,
  User,
  Phone,
  FileText,
  ShieldCheck,
} from 'lucide-react';

export const BookingFlow: React.FC = () => {
  const {
    selectedBarber,
    setView,
    selectedServicesForBooking,
    setSelectedServicesForBooking,
    createAppointment,
    getSlotsForDate,
    userProfile,
  } = useApp();

  // If no barber selected, return to explore
  if (!selectedBarber) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400">Lütfen önce bir berber seçiniz.</p>
        <button
          onClick={() => setView('explore')}
          className="mt-4 px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl"
        >
          Berber Listesi
        </button>
      </div>
    );
  }

  // Next 7 days
  const dateOptions = useMemo(() => {
    const list = [];
    for (let i = 0; i < 7; i++) {
      const dStr = getDateStringOffset(i);
      list.push({
        dateStr: dStr,
        label: formatTurkishDate(dStr),
        isToday: i === 0,
      });
    }
    return list;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Client info state (prefilled from userProfile for zero unnecessary friction)
  const [clientName, setClientName] = useState<string>(userProfile.name);
  const [clientPhone, setClientPhone] = useState<string>(userProfile.phone);
  const [clientNote, setClientNote] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Available slots for selected date & barber
  const scheduleSlots = useMemo(() => {
    return getSlotsForDate(selectedBarber.id, selectedDate);
  }, [getSlotsForDate, selectedBarber.id, selectedDate]);

  // Pricing & duration calculation
  const totalPrice = selectedServicesForBooking.reduce((acc, s) => acc + s.price, 0);
  const totalDuration = selectedServicesForBooking.reduce((acc, s) => acc + s.durationMinutes, 0);

  const toggleService = (service: BarberService) => {
    setSelectedServicesForBooking((prev) => {
      const exists = prev.some((s) => s.id === service.id);
      if (exists) {
        if (prev.length === 1) return prev; // Must have at least 1 service
        return prev.filter((s) => s.id !== service.id);
      }
      return [...prev, service];
    });
  };

  const handleBookingSubmit = () => {
    setFormError('');

    if (selectedServicesForBooking.length === 0) {
      setFormError('Lütfen en az bir hizmet seçiniz.');
      return;
    }
    if (!selectedDate) {
      setFormError('Lütfen bir tarih seçiniz.');
      return;
    }
    if (!selectedTime) {
      setFormError('Lütfen müsait bir randevu saati seçiniz.');
      return;
    }
    if (!clientName.trim()) {
      setFormError('Lütfen ad ve soyadınızı belirtiniz.');
      return;
    }
    if (!clientPhone.trim() || clientPhone.trim().length < 7) {
      setFormError('Lütfen geçerli bir telefon numarası giriniz.');
      return;
    }

    setIsSubmitting(true);

    // Micro-delay for realistic tactile confirmation
    setTimeout(() => {
      createAppointment({
        barberId: selectedBarber.id,
        barberName: selectedBarber.name,
        barberImage: selectedBarber.image,
        barberDistrict: selectedBarber.district,
        services: selectedServicesForBooking,
        totalPrice,
        totalDuration,
        date: selectedDate,
        time: selectedTime,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientNote: clientNote.trim() || undefined,
      });
      setIsSubmitting(false);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#0c0e12] py-8 pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <button
            onClick={() => setView('barber-detail')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{selectedBarber.name} Bilgilerine Dön</span>
          </button>
          <div className="text-xs font-semibold text-amber-400">
            Adım Adım Hızlı Randevu
          </div>
        </div>

        {/* Main Grid: Left Steps, Right Summary */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Booking Steps */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* STEP 1: HİZMET SEÇ */}
            <div className="p-5 sm:p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-base font-bold text-white">Hizmet Seçimi</h2>
                </div>
                <span className="text-xs text-slate-400">
                  {selectedServicesForBooking.length} seçildi
                </span>
              </div>

              <div className="space-y-2.5">
                {selectedBarber.services.map((svc) => {
                  const isSelected = selectedServicesForBooking.some((s) => s.id === svc.id);
                  return (
                    <div
                      key={svc.id}
                      onClick={() => toggleService(svc)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-amber-400/10 border-amber-400 text-white'
                          : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-amber-400 border-amber-400 text-slate-950'
                              : 'border-slate-600 bg-slate-800 text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{svc.name}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{svc.durationMinutes} dk</span>
                            <span>·</span>
                            <span>{svc.category}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm font-extrabold text-white tabular-nums">
                        ₺{svc.price}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: TARİH SEÇ */}
            <div className="p-5 sm:p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h2 className="text-base font-bold text-white">Tarih Seç</h2>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {dateOptions.map((opt) => {
                  const isSelected = selectedDate === opt.dateStr;
                  return (
                    <button
                      key={opt.dateStr}
                      onClick={() => {
                        setSelectedDate(opt.dateStr);
                        setSelectedTime(''); // Reset time on date change
                      }}
                      className={`px-4 py-3 rounded-xl border text-left shrink-0 transition-all ${
                        isSelected
                          ? 'bg-amber-400 border-amber-400 text-slate-950 shadow-md font-bold'
                          : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="text-[11px] uppercase tracking-wider opacity-80">
                        {opt.isToday ? 'Bugün' : 'Tarih'}
                      </div>
                      <div className="text-sm font-bold mt-0.5 whitespace-nowrap">
                        {opt.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: SAAT SEÇ (Dolu / Müsait Kontrolü) */}
            <div className="p-5 sm:p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-base font-bold text-white">Müsait Saat Seç</h2>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                    <span>Müsait</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
                    <span>Dolu / Mola</span>
                  </div>
                </div>
              </div>

              {/* Time Slots Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {scheduleSlots.map((slot) => {
                  const isAvailable = slot.status === 'available';
                  const isSelected = selectedTime === slot.time;

                  if (!isAvailable) {
                    return (
                      <div
                        key={slot.time}
                        className="py-3 px-2 rounded-xl bg-slate-800/30 border border-slate-800 text-center opacity-40 cursor-not-allowed select-none"
                      >
                        <div className="text-xs font-semibold line-through text-slate-400">
                          {slot.time}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                          {slot.status === 'break' ? 'Mola' : 'Dolu'}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={slot.time}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`py-3 px-2 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-amber-400 border-amber-400 text-slate-950 shadow-md font-extrabold ring-2 ring-amber-400/30'
                          : 'bg-slate-800/70 border-slate-700/60 hover:border-amber-400/50 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <div className="text-sm font-bold">{slot.time}</div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          isSelected ? 'text-slate-950 font-bold' : 'text-emerald-400'
                        }`}
                      >
                        Müsait
                      </div>
                    </button>
                  );
                })}
              </div>

              {!selectedTime && (
                <p className="mt-3 text-xs text-amber-400/80">
                  Lütfen yukarıdan boş (yeşil etiketli) bir saat dilimine tıklayınız.
                </p>
              )}
            </div>

            {/* STEP 4: MÜŞTERİ BİLGİLERİ (Gereksiz form yok) */}
            <div className="p-5 sm:p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <h2 className="text-base font-bold text-white">İletişim Bilgilerin</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Ad Soyad
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Adınız ve Soyadınız"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Telefon Numarası (SMS Onayı & Hatırlatma için)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="0532 123 45 67"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Özel Not / İstek (Opsiyonel)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={clientNote}
                      onChange={(e) => setClientNote(e.target.value)}
                      placeholder="Örn: Yanlar kısa, üstler doğal kalsın."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Live Summary & Confirmation */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
              <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
                Randevu Özeti
              </h3>

              {/* Barber Snapshot */}
              <div className="mt-4 flex items-center gap-3">
                <img
                  src={selectedBarber.image}
                  alt={selectedBarber.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedBarber.name}</h4>
                  <p className="text-xs text-slate-400">{selectedBarber.district}, {selectedBarber.city}</p>
                </div>
              </div>

              {/* Services Itemized */}
              <div className="mt-5 space-y-2 py-3 border-t border-b border-slate-800">
                <div className="text-xs font-semibold text-slate-400 mb-1">Seçilen Hizmetler:</div>
                {selectedServicesForBooking.map((s) => (
                  <div key={s.id} className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">{s.name} ({s.durationMinutes} dk)</span>
                    <span className="font-bold text-white tabular-nums">₺{s.price}</span>
                  </div>
                ))}
              </div>

              {/* Date & Time chosen */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tarih:</span>
                  <span className="font-semibold text-white">
                    {formatTurkishDate(selectedDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Saat:</span>
                  <span className={`font-bold ${selectedTime ? 'text-amber-400' : 'text-slate-500'}`}>
                    {selectedTime ? selectedTime : 'Henüz seçilmedi'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tahmini Süre:</span>
                  <span className="font-semibold text-white">{totalDuration} dakika</span>
                </div>
              </div>

              {/* Total & Action */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="text-xs text-slate-400 block">Toplam Tutar</span>
                    <span className="text-2xl font-extrabold text-white tabular-nums">
                      ₺{totalPrice}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Ödeme salonda yapılır
                  </span>
                </div>

                {formError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{formError}</span>
                  </div>
                )}

                <button
                  disabled={isSubmitting || !selectedTime}
                  onClick={handleBookingSubmit}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${
                    !selectedTime
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : isSubmitting
                      ? 'bg-amber-400/80 text-slate-950 cursor-wait'
                      : 'bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950'
                  }`}
                >
                  {isSubmitting ? (
                    <span>Randevu Oluşturuluyor...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Randevuyu Onayla</span>
                    </>
                  )}
                </button>

                <p className="mt-3 text-[11px] text-center text-slate-400 leading-normal">
                  "Berberi arama. Boş saati gör. Randevunu al. <strong className="text-amber-400">Kesin gel.</strong>"
                </p>
              </div>

            </div>

            {/* Trust badge */}
            <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl text-xs text-slate-400 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Onayladığınızda seçtiğiniz saat anında kapatılır ve berberin sistemine işlenir. Telefonla teyit etmenize gerek kalmaz.
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
