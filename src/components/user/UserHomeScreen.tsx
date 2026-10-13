/**
 * RESQ Nepal - Original Ambulance Booking Home Screen
 * Pure original design: Emergency Red & White branding, clean map focus,
 * instant emergency dispatch action, ambulance tier selection, and hospital hubs.
 */

import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { MapComponent } from '../common/MapComponent';
import { HeaderBar } from '../common/HeaderBar';
import { SideDrawer } from '../common/SideDrawer';
import { AMBULANCE_CATEGORIES, KATHMANDU_HOSPITALS } from '../../config/constants';
import { AmbulanceCategory, Coordinates } from '../../types';

interface UserHomeScreenProps {
  onNavigate: (route: string) => void;
  onRequestAmbulance: (initialCategory?: AmbulanceCategory) => void;
}

export const UserHomeScreen: React.FC<UserHomeScreenProps> = ({ onNavigate, onRequestAmbulance }) => {
  const {
    currentUser,
    ambulances,
    bookings,
    activeBookingId,
  } = useAppStore();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState<Coordinates>({
    lat: 27.6915,
    lng: 85.342,
    address: 'Baneshwor, Kathmandu',
  });
  const [selectedCategory, setSelectedCategory] = useState<AmbulanceCategory>('BASIC');

  const availableAmbulances = ambulances.filter((a) => a.isOnline && a.status === 'available');
  const activeBooking = bookings.find(
    (b) => b.id === activeBookingId && b.status !== 'completed' && b.status !== 'cancelled'
  );

  return (
    <div className="w-full h-full bg-[#F9FAFB] text-gray-900 flex flex-col justify-between overflow-hidden relative font-sans">
      {/* Side Navigation Drawer */}
      <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={onNavigate} />

      {/* Top Header with RESQ Nepal Brand Identity */}
      <HeaderBar
        variant="brand"
        onOpenDrawer={() => setDrawerOpen(true)}
        uiStyle="light"
        rightAction={
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate('safety')}
              className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold hover:bg-red-100 transition flex items-center space-x-1"
              title="Emergency SOS"
            >
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              <span>102 SOS</span>
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-gray-200 hover:ring-red-500 transition"
            >
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        }
      />

      {/* Main Map Canvas Area */}
      <div className="flex-1 w-full relative z-0 overflow-hidden">
        <MapComponent
          pickup={selectedPickup}
          ambulances={ambulances}
          uiStyle="light"
          onSelectLocation={(coords) => setSelectedPickup(coords)}
        />

        {/* Current Location Pill over Map */}
        <div className="absolute top-3 inset-x-4 z-10 pointer-events-none flex justify-center">
          <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-gray-200/80 flex items-center space-x-2.5 pointer-events-auto max-w-sm w-full">
            <div className="w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-100 shrink-0"></div>
            <div className="flex-1 min-w-0 text-left">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pickup Location</span>
              <p className="text-xs font-bold text-gray-900 truncate">{selectedPickup.address}</p>
            </div>
            <button
              onClick={() => onNavigate('request')}
              className="text-xs font-bold text-red-600 hover:underline shrink-0"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Active Emergency Transit Alert Banner */}
        {activeBooking && (
          <div className="absolute bottom-3 inset-x-4 z-20">
            <div
              onClick={() => onNavigate('tracking')}
              className="bg-white p-3.5 rounded-2xl border-2 border-red-600 shadow-xl flex items-center justify-between cursor-pointer hover:bg-red-50/50 transition animate-pulse"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🚑</span>
                <div>
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-widest block">
                    DISPATCH EN ROUTE
                  </span>
                  <h4 className="text-xs font-bold text-gray-900">
                    {activeBooking.assignedVehiclePlate || 'Ambulance Assigned'}
                  </h4>
                  <p className="text-[11px] text-gray-500 truncate">Destination: {activeBooking.destination?.address || 'Hospital ER'}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold shadow-xs">
                Track Live &rarr;
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Emergency Booking Panel (Original RESQ Nepal Design) */}
      <div className="relative z-20 bg-white rounded-t-3xl border-t border-gray-100 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.08)] p-5 space-y-4">
        {/* Ambulance Tier Selection Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Select Ambulance Tier
            </span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {availableAmbulances.length} Active in Kathmandu
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {AMBULANCE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'border-red-600 bg-red-50/60 shadow-sm'
                      : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-base">🚑</span>
                    <span className="font-mono text-xs font-black text-red-600">रु. {cat.baseFareNpr}</span>
                  </div>
                  <div className="mt-2">
                    <h4 className={`text-xs font-bold leading-tight ${isSelected ? 'text-red-700' : 'text-gray-900'}`}>
                      {cat.badgeTitle}
                    </h4>
                    <p className="text-[9px] text-gray-500 mt-0.5 line-clamp-1">{cat.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Call Emergency Ambulance Button */}
        <button
          onClick={() => onRequestAmbulance(selectedCategory)}
          className="w-full bg-[#DC2626] hover:bg-[#b91c1c] active:scale-98 text-white font-extrabold text-base py-3.5 px-6 rounded-2xl shadow-lg shadow-red-600/30 transition flex items-center justify-center space-x-2.5"
        >
          <span className="text-xl">🚨</span>
          <span>Request Ambulance Now</span>
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        {/* Emergency Transfer Destinations Quick Row */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
            Major Emergency Receiving Hospitals
          </span>
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {KATHMANDU_HOSPITALS.slice(0, 4).map((hosp) => (
              <button
                key={hosp.id}
                onClick={() => onRequestAmbulance(selectedCategory)}
                className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold whitespace-nowrap transition border border-gray-200/60 flex items-center space-x-1.5"
              >
                <span>🏥</span>
                <span>{hosp.name.split('(')[0].trim()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Mobile Tab Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-2.5 flex items-center justify-between text-xs select-none">
        <button className="flex flex-col items-center space-y-1 text-red-600 font-bold">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span className="text-[10px]">Booking</span>
        </button>
        <button onClick={() => onNavigate('history')} className="flex flex-col items-center space-y-1 text-gray-400 hover:text-gray-800 font-medium">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          <span className="text-[10px]">Trips</span>
        </button>
        <button onClick={() => onNavigate('safety')} className="flex flex-col items-center space-y-1 text-gray-400 hover:text-gray-800 font-medium">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span className="text-[10px]">Safety & SOS</span>
        </button>
        <button onClick={() => onNavigate('settings')} className="flex flex-col items-center space-y-1 text-gray-400 hover:text-gray-800 font-medium">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          <span className="text-[10px]">Settings</span>
        </button>
      </div>
    </div>
  );
};
