// src/components/Common/HologramBadge.jsx
import React from 'react';
import { DEVELOPER_INFO } from '../../utils/constants';

/**
 * Developer Hologram Capsule
 * Recreates the exact sleek, modern inline footer hologram capsule requested:
 * [ ● Designed & Engineered by [ Harsh Jha ↗ ] [ 📞 +91 90758 40173 ] ]
 */
const HologramBadge = () => {
  return (
    <div 
      className="inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full 
                 bg-[#0a0f1d] text-white 
                 border border-slate-700/60 hover:border-slate-600
                 shadow-md backdrop-blur-md transition-all duration-200"
    >
      {/* Blue Dot */}
      <span className="inline-block h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6] shrink-0" />

      {/* Text Label */}
      <span className="text-xs font-medium text-slate-200 whitespace-nowrap">
        Designed &amp; Engineered by
      </span>

      {/* Blue Gradient Name Pill -> Links to LinkedIn */}
      <a
        href={DEVELOPER_INFO.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold text-white 
                   bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700
                   hover:from-blue-500 hover:to-indigo-600 shadow-sm transition-all duration-150 
                   hover:scale-[1.03] active:scale-95 whitespace-nowrap"
        title="Visit Harsh Jha on LinkedIn"
      >
        <span>{DEVELOPER_INFO.name}</span>
        <span className="text-[10px]">↗</span>
      </a>

      {/* Emerald Phone Pill -> Direct Phone Dialer */}
      <a
        href={`tel:${DEVELOPER_INFO.phoneClean}`}
        className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold text-emerald-400 
                   border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 hover:border-emerald-400/80 
                   transition-all duration-150 hover:scale-[1.03] active:scale-95 whitespace-nowrap"
        title="Call Developer (+91 9075840173)"
      >
        <svg className="w-3 h-3 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span>+91 90758 40173</span>
      </a>
    </div>
  );
};

export default HologramBadge;
