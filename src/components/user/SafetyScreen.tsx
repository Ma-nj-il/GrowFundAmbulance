/**
 * RESQ Nepal - Safety & Emergency SOS Screen
 * Authentic RESQ Nepal emergency services design:
 * Dual Nepal SOS buttons (102 Ambulance & 100 Police),
 * Hospital trauma emergency desks, and EMT medical transport protection standards.
 */

import React, { useState } from 'react';
import { HeaderBar } from '../common/HeaderBar';
import { KATHMANDU_HOSPITALS } from '../../config/constants';

interface SafetyScreenProps {
  onBack: () => void;
  onNavigate: (route: string) => void;
}

export const SafetyScreen: React.FC<SafetyScreenProps> = ({ onBack, onNavigate }) => {
  const [sosModalOpen, setSosModalOpen] = useState<'102' | '100' | null>(null);
  const [activeGuide, setActiveGuide] = useState<string | null>(null);
  const [hospitalsModalOpen, setHospitalsModalOpen] = useState(false);

  const guides: Record<string, { title: string; text: string }> = {
    proactive: {
      title: 'Active GPS Fleet Telematics',
      text: 'Every RESQ Nepal ambulance is equipped with active GPS telematics. Dispatch tracks speed, route progression, and emergency hospital ETA in real time across Kathmandu Valley.',
    },
    verification: {
      title: 'Certified EMT & Driver Verification',
      text: 'All drivers possess Department of Transport Management (DOTM) heavy emergency vehicle licenses and have completed Nepal Red Cross Society Basic Life Support (BLS) training.',
    },
    privacy: {
      title: 'Patient Medical Data Protection',
      text: 'Patient clinical triage information is strictly shared only with the assigned emergency response crew and receiving hospital emergency physicians.',
    },
    standards: {
      title: 'Medical Life Support Standards',
      text: 'Vehicles adhere to National Ambulance Guidelines 2078 (MoHP): 5-point stretcher harnesses, piped oxygen manifolds, manual and transport ventilators, and sterile trauma kits.',
    },
    protocols: {
      title: 'Emergency Priority Protocols',
      text: 'Ambulances operate under Kathmandu Valley traffic priority protocols. In critical Code Red emergencies, traffic signals and corridors are cleared for unhindered hospital transit.',
    },
  };

  return (
    <div className="w-full h-full bg-[#F9FAFB] text-gray-900 flex flex-col justify-between overflow-hidden font-sans">
      <HeaderBar title="Emergency Safety & SOS" showBack={true} onBack={onBack} uiStyle="light" />

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Dual Emergency SOS Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* Call 102 - Ambulance Hotline */}
          <button
            onClick={() => setSosModalOpen('102')}
            className="p-4 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-98 text-white font-black text-sm shadow-lg shadow-red-600/25 transition flex flex-col items-center justify-center space-y-1"
          >
            <span className="text-2xl">🚑</span>
            <span>Call 102 (Ambulance)</span>
            <span className="text-[10px] text-red-100 font-normal">National Medical Dispatch</span>
          </button>

          {/* Call 100 - Nepal Police */}
          <button
            onClick={() => setSosModalOpen('100')}
            className="p-4 rounded-2xl bg-gray-900 hover:bg-black active:scale-98 text-white font-black text-sm shadow-lg transition flex flex-col items-center justify-center space-y-1"
          >
            <span className="text-2xl">🚨</span>
            <span>Call 100 (Police)</span>
            <span className="text-[10px] text-gray-400 font-normal">Emergency Police Control</span>
          </button>
        </div>

        {/* Quick Contact & Support Row */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate('support')}
            className="p-3.5 rounded-2xl bg-white border border-gray-200 hover:border-red-200 transition flex items-center space-x-3 text-left shadow-xs"
          >
            <span className="text-xl">💬</span>
            <div>
              <span className="text-xs font-bold text-gray-900 block">Dispatch Chat</span>
              <span className="text-[10px] text-gray-400">24/7 Response Desk</span>
            </div>
          </button>

          <button
            onClick={() => setHospitalsModalOpen(true)}
            className="p-3.5 rounded-2xl bg-white border border-gray-200 hover:border-red-200 transition flex items-center space-x-3 text-left shadow-xs"
          >
            <span className="text-xl">🏥</span>
            <div>
              <span className="text-xs font-bold text-gray-900 block">Hospital Contacts</span>
              <span className="text-[10px] text-gray-400">Kathmandu Trauma Hubs</span>
            </div>
          </button>
        </div>

        {/* Section: Medical Protection & Standards */}
        <div>
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-gray-500 mb-2.5">
            RESQ Nepal Protection Standards
          </h3>

          <div className="space-y-2">
            {/* 1. Proactive Fleet Telematics */}
            <div
              onClick={() => setActiveGuide('proactive')}
              className="p-3.5 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 cursor-pointer shadow-xs flex items-center justify-between transition"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                  🛡️
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Active Fleet Telematics</h4>
                  <p className="text-[11px] text-gray-500">Live GPS tracking and monitored corridors</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">&rarr;</span>
            </div>

            {/* 2. EMT & Driver Verification */}
            <div
              onClick={() => setActiveGuide('verification')}
              className="p-3.5 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 cursor-pointer shadow-xs flex items-center justify-between transition"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-lg">
                  👨‍⚕️
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Certified EMT & Driver Verification</h4>
                  <p className="text-[11px] text-gray-500">DOTM licensed and Red Cross BLS trained</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">&rarr;</span>
            </div>

            {/* 3. Patient Medical Data Protection */}
            <div
              onClick={() => setActiveGuide('privacy')}
              className="p-3.5 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 cursor-pointer shadow-xs flex items-center justify-between transition"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                  🔒
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Patient Medical Privacy</h4>
                  <p className="text-[11px] text-gray-500">Encrypted clinical handover protocols</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">&rarr;</span>
            </div>

            {/* 4. Life Support Standards */}
            <div
              onClick={() => setActiveGuide('standards')}
              className="p-3.5 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 cursor-pointer shadow-xs flex items-center justify-between transition"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
                  💉
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">National Ambulance Standards</h4>
                  <p className="text-[11px] text-gray-500">Continuous oxygen, ECG, and trauma kits</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">&rarr;</span>
            </div>

            {/* 5. Emergency Priority Protocols */}
            <div
              onClick={() => setActiveGuide('protocols')}
              className="p-3.5 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 cursor-pointer shadow-xs flex items-center justify-between transition"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
                  ⚡
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Traffic Clearance Protocols</h4>
                  <p className="text-[11px] text-gray-500">Kathmandu traffic emergency priority</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">&rarr;</span>
            </div>
          </div>
        </div>
      </div>

      {/* SOS Modal */}
      {sosModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl border border-gray-100">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-3xl animate-bounce">
              📞
            </div>
            <div>
              <h3 className="text-base font-extrabold text-red-600">
                {sosModalOpen === '102' ? 'Connecting to 102 Ambulance Dispatch' : 'Connecting to Nepal Police 100'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Your current GPS coordinates in Kathmandu Valley are ready to share with emergency operators.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSosModalOpen(null)}
                className="py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition"
              >
                Cancel
              </button>
              <a
                href={sosModalOpen === '102' ? 'tel:102' : 'tel:100'}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center transition"
              >
                Dial {sosModalOpen}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hospital Contacts Modal */}
      {hospitalsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-3xl p-6 max-w-sm w-full space-y-3.5 shadow-2xl border border-gray-100 max-h-[85vh] overflow-y-auto">
            <h3 className="text-sm font-extrabold text-gray-900">Kathmandu Emergency Trauma Desks</h3>
            <div className="space-y-2">
              {KATHMANDU_HOSPITALS.map((hosp) => (
                <div key={hosp.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-gray-900 block truncate">{hosp.name}</span>
                    <span className="text-[10px] text-gray-500 block">{hosp.address}</span>
                  </div>
                  <a
                    href={`tel:${hosp.emergencyHotline}`}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-bold shrink-0"
                  >
                    Call ER
                  </a>
                </div>
              ))}
            </div>
            <button
              onClick={() => setHospitalsModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Guide Details Modal */}
      {activeGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-3xl p-6 max-w-sm w-full space-y-3.5 shadow-2xl border border-gray-100">
            <h3 className="text-base font-extrabold text-gray-900">{guides[activeGuide]?.title}</h3>
            <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">{guides[activeGuide]?.text}</p>
            <button
              onClick={() => setActiveGuide(null)}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
