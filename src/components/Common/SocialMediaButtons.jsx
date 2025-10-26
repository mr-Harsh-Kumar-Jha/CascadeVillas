// src/components/Common/SocialMediaButtons.jsx - FIXED VERSION (No Overlap)
import React, { useState } from 'react';
import { WHATSAPP_NUMBER } from '../../utils/constants';
import { generateWhatsAppLink } from '../../utils/helpers';

const SocialMediaButtons = ({ villaName = null }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Social Media Links - UPDATE THESE WITH YOUR ACTUAL LINKS
  const INSTAGRAM_URL = 'https://instagram.com/cascade.villas?igsh=MWNxaW9nYjRia29wZQ==';
  const FACEBOOK_URL = 'https://facebook.com/people/Cascade-Villas-Homestay/61579758807827';
  const whatsappMessage = villaName 
    ? `Hi, I'm interested in ${villaName}. Can you provide more details?`
    : "Hi, I'm interested in booking a villa. Can you help me?";
  
  const whatsappLink = generateWhatsAppLink(WHATSAPP_NUMBER, whatsappMessage);

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: (
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      ),
      url: whatsappLink,
      bgColor: 'bg-green-500 hover:bg-green-600',
      label: 'WhatsApp'
    },
    {
      name: 'Instagram',
      icon: (
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      ),
      url: INSTAGRAM_URL,
      bgColor: 'bg-pink-500 hover:bg-pink-600',
      label: 'Instagram'
    },
    {
      name: 'Facebook',
      icon: (
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      ),
      url: FACEBOOK_URL,
      bgColor: 'bg-blue-600 hover:bg-blue-700',
      label: 'Facebook'
    }
  ];

  return (
    <>
      {/* Desktop Version - Horizontal Layout (hidden on mobile/tablet) */}
      <div className="hidden lg:block fixed bottom-6 right-6 z-40">
        <div className="relative flex items-center gap-3">
          {/* Social Media Buttons - Show when expanded (horizontal on desktop) */}
          <div className={`flex flex-row gap-3 transition-all duration-300 ${
            isExpanded ? 'opacity-100 translate-x-0 mr-3' : 'opacity-0 translate-x-4 pointer-events-none mr-0'
          }`}>
            {socialLinks.map((social, index) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${social.bgColor} text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group`}
                aria-label={social.label}
                style={{
                  transitionDelay: isExpanded ? `${index * 50}ms` : '0ms'
                }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  {social.icon}
                </svg>
                <span className="hidden group-hover:inline-block text-sm font-medium whitespace-nowrap pr-2">
                  {social.label}
                </span>
              </a>
            ))}
          </div>

          {/* Toggle Button - FIXED: Always stays in the same position */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`bg-neutral-800 hover:bg-neutral-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 ${
              isExpanded ? 'rotate-45' : 'rotate-0'
            }`}
            aria-label={isExpanded ? 'Close social menu' : 'Open social menu'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              )}
            </svg>
          </button>
        </div>

        {/* Label when collapsed */}
        {!isExpanded && (
          <div className="absolute -top-12 right-0 bg-neutral-800 text-white px-3 py-1 rounded-full text-sm whitespace-nowrap pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
            Connect with us
          </div>
        )}
      </div>

      {/* Mobile/Tablet Version - Vertical Layout (visible only on mobile/tablet) */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <div className="relative flex flex-col items-end gap-3">
          {/* Social Media Buttons - Show when expanded (vertical on mobile/tablet) */}
          <div className={`flex flex-col gap-3 transition-all duration-300 ${
            isExpanded ? 'opacity-100 translate-y-0 mb-3' : 'opacity-0 translate-y-4 pointer-events-none mb-0'
          }`}>
            {socialLinks.map((social, index) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${social.bgColor} text-white rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group`}
                aria-label={social.label}
                style={{
                  transitionDelay: isExpanded ? `${index * 50}ms` : '0ms'
                }}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  {social.icon}
                </svg>
              </a>
            ))}
          </div>

          {/* Toggle Button - FIXED: Always stays in the same position */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`bg-neutral-800 hover:bg-neutral-700 text-white rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 ${
              isExpanded ? 'rotate-45' : 'rotate-0'
            }`}
            aria-label={isExpanded ? 'Close social menu' : 'Open social menu'}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default SocialMediaButtons;