// src/components/Footer/Footer.jsx
import React from 'react';
import HologramBadge from '../Common/HologramBadge';
import CascadeLogo from '../../assets/Cascade.jpg';
import { CONCIERGE_INFO } from '../../utils/constants';

const Footer = ({ onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-neutral-200 dark:border-white/10 bg-neutral-100/70 dark:bg-neutral-950/80 backdrop-blur-xl transition-colors duration-300 pb-28 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 text-left">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-14 rounded-xl overflow-hidden bg-[#F5F5DD] p-0.5 border border-neutral-200/80 dark:border-white/15 shadow-sm flex items-center justify-center shrink-0">
                <img className="w-full h-full object-contain rounded-lg" src={CascadeLogo} alt="Cascade Villas" />
              </div>
              <div className="leading-tight">
                <span className="font-serif font-black tracking-wider text-neutral-900 dark:text-white text-base block">
                  CASCADE VILLAS
                </span>
                <span className="text-[10px] tracking-widest text-neutral-500 dark:text-neutral-400 uppercase font-semibold">
                  Villas &amp; Homestays
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Curated private pool villas and boutique homestays in Lonavala and Mahabaleshwar. 
              Transparent pricing, verified properties, and 24/7 direct host concierge assistance.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a 
                href="https://instagram.com/cascade.villas?igsh=MWNxaW9nYjRia29wZQ==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-white/10 hover:bg-pink-500 hover:text-white text-neutral-700 dark:text-neutral-300 flex items-center justify-center transition-colors text-xs"
                aria-label="Instagram"
              >
                📸
              </a>
              <a 
                href="https://facebook.com/people/Cascade-Villas-Homestay/61579758807827" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-white/10 hover:bg-blue-600 hover:text-white text-neutral-700 dark:text-neutral-300 flex items-center justify-center transition-colors text-xs"
                aria-label="Facebook"
              >
                👥
              </a>
              <a 
                href={`https://wa.me/${CONCIERGE_INFO.phoneClean}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-white/10 hover:bg-emerald-500 hover:text-white text-neutral-700 dark:text-neutral-300 flex items-center justify-center transition-colors text-xs"
                aria-label="WhatsApp"
              >
                💬
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400">
              <li>
                <button 
                  onClick={() => onNavigate('home')} 
                  className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                >
                  Featured Getaways
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('properties')} 
                  className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                >
                  All Villas
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('dashboard')} 
                  className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                >
                  Track My Enquiries
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('terms')} 
                  className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('privacy')} 
                  className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Featured Locations */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-white mb-4">
              Destinations
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400">
              <li className="flex items-center gap-1.5">
                <span>📍</span>
                <span>Lonavala Private Villas</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>📍</span>
                <span>Mahabaleshwar Homestays</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>🏊</span>
                <span>Private Heated Pool Estates</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>🎉</span>
                <span>Wedding & Corporate Retreats</span>
              </li>
            </ul>
          </div>

          {/* Concierge Desk Contact */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-white mb-4">
              Villa Inquiries & Bookings
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
              Direct assistance with availability, custom itineraries, and reservations.
            </p>
            <div className="space-y-2 text-xs">
              <a 
                href={`tel:${CONCIERGE_INFO.phoneClean}`}
                className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
              >
                <span>📞</span>
                <span>{CONCIERGE_INFO.phone}</span>
              </a>
              <a 
                href={`mailto:${CONCIERGE_INFO.email}`}
                className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
              >
                <span>✉️</span>
                <span>{CONCIERGE_INFO.email}</span>
              </a>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-500 pt-1">
                ⏰ {CONCIERGE_INFO.hours}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Developer Capsule from Image 2, Legal Links */}
        <div className="pt-8 border-t border-neutral-200/80 dark:border-white/10 flex flex-col lg:flex-row items-center justify-between gap-5 text-xs text-neutral-500 dark:text-neutral-400">
          <p className="whitespace-nowrap">
            © {new Date().getFullYear()} Cascade Villas. All rights reserved.
          </p>

          {/* Developer Hologram Capsule */}
          <HologramBadge />

          <div className="flex items-center gap-6 text-xs whitespace-nowrap">
            <button 
              onClick={() => onNavigate('privacy')}
              className="hover:text-emerald-500 dark:hover:text-emerald-400 cursor-pointer transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => onNavigate('terms')}
              className="hover:text-emerald-500 dark:hover:text-emerald-400 cursor-pointer transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
