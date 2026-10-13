/**
 * RESQ Nepal - Request Ambulance Screen
 * Original RESQ Nepal Emergency Dispatch Request:
 * - Precise Pickup Location with GPS auto-locate
 * - Emergency Receiving Hospital selection across Kathmandu Valley
 * - Certified Ambulance Categories (Basic BLS, Advanced ALS, ICU Ventilator)
 * - Patient clinical triage notes & severity selector
 * - Transparent regulated fares in Nepali Rupees (रु.)
 */

import React, { useState } from 'react';
import { HeaderBar } from '../common/HeaderBar';
import { MapComponent } from '../common/MapComponent';
import { AMBULANCE_CATEGORIES, KATHMANDU_HOSPITALS } from '../../config/constants';
import { AmbulanceCategory, Coordinates } from '../../types';

interface RequestAmbulanceModalProps {
  onBack: () => void;
  onSendRequest: (pickup: Coordinates, dest: Coordinates, category: AmbulanceCategory, fareNpr: number) => void;
  initialCategory?: AmbulanceCategory;
}

export const RequestAmbulanceModal: React.FC<RequestAmbulanceModalProps> = ({
  onBack,
  onSendRequest,
  initialCategory = 'BASIC',
}) => {
  const [pickup, setPickup] = useState<Coordinates>({
    lat: 27.6915,
    lng: 85.342,
    address: 'Baneshwor Chowk, Kathmandu',
  });

  const [destination, setDestination] = useState<Coordinates>({
    lat: 27.7374,
    lng: 85.3312,
    address: 'Tribhuvan University Teaching Hospital (TUTH)',
  });

  const [selectedCategory, setSelectedCategory] = useState<AmbulanceCategory>(initialCategory);
  const [showHospitalPicker, setShowHospitalPicker] = useState(false);
  const [urgency, setUrgency] = useState<'NORMAL' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [patientNotes, setPatientNotes] = useState<string>('Trauma / Emergency triage needed');

  const activeCategoryConfig = AMBULANCE_CATEGORIES.find((c) => c.id === selectedCategory) || AMBULANCE_CATEGORIES[0];
  const calculatedFare = activeCategoryConfig.baseFareNpr;

  const handleUseGps = () => {
    setPickup({
      lat: 27.7000,
      lng: 85.3333,
      address: 'Current Location (Kathmandu Metro Sector 4)',
    });
  };

  const emergencyConditions = [
    'Trauma / Accident',
    'Cardiac / Chest Pain',
    'Respiratory Distress',
    'Maternal / Labor',
    'Loss of Consciousness',
    'General Medical Transport',
  ];

  return (
    <div className="w-full h-full bg-[#F9FAFB] text-gray-900 flex flex-col justify-between overflow-hidden relative font-sans">
      {/* Top Header */}
      <HeaderBar
        title="Emergency Dispatch Request"
        subtitle="Confirm Pickup & Receiving Facility"
        showBack={true}
        onBack={onBack}
        uiStyle="light"
        rightAction={
          <button
            onClick={handleUseGps}
            className="p-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold hover:bg-red-100 transition flex items-center space-x-1"
            title="Use current GPS"
          >
            <span>📍 GPS</span>
          </button>
        }
      />

      {/* Route Preview Map */}
      <div className="flex-1 w-full relative z-0 min-h-[160px]">
        <MapComponent
          pickup={pickup}
          destination={destination}
          uiStyle="light"
          heightClass="h-full"
        />
      </div>

      {/* Bottom Emergency Booking Panel */}
      <div className="relative z-10 bg-white rounded-t-3xl shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.12)] p-5 space-y-4 border-t border-gray-100 max-h-[70vh] overflow-y-auto">
        {/* Pickup & Destination Address Card */}
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2.5">
          {/* Pickup Input */}
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-100 shrink-0"></div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">Pickup Location</span>
              <input
                type="text"
                value={pickup.address}
                onChange={(e) => setPickup({ ...pickup, address: e.target.value })}
                className="w-full bg-transparent text-xs font-bold text-gray-900 focus:outline-none truncate"
                placeholder="Enter pickup point"
              />
            </div>
            <button
              onClick={handleUseGps}
              className="text-[10px] font-bold text-red-600 hover:underline shrink-0"
            >
              Current GPS
            </button>
          </div>

          <div className="border-l-2 border-dotted border-gray-300 ml-1.5 h-3"></div>

          {/* Destination Hospital Picker */}
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-red-600 ring-4 ring-red-100 shrink-0"></div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">Receiving Hospital</span>
              <button
                type="button"
                onClick={() => setShowHospitalPicker(!showHospitalPicker)}
                className="w-full text-left bg-transparent text-xs font-bold text-gray-900 focus:outline-none truncate flex items-center justify-between"
              >
                <span className="truncate">{destination.address}</span>
                <span className="text-red-600 text-[10px] ml-1 shrink-0">Change &darr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hospital Dropdown Drawer (if toggled) */}
        {showHospitalPicker && (
          <div className="p-3 bg-red-50/50 rounded-2xl border border-red-200 space-y-2 max-h-40 overflow-y-auto">
            <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block">
              Emergency Receiving Trauma Hubs
            </span>
            <div className="space-y-1">
              {KATHMANDU_HOSPITALS.map((hosp) => (
                <div
                  key={hosp.id}
                  onClick={() => {
                    setDestination({
                      lat: hosp.lat,
                      lng: hosp.lng,
                      address: hosp.name,
                    });
                    setShowHospitalPicker(false);
                  }}
                  className="p-2 rounded-xl bg-white hover:bg-red-50 border border-gray-200 cursor-pointer text-xs font-bold transition flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <span className="truncate block text-gray-900">{hosp.name}</span>
                    <span className="text-[10px] text-gray-500 font-normal">{hosp.type} • {hosp.address}</span>
                  </div>
                  <span className="text-red-600 text-xs shrink-0 ml-2">Select</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ambulance Tier Categories */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500">
              Choose Ambulance Tier
            </span>
            <span className="text-[11px] font-mono text-gray-500">
              Standard MoHP Regulated Rates
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
                      ? 'border-red-600 bg-red-50/70 shadow-sm ring-1 ring-red-600'
                      : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg">🚑</span>
                    <span className="font-mono text-xs font-black text-red-600">रु. {cat.baseFareNpr}</span>
                  </div>
                  <div className="mt-2">
                    <h4 className={`text-xs font-black leading-tight ${isSelected ? 'text-red-700' : 'text-gray-900'}`}>
                      {cat.badgeTitle}
                    </h4>
                    <p className="text-[9px] text-gray-500 mt-0.5 line-clamp-1">{cat.features[0]}</p>
                    <span className="text-[9px] font-mono text-emerald-600 block mt-1 font-bold">
                      {cat.estimatedArrivalMin}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clinical Emergency Urgency & Condition Notes */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 block">
            Emergency Condition / Triage Notes
          </span>
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {emergencyConditions.map((cond) => (
              <button
                key={cond}
                type="button"
                onClick={() => setPatientNotes(cond)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                  patientNotes === cond
                    ? 'bg-red-600 text-white border-red-600 shadow-xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200/80'
                }`}
              >
                {cond}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={patientNotes}
            onChange={(e) => setPatientNotes(e.target.value)}
            placeholder="Describe patient status (e.g. oxygen required, conscious, fractures)..."
            className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-800 focus:outline-none focus:border-red-600"
          />
        </div>

        {/* Fare Summary & Request CTA */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Regulated Base Rate</span>
            <span className="font-mono text-base font-black text-gray-900">रु. {calculatedFare}</span>
          </div>

          <button
            onClick={() => onSendRequest(pickup, destination, selectedCategory, calculatedFare)}
            className="flex-1 ml-4 bg-[#DC2626] hover:bg-[#b91c1c] active:scale-98 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-red-600/30 transition flex items-center justify-center space-x-2"
          >
            <span>🚨 Start Emergency Radar</span>
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
