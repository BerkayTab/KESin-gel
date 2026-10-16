import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarberService } from '../types';
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Instagram,
  Heart,
  ArrowLeft,
  Check,
  Calendar,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const BarberDetailView: React.FC = () => {
  const {
    selectedBarber,
    setView,
    isFavorite,
    toggleFavorite,
    startBookingFlow,
    selectedServicesForBooking,
    setSelectedServicesForBooking,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'services' | 'about' | 'reviews'>('services');

  if (!selectedBarber) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white">Berber bulunamadı.</h2>
        <button
          onClick={() => setView('explore')}
          className="mt-4 px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl"
        >
          Berber Listesine Dön
        </button>
      </div>
    );
  }

  const favorite = isFavorite(selectedBarber.id);

  // Toggle service selection in detail view
  const toggleService = (service: BarberService) => {
    setSelectedServicesForBooking((prev) => {
      const exists = prev.some((s) => s.id === service.id);
      if (exists) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((s) => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const isServiceSelected = (serviceId: string) =>
    selectedServicesForBooking.some((s) => s.id === serviceId);

  const totalPrice = selectedServicesForBooking.reduce((acc, s) => acc + s.price, 0);
  const totalDuration = selectedServicesForBooking.reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className="min-h-screen bg-[#0c0e12] pb-28">
      
      {/* Top Back Header */}
      <div className="border-b border-slate-800 bg-slate-900/60 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => setView('explore')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tüm Berberler</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleFavorite(selectedBarber.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                favorite
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-current text-rose-400' : ''}`} />
              <span>{favorite ? 'Favorilerimde' : 'Favoriye Ekle'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Header Media & Details */}
      <div className="relative bg-slate-900 border-b border-slate-800 overflow-hidden">
        {/* Cover backdrop */}
        <div className="h-48 sm:h-64 relative bg-slate-800 overflow-hidden">
          <img
            src={selectedBarber.coverImage || selectedBarber.image}
            alt={selectedBarber.name}
            className="w-full h-full object-cover object-center filter brightness-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>

        {/* Profile Card Overlay */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative -mt-16 sm:-mt-20 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-[#0c0e12] shadow-2xl bg-slate-800 shrink-0">
              <img
                src={selectedBarber.image}
                alt={selectedBarber.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {selectedBarber.name}
                </h1>
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Onaylı Berber</span>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-4 text-xs sm:text-sm text-slate-300 flex-wrap">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-white tabular-nums">{selectedBarber.rating}</span>
                  <span className="text-slate-400">({selectedBarber.reviewCount} değerlendirme)</span>
                </div>

                <div className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>{selectedBarber.district}, {selectedBarber.neighborhood}</span>
                </div>

                <div className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{selectedBarber.openingHours.open} - {selectedBarber.openingHours.close}</span>
                </div>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                {selectedBarber.description}
              </p>
            </div>

            {/* Quick Action button on desktop */}
            <div className="sm:text-right shrink-0">
              <div className="text-xs text-slate-400 mb-1">En erken müsait:</div>
              <div className="text-sm font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg inline-block mb-3">
                Bugün {selectedBarber.earliestAvailable}
              </div>
              <div>
                <button
                  onClick={() => startBookingFlow(selectedBarber)}
                  className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all"
                >
                  Randevu Oluştur
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 flex items-center gap-2 border-b border-slate-800">
            <button
              onClick={() => setActiveTab('services')}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'services'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Hizmetler & Fiyatlar ({selectedBarber.services.length})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'about'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Berber Hakkında & Konum
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'reviews'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Yorumlar ({selectedBarber.reviews.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* Tab 1: Services */}
        {activeTab === 'services' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Hizmet Seçimi</h2>
              <span className="text-xs text-slate-400">
                Birden fazla hizmet seçebilirsiniz
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedBarber.services.map((service) => {
                const selected = isServiceSelected(service.id);
                return (
                  <div
                    key={service.id}
                    onClick={() => toggleService(service)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      selected
                        ? 'bg-amber-400/10 border-amber-400/80 shadow-md shadow-amber-500/5'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-amber-400/90">{service.category}</span>
                        {service.popular && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-400 text-slate-950 rounded">
                            Popüler
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">{service.name}</h3>
                      {service.description && (
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {service.description}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-3 text-xs text-slate-300">
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{service.durationMinutes} dakika</span>
                        </span>
                        <span>·</span>
                        <span className="text-sm font-extrabold text-white tabular-nums">
                          ₺{service.price}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                        selected
                          ? 'bg-amber-400 border-amber-400 text-slate-950'
                          : 'border-slate-700 bg-slate-800 text-transparent'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: About & Location */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
                <h3 className="text-base font-bold text-white mb-2">Usta Hakkında</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{selectedBarber.bio}</p>
              </div>

              <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
                <h3 className="text-base font-bold text-white mb-3">Dükkan Özellikleri</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selectedBarber.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-slate-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
                <h3 className="text-base font-bold text-white mb-2">Çalışma Saatleri</h3>
                <div className="text-xs text-slate-300 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Hafta İçi & Cumartesi:</span>
                    <span className="font-bold text-white">{selectedBarber.openingHours.open} - {selectedBarber.openingHours.close}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Öğle Molası:</span>
                    <span className="text-amber-400">{selectedBarber.breakHours.start} - {selectedBarber.breakHours.end}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>İzin Günleri:</span>
                    <span className="text-rose-400">{selectedBarber.openingHours.daysOff.join(', ') || 'Yok (Her Gün Açık)'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map & Address Box */}
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-2">Konum & Adres</h3>
                <p className="text-sm text-slate-300 mb-4">{selectedBarber.address}</p>

                {/* Styled Interactive Map Mockup */}
                <div className="w-full h-56 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center p-4 text-center">
                  {/* Subtle map grid effect */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-xl animate-bounce">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-white mt-2">{selectedBarber.name}</span>
                    <span className="text-xs text-slate-400">{selectedBarber.district}, {selectedBarber.city}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(selectedBarber.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl text-center border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Haritalarda Aç</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-4xl font-extrabold text-white tabular-nums">
                  {selectedBarber.rating}
                  <span className="text-sm font-normal text-slate-400"> / 5.0</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-400">
                  {selectedBarber.reviewCount} doğrulanmış KESİN GEL müşterisi
                </p>
              </div>

              <div className="text-xs text-slate-400 max-w-xs">
                Tüm değerlendirmeler yalnızca bu berberden randevu alıp kesin gelen kullanıcılar tarafından yazılmıştır.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedBarber.reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{rev.author}</span>
                    <span className="text-xs text-slate-400">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1 my-1.5 text-amber-400">
                    {[...Array(Math.floor(rev.rating))].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                    <span className="text-xs font-bold text-slate-300 ml-1 tabular-nums">{rev.rating}</span>
                  </div>
                  <div className="text-xs text-amber-400/80 font-medium mb-2">{rev.service}</div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Sticky Bottom Order Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0e12]/95 border-t border-slate-800 backdrop-blur-md px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400">
              Seçilen: <span className="text-slate-200 font-semibold">{selectedServicesForBooking.length} Hizmet</span> ({totalDuration} dk)
            </div>
            <div className="text-lg font-extrabold text-white tabular-nums">
              ₺{totalPrice}
            </div>
          </div>

          <button
            onClick={() => startBookingFlow(selectedBarber)}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <span>Tarih & Saat Seç</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
