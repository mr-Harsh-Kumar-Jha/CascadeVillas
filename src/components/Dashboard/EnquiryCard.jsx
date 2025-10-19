// src/components/Dashboard/EnquiryCard.jsx
import React, { useState } from 'react';
import { formatDateTime, formatDate } from '../../utils/helpers';
import { STATUS_COLORS } from '../../utils/constants';

const EnquiryCard = ({ enquiry }) => {
  const [showDetails, setShowDetails] = useState(false);

  const statusColor = STATUS_COLORS[enquiry.status] || 'bg-neutral-100 text-neutral-800';

  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-neutral-800 mb-1">
              {enquiry.villaName}
            </h3>
            <p className="text-sm text-neutral-500">
              {formatDateTime(enquiry.createdAt)}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor} capitalize`}>
            {enquiry.status}
          </span>
        </div>

        {/* Quick Info */}
        <div className="space-y-2 mb-4">
          {enquiry.checkInDate && (
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {formatDate(new Date(enquiry.checkInDate))}
                {enquiry.checkOutDate && ` - ${formatDate(new Date(enquiry.checkOutDate))}`}
              </span>
            </div>
          )}
          
          {enquiry.numberOfGuests && (
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{enquiry.numberOfGuests} Guest{enquiry.numberOfGuests > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Toggle Details Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-neutral-600 hover:text-neutral-800 text-sm font-medium flex items-center gap-1 transition-colors"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
          <svg 
            className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <div className="px-6 pb-6 pt-0 border-t border-neutral-100">
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-neutral-500 mb-1">Contact Information</p>
              <p className="text-sm text-neutral-700">{enquiry.userName}</p>
              <p className="text-sm text-neutral-600">{enquiry.email}</p>
              <p className="text-sm text-neutral-600">{enquiry.phone}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-neutral-500 mb-1">Message</p>
              <p className="text-sm text-neutral-700 leading-relaxed">
                {enquiry.message}
              </p>
            </div>

            <div className="pt-3">
              <p className="text-xs text-neutral-500">
                Enquiry ID: {enquiry.id}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiryCard;