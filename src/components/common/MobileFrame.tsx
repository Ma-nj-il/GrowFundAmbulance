/**
 * RESQ Nepal - Mobile Handset Bezel Simulator & Mode Switch Toolbar
 * Provides a high-fidelity mobile experience with realistic frame,
 * notch/island, rounded safe areas, seamless User/Driver Mode switcher, and Auth modal trigger.
 */

import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

interface MobileFrameProps {
  children: React.ReactNode;
  uiStyle?: 'light' | 'dark';
  onOpenAuthModal?: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  onOpenAuthModal,
}) => {
  const { activeMode, switchMode, currentUser, resetDemoData } = useAppStore();
  const [deviceFrameEnabled, setDeviceFrameEnabled] = useState(true);

  return (
    <div className="flex-1 w-full bg-[#0B0E14] flex flex-col items-center justify-center p-0 sm:p-4 overflow-hidden relative">
      {/* Top Floating App Toolbar */}
      <div className="hidden sm:flex absolute top-3 inset-x-6 z-40 items-center justify-between pointer-events-none">
        {/* Brand & Mode Indicator */}
        <div className="flex items-center space-x-2 bg-gray-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gray-800 text-xs text-gray-200 shadow-lg pointer-events-auto">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
            <span className="font-black text-red-500">RESQ</span>
            <span className="font-extrabold text-white">NEPAL</span>
          </div>
          <span className="text-gray-600">|</span>
          {/* Switch Mode Button */}
          <div className="flex items-center bg-gray-800/80 p-0.5 rounded-full border border-gray-700/60">
            <button
              onClick={() => switchMode('user')}
              className={`px-3 py-1 rounded-full font-extrabold text-[11px] transition ${
                activeMode === 'user' ? 'bg-red-600 text-white shadow-xs' : 'text-gray-400 hover:text-white'
              }`}
            >
              👤 User Mode
            </button>
            <button
              onClick={() => switchMode('driver')}
              className={`px-3 py-1 rounded-full font-extrabold text-[11px] transition ${
                activeMode === 'driver' ? 'bg-red-600 text-white shadow-xs' : 'text-gray-400 hover:text-white'
              }`}
            >
              🚑 Driver Mode
            </button>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          {/* Auth / Account Profile */}
          {onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              className="bg-gray-900/90 hover:bg-gray-800 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-800 text-[11px] text-gray-200 shadow-md font-bold transition flex items-center space-x-1.5"
            >
              <span>🔑</span>
              <span>{currentUser.name.split(' ')[0]} (Sign In / Register)</span>
            </button>
          )}

          {/* Reset Demo Data */}
          <button
            onClick={() => {
              resetDemoData();
            }}
            className="bg-gray-900/90 hover:bg-gray-800 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-800 text-[11px] text-gray-300 shadow-md font-bold transition"
            title="Reset demo ambulances and bookings"
          >
            ↻ Reset Fleet Data
          </button>

          {/* Device Frame Toggle Chip */}
          <button
            onClick={() => setDeviceFrameEnabled(!deviceFrameEnabled)}
            className={`px-3 py-1.5 rounded-full font-bold text-[11px] border border-gray-800 transition shadow-md ${
              deviceFrameEnabled ? 'bg-red-600 text-white' : 'bg-gray-900/90 text-gray-400 hover:text-white'
            }`}
          >
            {deviceFrameEnabled ? 'iPhone 16 Pro Frame' : 'Full Screen'}
          </button>
        </div>
      </div>

      {deviceFrameEnabled ? (
        <div className="w-full max-w-[420px] h-[100dvh] sm:h-[870px] max-h-[96vh] bg-white sm:rounded-[48px] sm:ring-12 sm:ring-[#1E222B] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden relative border border-gray-800/60">
          {/* Dynamic Island / Notch */}
          <div className="hidden sm:block absolute top-3 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 border border-gray-900 shadow-sm flex items-center justify-end pr-2 pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0a1829] border border-gray-800"></div>
          </div>

          {/* Screen Canvas */}
          <div className="w-full h-full flex flex-col overflow-hidden relative">
            {children}
          </div>

          {/* iOS Bottom Home Bar Indicator */}
          <div className="hidden sm:block absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-400/50 rounded-full z-40 pointer-events-none"></div>
        </div>
      ) : (
        <div className="w-full h-[100dvh] flex flex-col overflow-hidden relative bg-white">
          {children}
        </div>
      )}
    </div>
  );
};
