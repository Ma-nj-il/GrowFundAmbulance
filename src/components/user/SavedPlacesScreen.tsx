/**
 * RESQ Nepal - Saved Places Screen
 * Allows users to store frequent medical pickup points:
 * Home, Office, Family Residence, Clinic, and Custom locations.
 */

import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { HeaderBar } from '../common/HeaderBar';

interface SavedPlacesScreenProps {
  onBack: () => void;
}

export const SavedPlacesScreen: React.FC<SavedPlacesScreenProps> = ({ onBack }) => {
  const { savedPlaces, addSavedPlace, deleteSavedPlace } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customAddress, setCustomAddress] = useState('');

  const homePlace = savedPlaces.find((p) => p.type === 'home');
  const workPlace = savedPlaces.find((p) => p.type === 'work');
  const customPlaces = savedPlaces.filter((p) => p.type === 'custom');

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customAddress.trim()) return;
    addSavedPlace({
      type: 'custom',
      name: customName.trim(),
      address: customAddress.trim(),
      lat: 27.7055,
      lng: 85.3135,
    });
    setCustomName('');
    setCustomAddress('');
    setModalOpen(false);
  };

  return (
    <div className="w-full h-full bg-[#F9FAFB] text-gray-900 flex flex-col justify-between overflow-hidden font-sans">
      <HeaderBar title="Saved Locations" showBack={true} onBack={onBack} uiStyle="light" />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 shadow-xs">
          {/* Home Location */}
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
            <div className="flex items-center space-x-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-lg shrink-0">
                🏠
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-gray-900 block">Home</span>
                <span className="text-[11px] text-gray-500 truncate block">
                  {homePlace ? homePlace.address : 'Baneshwor, Kathmandu'}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-red-600 shrink-0">Default</span>
          </div>

          {/* Work / Office Location */}
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
            <div className="flex items-center space-x-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shrink-0">
                🏢
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-gray-900 block">Work / Office</span>
                <span className="text-[11px] text-gray-500 truncate block">
                  {workPlace ? workPlace.address : 'Maharajgunj Sadak, Kathmandu'}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-gray-400 shrink-0">Saved</span>
          </div>

          {/* Custom Saved Locations */}
          {customPlaces.map((place) => (
            <div key={place.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg shrink-0">
                  📍
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-gray-900 block">{place.name}</span>
                  <span className="text-[11px] text-gray-500 truncate block">{place.address}</span>
                </div>
              </div>
              <button
                onClick={() => deleteSavedPlace(place.id)}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 shrink-0"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Add New Location Button */}
        <button
          onClick={() => setModalOpen(true)}
          className="w-full py-3.5 px-4 rounded-2xl bg-white border-2 border-dashed border-red-300 hover:border-red-500 text-red-600 font-extrabold text-xs transition flex items-center justify-center space-x-2 shadow-xs"
        >
          <span>＋</span>
          <span>Add New Emergency Pickup Address</span>
        </button>
      </div>

      {/* Add Location Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddCustom}
            className="bg-white text-gray-900 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-gray-100"
          >
            <h3 className="text-base font-extrabold text-gray-900">Add Saved Address</h3>
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">Label Name</label>
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Parents' House, Family Clinic"
                className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-red-600 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">Full Street Address</label>
              <input
                type="text"
                required
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                placeholder="e.g. Lagankhel, Lalitpur"
                className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-red-600 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="py-2.5 rounded-xl bg-gray-100 text-xs font-bold text-gray-700 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 rounded-xl bg-red-600 text-xs font-bold text-white hover:bg-red-700 transition"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
