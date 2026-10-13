/**
 * RESQ Nepal - Trip History Screen
 * Medical dispatch records with hospital destinations, ambulance plates, and status.
 */

import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { HeaderBar } from '../common/HeaderBar';

interface OrderHistoryScreenProps {
  onBack: () => void;
  onSelectBooking: (bookingId: string) => void;
}

export const OrderHistoryScreen: React.FC<OrderHistoryScreenProps> = ({ onBack, onSelectBooking }) => {
  const { bookings } = useAppStore();
  const [filter, setFilter] = useState<'All' | 'Emergency' | 'Inter-Hospital'>('All');

  return (
    <div className="w-full h-full bg-[#F9FAFB] text-gray-900 flex flex-col justify-between overflow-hidden font-sans">
      <HeaderBar title="Ambulance Trip History" showBack={true} onBack={onBack} uiStyle="light" />

      {/* Filter Tabs */}
      <div className="px-4 py-2 flex items-center space-x-2 bg-white border-b border-gray-100">
        <button
          onClick={() => setFilter('All')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
            filter === 'All' ? 'bg-red-600 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Dispatches
        </button>

        <button
          onClick={() => setFilter('Emergency')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
            filter === 'Emergency' ? 'bg-red-600 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Code Red Calls
        </button>

        <button
          onClick={() => setFilter('Inter-Hospital')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
            filter === 'Inter-Hospital' ? 'bg-red-600 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Hospital Transfers
        </button>
      </div>

      {/* Trip Cards List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            onClick={() => onSelectBooking(booking.id)}
            className="p-4 rounded-2xl bg-white border border-gray-200 hover:border-red-300 shadow-xs cursor-pointer transition space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🚑</span>
                <span className="font-mono text-xs font-black text-gray-900">{booking.id}</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  booking.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : booking.status === 'cancelled'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {booking.status.toUpperCase().replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-start space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0"></span>
                <span className="text-gray-600 truncate">From: <strong>{booking.pickup.address}</strong></span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-600 mt-1 shrink-0"></span>
                <span className="text-gray-900 truncate">To: <strong>{booking.destination?.address || 'Hospital ER'}</strong></span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-500 font-mono">
              <span>Ambulance: {booking.assignedVehiclePlate || 'Assigned'}</span>
              <span className="font-bold text-gray-900">रु. {booking.fareNpr}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
