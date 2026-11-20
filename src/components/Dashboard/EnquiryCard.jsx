// src/components/Dashboard/EnquiryCard.jsx
import React, { useState } from 'react';
import { formatDateTime, formatDate } from '../../utils/helpers';
import { STATUS_COLORS } from '../../utils/constants';

const EnquiryCard = ({ enquiry, onCancel, showCancelButton = false }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const statusColor = STATUS_COLORS[enquiry.status] || 'bg-neutral-500/10 text-neutral-400';
  
  const handleCancel = async () => {
    setCancelling(true);
    try {
      await onCancel(enquiry.id);
    } catch (error) {
      console.error('Error cancelling:', error);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl border border-neutral-200/80 dark:border-white/10 overflow-hidden shadow-lg p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-0.5">
              {enquiry.villaName}
            </h3>
            <p className="text-xs text-neutral-500">
              Submitted: {formatDateTime(enquiry.createdAt)}
            </p>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${statusColor}`}>
            {enquiry.status}
          </span>
        </div>

        {/* Quick Info */}
        <div className="space-y-1.5 py-3 border-y border-neutral-200/60 dark:border-white/10 text-xs text-neutral-700 dark:text-neutral-300">
          {enquiry.checkInDate && (
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span>
                {formatDate(enquiry.checkInDate)}
                {enquiry.checkOutDate && ` → ${formatDate(enquiry.checkOutDate)}`}
              </span>
            </div>
          )}
          
          {enquiry.numberOfGuests && (
            <div className="flex items-center gap-2">
              <span>👥</span>
              <span>{enquiry.numberOfGuests} Guests</span>
            </div>
          )}
        </div>

        {/* Details Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-3 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-emerald-500 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors"
        >
          <span>{showDetails ? 'Hide Details' : 'View Message & Info'}</span>
          <span className={`transition-transform ${showDetails ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {showDetails && (
          <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-white/10 text-xs space-y-2 animate-fade-in">
            <div>
              <span className="text-[10px] font-bold uppercase text-neutral-400 block">Contact Info</span>
              <p className="text-neutral-800 dark:text-neutral-200">{enquiry.userName} • {enquiry.phone}</p>
              <p className="text-neutral-500">{enquiry.email}</p>
            </div>
            {enquiry.message && (
              <div>
                <span className="text-[10px] font-bold uppercase text-neutral-400 block">Message</span>
                <p className="text-neutral-700 dark:text-neutral-300 italic">&ldquo;{enquiry.message}&rdquo;</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showCancelButton && enquiry.status === 'pending' && (
        <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-white/10 flex justify-end">
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Enquiry'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EnquiryCard;
