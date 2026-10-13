/**
 * RESQ Nepal - Live Ambulance Tracking Screen
 * Original RESQ Nepal Emergency Telemetry:
 * - Live GPS ambulance tracking to pickup and hospital
 * - Assigned vehicle plate, certified EMT driver, and hospital affiliation
 * - Patient clinical handover status stepper
 * - Direct contact with driver & hospital emergency department (in-app modal)
 * - Safe emergency cancellation
 */

import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { MapComponent } from '../common/MapComponent';
import { HeaderBar } from '../common/HeaderBar';

interface LiveTrackingScreenProps {
  onBack: () => void;
  onNavigate: (route: string) => void;
}

export const LiveTrackingScreen: React.FC<LiveTrackingScreenProps> = ({ onBack, onNavigate }) => {
  const {
    bookings,
    activeBookingId,
    ambulances,
    advanceTripStep,
    cancelActiveBooking,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'map' | 'timeline'>('map');
  const [callModalTarget, setCallModalTarget] = useState<'driver' | 'hospital' | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Patient stabilized / alternative transport arranged');

  const booking = bookings.find((b) => b.id === activeBookingId) || bookings[0];
  const assignedAmbulance = ambulances.find((a) => a.id === booking?.assignedAmbulanceId) || ambulances[0];

  if (!booking) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-gray-900 bg-[#F9FAFB]">
        <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center text-3xl mb-3">
          🚑
        </div>
        <h3 className="text-base font-extrabold">No Active Emergency Transit</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-xs">You currently do not have an active ambulance dispatched.</p>
        <button
          onClick={onBack}
          className="mt-4 px-5 py-2.5 bg-red-600 text-white rounded-2xl text-xs font-bold shadow-md shadow-red-600/20"
        >
          Return to Booking Home
        </button>
      </div>
    );
  }

  // Calculate status label
  const getStatusDisplay = () => {
    switch (booking.status) {
      case 'assigned':
        return { badge: 'DISPATCH ASSIGNED', title: 'Unit Dispatched', step: 1 };
      case 'approaching':
        return { badge: 'APPROACHING PICKUP', title: 'On the way to pickup point', step: 2 };
      case 'arrived':
        return { badge: 'AT PICKUP POINT', title: 'Ambulance arrived at location', step: 3 };
      case 'patient_onboard':
        return { badge: 'PATIENT ONBOARD', title: 'Vitals stabilized; departing', step: 4 };
      case 'en_route_hospital':
        return { badge: 'EN ROUTE TO HOSPITAL', title: 'Priority corridor transit to ER', step: 5 };
      case 'completed':
        return { badge: 'TRIP COMPLETED', title: 'Handed over to Trauma ER', step: 6 };
      default:
        return { badge: 'SEARCHING', title: 'Locating nearby emergency units', step: 1 };
    }
  };

  const statusInfo = getStatusDisplay();

  const handleCancelBooking = () => {
    cancelActiveBooking(cancelReason);
    setCancelModalOpen(false);
    onBack();
  };

  return (
    <div className="w-full h-full bg-[#F9FAFB] text-gray-900 flex flex-col justify-between overflow-hidden relative font-sans">
      {/* Top Header */}
      <HeaderBar
        title={`Transit • ${booking.id}`}
        subtitle={statusInfo.badge}
        showBack={true}
        onBack={onBack}
        uiStyle="light"
        rightAction={
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setActiveTab(activeTab === 'map' ? 'timeline' : 'map')}
              className="text-[11px] font-bold px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition"
            >
              {activeTab === 'map' ? 'Timeline' : 'Live Map'}
            </button>
          </div>
        }
      />

      {/* Main View Area */}
      {activeTab === 'map' ? (
        <div className="flex-1 w-full relative z-0 overflow-hidden flex flex-col justify-between">
          {/* Live Status Floating Pill */}
          <div className="absolute top-3 inset-x-4 z-20 pointer-events-none flex justify-center">
            <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-gray-200/80 flex items-center space-x-2 text-xs font-bold text-gray-900 pointer-events-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
              <span>{statusInfo.badge}</span>
              <span className="text-gray-300">•</span>
              <span className="text-emerald-600 font-mono">ETA 6 min</span>
            </div>
          </div>

          {/* Interactive Map */}
          <div className="w-full h-full">
            <MapComponent
              pickup={booking.pickup}
              destination={booking.destination}
              assignedAmbulance={assignedAmbulance}
              simulationStep={booking.demoSimulationStep || 3}
              uiStyle="light"
              heightClass="h-full"
            />
          </div>
        </div>
      ) : (
        /* Timeline View */
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500">
              Emergency Dispatch Events Log
            </h3>
            <div className="space-y-3 border-l-2 border-red-500 ml-2 pl-4">
              {booking.events.map((evt, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-red-600 border-2 border-white"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 uppercase">{evt.status.replace('_', ' ')}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{evt.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-0.5">{evt.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Assigned Vehicle Details Sheet */}
      <div className="relative z-20 bg-white rounded-t-3xl shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.12)] p-5 space-y-4 border-t border-gray-100">
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto"></div>

        {/* Assigned Ambulance Card */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl font-bold border border-red-100">
              🚑
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-black text-gray-900">
                  {booking.assignedVehiclePlate || 'Ba 1 Jha 9021'}
                </h4>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-md text-[9px] font-bold">
                  {booking.category}
                </span>
              </div>
              <p className="text-xs text-gray-600 font-medium">
                {booking.assignedDriverName || 'Hari Sundar Shrestha'} (Licensed EMT)
              </p>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Hospital: {assignedAmbulance?.hospitalAffiliation || 'TUTH Maharajgunj'}
              </span>
            </div>
          </div>

          {/* Quick Communication Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCallModalTarget('driver')}
              className="w-10 h-10 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center text-base font-bold transition shadow-xs"
              title="Call Ambulance Driver"
            >
              📞
            </button>
            <button
              onClick={() => setCallModalTarget('hospital')}
              className="w-10 h-10 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 flex items-center justify-center text-base font-bold transition shadow-xs"
              title="Call Receiving Hospital ER"
            >
              🏥
            </button>
          </div>
        </div>

        {/* Route Details Card */}
        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2 text-xs">
          <div className="flex items-start space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1 shrink-0"></span>
            <div className="min-w-0">
              <span className="text-[9px] font-bold text-gray-400 uppercase block">Pickup Point</span>
              <p className="text-xs font-semibold text-gray-900 truncate">{booking.pickup.address}</p>
            </div>
          </div>
          <div className="flex items-start space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 mt-1 shrink-0"></span>
            <div className="min-w-0">
              <span className="text-[9px] font-bold text-gray-400 uppercase block">Destination Emergency Facility</span>
              <p className="text-xs font-semibold text-gray-900 truncate">
                {booking.destination?.address || 'TUTH Emergency Trauma Unit'}
              </p>
            </div>
          </div>
        </div>

        {/* Demo Trip Lifecycle Simulator Buttons */}
        {booking.status !== 'completed' && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
              <span>Simulate Ambulance Journey Progression:</span>
              <span className="text-red-600 uppercase">Stage {statusInfo.step} of 6</span>
            </div>
            <button
              onClick={() => advanceTripStep(booking.id)}
              className="w-full bg-[#DC2626] hover:bg-[#b91c1c] active:scale-98 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md shadow-red-600/25 transition flex items-center justify-center space-x-2"
            >
              <span>Advance Step &rarr; Next: {booking.status === 'assigned' ? 'Approaching' : booking.status === 'approaching' ? 'Arrived' : booking.status === 'arrived' ? 'Patient Onboard' : booking.status === 'patient_onboard' ? 'En Route Hospital' : 'Complete Handover'}</span>
            </button>
          </div>
        )}

        {/* Cancel Booking Action */}
        {booking.status !== 'completed' && (
          <button
            onClick={() => setCancelModalOpen(true)}
            className="w-full text-center text-xs font-bold text-gray-400 hover:text-red-600 py-1 transition"
          >
            Cancel Ambulance Dispatch
          </button>
        )}
      </div>

      {/* Direct Call Modal */}
      {callModalTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl border border-gray-100">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto text-2xl">
              📞
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                {callModalTarget === 'driver' ? 'Connecting to EMT Driver' : 'Connecting to Hospital ER Triage'}
              </h3>
              <p className="text-xs text-gray-500 font-mono mt-1">
                {callModalTarget === 'driver'
                  ? booking.assignedDriverPhone || '+977-9841883391'
                  : '+977-1-4412404 (TUTH Emergency Room)'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCallModalTarget(null)}
                className="py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700"
              >
                Close
              </button>
              <a
                href={callModalTarget === 'driver' ? `tel:${booking.assignedDriverPhone || '+9779841883391'}` : 'tel:+97714412404'}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Booking Confirmation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-3xl p-6 max-w-sm w-full space-y-3.5 shadow-2xl border border-gray-100">
            <h3 className="text-base font-extrabold text-red-600">Cancel Emergency Dispatch</h3>
            <p className="text-xs text-gray-600">Please provide a reason to notify the dispatch center and driver:</p>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-red-600"
            >
              <option value="Patient stabilized / alternative transport arranged">Patient stabilized / alternative transport arranged</option>
              <option value="Booked by mistake">Booked by mistake</option>
              <option value="Hospital transfer postponed by physician">Hospital transfer postponed by physician</option>
              <option value="Emergency resolved on-site">Emergency resolved on-site</option>
            </select>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700"
              >
                Keep Dispatch
              </button>
              <button
                onClick={handleCancelBooking}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
