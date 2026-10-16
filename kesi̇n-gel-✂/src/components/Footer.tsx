import React from 'react';
import { useApp } from '../context/AppContext';
import { Scissors } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setView } = useApp();

  return (
    <footer className="border-t border-slate-800/80 bg-[#090b0e] py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand Lockup */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-white font-extrabold text-base">
            <span className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Scissors className="w-4 h-4" />
            </span>
            <span>KESİN GEL ✂</span>
          </div>
          <span className="hidden sm:inline text-slate-700">·</span>
          <span className="text-slate-400">
            "Berberi arama. Boş saati gör. Randevunu al. Kesin gel."
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-slate-400 font-medium">
          <button
            onClick={() => {
              setView('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-white transition-colors"
          >
            Berberler
          </button>
          <button
            onClick={() => {
              setView('barber-dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-amber-400 transition-colors"
          >
            Berber Girişi
          </button>
          <button
            onClick={() => {
              setView('profile');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-white transition-colors"
          >
            Profil
          </button>
          <span className="text-slate-600">© 2026 KESİN GEL</span>
        </div>

      </div>
    </footer>
  );
};
