/**
 * RESQ Nepal - Driver Login / Sign In Screen
 * Paramedic & Ambulance Operator authentication:
 * - Nepal country code +977 mobile input
 * - Password input with visibility toggle
 * - Remember me & Forgot Password navigation
 * - Quick fill demo driver credentials (Hari Sundar Shrestha)
 * - Navigation to Driver Registration / Ambulance Application
 */

import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

interface DriverLoginScreenProps {
  onSuccess: () => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
  onBackToAccountType: () => void;
}

export const DriverLoginScreen: React.FC<DriverLoginScreenProps> = ({
  onSuccess,
  onNavigateToRegister,
  onNavigateToForgotPassword,
  onBackToAccountType,
}) => {
  const { login } = useAppStore();

  const [phone, setPhone] = useState('9841883391');
  const [password, setPassword] = useState('driver123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = phone.trim().replace(/[\s\-]/g, '');
    if (!cleanPhone) {
      setError('Please enter your Nepal driver phone number');
      return;
    }
    if (cleanPhone.length < 7) {
      setError('Phone number must be at least 7 digits (e.g. 9841883391)');
      return;
    }
    if (!password) {
      setError('Please enter your driver password');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const ok = login(cleanPhone, password);
      if (ok) {
        setIsLoading(false);
        onSuccess();
      } else {
        setIsLoading(false);
        setError('Invalid driver credentials. Check phone number or use the demo driver below.');
      }
    }, 400);
  };

  const handleFillDemo = () => {
    setPhone('9841883391');
    setPassword('driver123');
    setError(null);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-white px-6 py-6 select-none text-gray-900 overflow-y-auto">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-4">
        <button
          onClick={onBackToAccountType}
          className="flex items-center space-x-1.5 text-xs text-gray-600 hover:text-gray-900 font-semibold p-1 -ml-1 rounded-lg transition"
        >
          <span>←</span>
          <span>Account Type</span>
        </button>

        <div className="flex items-center space-x-1">
          <span className="text-xs font-black tracking-tight text-gray-900">RESQ</span>
          <span className="text-xs font-black tracking-tight text-red-600">NEPAL</span>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="my-auto space-y-5 max-w-sm mx-auto w-full">
        {/* Headings */}
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold">
            <span>🚑</span>
            <span>Driver & Paramedic Portal</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Driver Sign In</h2>
          <p className="text-xs text-gray-500">
            Sign in to accept Kathmandu emergency dispatches and assist patients.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-start space-x-2 animate-in fade-in">
            <span className="text-red-500 font-bold mt-0.5">⚠️</span>
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone Number Field */}
          <div>
            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
              Driver Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition bg-gray-50/50">
              <div className="px-3 py-2.5 bg-gray-100 border-r border-gray-300 flex items-center space-x-1 text-xs font-bold text-gray-700 select-none">
                <span>🇳🇵</span>
                <span>+977</span>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98XXXXXXXX"
                className="flex-1 px-3 py-2.5 text-xs text-gray-900 bg-transparent outline-none font-medium placeholder-gray-400"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Registered mobile on Nepal EMT system</p>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                Password <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={onNavigateToForgotPassword}
                className="text-[11px] text-red-600 hover:text-red-700 font-bold transition"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition bg-gray-50/50">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter driver password"
                className="w-full px-3 py-2.5 text-xs text-gray-900 bg-transparent outline-none font-medium pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-gray-600 text-xs font-semibold p-1 transition"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center space-x-2 pt-0.5">
            <input
              type="checkbox"
              id="rememberDriver"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 border-gray-300 focus:ring-red-500 accent-red-600 cursor-pointer"
            />
            <label htmlFor="rememberDriver" className="text-xs text-gray-600 cursor-pointer font-medium select-none">
              Stay signed in for emergency alerts
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-red-400 text-white rounded-2xl font-extrabold text-xs transition shadow-lg shadow-red-600/25 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Connecting to Dispatch Desk...</span>
              </span>
            ) : (
              <span>Sign In as Driver</span>
            )}
          </button>
        </form>

        {/* Quick Demo Fill Helper */}
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 text-center space-y-1.5">
          <p className="text-[10px] text-gray-500 font-medium">Demo Ambulance Operator Account:</p>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-[11px] font-bold text-red-600 hover:text-red-700 bg-white border border-red-200 px-3 py-1 rounded-lg shadow-2xs hover:bg-red-50 transition"
          >
            ⚡ Autofill Demo Driver (+977 9841883391 / driver123)
          </button>
        </div>
      </div>

      {/* Bottom Registration Prompt */}
      <div className="pt-4 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-600">
          Want to register an ambulance vehicle?{' '}
          <button
            onClick={onNavigateToRegister}
            className="text-red-600 hover:text-red-700 font-extrabold underline underline-offset-2 transition"
          >
            Apply as a Driver
          </button>
        </p>
      </div>
    </div>
  );
};
