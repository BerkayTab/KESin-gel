import React from 'react';
import { Search, MapPin, Sparkles, Clock, CheckCircle } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onSearchSubmit: () => void;
}

const QUICK_FILTERS = [
  'Tümü',
  'Saç',
  'Sakal',
  'Saç + Sakal',
  'Çocuk',
  'Boyama',
];

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onSearchSubmit,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  };

  return (
    <div className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-[#11141b] via-[#0c0e12] to-[#0c0e12]">
      {/* Subtle background ambient artwork */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img
          src="/src/assets/images/hero_barber_interior_1792159430561.jpg"
          alt="Modern Barber Lounge"
          className="w-full h-full object-cover object-center filter blur-[1px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e12] via-[#0c0e12]/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-16 md:pb-20 text-center">
        {/* Brand slogan lead-in */}
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Berberi arama. Boş saati gör. Randevunu al. Kesin gel.</span>
        </div>

        {/* Big headline with balance */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.12] max-w-3xl mx-auto">
          Berberi arama. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
            Boş saati gör.
          </span>
        </h1>

        {/* Subtext */}
        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Yakınındaki berberleri keşfet, müsait saatleri anında gör ve randevunu saniyeler içinde al. Telefonla uğraşmak yok.
        </p>

        {/* Search input form */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-stretch gap-2 p-2 bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md">
            <div className="flex-1 flex items-center gap-3 px-3 py-2">
              <Search className="w-5 h-5 text-amber-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Berber, hizmet veya bölge ara (Kadıköy, Beşiktaş...)"
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded"
                >
                  Temizle
                </button>
              )}
            </div>

            <button
              onClick={onSearchSubmit}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              <span>Berber Bul</span>
            </button>
          </div>
        </div>

        {/* Quick category filter buttons */}
        <div className="mt-6 flex items-center justify-center gap-2 flex-wrap max-w-xl mx-auto">
          <span className="text-xs text-slate-400 font-medium mr-1">Hızlı Filtre:</span>
          {QUICK_FILTERS.map((cat) => {
            const isActive = selectedCategory === (cat === 'Tümü' ? '' : cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === 'Tümü' ? '' : cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Trust metrics bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-xl mx-auto text-center">
          <div>
            <div className="text-lg sm:text-xl font-bold text-white tabular-nums">0 Arama</div>
            <div className="text-xs text-slate-400 mt-0.5">Telefon meşgul derdi yok</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-amber-400 tabular-nums">Canlı Saatler</div>
            <div className="text-xs text-slate-400 mt-0.5">Gerçek zamanlı müsaitlik</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-emerald-400 tabular-nums">%100 Kesin</div>
            <div className="text-xs text-slate-400 mt-0.5">Randevun koltukta hazır</div>
          </div>
        </div>

      </div>
    </div>
  );
};
