/**
 * RESQ Nepal - App Settings Screen
 * Original RESQ Nepal preferences: Language, Emergency Alerts,
 * GPS telemetry permissions, and Ministry of Health compliance.
 */

import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { HeaderBar } from '../common/HeaderBar';

interface AppSettingsScreenProps {
  onBack: () => void;
}

export const AppSettingsScreen: React.FC<AppSettingsScreenProps> = ({ onBack }) => {
  const { settings, updateSettings, resetDemoData } = useAppStore();
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [resetToast, setResetToast] = useState(false);

  const handleReset = () => {
    resetDemoData();
    setResetConfirmOpen(false);
    setResetToast(true);
    setTimeout(() => setResetToast(false), 2000);
  };

  return (
    <div className="w-full h-full bg-[#F9FAFB] text-gray-900 flex flex-col justify-between overflow-hidden font-sans">
      <HeaderBar title="Settings" showBack={true} onBack={onBack} uiStyle="light" />

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Reset Success Toast */}
        {resetToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold text-center animate-in fade-in">
            ✓ Demo data successfully reset to defaults.
          </div>
        )}

        {/* Settings Group */}
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 shadow-xs">
          {/* Language Switcher */}
          <div
            onClick={() => updateSettings({ language: settings.language === 'en' ? 'ne' : 'en' })}
            className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition"
          >
            <div>
              <span className="text-xs font-bold text-gray-900 block">Language / भाषा</span>
              <span className="text-[11px] text-gray-500">{settings.language === 'en' ? 'English (EN)' : 'नेपाली (Nepali)'}</span>
            </div>
            <span className="text-xs font-bold text-red-600">Switch &rarr;</span>
          </div>

          {/* Distance Units */}
          <div
            onClick={() => updateSettings({ distanceUnits: settings.distanceUnits === 'Kilometres' ? 'Miles' : 'Kilometres' })}
            className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition"
          >
            <div>
              <span className="text-xs font-bold text-gray-900 block">Distance Units</span>
              <span className="text-[11px] text-gray-500">{settings.distanceUnits}</span>
            </div>
            <span className="text-xs font-bold text-gray-600">{settings.distanceUnits}</span>
          </div>

          {/* Emergency Siren Audio */}
          <div
            onClick={() => updateSettings({ emergencySirensEnabled: !settings.emergencySirensEnabled })}
            className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition"
          >
            <div>
              <span className="text-xs font-bold text-gray-900 block">Emergency Siren Sound Alerts</span>
              <span className="text-[11px] text-gray-500">Play audible siren chimes when dispatch is within 1 km</span>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              settings.emergencySirensEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
            }`}>
              {settings.emergencySirensEnabled ? 'Enabled' : 'Muted'}
            </span>
          </div>

          {/* Location Sharing */}
          <div
            onClick={() => updateSettings({ showLocationToDriver: !settings.showLocationToDriver })}
            className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition"
          >
            <div>
              <span className="text-xs font-bold text-gray-900 block">GPS Telemetry to Assigned Ambulance</span>
              <span className="text-[11px] text-gray-500">Provide real-time coordinate updates to approaching driver</span>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              settings.showLocationToDriver ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
            }`}>
              {settings.showLocationToDriver ? 'Active' : 'Off'}
            </span>
          </div>
        </div>

        {/* Regulatory & Version Information Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-2 shadow-xs text-xs text-gray-600">
          <div className="flex items-center space-x-2 text-red-600 font-bold">
            <span>🛡️</span>
            <span>MoHP National Ambulance Guideline 2078</span>
          </div>
          <p className="text-[11px] leading-relaxed text-gray-500">
            RESQ Nepal operates in certified compliance with Nepal Emergency Medical Services standards. Licensed and monitored under Kathmandu Metropolitan Public Health Division.
          </p>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between font-mono text-[11px] text-gray-400">
            <span>RESQ Nepal Mobile</span>
            <span>v2.0.0 (Original Build)</span>
          </div>
        </div>

        {/* Reset Demo Data Button */}
        <button
          onClick={() => setResetConfirmOpen(true)}
          className="w-full py-3 rounded-2xl bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:text-red-600 transition shadow-xs"
        >
          Reset Demo Data
        </button>
      </div>

      {/* Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-3xl p-6 max-w-xs w-full space-y-3.5 shadow-2xl border border-gray-100 text-center">
            <h3 className="text-sm font-extrabold text-gray-900">Reset Local Demo Data?</h3>
            <p className="text-xs text-gray-500">
              This will restore all Kathmandu ambulances, bookings, and places back to default demo state.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
