import React from 'react';
import { useApp } from '../context/AppContext';
import { Scissors, Calendar, Bookmark, User, Store, Search, ArrowLeft } from 'lucide-react';

export const Header: React.FC = () => {
  const { view, setView, appointments, favorites, setSelectedBarber } = useApp();

  const activeAppointmentsCount = appointments.filter((a) => a.status === 'confirmed').length;

  const handleNavClick = (targetView: typeof view) => {
    if (targetView === 'explore') {
      setSelectedBarber(null);
    }
    setView(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isBarberDashboard = view === 'barber-dashboard';

  return (
    <header className="sticky top-0 z-40 bg-[#0c0e12]/95 backdrop-blur-md border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          {view !== 'explore' && !isBarberDashboard && (
            <button
              onClick={() => handleNavClick('explore')}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Geri Dön"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => handleNavClick('explore')}
            className="flex items-center gap-2 group text-left transition-transform active:scale-95"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-all duration-200">
              <Scissors className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white whitespace-nowrap">
              KESİN GEL <span className="text-amber-400">✂</span>
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => handleNavClick('explore')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              view === 'explore' || view === 'barber-detail' || view === 'booking'
                ? 'text-amber-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Berber Bul
            {(view === 'explore' || view === 'barber-detail') && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('appointments')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative flex items-center gap-2 ${
              view === 'appointments'
                ? 'text-amber-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Randevularım</span>
            {activeAppointmentsCount > 0 && (
              <span className="px-1.5 py-0.2 text-[11px] font-bold bg-amber-500 text-slate-950 rounded-full">
                {activeAppointmentsCount}
              </span>
            )}
            {view === 'appointments' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('favorites')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative flex items-center gap-1.5 ${
              view === 'favorites'
                ? 'text-amber-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Favoriler</span>
            {favorites.length > 0 && (
              <span className="text-xs text-slate-400">({favorites.length})</span>
            )}
            {view === 'favorites' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('profile')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              view === 'profile'
                ? 'text-amber-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Profil
            {view === 'profile' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {isBarberDashboard ? (
            <button
              onClick={() => handleNavClick('explore')}
              className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Müşteri Moduna Dön</span>
            </button>
          ) : (
            <button
              onClick={() => handleNavClick('barber-dashboard')}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-98 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Berber misin?</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0c0e12]/95 backdrop-blur-lg border-t border-slate-800 px-3 py-2 flex items-center justify-around">
        <button
          onClick={() => handleNavClick('explore')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-xs font-medium transition-colors ${
            view === 'explore' || view === 'barber-detail' || view === 'booking'
              ? 'text-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>Keşfet</span>
        </button>

        <button
          onClick={() => handleNavClick('appointments')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-xs font-medium transition-colors relative ${
            view === 'appointments' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Calendar className="w-4 h-4" />
            {activeAppointmentsCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeAppointmentsCount}
              </span>
            )}
          </div>
          <span>Randevular</span>
        </button>

        <button
          onClick={() => handleNavClick('favorites')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-xs font-medium transition-colors ${
            view === 'favorites' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Favoriler</span>
        </button>

        <button
          onClick={() => handleNavClick('barber-dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-xs font-medium transition-colors ${
            view === 'barber-dashboard' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Panel</span>
        </button>

        <button
          onClick={() => handleNavClick('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-xs font-medium transition-colors ${
            view === 'profile' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profil</span>
        </button>
      </div>
    </header>
  );
};
