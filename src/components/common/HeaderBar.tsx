/**
 * RESQ Nepal - Universal Mobile Top Bar
 * Matches the reference headers across all screenshots with accurate status bar & back/menu actions.
 */

import React from 'react';
import { useAppStore } from '../../store/useAppStore';

interface HeaderBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onOpenDrawer?: () => void;
  rightAction?: React.ReactNode;
  uiStyle?: 'light' | 'dark';
  variant?: 'brand' | 'simple' | 'nepali';
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  onOpenDrawer,
  rightAction,
  uiStyle = 'light',
  variant = 'simple',
}) => {
  const { currentUser, activeMode } = useAppStore();

  const isDark = uiStyle === 'dark';

  return (
    <div className={`w-full shrink-0 select-none ${isDark ? 'bg-[#181A1F] text-white' : 'bg-white text-gray-900 border-b border-gray-100'}`}>
      {/* iOS/Android Status Bar Simulation: 9:41, Cellular, Wifi, 85% Battery */}
      <div className={`flex items-center justify-between px-6 pt-3 pb-1 text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
        <span className="font-mono text-[13px] tracking-tight">9:41</span>
        <div className="flex items-center space-x-2 text-[11px]">
          {/* Signal */}
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.2.2-.2.51 0 .71.2.2.51.2.71 0l1.86-1.86C8.42 19.34 10.14 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/></svg>
          {/* Wifi */}
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4z"/></svg>
          {/* Battery 85% */}
          <div className="flex items-center space-x-0.5">
            <span className="text-[10px] font-mono text-emerald-400 font-bold">85%</span>
            <div className="w-5 h-2.5 rounded-xs border border-current p-0.5 flex items-center">
              <div className="h-full bg-emerald-400 rounded-2xs w-[85%]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="flex items-center justify-between px-4 py-2.5 h-13">
        {/* Left Action: Hamburger Menu or Back Arrow */}
        <div className="flex items-center space-x-3">
          {showBack ? (
            <button
              onClick={onBack}
              className={`p-2 rounded-full transition active:scale-90 ${isDark ? 'bg-gray-800/80 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              aria-label="Go back"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : onOpenDrawer ? (
            <button
              onClick={onOpenDrawer}
              className={`p-2.5 rounded-full transition active:scale-90 ${isDark ? 'bg-[#2A2E35] text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          ) : null}

          {/* Title or Brand Identity */}
          {variant === 'brand' || variant === 'nepali' ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-sm font-bold text-base">
                🚑
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <h1 className="font-black text-base tracking-tight leading-tight text-red-600">RESQ</h1>
                  <span className={`font-black text-base tracking-tight leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>NEPAL</span>
                </div>
                <p className="text-[10px] text-gray-500 font-medium">Emergency Ambulance Dispatch</p>
              </div>
            </div>
          ) : (
            <div>
              {title && <h2 className="font-extrabold text-base tracking-tight leading-tight">{title}</h2>}
              {subtitle && <p className="text-[11px] text-gray-400">{subtitle}</p>}
            </div>
          )}
        </div>

        {/* Right Action */}
        <div className="flex items-center space-x-2">
          {rightAction ? (
            rightAction
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-gray-600 bg-gray-800 flex items-center justify-center">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-white uppercase">{currentUser.name.slice(0, 2)}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
