import React from 'react';
import { useApp } from '../context/AppContext';
import { BarberCard } from './BarberCard';
import { Heart, Scissors, ArrowRight } from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const { barbers, favorites, setView } = useApp();

  const favoriteBarbers = barbers.filter((b) => favorites.includes(b.id));

  return (
    <div className="min-h-screen bg-[#0c0e12] py-10 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="pb-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Favori Berberlerim</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20 tabular-nums">
                {favoriteBarbers.length}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Hızlı randevu almak için kaydettiğiniz berberler
            </p>
          </div>

          <button
            onClick={() => setView('explore')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            Tüm Berberleri Gör
          </button>
        </div>

        {/* Favorite Barbers Grid */}
        {favoriteBarbers.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteBarbers.map((barber) => (
              <BarberCard key={barber.id} barber={barber} />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center py-16 px-4 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center mb-4">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Henüz favori berberin yok
            </h3>
            <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
              Berber kartlarındaki kalp ikonuna tıklayarak favori ustalarını buraya ekleyebilirsin.
            </p>
            <button
              onClick={() => setView('explore')}
              className="mt-6 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow transition-all inline-flex items-center gap-1.5"
            >
              <span>Berberleri Keşfet</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
