/**
 * RESQ Nepal - Multi-Step Driver & Ambulance Fleet Registration Flow
 * Step 1: Driver Personal Information & Emergency Contact
 * Step 2: Driver Phone OTP Verification
 * Step 3: Nepal Driving Licence Upload (Smart Card Front & Back)
 * Step 4: Driver Citizenship Document Upload (Front & Back)
 * Step 5: Ambulance Vehicle & Life Support Specifications
 * Step 6: Application Review -> Immediate Fleet Commissioning & Approval
 */

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AmbulanceCategory } from '../../types';
import { KATHMANDU_HOSPITALS } from '../../config/constants';
import { DocumentUploadCard } from './DocumentUploadCard';

interface DriverRegisterScreenProps {
  onSuccess: () => void;
  onNavigateToLogin: () => void;
  onBackToAccountType: () => void;
}

export const DriverRegisterScreen: React.FC<DriverRegisterScreenProps> = ({
  onSuccess,
  onNavigateToLogin,
  onBackToAccountType,
}) => {
  const { registerDriverAccount } = useAppStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);

  // Step 1: Personal Info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

  // Step 2: OTP
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(45);
  const [isOtpTimerActive, setIsOtpTimerActive] = useState(false);

  // Step 3: Driving License
  const [licenseNumber, setLicenseNumber] = useState('01-06-00492812');
  const [licenseCategory, setLicenseCategory] = useState('B, C (Ambulance Certified)');
  const [licenseExpiry, setLicenseExpiry] = useState('2029-05-18');
  const [licenseFrontUrl, setLicenseFrontUrl] = useState<string | null>(null);
  const [licenseBackUrl, setLicenseBackUrl] = useState<string | null>(null);

  // Step 4: Citizenship
  const [citizenshipNumber, setCitizenshipNumber] = useState('27-01-78-04921');
  const [citizenshipDistrict, setCitizenshipDistrict] = useState('Kathmandu (काठमाडौं)');
  const [citizenshipFrontUrl, setCitizenshipFrontUrl] = useState<string | null>(null);
  const [citizenshipBackUrl, setCitizenshipBackUrl] = useState<string | null>(null);

  // Step 5: Ambulance Specs
  const [ambulancePlate, setAmbulancePlate] = useState('BA 2 CHA 4092');
  const [ambulanceCategory, setAmbulanceCategory] = useState<AmbulanceCategory>('ADVANCED');
  const [hospitalAffiliation, setHospitalAffiliation] = useState(
    'Tribhuvan University Teaching Hospital (TUTH)'
  );
  const [serviceArea, setServiceArea] = useState('Kathmandu Valley (Ring Road & Suburbs)');
  const [hasOxygenManifold, setHasOxygenManifold] = useState(true);
  const [hasStretcher, setHasStretcher] = useState(true);
  const [hasDefibrillator, setHasDefibrillator] = useState(true);

  // Step 6: Review & Terms
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState('RESQ-DRV-8941');

  // OTP Countdown
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

  // Step 1 -> 2
  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please enter your full legal name');
      return;
    }
    const cleanPhone = phone.trim().replace(/[\s\-]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      setError('Please enter a valid Nepal phone number (e.g. 9841883391)');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setOtpTimer(45);
    setIsOtpTimerActive(true);
    setStep(2);
  };

  // Step 2 -> 3
  const handleVerifyOtp = () => {
    setError(null);
    const fullOtp = otpCode.join('');
    if (fullOtp.length < 6) {
      setError('Please enter all 6 digits of the OTP');
      return;
    }
    setStep(3);
  };

  // Step 3 -> 4
  const handleProceedToCitizenship = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!licenseNumber.trim()) {
      setError('Please enter your Nepal Driving License number');
      return;
    }
    if (!licenseFrontUrl) {
      setError('Please upload or attach Driving License Front Side');
      return;
    }
    if (!licenseBackUrl) {
      setError('Please upload or attach Driving License Back Side');
      return;
    }
    setStep(4);
  };

  // Step 4 -> 5
  const handleProceedToAmbulance = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!citizenshipFrontUrl) {
      setError('Please upload Citizenship Front Side');
      return;
    }
    if (!citizenshipBackUrl) {
      setError('Please upload Citizenship Back Side');
      return;
    }
    setStep(5);
  };

  // Step 5 -> 6
  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!ambulancePlate.trim()) {
      setError('Please enter vehicle registration plate (e.g. BA 2 CHA 4092)');
      return;
    }
    setStep(6);
  };

  // Final Submit
  const handleFinalSubmit = () => {
    setError(null);
    if (!agreedToTerms) {
      setError('Please confirm EMT compliance and vehicle registration validity');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `RESQ-DRV-${Math.floor(1000 + Math.random() * 9000)}`;
      setApplicationId(generatedId);

      registerDriverAccount({
        fullName: fullName.trim(),
        phone: phone.trim().startsWith('+977') ? phone.trim() : `+977-${phone.trim()}`,
        email: email.trim(),
        password,
        emergencyContactName: emergencyContactName.trim(),
        emergencyContactPhone: emergencyContactPhone.trim(),
        licenseNumber: licenseNumber.trim(),
        licenseCategory,
        licenseExpiry,
        licenseFrontUrl: licenseFrontUrl || undefined,
        licenseBackUrl: licenseBackUrl || undefined,
        citizenshipNumber,
        citizenshipFrontUrl: citizenshipFrontUrl || undefined,
        citizenshipBackUrl: citizenshipBackUrl || undefined,
        ambulanceRegistration: ambulancePlate.trim().toUpperCase(),
        ambulanceCategory,
        hospitalAffiliation,
        serviceArea,
      });

      setIsSubmitting(false);
      setStep(7); // Go to Approval / Success screen
    }, 600);
  };

  const handleFillDemoApplicant = () => {
    setFullName('Bikash Adhikari');
    setPhone('9841772211');
    setEmail('bikash.adhikari@gmail.com');
    setPassword('bikash123');
    setConfirmPassword('bikash123');
    setEmergencyContactName('Radha Adhikari');
    setEmergencyContactPhone('9851099881');
    setError(null);
  };

  const handleFillDemoOtp = () => {
    setOtpCode(['1', '2', '3', '4', '5', '6']);
    setError(null);
  };

  const handleOtpInputChange = (val: string, index: number) => {
    const digit = val.slice(-1);
    const next = [...otpCode];
    next[index] = digit;
    setOtpCode(next);
    if (digit && index < 5) {
      document.getElementById(`driver-otp-${index + 1}`)?.focus();
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-white px-5 py-5 select-none text-gray-900 overflow-y-auto">
      {/* Top Header & Step Indicator */}
      {step < 7 && (
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
              Step {step} of 6
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-red-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
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
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold">
              <span>🚑 Driver Onboarding</span>
            </div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Driver Personal Info</h2>
            <p className="text-xs text-gray-500">Step 1: Paramedic & operator identity</p>
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
                placeholder="e.g. Bikash Adhikari"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-red-500 outline-none text-xs font-medium bg-gray-50/50"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:border-red-500 bg-gray-50/50">
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

            {/* Email */}
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="driver.bikash@gmail.com"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium bg-gray-50/50 outline-none focus:border-red-500"
              />
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:border-red-500 bg-gray-50/50">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full px-2.5 py-2.5 text-xs text-gray-900 bg-transparent outline-none pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 text-gray-400 p-0.5 text-xs"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Confirm <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:border-red-500 bg-gray-50/50">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter"
                    className="w-full px-2.5 py-2.5 text-xs text-gray-900 bg-transparent outline-none pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 text-gray-400 p-0.5 text-xs"
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 space-y-2">
              <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block">
                Emergency Next of Kin Contact
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  placeholder="Kin Full Name"
                  className="w-full px-2.5 py-2 rounded-lg border border-gray-300 bg-white text-xs outline-none focus:border-red-500"
                />
                <input
                  type="tel"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  placeholder="Kin Phone (98...)"
                  className="w-full px-2.5 py-2 rounded-lg border border-gray-300 bg-white text-xs outline-none focus:border-red-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold text-xs transition shadow-md shadow-red-600/20 flex items-center justify-center space-x-2"
            >
              <span>Continue to Phone OTP</span>
              <span>→</span>
            </button>
          </form>

          {/* Quick preset fill */}
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={handleFillDemoApplicant}
              className="text-[10px] text-gray-500 hover:text-red-600 underline"
            >
              ⚡ Quick-fill sample driver details
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Driver Phone OTP */}
      {step === 2 && (
        <div className="my-auto space-y-5 max-w-sm mx-auto w-full py-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl mx-auto shadow-sm">
            📲
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Verify Driver Phone</h2>
            <p className="text-xs text-gray-600">
              Dispatches and audio triage require verified phone line:
            </p>
            <div className="inline-flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-800 mt-1">
              <span>{phone.startsWith('+977') ? phone : `+977 ${phone}`}</span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-red-600 text-[10px] underline ml-1"
              >
                Change
              </button>
            </div>
          </div>

          <div className="flex justify-center items-center gap-2 py-2">
            {otpCode.map((digit, idx) => (
              <input
                key={idx}
                id={`driver-otp-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpInputChange(e.target.value, idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !digit && idx > 0) {
                    document.getElementById(`driver-otp-${idx - 1}`)?.focus();
                  }
                }}
                className="w-10 h-12 text-center text-lg font-black border-2 border-gray-300 rounded-xl focus:border-red-600 focus:bg-red-50/30 outline-none transition"
              />
            ))}
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-800">Demo Driver SMS Verification:</span>
              <button
                type="button"
                onClick={handleFillDemoOtp}
                className="text-[10px] font-extrabold text-red-600 bg-white px-2 py-0.5 rounded shadow-2xs border border-red-200"
              >
                ⚡ Auto-fill 123456
              </button>
            </div>
            <p className="text-[10px] text-amber-700 leading-tight">
              Enter demo code <strong>123456</strong> to proceed to driving license upload.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleVerifyOtp}
              className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold text-xs transition shadow-md shadow-red-600/20"
            >
              Verify Driver Phone
            </button>
            <div className="text-xs text-gray-500 pt-1">
              {isOtpTimerActive ? (
                <span>Resend code in <strong>{otpTimer}s</strong></span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setOtpTimer(45);
                    setIsOtpTimerActive(true);
                  }}
                  className="text-red-600 font-bold hover:underline"
                >
                  Resend Code
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Driving License Upload */}
      {step === 3 && (
        <div className="my-auto space-y-4 max-w-sm mx-auto w-full py-2">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
              <span>✓ Phone Verified</span>
            </div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Driving Licence (लाईसेन्स)</h2>
            <p className="text-xs text-gray-500">
              Step 3: Nepal Department of Transport Management (DOTM) Smart Card
            </p>
          </div>

          <form onSubmit={handleProceedToCitizenship} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  License Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="01-06-00492812"
                  className="w-full px-2.5 py-2 rounded-xl border border-gray-300 font-bold text-gray-800 bg-gray-50/50 outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Valid Until
                </label>
                <input
                  type="date"
                  value={licenseExpiry}
                  onChange={(e) => setLicenseExpiry(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-gray-300 text-xs bg-gray-50/50 outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                License Category
              </label>
              <select
                value={licenseCategory}
                onChange={(e) => setLicenseCategory(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-gray-300 font-medium bg-gray-50/50 outline-none focus:border-red-500"
              >
                <option value="B, C (Ambulance Certified)">Category B & C (Light Vehicle & Ambulance)</option>
                <option value="B (Car/Jeep/Van)">Category B (Car / Jeep / Delivery Van)</option>
                <option value="A, B (Motorcycle & Car)">Category A & B</option>
              </select>
            </div>

            {/* Document Upload Cards */}
            <div className="space-y-3 pt-1">
              <DocumentUploadCard
                title="Driving Licence Front Side (लाईसेन्स अगाडि)"
                subtitle="High-resolution image showing name, DOTM seal, chip & categories"
                value={licenseFrontUrl}
                onChange={setLicenseFrontUrl}
                presetSampleType="license_front"
                required={true}
              />

              <DocumentUploadCard
                title="Driving Licence Back Side (लाईसेन्स पछाडि)"
                subtitle="Showing barcode, issuing transport office, and emergency blood group"
                value={licenseBackUrl}
                onChange={setLicenseBackUrl}
                presetSampleType="license_back"
                required={true}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold text-xs transition shadow-md shadow-red-600/20 flex items-center justify-center space-x-1"
            >
              <span>Continue to Citizenship Upload</span>
              <span>→</span>
            </button>
          </form>
        </div>
      )}

      {/* STEP 4: Citizenship Upload */}
      {step === 4 && (
        <div className="my-auto space-y-4 max-w-sm mx-auto w-full py-2">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Driver Citizenship</h2>
            <p className="text-xs text-gray-500">
              Step 4: Government of Nepal Citizenship Certificate (नागरिकता)
            </p>
          </div>

          <form onSubmit={handleProceedToAmbulance} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Citizenship Number
                </label>
                <input
                  type="text"
                  value={citizenshipNumber}
                  onChange={(e) => setCitizenshipNumber(e.target.value)}
                  placeholder="27-01-78-04921"
                  className="w-full px-2.5 py-2 rounded-xl border border-gray-300 font-bold bg-gray-50/50 outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Issue District
                </label>
                <input
                  type="text"
                  value={citizenshipDistrict}
                  onChange={(e) => setCitizenshipDistrict(e.target.value)}
                  placeholder="Kathmandu"
                  className="w-full px-2.5 py-2 rounded-xl border border-gray-300 bg-gray-50/50 outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <DocumentUploadCard
                title="Citizenship Front Side (नागरिकता अगाडि)"
                subtitle="Photograph and legal name as registered in Nepal Home Ministry"
                value={citizenshipFrontUrl}
                onChange={setCitizenshipFrontUrl}
                presetSampleType="citizenship_front"
                required={true}
              />

              <DocumentUploadCard
                title="Citizenship Back Side (नागरिकता पछाडि)"
                subtitle="Permanent address, parental lineage, and district magistrate seal"
                value={citizenshipBackUrl}
                onChange={setCitizenshipBackUrl}
                presetSampleType="citizenship_back"
                required={true}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold text-xs transition shadow-md shadow-red-600/20 flex items-center justify-center space-x-1"
            >
              <span>Continue to Ambulance Info</span>
              <span>→</span>
            </button>
          </form>
        </div>
      )}

      {/* STEP 5: Ambulance Information */}
      {step === 5 && (
        <div className="my-auto space-y-4 max-w-sm mx-auto w-full py-2">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Ambulance Vehicle Specs</h2>
            <p className="text-xs text-gray-500">
              Step 5: Vehicle plate, life support category, and hospital triage base
            </p>
          </div>

          <form onSubmit={handleProceedToReview} className="space-y-3 text-xs">
            {/* Plate Number */}
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                Ambulance Plate Registration <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border-2 border-red-500 rounded-xl overflow-hidden bg-red-50/20">
                <div className="px-3 py-2 bg-red-600 text-white font-black text-xs">
                  NEPAL
                </div>
                <input
                  type="text"
                  value={ambulancePlate}
                  onChange={(e) => setAmbulancePlate(e.target.value.toUpperCase())}
                  placeholder="BA 2 CHA 4092"
                  className="flex-1 px-3 py-2 text-xs font-black tracking-widest text-gray-900 uppercase bg-transparent outline-none"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Official red ambulance plate registered in Bagmati</p>
            </div>

            {/* Ambulance Life Support Tier */}
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                Ambulance Life Support Tier <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'BASIC', label: 'Basic (BLS)', desc: 'Stretcher, O2, Ambu' },
                  { id: 'ADVANCED', label: 'Advanced (ALS)', desc: 'Cardiac, Defibrillator' },
                  { id: 'VENTILATOR', label: 'Ventilator (ICU)', desc: 'Hamilton T1, Pumps' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setAmbulanceCategory(tier.id as AmbulanceCategory)}
                    className={`p-2 rounded-xl border text-left transition ${
                      ambulanceCategory === tier.id
                        ? 'border-red-600 bg-red-50/70 text-red-950 font-bold ring-1 ring-red-500'
                        : 'border-gray-200 bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="font-extrabold text-[11px]">{tier.label}</div>
                    <div className="text-[8px] text-gray-500 mt-0.5">{tier.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Hospital Affiliation */}
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                Receiving Emergency Hospital Base <span className="text-red-500">*</span>
              </label>
              <select
                value={hospitalAffiliation}
                onChange={(e) => setHospitalAffiliation(e.target.value)}
                className="w-full px-2.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold bg-gray-50/50 outline-none focus:border-red-500"
              >
                {KATHMANDU_HOSPITALS.map((h) => (
                  <option key={h.id} value={h.name}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Coverage Area */}
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                Service Dispatch Radius Area
              </label>
              <select
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
                className="w-full px-2.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-gray-50/50 outline-none focus:border-red-500"
              >
                <option value="Kathmandu Valley (Ring Road & Suburbs)">Kathmandu Valley (Ring Road & Suburbs)</option>
                <option value="Lalitpur Metro & Southern Hills">Lalitpur Metro & Southern Hills</option>
                <option value="Bhaktapur & Arniko Highway Corridor">Bhaktapur & Arniko Highway Corridor</option>
                <option value="All Bagmati Province Inter-district">All Bagmati Province Inter-district</option>
              </select>
            </div>

            {/* Equipment Readiness Checklist */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
              <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block">
                Equipment Checklist (Pre-Flight)
              </span>
              <label className="flex items-center space-x-2 text-[11px] text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasOxygenManifold}
                  onChange={(e) => setHasOxygenManifold(e.target.checked)}
                  className="rounded text-red-600 accent-red-600"
                />
                <span>Medical Oxygen Cylinder (at least 20L filled)</span>
              </label>
              <label className="flex items-center space-x-2 text-[11px] text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasStretcher}
                  onChange={(e) => setHasStretcher(e.target.checked)}
                  className="rounded text-red-600 accent-red-600"
                />
                <span>Roll-in Autoloader Ambulance Stretcher</span>
              </label>
              <label className="flex items-center space-x-2 text-[11px] text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasDefibrillator}
                  onChange={(e) => setHasDefibrillator(e.target.checked)}
                  className="rounded text-red-600 accent-red-600"
                />
                <span>Automated External Defibrillator (AED) / Cardiac monitor</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold text-xs transition shadow-md shadow-red-600/20 flex items-center justify-center space-x-1"
            >
              <span>Review Application</span>
              <span>→</span>
            </button>
          </form>
        </div>
      )}

      {/* STEP 6: Review & Final Submission */}
      {step === 6 && (
        <div className="my-auto space-y-4 max-w-sm mx-auto w-full py-2">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Review Application</h2>
            <p className="text-xs text-gray-500">Step 6: Review all credentials before commissioning</p>
          </div>

          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Driver / Paramedic</span>
              <span className="font-extrabold text-gray-900">{fullName}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Phone Line</span>
              <span className="font-bold text-gray-900">{phone} (Verified)</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Vehicle Registration</span>
              <span className="font-black text-red-600 bg-red-50 px-2 py-0.5 rounded tracking-wider">
                {ambulancePlate}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Life Support Tier</span>
              <span className="font-bold text-gray-800">{ambulanceCategory}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Hospital Base</span>
              <span className="font-semibold text-gray-800 text-right max-w-[55%] truncate">
                {hospitalAffiliation}
              </span>
            </div>

            <div className="pt-1 space-y-1.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                Attached Legal Documents
              </span>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 bg-white rounded-xl border border-gray-200 flex items-center space-x-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <div>
                    <span className="font-bold block text-gray-800">Driving License</span>
                    <span className="text-gray-400 text-[8px]">{licenseNumber}</span>
                  </div>
                </div>
                <div className="p-2 bg-white rounded-xl border border-gray-200 flex items-center space-x-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <div>
                    <span className="font-bold block text-gray-800">Citizenship Card</span>
                    <span className="text-gray-400 text-[8px]">{citizenshipNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-2 pt-1">
            <input
              type="checkbox"
              id="driverTerms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-red-600 accent-red-600"
            />
            <label htmlFor="driverTerms" className="text-[10px] text-gray-600 leading-tight">
              I certify that I am licensed to operate emergency vehicles in Nepal and agree to
              immediate dispatch compliance with the Kathmandu Emergency Ambulance Code.
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
                <span>Submitting & Commissioning...</span>
              </span>
            ) : (
              <span>Submit & Commission Ambulance</span>
            )}
          </button>
        </div>
      )}

      {/* STEP 7: Application Submitted & Approved */}
      {step === 7 && (
        <div className="my-auto space-y-6 max-w-sm mx-auto w-full py-6 text-center animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-3xl bg-red-50 border-2 border-red-200 text-red-600 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-red-100">
            🚑
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
              Commissioned & Verified
            </span>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Welcome to the Fleet, {fullName}!
            </h2>
            <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">
              Your ambulance <strong>{ambulancePlate}</strong> is now registered in the Kathmandu Valley
              dispatch network. You are ready to go online and receive patient requests.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-left space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Application ID</span>
              <span className="font-mono font-bold text-gray-900">{applicationId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Assigned Vehicle</span>
              <span className="font-black text-red-600">{ambulancePlate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Emergency Tier</span>
              <span className="font-bold text-gray-800">{ambulanceCategory} Life Support</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Hospital Anchor</span>
              <span className="font-medium text-gray-700 text-right truncate max-w-[50%]">
                {hospitalAffiliation}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onSuccess}
            className="w-full py-4 px-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs transition shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2"
          >
            <span>Launch Driver Dashboard</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Bottom Sign In Link (only on Step 1) */}
      {step === 1 && (
        <div className="pt-3 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-600">
            Already have a driver account?{' '}
            <button
              onClick={onNavigateToLogin}
              className="text-red-600 hover:text-red-700 font-extrabold underline underline-offset-2 transition"
            >
              Driver Sign In
            </button>
          </p>
        </div>
      )}
    </div>
  );
};
