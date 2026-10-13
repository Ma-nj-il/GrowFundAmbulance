/**
 * RESQ Nepal - Original Driver & Paramedic Duty Console
 * Built specifically for ambulance drivers and EMTs:
 * Online/Offline emergency availability, dispatch radar, active trip progression,
 * and seamless mode switching back to User Mode.
 */

import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { HeaderBar } from '../common/HeaderBar';
import { SideDrawer } from '../common/SideDrawer';
import { MapComponent } from '../common/MapComponent';

interface DriverHomeScreenProps {
  onNavigate: (route: string) => void;
  onOpenTrip: (bookingId: string) => void;
}

export const DriverHomeScreen: React.FC<DriverHomeScreenProps> = ({ onNavigate, onOpenTrip }) => {
  const {
    currentUser,
    ambulances,
    bookings,
    driverSetOnline,
    driverAcceptBooking,
    driverRejectBooking,
    switchMode,
  } = useAppStore();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);

  // Find driver's assigned vehicle or fallback to first
  const driverVehicle = ambulances.find((a) => a.driverId === currentUser.id) || ambulances[0];
  const isOnline = driverVehicle?.isOnline ?? true;

  // Find incoming unassigned emergency bookings for this driver
  const incomingRequests = bookings.filter(
    (b) => b.status === 'searching' || b.status === 'requested'
  );

  // Active trip for this driver
  const activeTrip = bookings.find(
    (b) =>
      (b.assignedDriverId === currentUser.id || b.assignedAmbulanceId === driverVehicle?.id) &&
      b.status !== 'completed' &&
      b.status !== 'cancelled'
  );

  return (
    <div className="w-full h-full bg-[#F9FAFB] text-gray-900 flex flex-col justify-between overflow-hidden relative font-sans">
      {/* Side Drawer */}
      <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={onNavigate} />

      {/* Driver Top Header */}
      <HeaderBar
        title={currentUser.name}
        subtitle="Licensed EMT Ambulance Driver"
        onOpenDrawer={() => setDrawerOpen(true)}
        uiStyle="light"
        rightAction={
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                switchMode('user');
                onNavigate('home');
              }}
              className="px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition active:scale-95 flex items-center space-x-1"
            >
              <span>👤 User Mode</span>
            </button>
          </div>
        }
      />

      {/* Duty Availability Bar */}
      <div className={`px-4 py-2.5 flex items-center justify-between border-b transition ${
        isOnline ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-100 border-gray-200'
      }`}>
        <div className="flex items-center space-x-2.5">
          <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
          <div>
            <span className={`text-xs font-black block ${isOnline ? 'text-emerald-800' : 'text-gray-600'}`}>
              {isOnline ? 'ON DUTY — READY FOR DISPATCH' : 'OFF DUTY — STANDBY'}
            </span>
            <span className="text-[10px] text-gray-500">
              {isOnline ? 'Receiving emergency requests in Kathmandu' : 'Toggle switch to receive calls'}
            </span>
          </div>
        </div>
        <button
          onClick={() => driverSetOnline(!isOnline)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-xs ${
            isOnline ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-700 text-white hover:bg-gray-800'
          }`}
        >
          {isOnline ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

      {/* Driver Scrollable View */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5">
        {/* Active Emergency Trip Banner */}
        {activeTrip && (
          <div
            onClick={() => onOpenTrip(activeTrip.id)}
            className="p-4 rounded-2xl bg-red-600 text-white shadow-xl cursor-pointer hover:bg-red-700 transition flex items-center justify-between animate-pulse"
          >
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🚨</span>
              <div>
                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-red-200">
                  ACTIVE TRIP — {activeTrip.id}
                </span>
                <h4 className="text-xs font-extrabold">{activeTrip.pickup.address}</h4>
                <p className="text-[11px] text-red-100">&rarr; {activeTrip.destination?.address || 'Hospital ER'}</p>
              </div>
            </div>
            <span className="px-3 py-1.5 bg-white text-red-600 rounded-full text-xs font-black shadow-sm">
              Open Trip &rarr;
            </span>
          </div>
        )}

        {/* Live Driver Map Preview */}
        <div className="w-full h-36 rounded-2xl overflow-hidden border border-gray-200 shadow-xs relative">
          <MapComponent
            pickup={{
              lat: driverVehicle?.currentLat || 27.698,
              lng: driverVehicle?.currentLng || 85.344,
              address: 'Driver Station',
            }}
            ambulances={ambulances}
            uiStyle="light"
            heightClass="h-full"
            interactive={false}
          />
        </div>

        {/* Assigned Ambulance Vehicle Profile Card */}
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Ambulance</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
              {driverVehicle?.category} Unit
            </span>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl shrink-0">
              🚑
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-black text-gray-900 truncate">
                {driverVehicle ? driverVehicle.vehiclePlate : 'Ba 1 Jha 9021'}
              </h4>
              <p className="text-xs text-gray-500 truncate">
                {driverVehicle?.model || 'Force Motors Traveller ALS'}
              </p>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Hospital Affiliation: {driverVehicle?.hospitalAffiliation || 'TUTH Maharajgunj'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setEquipmentModalOpen(true)}
            className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition"
          >
            Check Medical Equipment Onboard &rarr;
          </button>
        </div>

        {/* Driver Emergency Statistics Card */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-2xl bg-white border border-gray-200 text-center shadow-xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase block">Completed Trips</span>
            <span className="text-base font-black text-gray-900 font-mono mt-0.5 block">{currentUser.totalTrips || 348}</span>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-gray-200 text-center shadow-xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase block">Avg Response</span>
            <span className="text-base font-black text-emerald-600 font-mono mt-0.5 block">7.2 min</span>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-gray-200 text-center shadow-xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase block">EMT Rating</span>
            <span className="text-base font-black text-amber-500 font-mono mt-0.5 block">★ {currentUser.rating || 4.9}</span>
          </div>
        </div>

        {/* Emergency Guidelines for Drivers */}
        <div className="p-4 rounded-2xl bg-red-50/70 border border-red-100 space-y-1.5">
          <h4 className="text-xs font-bold text-red-800 flex items-center gap-1.5">
            <span>🛡️</span>
            <span>Kathmandu Valley Emergency Transport Protocol</span>
          </h4>
          <p className="text-[11px] text-red-700 leading-relaxed">
            Activate emergency sirens and strobe beacons during critical patient transfers. Follow assigned priority corridor routes to the nearest trauma hospital.
          </p>
        </div>
      </div>

      {/* INCOMING EMERGENCY AMBULANCE REQUEST POPUP */}
      {isOnline && incomingRequests.length > 0 && !activeTrip && (
        <div className="absolute inset-x-4 bottom-4 z-40 animate-in slide-in-from-bottom duration-300">
          <div className="p-5 rounded-3xl bg-white text-gray-900 border-2 border-red-600 shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                <span className="text-xs font-black text-red-600 uppercase tracking-wider">
                  URGENT DISPATCH REQUEST
                </span>
              </div>
              <span className="text-xs font-mono font-black text-emerald-600">
                रु. {incomingRequests[0].fareNpr}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-black text-gray-900 truncate">
                Pickup: {incomingRequests[0].pickup.address}
              </h3>
              <p className="text-xs text-gray-600 truncate mt-0.5">
                Destination: {incomingRequests[0].destination?.address || 'TUTH Emergency Trauma Unit'}
              </p>
              <div className="flex items-center space-x-2 mt-1.5 text-[11px] text-gray-500 font-mono">
                <span>Ref: {incomingRequests[0].id}</span>
                <span>•</span>
                <span className="font-bold text-red-600">Category: {incomingRequests[0].category}</span>
              </div>
            </div>

            {/* Accept / Decline Action Buttons */}
            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={() => driverRejectBooking(incomingRequests[0].id)}
                className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-600 transition"
              >
                Decline
              </button>
              <button
                onClick={() => {
                  driverAcceptBooking(incomingRequests[0].id);
                  onOpenTrip(incomingRequests[0].id);
                }}
                className="flex-2 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-lg shadow-red-600/30 transition active:scale-98 flex items-center justify-center space-x-1.5"
              >
                <span>ACCEPT & DISPATCH</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Equipment Checklist Modal */}
      {equipmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-3xl p-6 max-w-sm w-full space-y-4 border border-gray-200 shadow-2xl">
            <h3 className="text-base font-extrabold text-gray-900">Medical Equipment Inventory</h3>
            <div className="p-3 bg-gray-50 rounded-2xl text-xs space-y-1 font-mono text-gray-700">
              <div>Plate: <strong>{driverVehicle?.vehiclePlate}</strong></div>
              <div>Tier: <strong>{driverVehicle?.category}</strong></div>
              <div>Battery Telemetry: <strong>{driverVehicle?.batteryPercent}%</strong></div>
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1.5">Installed Life Support Equipment:</span>
              <ul className="text-xs text-gray-700 space-y-1 list-disc pl-4">
                {driverVehicle?.equipment.map((eq, i) => (
                  <li key={i}>{eq}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setEquipmentModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-red-600 text-xs font-bold text-white hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
