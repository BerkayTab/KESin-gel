import React, { useState, useMemo } from 'react';
import { Barber } from '../types';
import { BarberCard } from './BarberCard';
import { SlidersHorizontal, MapPin, ArrowUpDown, Scissors, X } from 'lucide-react';

interface BarberListProps {
  barbers: Barber[];
  searchQuery: string;
  selectedCategory: string;
}

export const BarberList: React.FC<BarberListProps> = ({
  barbers,
  searchQuery,
  selectedCategory,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Tümü');
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'price-asc' | 'price-desc' | 'earliest'>('recommended');
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyTodayAvailable, setOnlyTodayAvailable] = useState<boolean>(false);

  // Extract unique districts
  const districts = useMemo(() => {
    const list = Array.from(new Set(barbers.map((b) => b.district)));
    return ['Tümü', ...list];
  }, [barbers]);

  // Filtering logic
  const filteredBarbers = useMemo(() => {
    return barbers.filter((barber) => {
      // Search query matches name, district, neighborhood, services
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = barber.name.toLowerCase().includes(q);
        const matchesDistrict = barber.district.toLowerCase().includes(q);
        const matchesNeighborhood = barber.neighborhood.toLowerCase().includes(q);
        const matchesServices = barber.services.some((s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
        if (!matchesName && !matchesDistrict && !matchesNeighborhood && !matchesServices) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory) {
        const hasCategory = barber.services.some((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());
        if (!hasCategory) return false;
      }

      // District filter
      if (selectedDistrict !== 'Tümü' && barber.district !== selectedDistrict) {
        return false;
      }

      // Min rating
      if (minRating > 0 && barber.rating < minRating) {
        return false;
      }

      return true;
    });
  }, [barbers, searchQuery, selectedCategory, selectedDistrict, minRating]);

  // Sorting logic
  const sortedBarbers = useMemo(() => {
    return [...filteredBarbers].sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'price-asc') {
        return a.startingPrice - b.startingPrice;
      }
      if (sortBy === 'price-desc') {
        return b.startingPrice - a.startingPrice;
      }
      if (sortBy === 'earliest') {
        return a.earliestAvailable.localeCompare(b.earliestAvailable);
      }
      // 'recommended' - default order
      return 0;
    });
  }, [filteredBarbers, sortBy]);

  const clearAllFilters = () => {
    setSelectedDistrict('Tümü');
    setMinRating(0);
    setSortBy('recommended');
  };

  const hasActiveFilters = selectedDistrict !== 'Tümü' || minRating > 0 || sortBy !== 'recommended';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="berber-listesi">
      
      {/* Header & Controls Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Çevrendeki Berberler
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {sortedBarbers.length} profesyonel berber müsait saatleriyle hazır
          </p>
        </div>

        {/* Sort and View controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Sırala:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="recommended" className="bg-slate-900 text-white">Önerilen</option>
              <option value="rating" className="bg-slate-900 text-white">En Yüksek Puan</option>
              <option value="earliest" className="bg-slate-900 text-white">En Erken Müsait</option>
              <option value="price-asc" className="bg-slate-900 text-white">Fiyat (Düşükten Yükseğe)</option>
              <option value="price-desc" className="bg-slate-900 text-white">Fiyat (Yüksekten Düşüğe)</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Filtreleri Sıfırla</span>
            </button>
          )}
        </div>
      </div>

      {/* District Pill Bar */}
      <div className="py-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-xs font-semibold text-slate-400 shrink-0 flex items-center gap-1 mr-1">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          Bölge:
        </span>
        {districts.map((district) => (
          <button
            key={district}
            onClick={() => setSelectedDistrict(district)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
              selectedDistrict === district
                ? 'bg-white text-slate-950 shadow-md font-bold'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            {district}
          </button>
        ))}

        <div className="h-4 w-[1px] bg-slate-800 mx-2 shrink-0" />

        <button
          onClick={() => setMinRating(minRating === 4.8 ? 0 : 4.8)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
            minRating === 4.8
              ? 'bg-amber-400 text-slate-950 font-bold'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          ★ 4.8+ Berberler
        </button>
      </div>

      {/* Barber Grid */}
      {sortedBarbers.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBarbers.map((barber) => (
            <BarberCard key={barber.id} barber={barber} />
          ))}
        </div>
      ) : (
        /* Empty State with Kesin Gel humor */
        <div className="mt-12 text-center py-16 px-4 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 mx-auto flex items-center justify-center mb-4">
            <Scissors className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">
            Bu bölgede berber bulamadık.
          </h3>
          <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
            Makası bırakıp başka bölgeye bakalım. Aramayı genişlet veya filtreleri temizle.
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-6 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Tüm Berberleri Göster
          </button>
        </div>
      )}

    </section>
  );
};
