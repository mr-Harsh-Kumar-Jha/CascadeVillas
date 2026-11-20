// src/components/Common/Loading.jsx
import React from 'react';

const Loading = ({ fullScreen = false, text = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
        <div className="glass-panel rounded-3xl p-8 flex flex-col items-center border border-white/10 shadow-2xl">
          <div className="relative w-14 h-14">
            <div className="w-14 h-14 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-xs">✨</div>
          </div>
          <p className="mt-4 text-xs font-bold text-neutral-800 dark:text-neutral-200 tracking-wide uppercase">
            {text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="glass-panel rounded-2xl px-6 py-4 flex items-center gap-3 border border-neutral-200 dark:border-white/10 shadow-sm">
        <div className="w-6 h-6 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">{text}</span>
      </div>
    </div>
  );
};

export default Loading;
