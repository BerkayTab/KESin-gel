import React, { useState } from 'react';
import { Barber } from '../types';
import { useApp } from '../context/AppContext';
import { Star, MapPin, Clock, Heart, Scissors, ArrowRight, ShieldCheck } from 'lucide-react';

interface BarberCardProps {
  barber: Barber;
}

export const BarberCard: React.FC<BarberCardProps> = ({ barber }) => {
  const { isFavorite, toggleFavorite, startBookingFlow, viewBarberDetails } = useApp();
  const favorite = isFavorite(barber.id);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col h-full">
      
      {/* Image & Top Header */}
      <div className="relative aspect-[16/10] bg-slate-800 overflow-hidden cursor-pointer" onClick={() => viewBarberDetails(barber)}>
        {!imgError ? (
          <img
            src={barber.image}
            alt={barber.name}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-400 p-4">
            <Scissors className="w-10 h-10 text-amber-400 mb-2" />
            <span className="text-sm font-semibold text-slate-200">{barber.name}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(barber.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all active:scale-90 ${
            favorite
              ? 'bg-rose-500 text-white shadow-lg'
              : 'bg-black/40 text-white/80 hover:text-white hover:bg-black/60'
          }`}
          aria-label={favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
        >
          <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
        </button>

        {/* District & Location */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-200 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium">{barber.district}, {barber.neighborhood}</span>
          </div>

          <div className="flex items-center gap-1 bg-amber-400/90 text-slate-950 px-2 py-0.5 rounded-md font-bold text-[11px] shadow">
            <Clock className="w-3 h-3" />
            <span>Müsait: {barber.earliestAvailable}</span>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3
                onClick={() => viewBarberDetails(barber)}
                className="text-lg font-bold text-white hover:text-amber-400 cursor-pointer transition-colors leading-snug"
              >
                {barber.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">{barber.description}</p>
            </div>
            
            <div className="flex items-center gap-1 shrink-0 px-2 py-1 bg-slate-800 rounded-lg border border-slate-700/60">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-white tabular-nums">{barber.rating}</span>
              <span className="text-[11px] text-slate-400">({barber.reviewCount})</span>
            </div>
          </div>

          {/* Services preview list */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {barber.services.slice(0, 3).map((svc) => (
              <span
                key={svc.id}
                className="text-[11px] font-medium text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/40"
              >
                {svc.name} · ₺{svc.price}
              </span>
            ))}
            {barber.services.length > 3 && (
              <span className="text-[11px] text-slate-400 px-1 py-0.5">
                +{barber.services.length - 3} daha
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-slate-400 block">Başlangıç</span>
            <div className="text-base font-extrabold text-white tabular-nums">
              ₺{barber.startingPrice}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => viewBarberDetails(barber)}
              className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-xl transition-colors"
            >
              İncele
            </button>
            <button
              onClick={() => startBookingFlow(barber)}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Randevu Al</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
