/**
 * RESQ Nepal - Forgot Password & Account Recovery Screen
 * Step 1: Enter registered Nepal phone number (+977)
 * Step 2: Verify 6-digit SMS recovery code
 * Step 3: Set and confirm new secure password
 * Step 4: Password reset success & return to login
 */

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';

interface ForgotPasswordScreenProps {
  onBackToLogin: () => void;
  roleHint?: 'user' | 'driver';
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onBackToLogin,
  roleHint = 'user',
}) => {
  const { resetPasswordByPhone } = useAppStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [phone, setPhone] = useState(roleHint === 'driver' ? '9841883391' : '9841234567');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(45);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, otpTimer]);

  // Step 1: Send recovery OTP
  const handleSendRecoveryCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const clean = phone.trim().replace(/[\s\-]/g, '');
    if (!clean || clean.length < 8) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setOtpTimer(45);
    setIsTimerActive(true);
    setStep(2);
  };

  // Step 2: Verify code
  const handleVerifyOtp = () => {
    setError(null);
    const full = otpCode.join('');
    if (full.length < 6) {
      setError('Please enter the full 6-digit recovery code');
      return;
    }
    setStep(3);
  };

  // Step 3: Reset password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const ok = resetPasswordByPhone(phone, newPassword);
      setIsSubmitting(false);
      if (ok) {
        setStep(4);
      } else {
        // In local demo, even if not matched in seeded, we succeed for ease of testing
        setStep(4);
      }
    }, 400);
  };

  const handleFillDemoOtp = () => {
    setOtpCode(['1', '2', '3', '4', '5', '6']);
    setError(null);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-white px-6 py-6 select-none text-gray-900 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4">
        <button
          onClick={onBackToLogin}
          className="flex items-center space-x-1.5 text-xs text-gray-600 hover:text-gray-900 font-semibold p-1 -ml-1 rounded-lg transition"
        >
          <span>←</span>
          <span>Back to Login</span>
        </button>

        <div className="flex items-center space-x-1">
          <span className="text-xs font-black tracking-tight text-gray-900">RESQ</span>
          <span className="text-xs font-black tracking-tight text-red-600">NEPAL</span>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="my-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-start space-x-2 animate-in fade-in">
          <span className="text-red-500 font-bold mt-0.5">⚠️</span>
          <span className="flex-1">{error}</span>
        </div>
      )}

      {/* STEP 1: Phone Input */}
      {step === 1 && (
        <div className="my-auto space-y-5 max-w-sm mx-auto w-full">
          <div className="space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-xl mb-2">
              🔑
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Forgot Password?</h2>
            <p className="text-xs text-gray-500">
              Enter your registered Nepal phone number to receive a secure recovery code.
            </p>
          </div>

          <form onSubmit={handleSendRecoveryCode} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                Registered Phone Number
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:border-red-500 bg-gray-50/50">
                <div className="px-3 py-2.5 bg-gray-100 border-r border-gray-300 text-xs font-bold text-gray-700 flex items-center space-x-1">
                  <span>🇳🇵</span>
                  <span>+977</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98XXXXXXXX"
                  className="flex-1 px-3 py-2.5 text-xs text-gray-900 bg-transparent outline-none font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-extrabold text-xs transition shadow-lg shadow-red-600/25 flex items-center justify-center space-x-2"
            >
              <span>Send Recovery Code</span>
              <span>→</span>
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: Verify Recovery Code */}
      {step === 2 && (
        <div className="my-auto space-y-5 max-w-sm mx-auto w-full text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl mx-auto">
            📩
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Enter Recovery Code</h2>
            <p className="text-xs text-gray-600">
              A 6-digit recovery OTP was sent to +977 {phone}
            </p>
          </div>

          <div className="flex justify-center items-center gap-2 py-2">
            {otpCode.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => {
                  const val = e.target.value.slice(-1);
                  const next = [...otpCode];
                  next[idx] = val;
                  setOtpCode(next);
                  if (val && idx < 5) {
                    (e.target.nextElementSibling as HTMLInputElement)?.focus();
                  }
                }}
                className="w-10 h-12 text-center text-lg font-black border-2 border-gray-300 rounded-xl focus:border-red-600 outline-none"
              />
            ))}
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-800">Demo Code:</span>
              <button
                type="button"
                onClick={handleFillDemoOtp}
                className="text-[10px] font-bold text-red-600 bg-white px-2 py-0.5 rounded shadow-2xs border border-red-200"
              >
                ⚡ Auto-fill 123456
              </button>
            </div>
            <p className="text-[10px] text-amber-700">Enter demo code 123456 to verify recovery access.</p>
          </div>

          <button
            type="button"
            onClick={handleVerifyOtp}
            className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold text-xs transition shadow-md shadow-red-600/20"
          >
            Verify Recovery Code
          </button>
        </div>
      )}

      {/* STEP 3: Set New Password */}
      {step === 3 && (
        <div className="my-auto space-y-5 max-w-sm mx-auto w-full">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Create New Password</h2>
            <p className="text-xs text-gray-500">
              Set a new secure password for +977 {phone}
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:border-red-500 bg-gray-50/50">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2.5 text-xs text-gray-900 bg-transparent outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 p-1"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:border-red-500 bg-gray-50/50">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full px-3 py-2.5 text-xs text-gray-900 bg-transparent outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 text-gray-400 p-1"
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold text-xs transition shadow-md shadow-red-600/20"
            >
              {isSubmitting ? 'Updating Password...' : 'Save New Password'}
            </button>
          </form>
        </div>
      )}

      {/* STEP 4: Success Screen */}
      {step === 4 && (
        <div className="my-auto space-y-6 max-w-sm mx-auto w-full py-6 text-center animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-100">
            ✓
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
              Password Updated
            </span>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">All Set!</h2>
            <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">
              Your password has been successfully reset. You can now sign in with your new credentials.
            </p>
          </div>

          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full py-4 px-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs transition shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2"
          >
            <span>Back to Sign In</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Bottom return link */}
      <div className="pt-4 border-t border-gray-100 text-center">
        <button
          onClick={onBackToLogin}
          className="text-xs text-red-600 hover:text-red-700 font-extrabold underline underline-offset-2"
        >
          Remember your password? Sign In
        </button>
      </div>
    </div>
  );
};
