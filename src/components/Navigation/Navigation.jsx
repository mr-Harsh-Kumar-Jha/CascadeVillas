// src/components/Navigation/Navigation.jsx
import React, { useState, useEffect } from 'react';
import CascadeLogo from '../../assets/Cascade.jpg';
import { useTheme } from '../../context/ThemeContext';
import { CONCIERGE_INFO } from '../../utils/constants';

const Navigation = ({ currentPage, onNavigate, user, isAdmin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConciergeSheet, setShowConciergeSheet] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  // Collapsible sidebar state persisted in localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('cascade_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('cascade_sidebar_collapsed', String(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  useEffect(() => {
    // Close mobile menu when page changes
    setMobileMenuOpen(false);
  }, [currentPage]);

  const menuItems = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' 
    },
    { 
      id: 'properties', 
      label: 'All Villas', 
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' 
    },
    { 
      id: 'dashboard', 
      label: 'My Enquiries', 
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' 
    }
  ];

  if (isAdmin) {
    menuItems.push({
      id: 'admin',
      label: 'Admin Panel',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
    });
  }

  return (
    <>
      {/* Desktop Toggleable Glass Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col h-screen sticky top-0 z-30 glass-panel border-r border-neutral-200/80 dark:border-white/10 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <nav className="flex flex-col h-full overflow-hidden">
          {/* Header & Toggle Button */}
          <div className={`p-4 border-b border-neutral-200/60 dark:border-white/10 flex items-center ${isCollapsed ? 'flex-col gap-3 justify-center' : 'justify-between'}`}>
            {/* Brand Logo & Name */}
            <div 
              onClick={() => onNavigate('home')}
              className={`flex items-center gap-3 cursor-pointer group ${isCollapsed ? 'justify-center' : ''}`}
              title="Cascade Villas - Home"
            >
              <div className="relative w-10 h-10 rounded-2xl overflow-hidden p-[1.5px] bg-gradient-to-tr from-brand-500 via-amber-400 to-emerald-400 shadow group-hover:scale-105 transition-transform shrink-0">
                <img 
                  className="w-full h-full object-cover rounded-[14px]" 
                  src={CascadeLogo} 
                  alt="Cascade Villas"
                />
              </div>

              {!isCollapsed && (
                <div className="truncate text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-white font-serif">
                      Cascade
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded bg-brand-500/10 text-brand-600 dark:text-rose-300 border border-brand-500/20">
                      LUXURY
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                    Villas & Homestays
                  </p>
                </div>
              )}
            </div>

            {/* Collapse / Expand Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-white/10 transition-colors"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <svg 
                className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
            {menuItems.map((item) => {
              const active = currentPage === item.id;
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-3'} rounded-xl font-semibold text-sm transition-all duration-200 ${
                      active
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-md scale-[1.02]'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <div className="flex items-center gap-3">
                      <svg 
                        className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                          active ? 'text-emerald-400 dark:text-brand-600' : 'text-neutral-400 dark:text-neutral-500 group-hover:text-emerald-500'
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                      </svg>
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>

                    {!isCollapsed && active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-brand-600 animate-pulse" />
                    )}
                  </button>

                  {/* Modern Floating Tooltip when Collapsed */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-neutral-900 text-white dark:bg-neutral-800 text-xs font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-white/10">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 24/7 Concierge Box */}
          {!isCollapsed ? (
            <div className="p-3.5 mx-3 mb-4 rounded-2xl bg-neutral-100/90 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  24/7 Villa Concierge
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Direct Inquiries
              </div>
              <div className="mt-2 flex flex-col gap-1">
                <a
                  href={`tel:${CONCIERGE_INFO.phoneClean}`}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5 truncate"
                >
                  <span>📞</span>
                  <span>{CONCIERGE_INFO.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${CONCIERGE_INFO.phoneClean}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-green-600 dark:text-green-400 hover:underline flex items-center gap-1.5"
                >
                  <span>💬</span>
                  <span>WhatsApp Desk</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="mb-4 flex flex-col items-center group relative">
              <a
                href={`https://wa.me/${CONCIERGE_INFO.phoneClean}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center hover:scale-110 transition-transform"
                title="24/7 Villa Concierge"
              >
                🛎️
              </a>
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-neutral-900 text-white dark:bg-neutral-800 text-xs font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-white/10">
                Concierge Desk
              </div>
            </div>
          )}

          {/* Theme Switcher & Footer */}
          <div className="p-3 border-t border-neutral-200/60 dark:border-white/10 space-y-2">
            {!isCollapsed ? (
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold
                           bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200/80 dark:hover:bg-white/10
                           text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span>{isDark ? '🌙' : '☀️'}</span>
                  <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-white/10">
                  Switch
                </span>
              </button>
            ) : (
              <div className="flex justify-center group relative">
                <button
                  onClick={toggleTheme}
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 transition-all"
                  aria-label="Toggle theme"
                  title="Toggle Theme"
                >
                  <span>{isDark ? '🌙' : '☀️'}</span>
                </button>
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-neutral-900 text-white dark:bg-neutral-800 text-xs font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-white/10">
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </div>
              </div>
            )}

            {/* Profile Snippet */}
            {!isCollapsed ? (
              <div className="flex items-center justify-between pt-1">
                {user ? (
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-neutral-950 shrink-0">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate text-left">
                      <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate">
                        {user.displayName || user.email.split('@')[0]}
                      </p>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                        {isAdmin ? 'Admin' : 'Guest'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-emerald-500 dark:hover:text-emerald-400 flex items-center gap-1.5 w-full justify-center py-1.5"
                  >
                    <span>Sign In / Admin</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex justify-center group relative">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 transition-all text-xs font-bold"
                  title={user ? user.email : 'Sign In'}
                >
                  {user ? (user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()) : '👤'}
                </button>
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-neutral-900 text-white dark:bg-neutral-800 text-xs font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-white/10">
                  {user ? (isAdmin ? 'Admin Panel' : 'My Account') : 'Sign In'}
                </div>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Ultra-Modern Mobile Glass Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 mobile-glass-dock border-b border-neutral-200/70 dark:border-white/10 transition-colors duration-300">
        <div className="flex items-center justify-between px-4 py-2.5">
          {/* Logo & Brand */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-8 h-8 rounded-xl overflow-hidden p-[1px] bg-gradient-to-tr from-brand-500 via-amber-400 to-emerald-400 shadow">
              <img className="w-full h-full object-cover rounded-[10px]" src={CascadeLogo} alt="Cascade"/>
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-sm text-neutral-900 dark:text-white">
                  Cascade
                </span>
                <span className="text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded bg-brand-500/10 text-brand-600 dark:text-rose-300 border border-brand-500/20">
                  LUXURY
                </span>
              </div>
              <p className="text-[9px] text-neutral-500 dark:text-neutral-400 font-medium">
                Villas &amp; Homestays
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick 24/7 Concierge Pill */}
            <button
              onClick={() => setShowConciergeSheet(true)}
              className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>24/7 Desk</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-200/60 dark:bg-white/10 border border-neutral-300/60 dark:border-white/10 active:scale-95 transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>

      {/* Floating Modern Mobile Glass Navigation Dock (iOS Native App Style) */}
      <div className="lg:hidden fixed bottom-3 left-3 right-3 sm:left-6 sm:right-6 max-w-md mx-auto z-40 h-16 rounded-3xl mobile-glass-dock flex items-center justify-around px-2 shadow-2xl backdrop-blur-2xl border border-white/30 dark:border-white/10">
        {/* Tab 1: Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all ${
            currentPage === 'home'
              ? 'text-emerald-500 dark:text-emerald-400 font-bold'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] tracking-tight">Home</span>
          {currentPage === 'home' && (
            <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          )}
        </button>

        {/* Tab 2: All Villas */}
        <button
          onClick={() => onNavigate('properties')}
          className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all ${
            currentPage === 'properties' || currentPage === 'villa-detail'
              ? 'text-emerald-500 dark:text-emerald-400 font-bold'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="text-[10px] tracking-tight">Villas</span>
          {(currentPage === 'properties' || currentPage === 'villa-detail') && (
            <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          )}
        </button>

        {/* Center Tab: Concierge Desk Elevated Action Button */}
        <div className="relative flex-1 flex justify-center -top-3">
          <button
            onClick={() => setShowConciergeSheet(true)}
            className="w-13 h-13 w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-neutral-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all border-2 border-white dark:border-neutral-900"
            aria-label="Open Concierge Desk"
            title="Concierge 24/7"
          >
            <span className="text-xl">🛎️</span>
          </button>
        </div>

        {/* Tab 4: Enquiries / Admin */}
        <button
          onClick={() => onNavigate(isAdmin ? 'admin' : 'dashboard')}
          className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all ${
            currentPage === 'dashboard' || currentPage === 'admin'
              ? 'text-emerald-500 dark:text-emerald-400 font-bold'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-[10px] tracking-tight">{isAdmin ? 'Admin' : 'Enquiries'}</span>
          {(currentPage === 'dashboard' || currentPage === 'admin') && (
            <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          )}
        </button>

        {/* Tab 5: Menu */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all ${
            mobileMenuOpen
              ? 'text-emerald-500 dark:text-emerald-400 font-bold'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-[10px] tracking-tight">Menu</span>
        </button>
      </div>

      {/* Mobile Concierge Quick Bottom Sheet */}
      {showConciergeSheet && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex flex-col justify-end p-3 animate-fade-in"
          onClick={() => setShowConciergeSheet(false)}
        >
          <div 
            className="mobile-glass-dock rounded-3xl p-6 border border-white/20 dark:border-white/10 shadow-2xl animate-slide-up space-y-4 max-w-md mx-auto w-full text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200/60 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-neutral-950 text-xl shadow">
                  🛎️
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
                    Cascade Concierge Desk
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    24/7 Verified Guest Support
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConciergeSheet(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-xl bg-neutral-100 dark:bg-white/5"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${CONCIERGE_INFO.phoneClean}`}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold text-xs shadow-lg active:scale-95 transition-all"
              >
                <span className="text-2xl">📞</span>
                <span>Call Concierge</span>
                <span className="text-[10px] opacity-80">{CONCIERGE_INFO.phone}</span>
              </a>

              <a
                href={`https://wa.me/${CONCIERGE_INFO.phoneClean}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-[#25D366] text-neutral-950 font-bold text-xs shadow-lg active:scale-95 transition-all"
              >
                <span className="text-2xl">💬</span>
                <span>WhatsApp Desk</span>
                <span className="text-[10px] font-semibold opacity-90">Instant Quotes</span>
              </a>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 border-t border-neutral-200/60 dark:border-white/10">
              <span>⏰ {CONCIERGE_INFO.hours}</span>
              <a 
                href="https://instagram.com/cascade.villas?igsh=MWNxaW9nYjRia29wZQ==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-pink-500 font-bold hover:underline"
              >
                Instagram 📸
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Full Mobile Slide-up Glass Drawer */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex flex-col justify-end p-3 animate-fade-in" 
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="mobile-glass-dock rounded-3xl p-6 border border-white/20 dark:border-white/10 shadow-2xl animate-slide-up space-y-4 max-w-md mx-auto w-full text-left max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header & User Info */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200/60 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 via-amber-400 to-emerald-400 flex items-center justify-center text-white font-serif font-black text-lg shadow">
                  C
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">
                    Cascade Villas
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {user ? (isAdmin ? 'Logged in as Admin' : `Guest: ${user.displayName || user.email}`) : 'Luxury Homestays & Pool Estates'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-xl bg-neutral-100 dark:bg-white/5"
              >
                ✕
              </button>
            </div>

            {/* Navigation Options */}
            <nav className="space-y-1.5">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-2xl font-bold text-xs transition-all ${
                    currentPage === item.id
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-md'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/10'
                  }`}
                >
                  <svg className="w-4 h-4 mr-3 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                  <span>{item.label}</span>
                </button>
              ))}

              <button
                onClick={() => {
                  onNavigate('terms');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center px-4 py-2.5 rounded-2xl font-medium text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/10"
              >
                <span className="w-4 mr-3 text-center">📜</span>
                <span>Terms &amp; Conditions</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('privacy');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center px-4 py-2.5 rounded-2xl font-medium text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/10"
              >
                <span className="w-4 mr-3 text-center">🔒</span>
                <span>Privacy Policy</span>
              </button>
            </nav>

            {/* Footer / Theme / Auth */}
            <div className="pt-3 border-t border-neutral-200/60 dark:border-white/10 flex items-center justify-between text-xs">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 font-bold text-neutral-700 dark:text-neutral-300"
              >
                <span>{isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="text-emerald-500 font-bold hover:underline"
              >
                {user ? 'My Account ↗' : 'Sign In / Admin ↗'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Top Header Spacer */}
      <div className="lg:hidden h-[54px]"></div>
    </>
  );
};

export default Navigation;
