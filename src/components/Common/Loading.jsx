import React from 'react';

const Loading = ({ fullScreen = false, text = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-neutral-200 border-t-neutral-800 rounded-full animate-spin"></div>
          <p className="mt-4 text-neutral-600 font-medium">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-neutral-200 border-t-neutral-800 rounded-full animate-spin"></div>
        <p className="mt-3 text-neutral-600">{text}</p>
      </div>
    </div>
  );
};

export default Loading;