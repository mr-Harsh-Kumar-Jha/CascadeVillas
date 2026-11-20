// src/components/Dashboard/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getCurrentUser, logOut } from '../../firebase/authService';
import { cancelEnquiry } from '../../firebase/bookingService';
import EnquiryCard from './EnquiryCard';
import Loading from '../Common/Loading';

const UserDashboard = ({ onLogout }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadUserEnquiries(currentUser.email);
    } else {
      setLoading(false);
      setError('Please login to view your enquiries');
    }
  }, []);

  const loadUserEnquiries = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      const enquiriesRef = collection(db, 'enquiries');
      const q = query(
        enquiriesRef,
        where('email', '==', email.toLowerCase())
      );
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => {
        const docData = doc.data();
        return {
          id: doc.id,
          ...docData,
          createdAt: docData.createdAt?.toDate ? docData.createdAt.toDate() : new Date()
        };
      });
      
      data.sort((a, b) => b.createdAt - a.createdAt);
      setEnquiries(data);
    } catch (err) {
      console.error('Error fetching enquiries:', err);
      setError('Failed to load enquiries: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEnquiry = async (enquiryId) => {
    if (!window.confirm('Are you sure you want to cancel this enquiry?')) {
      return;
    }

    try {
      await cancelEnquiry(enquiryId);
      if (user) {
        await loadUserEnquiries(user.email);
      }
    } catch (err) {
      console.error('Error cancelling enquiry:', err);
      alert('Failed to cancel enquiry. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      onLogout();
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Loading text="Loading your guest dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-8 max-w-md text-center border border-neutral-200 dark:border-white/10 shadow-xl">
          <p className="text-sm font-semibold text-rose-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold text-xs rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <section id="dashboard" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 min-h-screen pb-28 lg:pb-16">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Verified Guest Hub
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              My Stay Inquiries
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Welcome back, <strong className="text-neutral-800 dark:text-neutral-200">{user?.displayName || user?.email}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-neutral-200/80 dark:bg-white/10 hover:bg-rose-500/10 hover:text-rose-500 text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-neutral-200/80 dark:border-white/10">
            <span className="text-xs font-semibold text-neutral-500 uppercase">Total Inquiries</span>
            <p className="text-3xl font-black text-neutral-900 dark:text-white mt-1">{enquiries.length}</p>
          </div>
          <div className="glass-card rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5">
            <span className="text-xs font-semibold text-amber-500 uppercase">Under Review</span>
            <p className="text-3xl font-black text-amber-500 mt-1">
              {enquiries.filter(e => e.status === 'pending').length}
            </p>
          </div>
          <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 bg-emerald-500/5">
            <span className="text-xs font-semibold text-emerald-500 uppercase">Confirmed Dates</span>
            <p className="text-3xl font-black text-emerald-500 mt-1">
              {enquiries.filter(e => e.status === 'confirmed').length}
            </p>
          </div>
        </div>

        {/* List of Inquiries */}
        {enquiries.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center border border-neutral-200 dark:border-white/10 shadow-lg">
            <span className="text-4xl block mb-3">📬</span>
            <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mb-1">
              No Inquiries Submitted Yet
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
              Explore our luxury villas in Lonavala & Mahabaleshwar and submit your holiday dates!
            </p>
            <a
              href="#properties"
              className="inline-block px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 text-neutral-950 shadow-md"
            >
              Explore Villas
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enquiries.map((enquiry) => (
              <EnquiryCard 
                key={enquiry.id} 
                enquiry={enquiry} 
                onCancel={handleCancelEnquiry}
                showCancelButton={true}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default UserDashboard;
