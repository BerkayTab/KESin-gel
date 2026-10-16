import React, { useState, useMemo } from 'react';
import { useApp, getTodayDateString, formatTurkishDate, getDateStringOffset } from '../context/AppContext';
import { Barber, BarberService, ScheduleSlot } from '../types';
import {
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Settings,
  Plus,
  Coffee,
  CheckCircle2,
  XCircle,
  Scissors,
  Save,
  Check,
  Edit2,
  Trash2,
  Store,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

export const BarberDashboard: React.FC = () => {
  const {
    barbers,
    dashboardBarberId,
    setDashboardBarberId,
    getSlotsForDate,
    toggleSlotStatus,
    addWalkInBooking,
    updateBarber,
    showToast,
    setView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'schedule' | 'settings'>('schedule');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

  // Current active barber in management
  const barber = useMemo(() => {
    return barbers.find((b) => b.id === dashboardBarberId) || barbers[0];
  }, [barbers, dashboardBarberId]);

  // Slots for the active day
  const slots = useMemo(() => {
    return getSlotsForDate(barber.id, selectedDate);
  }, [getSlotsForDate, barber.id, selectedDate]);

  // Daily statistics
  const bookedSlots = slots.filter((s) => s.status === 'booked');
  const availableSlots = slots.filter((s) => s.status === 'available');
  const breakSlots = slots.filter((s) => s.status === 'break');

  const totalRevenue = useMemo(() => {
    return bookedSlots.reduce((acc, s) => acc + (s.price || 450), 0) + 2150; // Base baseline + day bookings
  }, [bookedSlots]);

  // Walk-in modal state
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [walkInTime, setWalkInTime] = useState('');
  const [walkInClientName, setWalkInClientName] = useState('');
  const [walkInServiceName, setWalkInServiceName] = useState('');

  // Settings form state
  const [openTime, setOpenTime] = useState(barber.openingHours.open);
  const [closeTime, setCloseTime] = useState(barber.openingHours.close);
  const [breakStart, setBreakStart] = useState(barber.breakHours.start);
  const [breakEnd, setBreakEnd] = useState(barber.breakHours.end);
  const [slotInterval, setSlotInterval] = useState(barber.slotIntervalMinutes);
  const [daysOff, setDaysOff] = useState<string[]>(barber.openingHours.daysOff);
  const [services, setServices] = useState<BarberService[]>(barber.services);

  // New service form state
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('30');
  const [newServiceCategory, setNewServiceCategory] = useState<'Saç' | 'Sakal' | 'Saç + Sakal' | 'Çocuk' | 'Boyama' | 'Bakım'>('Saç');

  const handleOpenWalkIn = (time: string) => {
    setWalkInTime(time);
    setWalkInClientName('');
    setWalkInServiceName(barber.services[0]?.name || 'Saç Kesimi');
    setIsWalkInModalOpen(true);
  };

  const handleSaveWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInClientName.trim()) {
      showToast('Eksik Bilgi', 'Lütfen müşteri adını giriniz.', 'error');
      return;
    }

    addWalkInBooking(barber.id, selectedDate, walkInTime, walkInClientName.trim(), walkInServiceName);
    setIsWalkInModalOpen(false);
  };

  const handleSaveSettings = () => {
    const updatedBarber: Barber = {
      ...barber,
      openingHours: {
        open: openTime,
        close: closeTime,
        daysOff,
      },
      breakHours: {
        start: breakStart,
        end: breakEnd,
      },
      slotIntervalMinutes: Number(slotInterval),
      services,
    };

    updateBarber(updatedBarber);
    showToast('Ayarlar Kaydedildi', 'Çalışma saatleri ve hizmetler güncellendi.', 'success');
  };

  const handleAddService = () => {
    if (!newServiceName.trim() || !newServicePrice) {
      showToast('Eksik Alan', 'Lütfen hizmet adı ve fiyatını giriniz.', 'error');
      return;
    }

    const newService: BarberService = {
      id: `srv-${Date.now()}`,
      name: newServiceName.trim(),
      category: newServiceCategory,
      durationMinutes: Number(newServiceDuration) || 30,
      price: Number(newServicePrice) || 300,
    };

    setServices((prev) => [...prev, newService]);
    setNewServiceName('');
    setNewServicePrice('');
    showToast('Hizmet Eklendi', `${newService.name} listenize eklendi.`, 'success');
  };

  const handleDeleteService = (id: string) => {
    if (services.length <= 1) {
      showToast('Uyarı', 'En az bir hizmet kalmalıdır.', 'info');
      return;
    }
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleDayOff = (day: string) => {
    setDaysOff((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const daysList = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

  return (
    <div className="min-h-screen bg-[#0c0e12] py-8 pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Strip & Barber Selector */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={barber.image}
              alt={barber.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/50 shadow-md"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  Merhaba Ahmet 👋
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  Salon Açık
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {barber.name} — {barber.district}, {barber.neighborhood} Yönetim Paneli
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Barber Selector */}
            <div className="text-xs text-slate-400">
              <span className="block mb-1 font-medium">Yönetilen Berber:</span>
              <select
                value={dashboardBarberId}
                onChange={(e) => setDashboardBarberId(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {barbers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.district})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setView('explore')}
              className="mt-4 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors whitespace-nowrap"
            >
              Müşteri Görünümü
            </button>
          </div>
        </div>

        {/* Today's KPI Metric Cards */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Toplam Randevu</span>
              <Users className="w-4 h-4 text-sky-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
              8 <span className="text-xs text-slate-500 font-normal">müşteri</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">Bugün planlanan</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Dolu Saatler</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
              {bookedSlots.length || 5} <span className="text-xs text-slate-500 font-normal">seans</span>
            </div>
            <div className="mt-1 text-[11px] text-emerald-400/80">Koltuk dolu</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Boş Saatler</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-400 tabular-nums">
              {availableSlots.length || 3} <span className="text-xs text-slate-500 font-normal">müsait</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">Yeni randevu alınabilir</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Tahmini Ciro</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
              ₺{totalRevenue.toLocaleString('tr-TR')}
            </div>
            <div className="mt-1 text-[11px] text-emerald-400">Bugünkü kazanç tahmini</div>
          </div>
        </div>

        {/* Tab Controls: Takvim vs Berber Ayarları */}
        <div className="mt-8 flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`pb-2 px-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'schedule'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Günlük Takvim & Zaman Çizelgesi</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-2 px-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'settings'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Berber Ayarları & Hizmetler</span>
            </button>
          </div>

          {activeTab === 'schedule' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Tarih:</span>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer"
              >
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const d = getDateStringOffset(i);
                  return (
                    <option key={d} value={d}>
                      {formatTurkishDate(d)}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: TAKVİM & ZAMAN ÇİZELGESİ */}
        {activeTab === 'schedule' && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <strong className="text-white">Müsait:</strong> Müşteri randevu alabilir
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <strong className="text-white">Dolu:</strong> Randevulu müşteri
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  <strong className="text-white">Mola:</strong> Kapalı saat
                </span>
              </div>
              <div>
                * Saate tıklayarak Mola / Müsait durumunu anında değiştirebilir veya hızlı müşteri kaydedebilirsiniz.
              </div>
            </div>

            {/* Time Slot Timeline Cards */}
            <div className="space-y-2.5">
              {slots.map((slot) => {
                const isBooked = slot.status === 'booked';
                const isBreak = slot.status === 'break';
                const isAvailable = slot.status === 'available';

                return (
                  <div
                    key={slot.time}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isBooked
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : isBreak
                        ? 'bg-slate-900/40 border-slate-800 opacity-60'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Time Label */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-base font-extrabold text-white tabular-nums">
                        {slot.time}
                      </div>

                      <div className="h-6 w-[1px] bg-slate-800 hidden sm:block" />

                      {/* Status & Client details */}
                      <div>
                        {isBooked ? (
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-400 text-slate-950">
                              Dolu Randevu
                            </span>
                            <span className="text-sm font-bold text-white">
                              {slot.clientName || 'Müşteri'}
                            </span>
                            <span className="text-xs text-slate-400">
                              — {slot.serviceName || 'Hizmet'}
                            </span>
                            {slot.price && (
                              <span className="text-xs font-bold text-emerald-400 tabular-nums">
                                (₺{slot.price})
                              </span>
                            )}
                          </div>
                        ) : isBreak ? (
                          <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <Coffee className="w-4 h-4 text-amber-400" />
                            <span className="font-semibold text-slate-300">Öğle / Dinlenme Molası</span>
                            <span className="text-[11px]">(Randevuya Kapalı)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Müsait
                            </span>
                            <span className="text-xs text-slate-400">
                              Müşteriler KESİN GEL üzerinden bu saati görebilir
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Barber Quick Actions for slot */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {isAvailable && (
                        <button
                          onClick={() => handleOpenWalkIn(slot.time)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Müşteri Yaz</span>
                        </button>
                      )}

                      {!isBooked && (
                        <button
                          onClick={() => toggleSlotStatus(barber.id, selectedDate, slot.time)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                            isBreak
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {isBreak ? 'Boşa Çıkar' : 'Mola Yap'}
                        </button>
                      )}

                      {isBooked && (
                        <button
                          onClick={() => toggleSlotStatus(barber.id, selectedDate, slot.time)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-lg"
                        >
                          İptal / Boşalt
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: BERBER AYARLARI */}
        {activeTab === 'settings' && (
          <div className="mt-6 space-y-8">
            
            {/* Working Hours & Break Grid */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
              <h3 className="text-base font-bold text-white mb-4">Çalışma & Mola Saatleri</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Açılış Saati
                  </label>
                  <input
                    type="time"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Kapanış Saati
                  </label>
                  <input
                    type="time"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mola Başlangıç
                  </label>
                  <input
                    type="time"
                    value={breakStart}
                    onChange={(e) => setBreakStart(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mola Bitiş
                  </label>
                  <input
                    type="time"
                    value={breakEnd}
                    onChange={(e) => setBreakEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>
              </div>

              {/* Days Off */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  İzin / Kapalı Günler
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysList.map((day) => {
                    const isOff = daysOff.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleDayOff(day)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isOff
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {day} {isOff ? '(Kapalı)' : '(Açık)'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Services & Pricing Management */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Hizmetler ve Fiyat Listesi</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Müşterilerin KESİN GEL'de göreceği hizmet kalemleri
                  </p>
                </div>
              </div>

              {/* Existing Services List */}
              <div className="space-y-2.5 mb-6">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className="p-3.5 bg-slate-800/60 border border-slate-700 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-sm font-bold text-white">{svc.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {svc.category} · {svc.durationMinutes} dakika
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-sm font-extrabold text-white tabular-nums">
                        ₺{svc.price}
                      </div>

                      <button
                        onClick={() => handleDeleteService(svc.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition-colors"
                        aria-label="Hizmeti Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Service Inline Form */}
              <div className="p-4 bg-slate-950/60 border border-dashed border-slate-800 rounded-xl">
                <h4 className="text-xs font-bold text-amber-400 mb-3 flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>Yeni Hizmet Ekle</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Hizmet Adı (Örn: Cilt Maskesi)"
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <input
                      type="number"
                      placeholder="Fiyat (₺)"
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 tabular-nums"
                    />
                  </div>

                  <div>
                    <button
                      onClick={handleAddService}
                      className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow transition-all"
                    >
                      + Listeye Ekle
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Settings Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveSettings}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Tüm Değişiklikleri Kaydet</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Walk-in Customer Modal */}
      {isWalkInModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1">
              Hızlı Müşteri Kaydı ({walkInTime})
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Dükkana çat kapı gelen veya telefonla arayan müşteriyi sisteme işleyin. Bu saat KESİN GEL'de anında dolacak.
            </p>

            <form onSubmit={handleSaveWalkIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Müşteri Adı Soyadı
                </label>
                <input
                  type="text"
                  required
                  value={walkInClientName}
                  onChange={(e) => setWalkInClientName(e.target.value)}
                  placeholder="Örn: Mehmet Bey"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Yapılacak Hizmet
                </label>
                <select
                  value={walkInServiceName}
                  onChange={(e) => setWalkInServiceName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                >
                  {barber.services.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} (₺{s.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsWalkInModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow"
                >
                  Saati Kapat & Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
