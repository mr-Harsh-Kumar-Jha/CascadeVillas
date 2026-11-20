// src/components/Legal/PrivacyPolicy.jsx
import React from 'react';
import { CONCIERGE_INFO } from '../../utils/constants';

const PrivacyPolicy = ({ onNavigate }) => {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Top Navigation & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-white/10">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Home</span>
          </button>

          {/* Legal Tab Switcher */}
          <div className="inline-flex p-1 rounded-2xl glass-panel border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-white/5">
            <button
              onClick={() => onNavigate('terms')}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Terms of Service
            </button>
            <button
              onClick={() => onNavigate('privacy')}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm"
            >
              Privacy Policy
            </button>
          </div>
        </div>

        {/* Header Hero Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-neutral-200/80 dark:border-white/10 shadow-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <span>🛡️ Data Privacy & Guest Trust</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-serif">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Last Updated: November 2026 • Compliant with Digital Personal Data Protection Act (DPDP Act, India)
          </p>
        </div>

        {/* Privacy Policy Body */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-neutral-200/80 dark:border-white/10 shadow-xl space-y-8 text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-500 flex items-center justify-center text-xs">1</span>
              <span>Overview & Scope</span>
            </h2>
            <p>
              At <strong>Cascade Villas</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), we take your privacy and personal data seriously. This Privacy Policy outlines how we collect, handle, store, and protect your information when you access our luxury villa rental portal, submit inquiries, or complete stays across Lonavala and Mahabaleshwar.
            </p>
            <p>
              By accessing our platform or sharing details with our concierge desk, you consent to the practices described in this policy.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-500 flex items-center justify-center text-xs">2</span>
              <span>Information We Collect</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-neutral-100/70 dark:bg-white/5 border border-neutral-200 dark:border-white/10">
                <h3 className="font-bold text-neutral-900 dark:text-white mb-1.5 flex items-center gap-2">
                  <span>👤</span>
                  <span>Contact & Booking Info</span>
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Name, email address, mobile/WhatsApp phone number, check-in and check-out dates, guest party size, and specific hospitality preferences.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-100/70 dark:bg-white/5 border border-neutral-200 dark:border-white/10">
                <h3 className="font-bold text-neutral-900 dark:text-white mb-1.5 flex items-center gap-2">
                  <span>🪪</span>
                  <span>Physical Check-in Identity</span>
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Government photo IDs presented in person at the villa as required by local Maharashtra police guest registration regulations (not stored on public servers).
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-500 flex items-center justify-center text-xs">3</span>
              <span>How We Use Your Data</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Processing Reservations:</strong> To verify villa availability, confirm stay dates, and issue official booking receipts.
              </li>
              <li>
                <strong>Guest Hospitality Support:</strong> To coordinate check-in arrival directions, food preferences, and caretaker assistance.
              </li>
              <li>
                <strong>Guest Communications:</strong> To send real-time SMS, WhatsApp, or email updates regarding enquiry status and property access details.
              </li>
              <li>
                <strong>Platform Optimization:</strong> To monitor website responsiveness, detect bugs, and enhance our glassmorphic interface performance.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-500 flex items-center justify-center text-xs">4</span>
              <span>Zero Advertising Data Sales Guarantee</span>
            </h2>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <p className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                🔒 Strict Non-Disclosure Commitment
              </p>
              <p className="text-neutral-700 dark:text-neutral-300">
                Cascade Villas never sells, trades, rents, or monetizes your personal data, phone numbers, or inquiry records to third-party marketing brokers or ad networks. Your details are treated with strict confidentiality.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-500 flex items-center justify-center text-xs">5</span>
              <span>Third-Party Infrastructure & Service Providers</span>
            </h2>
            <p>
              We partner only with industry-standard, compliant infrastructure services:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Google Firebase:</strong> Secure database (Firestore), user authentication, and photo asset storage using Google Cloud data centers with HTTPS/TLS encryption-in-transit and AES-256 encryption-at-rest.
              </li>
              <li>
                <strong>Local Caretaker Coordination:</strong> Only the essential contact details (name and phone) are provided to the designated villa host/caretaker strictly for the purpose of facilitating check-in and managing on-site hospitality.
              </li>
              <li>
                <strong>Statutory Compliance:</strong> We may disclose information only if required by court order, law enforcement investigation, or mandatory guest registration statutes.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-500 flex items-center justify-center text-xs">6</span>
              <span>Cookies & Local Client Storage</span>
            </h2>
            <p>
              Our web application utilizes minimal client-side browser storage strictly for functional application performance:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li><code className="text-emerald-500 font-mono">cascade_theme</code>: Saves your preferred Dark Mode or Light Mode theme.</li>
              <li><code className="text-emerald-500 font-mono">cascade_sidebar_collapsed</code>: Remembers your toggleable sidebar layout preference.</li>
              <li><code className="text-emerald-500 font-mono">firebase:authUser</code>: Maintains secure session state if you log in to track inquiries.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-500 flex items-center justify-center text-xs">7</span>
              <span>Your Data Rights & Grievance Redressal</span>
            </h2>
            <p>
              Under the Digital Personal Data Protection Act, you have the right to inspect, correct, or request the permanent deletion of your inquiry records from our system.
            </p>
            <p>
              To exercise any of these rights, or to submit a privacy grievance, please contact our Data Protection Concierge Officer:
            </p>
            <div className="p-4 rounded-2xl bg-neutral-100/70 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs space-y-1.5">
              <p className="font-bold text-neutral-900 dark:text-white">Grievance & Privacy Officer</p>
              <p>Cascade Villas Concierge Desk</p>
              <p>Lonavala & Mahabaleshwar Operations, Maharashtra, India</p>
              <p>Email: <a href={`mailto:${CONCIERGE_INFO.email}`} className="text-emerald-500 hover:underline font-bold">{CONCIERGE_INFO.email}</a></p>
              <p>Phone: <a href={`tel:${CONCIERGE_INFO.phoneClean}`} className="text-emerald-500 hover:underline font-bold">{CONCIERGE_INFO.phone}</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
