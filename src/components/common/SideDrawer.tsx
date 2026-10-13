/**
 * RESQ Nepal - Original Mobile Navigation Drawer
 * Designed with authentic RESQ Nepal Emergency Medical Services identity:
 * Crisp white and emergency red accents, hotline 102, profile info, and seamless Driver Mode switcher.
 */

import React from 'react';
import { useAppStore } from '../../store/useAppStore';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const { currentUser, switchMode } = useAppStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Body */}
      <div className="relative w-[82%] max-w-[320px] h-full bg-white text-gray-900 flex flex-col justify-between p-5 shadow-2xl z-10 animate-in slide-in-from-left duration-200 border-r border-gray-100">
        <div className="space-y-5 overflow-y-auto pr-1">
          {/* RESQ Nepal Brand Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-red-600/20">
                🚑
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-black text-base tracking-tight text-red-600">RESQ</span>
                  <span className="font-black text-base tracking-tight text-gray-900">NEPAL</span>
                </div>
                <span className="text-[10px] font-bold text-gray-400 block tracking-wider uppercase">
                  Emergency Medical Network
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Profile Card */}
          <div
            onClick={() => {
              onNavigate('settings');
              onClose();
            }}
            className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center space-x-3 cursor-pointer hover:bg-gray-100/80 transition"
          >
            <div className="relative">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentUser.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-red-600/20"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-gray-900 truncate">{currentUser.name}</h3>
              <p className="text-[11px] text-gray-500 font-mono">{currentUser.phone || '+977-9841234567'}</p>
            </div>
          </div>

          {/* Clean Medical Navigation Items */}
          <nav className="space-y-1 text-sm font-semibold">
            <button
              onClick={() => {
                onNavigate('home');
                onClose();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition text-left"
            >
              <span className="text-base">🚑</span>
              <span>Ambulance Booking</span>
            </button>

            <button
              onClick={() => {
                onNavigate('history');
                onClose();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition text-left"
            >
              <span className="text-base">📋</span>
              <span>Trip History</span>
            </button>

            <button
              onClick={() => {
                onNavigate('saved-places');
                onClose();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition text-left"
            >
              <span className="text-base">📍</span>
              <span>Saved Locations</span>
            </button>

            <button
              onClick={() => {
                onNavigate('notifications');
                onClose();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition text-left"
            >
              <span className="text-base">🔔</span>
              <span>Emergency Alerts</span>
            </button>

            <button
              onClick={() => {
                onNavigate('safety');
                onClose();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition text-left"
            >
              <span className="text-base">🛡️</span>
              <span>Safety & EMT Guidelines</span>
            </button>

            <button
              onClick={() => {
                onNavigate('settings');
                onClose();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition text-left"
            >
              <span className="text-base">⚙️</span>
              <span>Settings & Language</span>
            </button>

            <button
              onClick={() => {
                onNavigate('support');
                onClose();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition text-left"
            >
              <span className="text-base">💬</span>
              <span>24/7 Dispatch Support</span>
            </button>

            <button
              onClick={() => {
                onNavigate('auth-welcome');
                onClose();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-red-600 bg-red-50/60 hover:bg-red-100 transition text-left font-bold"
            >
              <span className="text-base">🔐</span>
              <span>Sign In / Switch Account</span>
            </button>
          </nav>
        </div>

        {/* Bottom Section: Driver Mode Switcher & Emergency Hotline */}
        <div className="space-y-3 pt-3 border-t border-gray-100">
          {/* Switch to Driver Mode Button */}
          <button
            onClick={() => {
              switchMode('driver');
              onNavigate('driver-home');
              onClose();
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm py-3 px-4 rounded-2xl shadow-lg shadow-red-600/25 transition active:scale-98 flex items-center justify-center space-x-2"
          >
            <span>🚑 Switch to Driver Mode</span>
          </button>

          {/* Become a Driver link */}
          <button
            onClick={() => {
              onNavigate('driver-register');
              onClose();
            }}
            className="w-full text-center text-xs font-bold text-gray-600 hover:text-red-600 transition"
          >
            Become an Ambulance Driver &rarr;
          </button>

          {/* Official Nepal Hotline Footer */}
          <div className="bg-red-50 rounded-xl p-2.5 text-center text-[10px] text-red-800 font-bold border border-red-100">
            Emergency Hotlines: Dial 102 (Ambulance) / 100 (Police)
          </div>
        </div>
      </div>
    </div>
  );
};
