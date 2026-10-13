/**
 * RESQ Nepal - Authentication Welcome / Choose Account Type Screen
 * Authentic emergency red & white branding:
 * - RESQ Nepal identity & ambulance emblem
 * - "Continue as User" & "Continue as Driver" primary selection
 * - "Already have an account? Sign In" navigation
 */

import React from 'react';

interface WelcomeScreenProps {
  onSelectUser: () => void;
  onSelectDriver: () => void;
  onSelectSignIn: (role?: 'user' | 'driver') => void;
  onClose?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onSelectUser,
  onSelectDriver,
  onSelectSignIn,
  onClose,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between bg-white px-6 py-8 select-none text-gray-900 overflow-y-auto">
      {/* Top Header / Close if applicable */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-200">
            <span className="text-base font-black">🚑</span>
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-base font-black tracking-tight text-gray-900">RESQ</span>
              <span className="text-base font-black tracking-tight text-red-600">NEPAL</span>
            </div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-xs transition"
            title="Close"
          >
            ✕
          </button>
        )}
      </div>

      {/* Hero Visual Element & Typography */}
      <div className="my-auto py-6 flex flex-col items-center text-center space-y-6">
        {/* Ambulance Medical Response Graphic Element */}
        <div className="relative">
          <div className="w-28 h-28 rounded-3xl bg-red-50 border-2 border-red-100 flex items-center justify-center shadow-lg shadow-red-100/50">
            {/* Custom SVG Ambulance Visual */}
            <svg
              className="w-16 h-16 text-red-600"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Emergency vehicle chassis */}
              <rect x="6" y="22" width="52" height="26" rx="4" fill="currentColor" opacity="0.12" />
              <path
                d="M8 44V26C8 23.7909 9.79086 22 12 22H42L54 32V44C54 45.1046 53.1046 46 52 46H8C8 46 8 44.5 8 44Z"
                fill="#DC2626"
              />
              {/* Windshield */}
              <path d="M42 25H44L51 33H42V25Z" fill="#FEE2E2" />
              {/* Medical Red Cross */}
              <rect x="22" y="30" width="10" height="4" rx="1" fill="white" />
              <rect x="25" y="27" width="4" height="10" rx="1" fill="white" />
              {/* Siren top */}
              <circle cx="27" cy="18" r="3" fill="#EF4444" />
              <path d="M25 15C25 15 27 13 29 15" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
              {/* Wheels */}
              <circle cx="18" cy="46" r="6" fill="#1F2937" />
              <circle cx="18" cy="46" r="2.5" fill="#E5E7EB" />
              <circle cx="44" cy="46" r="6" fill="#1F2937" />
              <circle cx="44" cy="46" r="2.5" fill="#E5E7EB" />
            </svg>
          </div>

          {/* Pulse heartbeat indicator */}
          <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-md flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>24/7 ACTIVE</span>
          </div>
        </div>

        {/* Headings */}
        <div className="space-y-2 max-w-xs">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
            Welcome to <span className="text-red-600">RESQ Nepal</span>
          </h1>
          <p className="text-xs font-medium text-gray-600 leading-relaxed">
            Reliable ambulance services, when every moment matters.
          </p>
        </div>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[10px] text-gray-500 font-medium">
          <span className="px-2.5 py-1 bg-gray-100 rounded-full flex items-center space-x-1">
            <span>⚡</span>
            <span>Real-time GPS Dispatch</span>
          </span>
          <span className="px-2.5 py-1 bg-gray-100 rounded-full flex items-center space-x-1">
            <span>🏥</span>
            <span>Kathmandu Hospitals</span>
          </span>
          <span className="px-2.5 py-1 bg-gray-100 rounded-full flex items-center space-x-1">
            <span>🇳🇵</span>
            <span>Govt. Regulated Fares</span>
          </span>
        </div>
      </div>

      {/* Bottom CTA Button Section */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        {/* Continue as User button */}
        <button
          onClick={onSelectUser}
          className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-2xl font-extrabold text-sm transition shadow-lg shadow-red-600/25 flex items-center justify-center space-x-2"
        >
          <span>Continue as User</span>
          <span className="text-base">→</span>
        </button>

        {/* Continue as Driver button */}
        <button
          onClick={onSelectDriver}
          className="w-full py-3.5 px-4 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-900 border-2 border-gray-200 hover:border-gray-300 rounded-2xl font-extrabold text-sm transition flex items-center justify-center space-x-2"
        >
          <span>Continue as Driver</span>
          <span className="text-red-600 font-bold">🚑</span>
        </button>

        {/* Existing account link */}
        <div className="pt-2 text-center">
          <p className="text-xs text-gray-500">
            Already have an account?{' '}
            <button
              onClick={() => onSelectSignIn()}
              className="text-red-600 hover:text-red-700 font-bold underline underline-offset-2 transition"
            >
              Sign In
            </button>
          </p>
        </div>

        {/* Emergency SOS hotline quick strip */}
        <div className="pt-2 flex items-center justify-center space-x-4 text-[10px] text-gray-400">
          <span>Nepal Hotline: <strong className="text-gray-700">102</strong> (Ambulance)</span>
          <span>•</span>
          <span>Police: <strong className="text-gray-700">100</strong></span>
        </div>
      </div>
    </div>
  );
};
