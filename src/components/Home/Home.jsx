import React from 'react';

const Home = ({ onNavigate }) => {
    return (
        <section id="about" className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Text Content */}
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold text-neutral-800 text-left">
                            About{' '}
                            <strong style={{ fontFamily: 'Grechen Fuemen, cursive', color: '#892b31' }}>
                                Cascade
                            </strong>
                        </h2>
                        <p className="text-lg text-neutral-600 leading-relaxed text-left">
                            At{' '}
                            <strong style={{ fontFamily: 'Grechen Fuemen, cursive', color: '#892b31' }}>
                                Cascade
                            </strong>
                            , we redefine luxury stays by offering exquisite villas for holidays, weddings, and homestays. 
                            Just like Airbnb transforms property buying with seamless transactions, we connect travelers with 
                            their dream getaways—ensuring transparency, comfort, and unforgettable experiences.
                        </p>

                        {/* Statistics Grid */}
                        <div className="grid grid-cols-2 gap-6 mt-8">
                            <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
                                <div className="text-3xl font-bold text-neutral-800 mb-2">1000+</div>
                                <div className="text-neutral-600">Properties Listed</div>
                            </div>
                            <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
                                <div className="text-3xl font-bold text-neutral-800 mb-2">500+</div>
                                <div className="text-neutral-600">Happy Clients</div>
                            </div>
                            <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
                                <div className="text-3xl font-bold text-neutral-800 mb-2">50+</div>
                                <div className="text-neutral-600">Cities Covered</div>
                            </div>
                            <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
                                <div className="text-3xl font-bold text-neutral-800 mb-2">24/7</div>
                                <div className="text-neutral-600">Support Available</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Why Choose Us */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-lg border border-neutral-200 shadow-sm">
                            <h3 className="text-2xl font-bold text-neutral-800 mb-6">Why Choose Us?</h3>
                            <div className="space-y-6">
                                {/* Feature 1 */}
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center text-white">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-neutral-800 text-left mb-2">
                                            Direct Price Quotes
                                        </h4>
                                        <p className="text-neutral-600 text-left">
                                            Get instant price quotes and negotiate directly with property owners.
                                        </p>
                                    </div>
                                </div>

                                {/* Feature 2 */}
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center text-white">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-neutral-800 text-left mb-2">
                                            Secure Transactions
                                        </h4>
                                        <p className="text-neutral-600 text-left">
                                            Our platform ensures safe and secure property transactions.
                                        </p>
                                    </div>
                                </div>

                                {/* Feature 3 */}
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center text-white">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-neutral-800 text-left mb-2">
                                            Verified Properties
                                        </h4>
                                        <p className="text-neutral-600 text-left">
                                            All listed properties are verified and authenticated.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard CTA Section */}
                {onNavigate && (
                    <div className="mt-16 bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-2xl p-8 md:p-12 text-center">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Already Made an Enquiry?
                        </h3>
                        <p className="text-neutral-300 mb-6 max-w-xl mx-auto">
                            Track the status of your villa enquiries and stay updated with our team's response
                        </p>
                        <button
                            onClick={() => onNavigate('dashboard')}
                            className="inline-block px-8 py-3 bg-white text-neutral-900 rounded-lg font-semibold hover:bg-neutral-100 transition-colors"
                        >
                            Track My Enquiries
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Home;