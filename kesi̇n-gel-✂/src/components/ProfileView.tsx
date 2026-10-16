import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Phone, Mail, MapPin, ShieldCheck, Bell, Award, Check, Scissors } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { userProfile, updateUserProfile, appointments, favorites, setView } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [phone, setPhone] = useState(userProfile.phone);
  const [email, setEmail] = useState(userProfile.email);
  const [district, setDistrict] = useState(userProfile.district);
  const [smsNotifications, setSmsNotifications] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, phone, email, district });
  };

  const totalCompletedAppointments = appointments.filter((a) => a.status === 'completed').length;

  return (
    <div className="min-h-screen bg-[#0c0e12] py-10 pb-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="pb-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-white tracking-tight">Kullanıcı Profili</h1>
          <p className="text-sm text-slate-400 mt-1">
            Randevularınızda otomatik kullanılacak kişisel bilgileriniz
          </p>
        </div>

        {/* User Card */}
        <div className="mt-8 p-6 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-extrabold text-2xl border border-amber-400/30">
              {name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{name}</h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Doğrulanmış Üye
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{phone} · {district}, İstanbul</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-center border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-800">
            <div>
              <div className="text-xl font-extrabold text-white tabular-nums">{appointments.length}</div>
              <div className="text-[11px] text-slate-400">Toplam Randevu</div>
            </div>
            <div className="h-8 w-[1px] bg-slate-800" />
            <div>
              <div className="text-xl font-extrabold text-amber-400 tabular-nums">{favorites.length}</div>
              <div className="text-[11px] text-slate-400">Favori Berber</div>
            </div>
          </div>
        </div>

        {/* Profile Settings Form */}
        <form onSubmit={handleSubmit} className="mt-8 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-5">
          <h3 className="text-base font-bold text-white mb-2">Bilgileri Güncelle</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Ad Soyad
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Telefon Numarası
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tercih Edilen İlçe
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white cursor-pointer"
                >
                  <option value="Kadıköy">Kadıköy</option>
                  <option value="Beşiktaş">Beşiktaş</option>
                  <option value="Bakırköy">Bakırköy</option>
                  <option value="Nişantaşı">Nişantaşı</option>
                  <option value="Şişli">Şişli</option>
                  <option value="Ataşehir">Ataşehir</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">SMS Hatırlatmaları</span>
                <span className="text-[11px] text-slate-400">
                  Randevudan 2 saat önce hatırlatma SMS'i al
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSmsNotifications(!smsNotifications)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  smsNotifications ? 'bg-amber-400' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                    smsNotifications ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow transition-all"
            >
              Profili Kaydet
            </button>
          </div>
        </form>

        {/* Trust & Guarantee Banner */}
        <div className="mt-8 p-5 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/20 rounded-2xl flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-400 shrink-0">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">KESİN GEL Garantisi</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Platformumuzda onaylanan randevularda berber koltuğu belirtilen dakikada boşaltmakla yükümlüdür. Sıra bekletilmez, telefonla teyit istenmez.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
