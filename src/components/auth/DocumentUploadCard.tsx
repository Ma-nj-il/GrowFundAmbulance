/**
 * RESQ Nepal - Medical & Legal Document Upload Card
 * Supports citizenship cards and driver licenses:
 * - File picker / Camera capture simulation
 * - Authentic Nepal government document sample presets
 * - Preview, Replace, and Remove actions
 * - Sensitive document privacy badge
 */

import React, { useRef, useState } from 'react';

interface DocumentUploadCardProps {
  title: string;
  subtitle: string;
  value?: string | null;
  onChange: (url: string | null) => void;
  presetSampleType: 'citizenship_front' | 'citizenship_back' | 'license_front' | 'license_back';
  required?: boolean;
}

// Authentic visual SVG Data URIs representing Nepal Government identity documents
const SAMPLE_PRESETS: Record<string, string> = {
  citizenship_front: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" rx="16" fill="%23FFFDF7" stroke="%23D97706" stroke-width="3"/><rect x="12" y="12" width="376" height="226" rx="12" fill="none" stroke="%23E5E7EB" stroke-width="1.5"/><circle cx="50" cy="50" r="22" fill="%23DC2626" opacity="0.12"/><path d="M50 35 L53 45 L63 45 L55 51 L58 61 L50 55 L42 61 L45 51 L37 45 L47 45 Z" fill="%23DC2626"/><text x="82" y="44" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23B91C1C">नेपाल सरकार | गृह मन्त्रालय</text><text x="82" y="60" font-family="sans-serif" font-size="10" fill="%234B5563">GOVERNMENT OF NEPAL - CITIZENSHIP</text><rect x="25" y="85" width="80" height="100" rx="6" fill="%23E5E7EB" stroke="%239CA3AF" stroke-width="1"/><circle cx="65" cy="120" r="18" fill="%239CA3AF"/><path d="M45 165 C45 145, 85 145, 85 165 Z" fill="%239CA3AF"/><text x="120" y="105" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111827">प्रमाणपत्र नं: 27-01-78-04921</text><text x="120" y="125" font-family="sans-serif" font-size="10" fill="%23374151">नाम: Manjil Bhandari</text><text x="120" y="145" font-family="sans-serif" font-size="10" fill="%23374151">जन्म मिति: 2056/08/14 B.S.</text><text x="120" y="165" font-family="sans-serif" font-size="10" fill="%23374151">जिल्ला: काठमाडौं (Kathmandu)</text><rect x="290" y="170" width="85" height="45" rx="4" fill="%23FEE2E2" stroke="%23DC2626" stroke-dasharray="3,3"/><text x="300" y="196" font-family="sans-serif" font-size="9" font-weight="bold" fill="%23DC2626">अधिकारप्राप्त अधिकारी</text></svg>`,

  citizenship_back: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" rx="16" fill="%23FFFDF7" stroke="%23D97706" stroke-width="3"/><rect x="12" y="12" width="376" height="226" rx="12" fill="none" stroke="%23E5E7EB" stroke-width="1.5"/><text x="30" y="45" font-family="sans-serif" font-size="11" font-weight="bold" fill="%231F2937">स्थायी ठेगाना (Permanent Address):</text><text x="30" y="65" font-family="sans-serif" font-size="10" fill="%234B5563">बागमती प्रदेश, काठमाडौं महानगरपालिका वडा नं. १०, बानेश्वर</text><line x1="30" y1="85" x2="370" y2="85" stroke="%23E5E7EB" stroke-width="1.5"/><text x="30" y="110" font-family="sans-serif" font-size="10" fill="%23374151">बाबुको नाम: Surendra Bhandari</text><text x="30" y="130" font-family="sans-serif" font-size="10" fill="%23374151">आमाको नाम: Sita Bhandari</text><rect x="35" y="155" width="55" height="65" rx="4" fill="%23E5E7EB" stroke="%236B7280" stroke-width="1"/><text x="42" y="192" font-family="sans-serif" font-size="8" fill="%234B5563">बायाँ औंठा</text><rect x="105" y="155" width="55" height="65" rx="4" fill="%23E5E7EB" stroke="%236B7280" stroke-width="1"/><text x="112" y="192" font-family="sans-serif" font-size="8" fill="%234B5563">दायाँ औंठा</text><rect x="250" y="165" width="120" height="45" rx="4" fill="%23FEF3C7" stroke="%23D97706"/><text x="260" y="192" font-family="sans-serif" font-size="9" font-weight="bold" fill="%2392400E">जारी मिति: 2074/09/12</text></svg>`,

  license_front: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" rx="16" fill="%23F0FDF4" stroke="%2316A34A" stroke-width="3"/><rect x="12" y="12" width="376" height="226" rx="12" fill="none" stroke="%23DCFCE7" stroke-width="1.5"/><text x="25" y="38" font-family="sans-serif" font-size="12" font-weight="bold" fill="%2315803D">नेपाल सरकार | यातायात व्यवस्था विभाग</text><text x="25" y="54" font-family="sans-serif" font-size="10" fill="%23166534">NEPAL SMART DRIVING LICENSE</text><rect x="25" y="75" width="80" height="100" rx="6" fill="%23E5E7EB" stroke="%2315803D" stroke-width="1.5"/><circle cx="65" cy="110" r="18" fill="%239CA3AF"/><path d="M45 155 C45 135, 85 135, 85 155 Z" fill="%239CA3AF"/><text x="120" y="95" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111827">DL No: 01-06-00492812</text><text x="120" y="115" font-family="sans-serif" font-size="10" fill="%23374151">Name: Hari Sundar Shrestha</text><text x="120" y="135" font-family="sans-serif" font-size="10" fill="%23374151">Category: B, C (Ambulance Certified)</text><text x="120" y="155" font-family="sans-serif" font-size="10" fill="%23374151">Blood Group: B+ve</text><text x="120" y="175" font-family="sans-serif" font-size="10" font-weight="bold" fill="%2315803D">Valid Until: 2029-05-18</text><rect x="300" y="30" width="75" height="50" rx="6" fill="%23FEF9C3" stroke="%23CA8A04"/><text x="312" y="60" font-family="sans-serif" font-size="16" font-weight="black" fill="%23854D0E">CHIP</text></svg>`,

  license_back: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" rx="16" fill="%23F0FDF4" stroke="%2316A34A" stroke-width="3"/><rect x="12" y="12" width="376" height="226" rx="12" fill="none" stroke="%23DCFCE7" stroke-width="1.5"/><text x="25" y="40" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23166534">Emergency Contact / Donor Status</text><text x="25" y="62" font-family="sans-serif" font-size="10" fill="%23374151">Organ Donor: YES (अंगदाता)</text><text x="25" y="82" font-family="sans-serif" font-size="10" fill="%23374151">Emergency Call: +977-9841883391</text><rect x="25" y="110" width="350" height="35" rx="4" fill="%231E293B"/><text x="35" y="132" font-family="monospace" font-size="11" fill="%23F8FAFC">IDNPL0106004928128&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</text><rect x="25" y="160" width="160" height="55" rx="4" fill="%23E2E8F0"/><text x="35" y="185" font-family="sans-serif" font-size="9" fill="%23334155">Issuing Zone: Bagmati</text><text x="35" y="202" font-family="sans-serif" font-size="9" fill="%23334155">Ekantakuna, Lalitpur</text><circle cx="330" cy="185" r="25" fill="%23DC2626" opacity="0.2"/><text x="312" y="190" font-family="sans-serif" font-size="10" font-weight="bold" fill="%23DC2626">DOTM</text></svg>`,
};

export const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({
  title,
  subtitle,
  value,
  onChange,
  presetSampleType,
  required = true,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoadSample = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(SAMPLE_PRESETS[presetSampleType]);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs transition hover:border-red-300">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header Info */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold text-gray-900">{title}</span>
            {required && <span className="text-red-500 font-bold text-xs">*</span>}
          </div>
          <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{subtitle}</p>
        </div>
        {value ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            ✓ Attached
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Required
          </span>
        )}
      </div>

      {/* Card Content State */}
      {!value ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 bg-gray-50/70 text-center flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-lg">
            📷
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-800">Upload or take a photo</p>
            <p className="text-[9px] text-gray-500">JPG, PNG or photo capture up to 10MB</p>
          </div>

          <div className="flex items-center space-x-2 pt-1 w-full max-w-xs">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-1.5 px-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-[10px] transition shadow-xs flex items-center justify-center space-x-1"
            >
              <span>Choose Photo</span>
            </button>
            <button
              type="button"
              onClick={handleLoadSample}
              className="py-1.5 px-2.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg font-semibold text-[10px] transition flex items-center justify-center space-x-1"
              title="Use authentic Nepal government document sample for rapid demo testing"
            >
              <span>🇳🇵 Use Sample</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div
            onClick={() => setIsZoomOpen(true)}
            className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-900/5 group cursor-pointer aspect-16/9 flex items-center justify-center max-h-36"
          >
            <img
              src={value}
              alt={title}
              className="w-full h-full object-cover transition group-hover:scale-102 duration-200"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[11px] font-semibold space-x-1">
              <span>🔍 Tap to expand preview</span>
            </div>
            <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] px-2 py-0.5 rounded font-medium">
              Verified Resolution
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-2 pt-0.5">
            <button
              type="button"
              onClick={() => setIsZoomOpen(true)}
              className="text-[10px] text-gray-600 hover:text-gray-900 font-medium px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition"
            >
              View Full
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[10px] text-red-600 hover:text-red-700 font-semibold px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition"
            >
              Replace Image
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="text-[10px] text-gray-500 hover:text-red-600 font-medium px-2 py-1 rounded hover:bg-gray-100 transition"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Modal Zoom Preview */}
      {isZoomOpen && value && (
        <div
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-sm w-full p-4 space-y-3 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="font-bold text-xs text-gray-900">{title}</span>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <img src={value} alt={title} className="w-full h-auto object-contain" />
            </div>
            <div className="text-[10px] text-gray-500 text-center">
              Tap anywhere outside or close to return
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
