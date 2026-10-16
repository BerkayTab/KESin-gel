import React, { useState } from 'react';
import { useApp, formatTurkishDate, getTodayDateString } from '../context/AppContext';
import { Appointment } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  Scissors,
  CheckCircle,
  XCircle,
  Repeat,
  Navigation,
  ChevronRight,
} from 'lucide-react';

export const MyAppointments: React.FC = () => {
  const { appointments, cancelAppointment, barbers, startBookingFlow, setView } = useApp();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const activeAppointments = appointments.filter((a) => a.status === 'confirmed');
  const pastAppointments = appointments.filter((a) => a.status !== 'confirmed');

  const handleCancelClick = (appointmentId: string) => {
    cancelAppointment(appointmentId);
    setCancellingId(null);
  };

  const handleRebook = (appointment: Appointment) => {
    const barber = barbers.find((b) => b.id === appointment.barberId);
    if (barber) {
      startBookingFlow(barber, appointment.services[0]);
    } else {
      setView('explore');
    }
  };

  const todayStr = getTodayDateString();

  return (
    <div className="min-h-screen bg-[#0c0e12] py-10 pb-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="pb-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Randevularım</h1>
            <p className="text-sm text-slate-400 mt-1">
              Aktif ve geçmiş berber randevularınız
            </p>
          </div>

          <button
            onClick={() => setView('explore')}
            className="px-4 py-2 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 text-xs font-bold rounded-xl transition-colors"
          >
            + Yeni Randevu Al
          </button>
        </div>

        {/* SECTION 1: AKTİF RANDEVULAR */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Aktif Randevular</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold tabular-nums">
                {activeAppointments.length}
              </span>
            </h2>
          </div>

          {activeAppointments.length > 0 ? (
            <div className="space-y-4">
              {activeAppointments.map((apt) => {
                const isToday = apt.date === todayStr;
                return (
                  <div
                    key={apt.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isToday
                        ? 'bg-slate-900/90 border-amber-500/50 shadow-xl shadow-amber-500/5'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    {isToday && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 text-xs font-bold mb-3">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Bugünkü Randevun! Kesin Gel.</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Barber & Service Info */}
                      <div className="flex items-start gap-4">
                        <img
                          src={apt.barberImage}
                          alt={apt.barberName}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white">{apt.barberName}</h3>
                            <span className="text-xs text-slate-400">· {apt.barberDistrict}</span>
                          </div>
                          
                          <div className="text-sm text-amber-400/90 font-medium mt-0.5">
                            {apt.services.map((s) => s.name).join(' + ')}
                          </div>

                          <div className="flex items-center gap-3 mt-2 text-xs text-slate-300">
                            <span className="flex items-center gap-1 text-slate-200 font-semibold">
                              <Calendar className="w-3.5 h-3.5 text-amber-400" />
                              <span>{formatTurkishDate(apt.date)}</span>
                            </span>
                            <span>—</span>
                            <span className="flex items-center gap-1 font-bold text-emerald-400 tabular-nums">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{apt.time}</span>
                            </span>
                          </div>

                          {apt.clientNote && (
                            <p className="text-xs text-slate-400 mt-2 italic">
                              Notunuz: "{apt.clientNote}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Pricing & Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                        <div className="text-right">
                          <span className="text-xs text-slate-400 block">Tutar</span>
                          <span className="text-xl font-extrabold text-white tabular-nums">
                            ₺{apt.totalPrice}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(apt.barberName + ' ' + apt.barberDistrict)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
                          >
                            <Navigation className="w-3.5 h-3.5 text-sky-400" />
                            <span>Yol Tarifi</span>
                          </a>

                          <button
                            onClick={() => setCancellingId(apt.id)}
                            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold rounded-lg transition-colors"
                          >
                            İptal Et
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Cancel confirmation modal / inline prompt */}
                    {cancellingId === apt.id && (
                      <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-rose-300">
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                          <span>Bu randevuyu iptal etmek istediğinize emin misiniz? Berberin saati boşa çıkacaktır.</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setCancellingId(null)}
                            className="px-3 py-1 bg-slate-800 text-slate-300 hover:text-white text-xs rounded-lg"
                          >
                            Vazgeç
                          </button>
                          <button
                            onClick={() => handleCancelClick(apt.id)}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg"
                          >
                            Evet, İptal Et
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          ) : (
            /* Witty Empty State */
            <div className="p-8 sm:p-12 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 mx-auto flex items-center justify-center mb-4">
                <Scissors className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Bugün boşsun. Berber de boş.
              </h3>
              <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                Daha ne bekliyorsun? Hemen çevrendeki berberlerin boş saatini gör, randevunu saniyeler içinde al.
              </p>
              <button
                onClick={() => setView('explore')}
                className="mt-5 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-1.5"
              >
                <span>Hemen Berber Bul</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* SECTION 2: GEÇMİŞ RANDEVULAR */}
        {pastAppointments.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-800">
            <h2 className="text-base font-bold text-white mb-4">
              Geçmiş Randevularım
            </h2>

            <div className="space-y-3">
              {pastAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 bg-slate-900/30 border border-slate-800/80 rounded-xl flex items-center justify-between gap-4 opacity-80 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={apt.barberImage}
                      alt={apt.barberName}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-800"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-sm font-bold text-white">{apt.barberName}</div>
                      <div className="text-xs text-slate-400">
                        {apt.services.map((s) => s.name).join(' + ')} · {apt.date} {apt.time}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        apt.status === 'cancelled'
                          ? 'bg-rose-500/10 text-rose-400'
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {apt.status === 'cancelled' ? 'İptal Edildi' : 'Tamamlandı'}
                    </span>

                    <button
                      onClick={() => handleRebook(apt)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Repeat className="w-3 h-3 text-amber-400" />
                      <span>Tekrar Randevu Al</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
