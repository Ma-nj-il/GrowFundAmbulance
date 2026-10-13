/**
 * RESQ Nepal - Notifications & Emergency Broadcasts Screen
 * Original RESQ Nepal design: Medical alerts, dispatch updates, and corridor status.
 */

import React from 'react';
import { HeaderBar } from '../common/HeaderBar';

interface NotificationsScreenProps {
  onBack: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onBack }) => {
  const notifications = [
    {
      id: 'notif-1',
      type: 'dispatch',
      title: 'Dispatch Completed',
      message: 'Ambulance Ba 1 Jha 9021 successfully handed over patient to TUTH Emergency Trauma Unit.',
      time: '15 mins ago',
      unread: false,
    },
    {
      id: 'notif-2',
      type: 'corridor',
      title: 'Kathmandu Priority Corridor',
      message: 'Traffic police priority corridor active along Maharajgunj Ring Road for emergency ambulance transit.',
      time: '2 hours ago',
      unread: false,
    },
    {
      id: 'notif-3',
      type: 'system',
      title: 'EMT Network Active',
      message: 'All 14 affiliated hospital ambulance depots in Kathmandu Valley are online and ready for dispatch.',
      time: 'Today, 08:00 AM',
      unread: false,
    },
  ];

  return (
    <div className="w-full h-full bg-[#F9FAFB] text-gray-900 flex flex-col justify-between overflow-hidden font-sans">
      <HeaderBar title="Emergency Alerts" showBack={true} onBack={onBack} uiStyle="light" />

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-start space-x-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-lg shrink-0">
              {item.type === 'dispatch' ? '🚑' : item.type === 'corridor' ? '🚨' : '🛡️'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-gray-900">{item.title}</h4>
                <span className="text-[10px] text-gray-400 font-mono">{item.time}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.message}</p>
            </div>
          </div>
        ))}

        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xl mb-2">
            ✓
          </div>
          <h4 className="text-xs font-bold text-gray-800">You are all caught up</h4>
          <p className="text-[11px] text-gray-400 mt-0.5">Emergency alerts will notify you during active dispatches.</p>
        </div>
      </div>
    </div>
  );
};
