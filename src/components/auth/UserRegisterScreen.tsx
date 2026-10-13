/**
 * RESQ Nepal - Multi-Step User Registration Flow
 * Step 1: Personal Information (Name, Phone, Password, Confirm Password, Blood Group)
 * Step 2: Phone OTP Verification (6-digit OTP, countdown, resend, change phone)
 * Step 3: Citizenship Document Upload (Front & Back cards, preview, replace, remove)
 * Step 4: Review and Create Account -> Registration Success
 */

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { DocumentUploadCard } from './DocumentUploadCard';

interface UserRegisterScreenProps {
  onSuccess: () => void;
  onNavigateToLogin: () => void;
  onBackToAccountType: () => void;
}

export const UserRegisterScreen: React.FC<UserRegisterScreenProps> = ({
  onSuccess,
  onNavigateToLogin,
  onBackToAccountType,
}) => {
  const { registerUserAccount } = useAppStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1); // 1: Info, 2: OTP, 3: Docs, 4: Review, 5: Success

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP State
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(45);
  const [isOtpTimerActive, setIsOtpTimerActive] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // Documents
  const [citizenshipFrontUrl, setCitizenshipFrontUrl] = useState<string | null>(null);
  const [citizenshipBackUrl, setCitizenshipBackUrl] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Errors & Loading
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any = null;
    if (isOtpTimerActive && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setIsOtpTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isOtpTimerActive, otpTimer]);

  // Handle Step 1 -> Step 2
  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please enter your full legal name');
      return;
    }
    const cleanPhone = phone.trim().replace(/[\s\-]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      setError('Please enter a valid Nepal phone number (e.g. 9841234567)');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Start OTP
    setOtpTimer(45);
    setIsOtpTimerActive(true);
    setStep(2);
  };

  // Handle Step 2: OTP Verification
  const handleVerifyOtp = () => {
    setError(null);
    const fullOtp = otpCode.join('');
    if (fullOtp.length < 6) {
      setError('Please enter the complete 6-digit verification code');
      return;
    }

    // For local demo, allow 123456 or any 6 digits
    if (fullOtp === '123456' || fullOtp.length === 6) {
      setIsPhoneVerified(true);
      setStep(3);
    } else {
      setError('Invalid code. Use demo code 123456');
    }
  };

  const handleFillDemoOtp = () => {
    setOtpCode(['1', '2', '3', '4', '5', '6']);
    setError(null);
  };

  const handleResendOtp = () => {
    setOtpTimer(45);
    setIsOtpTimerActive(true);
    setError(null);
  };

  const handleOtpInputChange = (val: string, index: number) => {
    const digit = val.slice(-1);
    const next = [...otpCode];
    next[index] = digit;
    setOtpCode(next);

    // Auto-focus next input
    if (digit && index < 5) {
      const nextInput = document.getElementById(`user-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle Step 3 -> Step 4
  const handleProceedToReview = () => {
    setError(null);
    if (!citizenshipFrontUrl) {
      setError('Please upload or attach Citizenship Front Side');
      return;
    }
    if (!citizenshipBackUrl) {
      setError('Please upload or attach Citizenship Back Side');
      return;
    }
    setStep(4);
  };

  // Handle Final Submission
  const handleFinalSubmit = () => {
    setError(null);
    if (!agreedToTerms) {
      setError('Please accept terms & emergency medical dispatch privacy policy');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      registerUserAccount({
        name: fullName.trim(),
        phone: phone.trim().startsWith('+977') ? phone.trim() : `+977-${phone.trim()}`,
        email: email.trim(),
        password,
        bloodGroup,
        citizenshipNumber: '27-01-78-04921',
        citizenshipFrontUrl: citizenshipFrontUrl || undefined,
        citizenshipBackUrl: citizenshipBackUrl || undefined,
      });

      setIsSubmitting(false);
      setStep(5); // Go to Success screen
    }, 600);
  };

  const maskedPhone = () => {
    const p = phone.trim();
    if (p.length < 6) return `+977 ${p}`;
    return `+977 ${p.slice(0, 3)} •••• ${p.slice(-2)}`;
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-white px-5 py-5 select-none text-gray-900 overflow-y-auto">
      {/* Top Header & Step Indicator */}
      {step < 5 && (
        <div className="space-y-3 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (step === 1) onBackToAccountType();
                else setStep((prev) => ((prev - 1) as any));
              }}
              className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-900 font-semibold transition"
            >
              <span>←</span>
              <span>{step === 1 ? 'Cancel' : 'Back'}</span>
            </button>

            <span className="text-[10px] font-black tracking-tight text-gray-500 uppercase">
              Step {step} of 4
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-red-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="my-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-start space-x-2 animate-in fade-in">
          <span className="text-red-500 font-bold mt-0.5">⚠️</span>
          <span className="flex-1">{error}</span>
        </div>
      )}

      {/* STEP 1: Personal Information */}
      {step === 1 && (
        <div className="my-auto space-y-4 max-w-sm mx-auto w-full py-2">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Create User Account</h2>
            <p className="text-xs text-gray-500">Step 1: Enter your personal contact details</p>
          </div>

          <form onSubmit={handleProceedToOtp} className="space-y-3 text-xs">
            {/* Full Name */}
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                Full Legal Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Manjil Bhandari"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none text-xs font-medium bg-gray-50/50"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 bg-gray-50/50">
                <div className="px-2.5 py-2.5 bg-gray-100 border-r border-gray-300 text-xs font-bold text-gray-700 flex items-center space-x-1">
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

            {/* Optional Blood Group & Email */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-2.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold bg-gray-50/50 outline-none focus:border-red-500"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@mail.com"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium bg-gray-50/50 outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:border-red-500 bg-gray-50/50">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2.5 text-xs text-gray-900 bg-transparent outline-none font-medium pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:border-red-500 bg-gray-50/50">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-3 py-2.5 text-xs text-gray-900 bg-transparent outline-none font-medium pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-3 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold text-xs transition shadow-md shadow-red-600/20 flex items-center justify-center space-x-2"
            >
              <span>Continue to Phone Verification</span>
              <span>→</span>
            </button>
          </form>

          {/* Quick Preset Fill for easy review */}
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={() => {
                setFullName('Sujata Karki');
                setPhone('9849123890');
                setEmail('sujata.karki@gmail.com');
                setPassword('sujata123');
                setConfirmPassword('sujata123');
                setError(null);
              }}
              className="text-[10px] text-gray-500 hover:text-red-600 underline"
            >
              ⚡ Quick-fill sample applicant details
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Phone OTP Verification */}
      {step === 2 && (
        <div className="my-auto space-y-5 max-w-sm mx-auto w-full py-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl mx-auto shadow-sm">
            📱
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Verify Phone Number</h2>
            <p className="text-xs text-gray-600">
              We sent a 6-digit verification code to
            </p>
            <div className="inline-flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-800 mt-1">
              <span>{phone.startsWith('+977') ? phone : `+977 ${phone}`}</span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-red-600 hover:text-red-700 text-[10px] underline ml-1 font-semibold"
              >
                Change
              </button>
            </div>
          </div>

          {/* 6-Digit OTP Input Grid */}
          <div className="flex justify-center items-center gap-2 py-2">
            {otpCode.map((digit, idx) => (
              <input
                key={idx}
                id={`user-otp-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpInputChange(e.target.value, idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !digit && idx > 0) {
                    document.getElementById(`user-otp-${idx - 1}`)?.focus();
                  }
                }}
                className="w-10 h-12 text-center text-lg font-black border-2 border-gray-300 rounded-xl focus:border-red-600 focus:bg-red-50/30 outline-none transition"
              />
            ))}
          </div>

          {/* Demo OTP Helper Notice */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-800">Demo Verification Notice:</span>
              <button
                type="button"
                onClick={handleFillDemoOtp}
                className="text-[10px] font-extrabold text-red-600 hover:text-red-700 bg-white px-2 py-0.5 rounded shadow-2xs border border-red-200"
              >
                ⚡ Auto-fill 123456
              </button>
            </div>
            <p className="text-[10px] text-amber-700 leading-tight">
              In this local demo environment, enter <strong>123456</strong> to proceed immediately.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleVerifyOtp}
              className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold text-xs transition shadow-md shadow-red-600/20"
            >
              Verify Phone Number
            </button>

            <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 pt-1">
              {isOtpTimerActive ? (
                <span>Resend code in <strong>{otpTimer}s</strong></span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-red-600 font-bold hover:underline"
                >
                  Resend Code
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Citizenship Document Upload */}
      {step === 3 && (
        <div className="my-auto space-y-4 max-w-sm mx-auto w-full py-2">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
              <span>✓ Phone Verified</span>
            </div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Citizenship Document</h2>
            <p className="text-xs text-gray-500">
              Government of Nepal Citizenship Certificate (नागरिकता प्रमाणपत्र)
            </p>
          </div>

          {/* Privacy Notice Banner */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start space-x-2 text-[10px] text-blue-900 leading-relaxed">
            <span className="text-sm">🔒</span>
            <div>
              <strong className="block font-bold">Confidential & Encrypted:</strong>
              Citizenship documents contain sensitive personal information. RESQ Nepal stores
              document credentials locally in compliance with Nepal Health & Emergency regulations.
            </div>
          </div>

          {/* Document Upload Cards */}
          <div className="space-y-3">
            <DocumentUploadCard
              title="Citizenship Front Side (नागरिकता अगाडि)"
              subtitle="Clear photograph showing your name, photo, and government stamp"
              value={citizenshipFrontUrl}
              onChange={setCitizenshipFrontUrl}
              presetSampleType="citizenship_front"
              required={true}
            />

            <DocumentUploadCard
              title="Citizenship Back Side (नागरिकता पछाडि)"
              subtitle="Showing permanent address, parents' names, and thumb impressions"
              value={citizenshipBackUrl}
              onChange={setCitizenshipBackUrl}
              presetSampleType="citizenship_back"
              required={true}
            />
          </div>

          <button
            type="button"
            onClick={handleProceedToReview}
            className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold text-xs transition shadow-md shadow-red-600/20 flex items-center justify-center space-x-1"
          >
            <span>Proceed to Review</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* STEP 4: Review and Submit */}
      {step === 4 && (
        <div className="my-auto space-y-4 max-w-sm mx-auto w-full py-2">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Review & Confirm</h2>
            <p className="text-xs text-gray-500">Verify your information before creating your account</p>
          </div>

          {/* Summary Card */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Full Name</span>
              <span className="font-extrabold text-gray-900">{fullName}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Phone Number</span>
              <div className="text-right">
                <span className="font-bold text-gray-900 block">{maskedPhone()}</span>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  ✓ Verified
                </span>
              </div>
            </div>

            {bloodGroup && (
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-gray-500 font-medium">Blood Group</span>
                <span className="font-black text-red-600 bg-red-50 px-2 py-0.5 rounded">{bloodGroup}</span>
              </div>
            )}

            {email && (
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-gray-500 font-medium">Email</span>
                <span className="font-semibold text-gray-700">{email}</span>
              </div>
            )}

            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                Identity Documents Attached
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-white rounded-xl border border-gray-200 flex items-center space-x-2">
                  <div className="w-8 h-8 rounded bg-gray-100 overflow-hidden flex items-center justify-center">
                    {citizenshipFrontUrl ? (
                      <img src={citizenshipFrontUrl} alt="Front" className="w-full h-full object-cover" />
                    ) : (
                      '📄'
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold block text-gray-800">Front Side</span>
                    <span className="text-[8px] text-emerald-600 font-bold">Attached</span>
                  </div>
                </div>

                <div className="p-2 bg-white rounded-xl border border-gray-200 flex items-center space-x-2">
                  <div className="w-8 h-8 rounded bg-gray-100 overflow-hidden flex items-center justify-center">
                    {citizenshipBackUrl ? (
                      <img src={citizenshipBackUrl} alt="Back" className="w-full h-full object-cover" />
                    ) : (
                      '📄'
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold block text-gray-800">Back Side</span>
                    <span className="text-[8px] text-emerald-600 font-bold">Attached</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start space-x-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-red-600 accent-red-600"
            />
            <label htmlFor="terms" className="text-[10px] text-gray-600 leading-tight">
              I agree to RESQ Nepal Terms of Service, Emergency Ambulance Response Consent, and
              confirm that the provided Nepal citizenship information is accurate.
            </label>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleFinalSubmit}
            className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl font-extrabold text-xs transition shadow-lg shadow-red-600/25 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Account...</span>
              </span>
            ) : (
              <span>Submit & Create Account</span>
            )}
          </button>
        </div>
      )}

      {/* STEP 5: Registration Success Screen */}
      {step === 5 && (
        <div className="my-auto space-y-6 max-w-sm mx-auto w-full py-6 text-center animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-100">
            ✓
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
              Registration Successful
            </span>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Welcome, {fullName}!
            </h2>
            <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">
              Your RESQ Nepal user account is verified and ready. You can now request emergency
              ambulances with live GPS tracking across Kathmandu.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-left space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Account Status</span>
              <span className="font-extrabold text-emerald-600">Active & Verified</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Registered Phone</span>
              <span className="font-bold text-gray-800">{phone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Emergency Triage Service</span>
              <span className="font-bold text-gray-800">Kathmandu 24/7 Fleet</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onSuccess}
            className="w-full py-4 px-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs transition shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2"
          >
            <span>Proceed to Ambulance Booking</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Bottom Sign In Link (only on Step 1) */}
      {step === 1 && (
        <div className="pt-3 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onNavigateToLogin}
              className="text-red-600 hover:text-red-700 font-extrabold underline underline-offset-2 transition"
            >
              Sign In
            </button>
          </p>
        </div>
      )}
    </div>
  );
};
