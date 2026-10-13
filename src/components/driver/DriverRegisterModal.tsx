/**
 * RESQ Nepal - Driver Registration & Fleet Commissioning Modal
 * Original RESQ Nepal onboarding for ambulance operators:
 * Driver license verification, ambulance registration, life support tier selection,
 * and immediate commissioning into the Kathmandu emergency network.
 */

import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AmbulanceCategory } from '../../types';

interface DriverRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DriverRegisterModal: React.FC<DriverRegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser, submitDriverApplication, switchMode } = useAppStore();

  const [fullName, setFullName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '+977-98');
  const [email, setEmail] = useState(currentUser.email || '');
  const [ambulancePlate, setAmbulancePlate] = useState('');
  const [category, setCategory] = useState<AmbulanceCategory>('ADVANCED');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [serviceArea, setServiceArea] = useState('Kathmandu Valley (Ring Road & Suburbs)');
  const [hospitalAffiliation, setHospitalAffiliation] = useState('Tribhuvan University Teaching Hospital (TUTH)');
  const [error, setError] = useState<string | null>(null);
  const [successSubmitted, setSuccessSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !ambulancePlate.trim() || !licenseNumber.trim()) {
      setError('Please fill in all required fields (Name, Phone, Plate, License).');
      return;
    }

    submitDriverApplication({
      userId: currentUser.id,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      ambulanceRegistration: ambulancePlate.trim().toUpperCase(),
      ambulanceCategory: category,
      licenseNumber: licenseNumber.trim(),
      serviceArea,
      hospitalAffiliation,
    });

    setError(null);
    setSuccessSubmitted(true);
  };

  const handleStartDriving = () => {
    setSuccessSubmitted(false);
    switchMode('driver');
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white text-gray-900 rounded-3xl p-6 max-w-md w-full space-y-4 border border-gray-100 shadow-2xl max-h-[90vh] overflow-y-auto">
        {!successSubmitted ? (
          <>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-xl font-bold">
                  🚑
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">Become a RESQ Driver</h3>
                  <p className="text-[11px] text-gray-500">Register your emergency vehicle in Kathmandu</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Subash Tamang"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-red-600 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+977-98XXXXXXXX"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 font-mono focus:outline-none focus:border-red-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="driver@resq.np"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Ambulance Plate *</label>
                  <input
                    type="text"
                    value={ambulancePlate}
                    onChange={(e) => setAmbulancePlate(e.target.value)}
                    placeholder="Ba 2 Cha 9901"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 uppercase font-mono font-bold focus:outline-none focus:border-red-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">DOTM License *</label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="01-04-XXXXXX"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 font-mono focus:outline-none focus:border-red-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Ambulance Life Support Tier</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['BASIC', 'ADVANCED', 'VENTILATOR'] as AmbulanceCategory[]).map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`p-2.5 rounded-xl border text-center font-bold text-[11px] transition ${
                        category === cat
                          ? 'border-red-600 bg-red-50 text-red-600'
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Hospital Depot Affiliation</label>
                <input
                  type="text"
                  value={hospitalAffiliation}
                  onChange={(e) => setHospitalAffiliation(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-extrabold rounded-2xl shadow-lg shadow-red-600/25 transition mt-2 text-xs"
              >
                Register & Commission Vehicle &rarr;
              </button>
            </form>
          </>
        ) : (
          /* Success Screen */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-bold">
              ✓
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Vehicle Successfully Commissioned!</h3>
              <p className="text-xs text-gray-600 mt-1">
                Ambulance <strong>{ambulancePlate}</strong> is now registered and active in the RESQ Nepal Kathmandu emergency dispatch network.
              </p>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-[11px] text-emerald-800 font-medium">
              You can now toggle On Duty to receive real-time ambulance calls and emergency hospital transfers.
            </div>
            <button
              onClick={handleStartDriving}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-2xl shadow-md text-xs"
            >
              Enter Driver Duty Console Now &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
