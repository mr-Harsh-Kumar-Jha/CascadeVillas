// src/components/Legal/TermsOfService.jsx
import React from 'react';
import { CONCIERGE_INFO } from '../../utils/constants';

const TermsOfService = ({ onNavigate }) => {
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
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm"
            >
              Terms of Service
            </button>
            <button
              onClick={() => onNavigate('privacy')}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
          </div>
        </div>

        {/* Header Hero Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-neutral-200/80 dark:border-white/10 shadow-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span>⚖️ Legal Agreements & Guest Rules</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-serif">
            Terms & Conditions of Service
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Effective Date: November 2026 • Governing Vacation Villa & Homestay Rentals at Cascade Villas
          </p>
        </div>

        {/* Terms Content Body */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-neutral-200/80 dark:border-white/10 shadow-xl space-y-8 text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center text-xs">1</span>
              <span>Acceptance of Terms</span>
            </h2>
            <p>
              Welcome to <strong>Cascade Villas</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). 
              By browsing our website, submitting an inquiry, or reserving any private villa, pool estate, or homestay listed across Lonavala, Mahabaleshwar, and surrounding regions, you (&ldquo;Guest&rdquo;, &ldquo;Renter&rdquo;, or &ldquo;User&rdquo;) agree to be legally bound by these Terms & Conditions.
            </p>
            <p>
              If you do not agree to these terms, please refrain from using this website or booking our vacation properties.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center text-xs">2</span>
              <span>Reservation, Confirmation & Payment Policy</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Inquiry Submission:</strong> Submitting an initial booking inquiry via our website or WhatsApp is completely complimentary and incurs zero upfront advance payment.
              </li>
              <li>
                <strong>Booking Confirmation:</strong> A reservation is considered confirmed only upon receipt of the agreed initial booking advance deposit and subsequent verification confirmation from our Concierge Desk.
              </li>
              <li>
                <strong>Balance Payment:</strong> The remaining balance of the rental fee must be settled prior to or upon physical check-in at the villa. Keys and property access will only be handed over once the balance is cleared.
              </li>
              <li>
                <strong>Direct Rate Guarantee:</strong> Cascade Villas connects guests directly with property owners and curated inventory with zero platform commissions or hidden markups.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center text-xs">3</span>
              <span>Check-in, Check-out & Mandatory Guest Identification</span>
            </h2>
            <div className="p-4 rounded-2xl bg-neutral-100/70 dark:bg-white/5 border border-neutral-200 dark:border-white/10 space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-white/10">
                <span className="font-bold text-neutral-900 dark:text-white">Standard Check-in Time:</span>
                <span className="text-emerald-500 font-extrabold">1:00 PM IST</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-white/10">
                <span className="font-bold text-neutral-900 dark:text-white">Standard Check-out Time:</span>
                <span className="text-amber-500 font-extrabold">11:00 AM IST</span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 pt-1">
                Early check-in and late check-out requests are subject to villa availability and prior written approval by the concierge desk.
              </p>
            </div>
            <p>
              <strong>Mandatory Government ID Verification:</strong> Under local municipal and Maharashtra Police guest verification regulations (Form-C / Guest Register), every adult staying on the property must present an official Government-issued photo ID (Aadhaar Card, Passport, Voter ID, or Driving License) prior to check-in. PAN cards are not accepted as proof of residence.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center text-xs">4</span>
              <span>Refundable Security Deposit & Damage Liability</span>
            </h2>
            <p>
              A refundable security deposit (amount varies by villa tier, typically ₹3,000 to ₹10,000) is collected at the time of check-in via UPI or cash.
            </p>
            <p>
              This deposit is fully refunded within 2 to 4 hours post check-out, following a standard walkthrough inspection by the villa caretaker. Deductions will apply for damaged furniture, broken glassware, stained upholstery, damaged electronic appliances, or violation of house rules. If damages exceed the deposit amount, the primary booking guest remains personally liable for the full replacement or repair cost.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center text-xs">5</span>
              <span>House Rules, Noise Regulations & Code of Conduct</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Noise Curfew & Music:</strong> As per local Lonavala & Mahabaleshwar administrative rules, outdoor amplified sound and loud music must be stopped or moved indoors by <strong>10:00 PM</strong> to maintain the tranquility of residential and hill station environs.
              </li>
              <li>
                <strong>Swimming Pool Guidelines:</strong> Glass bottles and food are strictly prohibited inside or around the pool perimeter. Appropriate swimwear is mandatory. Children under 14 must be supervised by an adult at all times. Use of pool after midnight is prohibited for safety reasons.
              </li>
              <li>
                <strong>Illegal Substances:</strong> Possession or consumption of banned narcotics and illegal substances is strictly forbidden. Any violation will result in immediate termination of the stay without refund and reporting to local authorities.
              </li>
              <li>
                <strong>Occupancy Limits:</strong> The villa may only be occupied by the exact number of declared guests. Day visitors or extra overnight occupants without prior written concierge approval are not permitted.
              </li>
              <li>
                <strong>Pet Policy:</strong> Pets are allowed only in properties specifically flagged as &ldquo;Pet Friendly&rdquo; and with prior notification.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center text-xs">6</span>
              <span>Cancellation & Rescheduling Policy</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Cancellations 14+ Days Prior:</strong> Full refund of advance payment less nominal 5% administrative bank processing charge.
              </li>
              <li>
                <strong>Cancellations 7 to 13 Days Prior:</strong> 50% refund of advance payment, or 100% credit toward rescheduling within 6 months (subject to seasonal rate differentials).
              </li>
              <li>
                <strong>Cancellations Less than 7 Days Prior / No-Shows:</strong> Advance deposit is non-refundable.
              </li>
              <li>
                <strong>Force Majeure / Monsoon Disruptions:</strong> In case of state-mandated travel bans or landslides affecting primary highway access, 100% of the advance amount will be converted into a stay voucher valid for 12 months.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center text-xs">7</span>
              <span>Limitation of Liability & Infrastructure</span>
            </h2>
            <p>
              While all Cascade Villas feature high-capacity power inverters or diesel generators, hill station utilities in the Western Ghats can occasionally experience power grid fluctuations, brief Wi-Fi disruptions, or heavy rain. Such temporary infrastructural outages beyond reasonable host control shall not constitute grounds for full refund.
            </p>
            <p>
              Cascade Villas and individual property owners are not liable for loss, theft, or damage to personal valuables, jewelry, or cash left unattended on the premises. Guests are advised to keep belongings secured.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center text-xs">8</span>
              <span>Governing Law & Legal Jurisdiction</span>
            </h2>
            <p>
              These Terms & Conditions shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes or claims arising out of villa stays or website usage shall be subject to the exclusive jurisdiction of the competent courts in Pune / Mumbai, Maharashtra.
            </p>
          </section>

          {/* Contact Box */}
          <div className="pt-6 border-t border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-neutral-900 dark:text-white">Have questions regarding our terms?</p>
              <p className="text-xs text-neutral-500">Contact our 24/7 Concierge Support Desk anytime.</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`tel:${CONCIERGE_INFO.phoneClean}`}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 transition-all shadow"
              >
                📞 {CONCIERGE_INFO.phone}
              </a>
              <a
                href={`mailto:${CONCIERGE_INFO.email}`}
                className="px-4 py-2 rounded-xl text-xs font-bold glass-panel border border-neutral-300 dark:border-white/10 text-neutral-800 dark:text-neutral-200 hover:text-emerald-500 transition-all"
              >
                {CONCIERGE_INFO.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
