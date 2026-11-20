// src/components/Home/Home.jsx
import React from 'react';

const Home = ({ onNavigate }) => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Brand Story & Philosophy */}
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-rose-300 border border-brand-500/20">
              <span>✦</span>
              <span>The Cascade Villas Distinction</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
              Curated Luxury Living, <br />
              <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
                Zero Middlemen.
              </span>
            </h2>

            <p className="text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              At <strong>Cascade Villas</strong>, we believe your holiday retreat should be seamless and unforgettable. 
              Our private villa collection spans handpicked estates across Lonavala and Mahabaleshwar.
            </p>

            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Whether celebrating intimate weddings, family reunions, or a weekend escape, we offer direct transparent pricing, verified amenities, and round-the-clock concierge hospitality.
            </p>

            {/* Statistics Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="glass-card rounded-2xl p-4 text-center border border-neutral-200/80 dark:border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white mb-0.5">50+</div>
                <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Curated Villas</div>
              </div>
              <div className="glass-card rounded-2xl p-4 text-center border border-neutral-200/80 dark:border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-emerald-500 mb-0.5">500+</div>
                <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Happy Guests</div>
              </div>
              <div className="glass-card rounded-2xl p-4 text-center border border-neutral-200/80 dark:border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-sky-500 mb-0.5">24/7</div>
                <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Host Support</div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('properties')}
                className="px-6 py-3 rounded-xl font-bold text-sm bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:scale-105 transition-all shadow-lg"
              >
                Browse All Properties →
              </button>
            </div>
          </div>

          {/* Right Column: Why Choose Us Glass Cards */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-white/10 shadow-2xl space-y-6">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              Why Guests Trust Cascade Villas
            </h3>

            <div className="space-y-4">
              {/* Feature 1 */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-100/60 dark:bg-white/5 border border-neutral-200/60 dark:border-white/5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 text-lg">
                  💎
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
                    Direct Best-Rate Guarantee
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    No hidden OTA commissions or inflated platform markups. Deal directly with property owners and our concierge.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-100/60 dark:bg-white/5 border border-neutral-200/60 dark:border-white/5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center shrink-0 text-lg">
                  🛡️
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
                    Personally Verified Listings
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Every pool, bedroom, kitchen, and lawn is physically inspected to guarantee hygiene and privacy.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-100/60 dark:bg-white/5 border border-neutral-200/60 dark:border-white/5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center shrink-0 text-lg">
                  🛎️
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
                    Dedicated Holiday Concierge
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    From chef arrangements to barbecue night and birthday decorations, our on-ground team takes care of every detail.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
