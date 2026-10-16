/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BarberList } from './components/BarberList';
import { BarberDetailView } from './components/BarberDetailView';
import { BookingFlow } from './components/BookingFlow';
import { BookingSuccess } from './components/BookingSuccess';
import { MyAppointments } from './components/MyAppointments';
import { FavoritesView } from './components/FavoritesView';
import { BarberDashboard } from './components/BarberDashboard';
import { ProfileView } from './components/ProfileView';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { view, barbers } = useApp();

  // Search & Filter state for Home / Explore view
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSearchSubmit = () => {
    const listElement = document.getElementById('berber-listesi');
    if (listElement) {
      listElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0e12] text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950">
      <Header />
      <ToastContainer />

      <main className="flex-1">
        {view === 'explore' && (
          <>
            <Hero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onSearchSubmit={handleSearchSubmit}
            />
            <BarberList
              barbers={barbers}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
            />
          </>
        )}

        {view === 'barber-detail' && <BarberDetailView />}
        {view === 'booking' && <BookingFlow />}
        {view === 'booking-success' && <BookingSuccess />}
        {view === 'appointments' && <MyAppointments />}
        {view === 'favorites' && <FavoritesView />}
        {view === 'barber-dashboard' && <BarberDashboard />}
        {view === 'profile' && <ProfileView />}
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
