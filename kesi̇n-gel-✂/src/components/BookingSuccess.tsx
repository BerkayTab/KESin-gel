import { buildAppointmentCalendar } from '../utils/calendar';
import React from 'react';
import { useApp, formatTurkishDate } from '../context/AppContext';
import { CheckCircle2, Calendar, Clock, MapPin, Scissors, Sparkles, Navigation, ArrowRight, Share2 } from 'lucide-react';

export const BookingSuccess: React.FC = () => {
  const { lastCreatedAppointment, setView, showToast } = useApp();

  if (!lastCreatedAppointment) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white">Randevu bilgisi bulunamadı.</h2>
        <button
          onClick={() => setView('explore')}
          className="mt-4 px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl"
        >
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  const handleDownloadCalendar = () => {
    const icsContent = buildAppointmentCalendar(lastCreatedAppointment);

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kesingel-randevu-${lastCreatedAppointment.time.replace(':', '')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    showToast('Takvim İndirildi', 'Randevu takviminize eklenebilir dosya olarak indi.', 'success');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'KESİN GEL Randevum',
        text: `${lastCreatedAppointment.barberName} - ${lastCreatedAppointment.time} randevum hazır. Kesin gidiyorum!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      showToast('Randevu Özeti Kopyalandı', `${lastCreatedAppointment.barberName} - ${lastCreatedAppointment.time}`, 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0e12] py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Big Check Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/20 mb-6">
          <Scissors className="w-10 h-10 animate-pulse" />
        </div>

        {/* Big Catchy Titles */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Randevun hazır. 😎
        </h1>

        <p className="mt-3 text-lg font-bold text-amber-400">
          Şimdi tek bir görevin var: <span className="underline decoration-wavy decoration-amber-400">KESİN GEL.</span>
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Usta koltuğu ve aletleri senin için ayarladı, saati başkasına kapattı.
        </p>

        {/* Details Card */}
        <div className="mt-8 p-5 bg-slate-950/70 border border-slate-800/90 rounded-2xl text-left space-y-3.5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <img
              src={lastCreatedAppointment.barberImage}
              alt={lastCreatedAppointment.barberName}
              className="w-12 h-12 rounded-xl object-cover border border-slate-700"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="text-sm font-bold text-white">{lastCreatedAppointment.barberName}</div>
              <div className="text-xs text-slate-400">{lastCreatedAppointment.barberDistrict}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{formatTurkishDate(lastCreatedAppointment.date)}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-300 font-bold">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-white text-sm tabular-nums">{lastCreatedAppointment.time}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">
              {lastCreatedAppointment.services.map((s) => s.name).join(' + ')}
            </span>
            <span className="text-base font-extrabold text-white tabular-nums">
              ₺{lastCreatedAppointment.totalPrice}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            Müşteri: <strong className="text-slate-200">{lastCreatedAppointment.clientName}</strong> ({lastCreatedAppointment.clientPhone})
          </div>
        </div>

        {/* Auxiliary Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={handleDownloadCalendar}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Takvime Ekle</span>
          </button>

          <button
            onClick={handleShare}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Paylaş / Kopyala</span>
          </button>
        </div>

        {/* Primary Navigation Buttons */}
        <div className="mt-6 space-y-2.5">
          <button
            onClick={() => setView('appointments')}
            className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Randevularımı Gör</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setView('explore')}
            className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>

      </div>
    </div>
  );
};
