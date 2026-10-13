/**
 * RESQ Nepal - Help & Emergency Dispatch Support Screen
 * 24/7 Kathmandu Medical Dispatch response desk, emergency FAQs,
 * and hospital triage coordination.
 */

import React, { useState } from 'react';
import { HeaderBar } from '../common/HeaderBar';

interface SupportScreenProps {
  onBack: () => void;
}

export const SupportScreen: React.FC<SupportScreenProps> = ({ onBack }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'support',
      text: 'Namaste! This is the RESQ Nepal 24/7 Central Dispatch Desk. How may we assist your emergency transport or patient transfer?',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topics: Record<string, { title: string; content: string }> = {
    standards: {
      title: 'National Ambulance Service Standards',
      content: 'All RESQ Nepal ambulances comply with Ministry of Health and Population (MoHP) standards. Every dispatch is sanitised, oxygen-tested, and crewed by licensed EMT emergency drivers.',
    },
    dispatch_delay: {
      title: 'What if an ambulance is delayed in traffic?',
      content: 'If an ambulance encounters heavy Kathmandu Ring Road or arterial congestion, central dispatch coordinates with the Kathmandu Valley Traffic Police to clear priority sirens corridors.',
    },
    oxygen_ventilator: {
      title: 'Ventilator & ICU Ambulance Requirements',
      content: 'Ventilator units (CCU/ICU) come equipped with transport ventilators, multi-channel infusion pumps, and advanced cardiac life support monitored by certified emergency paramedics.',
    },
    interhospital: {
      title: 'Inter-Hospital Patient Referrals',
      content: 'For scheduled or urgent transfers between hospitals (e.g., district hospitals to TUTH or Bir Hospital), specify the receiving department for seamless trauma triage handover.',
    },
    billing: {
      title: 'Transparent Ambulance Fares in Nepal',
      content: 'Fares adhere to standard government and hospital regulated base rates (Basic रु.100, ALS रु.150, Ventilator रु.200) with fair per-km transit rates. No surge pricing.',
    },
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const userMsg = inputText.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputText('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'support',
          text: `Thank you for reaching out. Dispatch Officer Bikram has received your inquiry: "${userMsg}". Live coordination ticket #KTM-${Math.floor(1000 + Math.random() * 9000)} is active.`,
        },
      ]);
    }, 700);
  };

  return (
    <div className="w-full h-full bg-[#F9FAFB] text-gray-900 flex flex-col justify-between overflow-hidden font-sans">
      <HeaderBar title="Help & Support Desk" showBack={true} onBack={onBack} uiStyle="light" />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* 24/7 Hotline Quick Banner */}
        <div className="p-4 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📞</span>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider">Direct Hotline 102</h3>
              <p className="text-[11px] text-red-100">National Ambulance Service Nepal</p>
            </div>
          </div>
          <a
            href="tel:102"
            className="px-3.5 py-1.5 rounded-full bg-white text-red-600 font-extrabold text-xs shadow-xs"
          >
            Call 102
          </a>
        </div>

        {/* Live Chat with Dispatch */}
        <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h4 className="text-xs font-bold text-gray-900">Emergency Dispatch Desk</h4>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Online</span>
          </div>

          <button
            onClick={() => setChatOpen(true)}
            className="w-full py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition flex items-center justify-center space-x-2"
          >
            <span>💬</span>
            <span>Open Live Dispatch Chat</span>
          </button>
        </div>

        {/* Emergency FAQs */}
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block mb-2">
            Frequently Asked Questions
          </span>
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 shadow-xs">
            {Object.entries(topics).map(([key, item]) => (
              <div
                key={key}
                onClick={() => setSelectedTopic(key)}
                className="p-3.5 hover:bg-gray-50 cursor-pointer transition flex items-center justify-between"
              >
                <span className="text-xs font-bold text-gray-900">{item.title}</span>
                <span className="text-xs text-gray-400">&rarr;</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-3xl w-full max-w-sm h-[480px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-4 bg-red-600 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🚑</span>
                <div>
                  <h4 className="text-xs font-bold">RESQ Nepal Central Dispatch</h4>
                  <span className="text-[10px] text-red-100">Live Support Desk</span>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white text-sm font-bold">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-gray-50 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl max-w-[85%] ${
                    m.sender === 'user'
                      ? 'ml-auto bg-red-600 text-white'
                      : 'mr-auto bg-white text-gray-900 border border-gray-200 shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type emergency message..."
                className="flex-1 p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-red-600"
              />
              <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold">
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Topic Content Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-3xl p-6 max-w-sm w-full space-y-3.5 shadow-2xl border border-gray-100">
            <h3 className="text-sm font-extrabold text-gray-900">{topics[selectedTopic]?.title}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{topics[selectedTopic]?.content}</p>
            <button
              onClick={() => setSelectedTopic(null)}
              className="w-full py-2.5 rounded-xl bg-red-600 text-xs font-bold text-white hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
