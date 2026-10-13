/**
 * RESQ Nepal - Progressive Ambulance Search Radar Screen
 * Original RESQ Nepal Emergency Dispatch Engine:
 * - Dynamic radar radius expansion: 2km -> 5km -> 10km -> 15km -> 20km
 * - Regulated ambulance fare transparency (no bidding)
 * - EMT verified vehicle fleet telemetry in Kathmandu Valley
 * - Direct dispatch assignment with nearest available ambulance
 */

import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { MapComponent } from '../common/MapComponent';
import { HeaderBar } from '../common/HeaderBar';
import { Ambulance, Coordinates } from '../../types';
import { calculateDistanceKm } from '../../config/maps';

interface SearchRadiusOverlayProps {
  pickup: Coordinates;
  destination?: Coordinates;
  initialFare?: number;
  onCancel: () => void;
  onAmbulanceMatched: (ambulance: Ambulance) => void;
}

export const SearchRadiusOverlay: React.FC<SearchRadiusOverlayProps> = ({
  pickup,
  destination,
  initialFare = 150,
  onCancel,
  onAmbulanceMatched,
}) => {
  const {
    currentSearchRadiusKm,
    matchedAmbulances,
    ambulances,
  } = useAppStore();

  const [countdownSec, setCountdownSec] = useState<number>(120);

  // 2-minute countdown timer for dispatch window
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSec((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getRadiusMessage = () => {
    if (matchedAmbulances.length > 0) {
      return `${matchedAmbulances.length} emergency unit(s) found within ${currentSearchRadiusKm} km range.`;
    }
    if (currentSearchRadiusKm === 2) {
      return 'Scanning local sector within 2 km radius...';
    }
    if (currentSearchRadiusKm === 5) {
      return 'Sector 1 busy. Expanding search radius to 5 km across Kathmandu...';
    }
    if (currentSearchRadiusKm === 10) {
      return 'Broadening search to 10 km (Lalitpur & Bhaktapur corridors)...';
    }
    if (currentSearchRadiusKm <= 15) {
      return 'Querying inter-hospital depots within 15 km perimeter...';
    }
    return 'Scanning maximum regional coverage up to 20 km...';
  };

  return (
    <div className="w-full h-full bg-[#F9FAFB] text-gray-900 flex flex-col justify-between overflow-hidden relative font-sans">
      {/* Top Header */}
      <HeaderBar
        title="Emergency Fleet Radar"
        subtitle="Automatic Progressive Radius Search"
        showBack={true}
        onBack={onCancel}
        uiStyle="light"
      />

      {/* Interactive Map with Radar Circles */}
      <div className="flex-1 w-full relative z-0">
        <MapComponent
          pickup={pickup}
          destination={destination}
          ambulances={ambulances}
          isSearching={true}
          searchRadiusKm={currentSearchRadiusKm}
          uiStyle="light"
          heightClass="h-full"
        />

        {/* Live Search Radius Floating Pill */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg flex items-center space-x-2 border-2 border-white">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
            <span>SEARCH RADIUS: {currentSearchRadiusKm} KM</span>
          </div>
        </div>
      </div>

      {/* Bottom Dispatch Status Sheet */}
      <div className="relative z-20 bg-white rounded-t-3xl shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] p-5 space-y-4 border-t border-gray-100">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto"></div>

        {/* Search Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-lg animate-pulse">
              📡
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 leading-tight">
                Locating Nearest Ambulance
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Central Kathmandu Valley EMT Network
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-gray-400 block uppercase">Timer</span>
            <span className="font-mono text-base font-black text-gray-900">{formatTimer(countdownSec)}</span>
          </div>
        </div>

        {/* Dynamic Radius Stepper Indicators */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <span>Progressive Range Expansion</span>
            <span className="text-red-600 font-extrabold">{currentSearchRadiusKm} km / 20 km</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-red-600 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(currentSearchRadiusKm / 20) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[9px] font-mono text-gray-400">
            <span className={currentSearchRadiusKm >= 2 ? 'text-red-600 font-bold' : ''}>2km</span>
            <span className={currentSearchRadiusKm >= 5 ? 'text-red-600 font-bold' : ''}>5km</span>
            <span className={currentSearchRadiusKm >= 10 ? 'text-red-600 font-bold' : ''}>10km</span>
            <span className={currentSearchRadiusKm >= 15 ? 'text-red-600 font-bold' : ''}>15km</span>
            <span className={currentSearchRadiusKm >= 20 ? 'text-red-600 font-bold' : ''}>20km</span>
          </div>
        </div>

        {/* Live Feedback Text */}
        <div className="p-3 bg-red-50/70 border border-red-100 rounded-2xl flex items-center space-x-2.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0"></span>
          <p className="text-xs text-red-800 font-medium">{getRadiusMessage()}</p>
        </div>

        {/* Matched Ambulances or Searching State */}
        {matchedAmbulances.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                Responded Ambulances in Radius
              </span>
              <span className="text-[11px] font-bold text-emerald-600">
                {matchedAmbulances.length} Ready
              </span>
            </div>

            <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
              {matchedAmbulances.map((amb) => {
                const dist = calculateDistanceKm(pickup.lat, pickup.lng, amb.currentLat, amb.currentLng);
                return (
                  <div
                    key={amb.id}
                    onClick={() => onAmbulanceMatched(amb)}
                    className="p-3 rounded-2xl bg-white hover:bg-red-50/60 border-2 border-red-200 hover:border-red-600 cursor-pointer flex items-center justify-between transition shadow-xs active:scale-98"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-lg">
                        🚑
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-black text-gray-900">{amb.vehiclePlate}</h4>
                          <span className="px-1.5 py-0.2 rounded-md bg-red-100 text-red-700 text-[9px] font-bold">
                            {amb.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate">
                          {amb.driverName} • {amb.hospitalAffiliation}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-black text-emerald-600 block">{dist} km away</span>
                      <button className="mt-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold shadow-xs">
                        Confirm &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-200">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Government Regulated Base Fare</span>
              <span className="text-sm font-black font-mono text-gray-900">रु. {initialFare}</span>
            </div>
            <button
              onClick={() => {
                const nearest = ambulances.find((a) => a.isOnline && a.status === 'available') || ambulances[0];
                onAmbulanceMatched(nearest);
              }}
              className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition shadow-xs"
            >
              Simulate Match Now &rarr;
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={onCancel}
            className="py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition text-center"
          >
            Cancel Search
          </button>
          <a
            href="tel:102"
            className="py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold transition text-center shadow-md shadow-red-600/20 flex items-center justify-center space-x-1.5"
          >
            <span>📞</span>
            <span>Call 102 Hotline</span>
          </a>
        </div>
      </div>
    </div>
  );
};
