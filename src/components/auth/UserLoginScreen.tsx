/**
 * RESQ Nepal - User Login / Sign In Screen
 * Dedicated emergency red-and-white authentication:
 * - Nepal country code +977 phone input
 * - Password input with visibility toggle
 * - Remember me & Forgot Password navigation
 * - Inline field validation and error banners
 * - Quick fill demo user credentials
 */

import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

interface UserLoginScreenProps {
  onSuccess: () => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
  onBackToAccountType: () => void;
}

export const UserLoginScreen: React.FC<UserLoginScreenProps> = ({
  onSuccess,
  onNavigateToRegister,
  onNavigateToForgotPassword,
  onBackToAccountType,
}) => {
  const { login } = useAppStore();

  const [phone, setPhone] = useState('9841234567');
  const [password, setPassword] = useState('user123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    const cleanPhone = phone.trim().replace(/[\s\-]/g, '');
    if (!cleanPhone) {
      setError('Please enter your Nepal phone number');
      return;
    }
    if (cleanPhone.length < 7) {
      setError('Phone number must be at least 7 digits (e.g. 9841234567)');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Attempt login
      const ok = login(cleanPhone, password);
      if (ok) {
        setIsLoading(false);
        onSuccess();
      } else {
        setIsLoading(false);
        setError('Invalid phone number or password. Check credentials or use the demo account below.');
      }
    }, 400);
  };

  const handleFillDemo = () => {
    setPhone('9841234567');
    setPassword('user123');
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
            <span>👤</span>
            <span>User Portal</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-xs text-gray-500">Sign in to book and track an ambulance across Nepal.</p>
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
              Phone Number <span className="text-red-500">*</span>
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
            <p className="text-[10px] text-gray-400 mt-1">Enter your 10-digit mobile number</p>
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
                placeholder="Enter your password"
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
              id="rememberUser"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 border-gray-300 focus:ring-red-500 accent-red-600 cursor-pointer"
            />
            <label htmlFor="rememberUser" className="text-xs text-gray-600 cursor-pointer font-medium select-none">
              Remember my session on this device
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
                <span>Signing In...</span>
              </span>
            ) : (
              <span>Sign In as User</span>
            )}
          </button>
        </form>

        {/* Quick Demo Fill Helper */}
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 text-center space-y-1.5">
          <p className="text-[10px] text-gray-500 font-medium">Demo Testing Credentials:</p>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-[11px] font-bold text-red-600 hover:text-red-700 bg-white border border-red-200 px-3 py-1 rounded-lg shadow-2xs hover:bg-red-50 transition"
          >
            ⚡ Autofill Demo User (+977 9841234567 / user123)
          </button>
        </div>
      </div>

      {/* Bottom Registration Prompt */}
      <div className="pt-4 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-600">
          Don't have an account yet?{' '}
          <button
            onClick={onNavigateToRegister}
            className="text-red-600 hover:text-red-700 font-extrabold underline underline-offset-2 transition"
          >
            Create a User Account
          </button>
        </p>
      </div>
    </div>
  );
};
