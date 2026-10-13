/**
 * RESQ Nepal - Driver Active Emergency Trip Screen
 * Original RESQ Nepal Paramedic Duty Execution:
 * - Real-time transit navigation with simulated GPS telemetry
 * - Patient clinical notes & emergency contact modal
 * - Step progression: Approaching -> Arrived -> Patient Onboard -> En Route Hospital -> Completed
 * - In-transit issue reporting (traffic priority corridor, clinical deterioration) with zero window.alert
 */

import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { HeaderBar } from '../common/HeaderBar';
import { MapComponent } from '../common/MapComponent';

interface DriverTripScreenProps {
  bookingId: string;
  onBack: () => void;
  onTripCompleted: () => void;
}

export const DriverTripScreen: React.FC<DriverTripScreenProps> = ({
  bookingId,
  onBack,
  onTripCompleted,
}) => {
  const { bookings, ambulances, advanceTripStep, cancelActiveBooking } = useAppStore();
  const [reportIssueOpen, setReportIssueOpen] = useState(false);
  const [statusToast, setStatusToast] = useState<string | null>(null);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [breakdownConfirmOpen, setBreakdownConfirmOpen] = useState(false);
  const [handoverModalOpen, setHandoverModalOpen] = useState(false);

  const booking = bookings.find((b) => b.id === bookingId) || bookings[0];
  const assignedAmbulance = ambulances.find((a) => a.id === booking?.assignedAmbulanceId);

  const showToast = (msg: string) => {
    setStatusToast(msg);
    setTimeout(() => setStatusToast(null), 3000);
  };

  if (!booking) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-gray-900 bg-[#F9FAFB]">
        <h3 className="text-sm font-bold">Trip not found</h3>
        <button onClick={onBack} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold">
          Return to Console
        </button>
      </div>
    );
  }

  // Next step calculation
  const getNextAction = () => {
    switch (booking.status) {
      case 'assigned':
        return { label: 'Start Approaching Pickup Point', nextStatus: 'approaching', stepNum: 1 };
      case 'approaching':
        return { label: 'Mark Arrived at Pickup Point', nextStatus: 'arrived', stepNum: 2 };
      case 'arrived':
        return { label: 'Confirm Patient Safely Onboard', nextStatus: 'patient_onboard', stepNum: 3 };
      case 'patient_onboard':
        return { label: 'Start Priority Transit to Hospital ER', nextStatus: 'en_route_hospital', stepNum: 4 };
      case 'en_route_hospital':
        return { label: 'Complete Handover at Emergency Room', nextStatus: 'completed', stepNum: 5 };
      case 'completed':
        return { label: 'Trip Completed', nextStatus: 'completed', stepNum: 5 };
      default:
        return { label: 'Advance Stage', nextStatus: 'approaching', stepNum: 1 };
    }
  };

  const nextAction = getNextAction();

  const handleAdvance = () => {
    advanceTripStep(booking.id);
    if (nextAction.nextStatus === 'completed') {
      setHandoverModalOpen(true);
    } else {
      showToast(`Status updated: ${nextAction.label}`);
    }
  };

  return (
    <div className="w-full h-full bg-[#F9FAFB] text-gray-900 flex flex-col justify-between overflow-hidden relative font-sans">
      {/* Top Header */}
      <HeaderBar
        title={`Duty • ${booking.id}`}
        subtitle={booking.status.toUpperCase().replace('_', ' ')}
        showBack={true}
        onBack={onBack}
        uiStyle="light"
        rightAction={
          <button
            onClick={() => setReportIssueOpen(true)}
            className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200"
          >
            Report Issue
          </button>
        }
      />

      {/* Map with Route & Live Ambulance */}
      <div className="flex-1 w-full relative z-0">
        <MapComponent
          pickup={booking.pickup}
          destination={booking.destination}
          assignedAmbulance={assignedAmbulance}
          simulationStep={booking.demoSimulationStep || 3}
          uiStyle="light"
          heightClass="h-full"
        />

        {/* Emergency Siren Active Banner */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-red-600 text-white text-[11px] font-black px-3.5 py-1.5 rounded-full shadow-lg flex items-center space-x-1.5 animate-pulse border border-white">
            <span>🚨 EMERGENCY TRANSIT ACTIVE — SIRENS ON</span>
          </div>
        </div>

        {/* In-app Toast Banner */}
        {statusToast && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-[90%] max-w-xs">
            <div className="bg-gray-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl text-center border border-gray-700 animate-in fade-in">
              {statusToast}
            </div>
          </div>
        )}
      </div>

      {/* Driver Controls Bottom Sheet */}
      <div className="relative z-20 bg-white rounded-t-3xl shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.12)] p-5 space-y-4 border-t border-gray-100">
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto"></div>

        {/* Patient / Caller Contact info */}
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Patient / Caller</span>
            <h4 className="text-xs font-extrabold text-gray-900 truncate">{booking.userName}</h4>
            <p className="text-[11px] text-gray-500 font-mono">{booking.userPhone}</p>
          </div>
          <button
            onClick={() => setCallModalOpen(true)}
            className="w-10 h-10 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold text-base shadow-xs shrink-0"
            title="Call Patient"
          >
            📞
          </button>
        </div>

        {/* Pickup & Hospital Destination Details */}
        <div className="space-y-1.5 text-xs bg-gray-50 p-3 rounded-2xl border border-gray-200">
          <div className="flex items-start space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1 shrink-0"></span>
            <div className="min-w-0">
              <span className="text-[9px] font-bold text-gray-400 uppercase block">Pickup Point</span>
              <span className="text-gray-900 font-semibold truncate block">{booking.pickup.address}</span>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 mt-1 shrink-0"></span>
            <div className="min-w-0">
              <span className="text-[9px] font-bold text-gray-400 uppercase block">Receiving Emergency Facility</span>
              <span className="text-red-700 font-semibold truncate block">
                {booking.destination?.address || 'TUTH Emergency Trauma Unit'}
              </span>
            </div>
          </div>
        </div>

        {/* Next Lifecycle Step Action Button */}
        {booking.status !== 'completed' ? (
          <button
            onClick={handleAdvance}
            className="w-full bg-[#DC2626] hover:bg-[#b91c1c] active:scale-98 text-white font-black text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-red-600/30 transition flex items-center justify-center space-x-2"
          >
            <span>{nextAction.label}</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        ) : (
          <button
            onClick={onTripCompleted}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm py-3.5 rounded-2xl shadow-lg shadow-emerald-600/25 transition"
          >
            Complete Handover & Return to Duty &rarr;
          </button>
        )}
      </div>

      {/* Patient Call Modal */}
      {callModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl border border-gray-100">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
              📞
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Calling Caller / Patient</h3>
              <p className="text-xs text-gray-600 font-mono mt-1">{booking.userPhone}</p>
              <p className="text-[11px] text-gray-400 mt-1">Direct communication with patient family</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCallModalOpen(false)}
                className="py-2.5 rounded-xl bg-gray-100 text-xs font-bold text-gray-700 hover:bg-gray-200"
              >
                Close
              </button>
              <a
                href={`tel:${booking.userPhone}`}
                className="py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center hover:bg-emerald-700"
              >
                Dial Now
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Handover Completed Modal */}
      {handoverModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl border border-gray-100">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">Patient Handover Completed</h3>
              <p className="text-xs text-gray-600 mt-1">
                Patient safely admitted to {booking.destination?.address || 'Hospital Trauma ER'}. Trip logged in history.
              </p>
            </div>
            <button
              onClick={() => {
                setHandoverModalOpen(false);
                onTripCompleted();
              }}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-2xl shadow-md text-xs"
            >
              Back to Driver Console &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Report Issue Modal */}
      {reportIssueOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl border border-gray-100">
            <h3 className="text-sm font-extrabold text-red-600">Report In-Transit Issue</h3>
            <p className="text-xs text-gray-600">Select an operational incident to alert central Kathmandu dispatch:</p>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => {
                  showToast('Traffic priority request dispatched to Kathmandu Traffic Police.');
                  setReportIssueOpen(false);
                }}
                className="w-full text-left p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 font-semibold"
              >
                🚦 Severe Traffic Jam / Blocked Corridor
              </button>
              <button
                onClick={() => {
                  showToast('Receiving Hospital ER team alerted: Critical Code Red Triage.');
                  setReportIssueOpen(false);
                }}
                className="w-full text-left p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-semibold"
              >
                ⚠️ Critical Patient Clinical Deterioration
              </button>
              <button
                onClick={() => {
                  setReportIssueOpen(false);
                  setBreakdownConfirmOpen(true);
                }}
                className="w-full text-left p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-semibold"
              >
                🔧 Vehicle Mechanical Breakdown
              </button>
            </div>
            <button
              onClick={() => setReportIssueOpen(false)}
              className="w-full py-2.5 rounded-xl bg-gray-100 text-xs font-bold text-gray-500 hover:text-gray-800 mt-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Breakdown Confirmation Dialog */}
      {breakdownConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-3xl p-6 max-w-xs w-full text-center space-y-3.5 shadow-2xl border border-gray-100">
            <h3 className="text-sm font-black text-rose-600">Cancel for Mechanical Breakdown?</h3>
            <p className="text-xs text-gray-600">
              This will reassign an urgent replacement ambulance from the nearest depot to the patient immediately.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setBreakdownConfirmOpen(false)}
                className="py-2.5 rounded-xl bg-gray-100 text-xs font-bold text-gray-700"
              >
                No, Go Back
              </button>
              <button
                onClick={() => {
                  cancelActiveBooking('Driver reported mechanical breakdown');
                  setBreakdownConfirmOpen(false);
                  onBack();
                }}
                className="py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
              >
                Confirm Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
