// src/components/Dashboard/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getCurrentUser, logOut } from '../../firebase/authService';
import EnquiryCard from './EnquiryCard';
import Loading from '../Common/Loading';

const UserDashboard = ({ onLogout }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    console.log('Current user:', currentUser); // Debug log
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
      
      console.log('Loading enquiries for email:', email); // Debug log
      
      const enquiriesRef = collection(db, 'enquiries');
      const q = query(
        enquiriesRef,
        where('email', '==', email.toLowerCase())
      );
      
      const snapshot = await getDocs(q);
      console.log('Found documents:', snapshot.size); // Debug log
      
      const data = snapshot.docs.map(doc => {
        const docData = doc.data();
        console.log('Document data:', docData); // Debug log
        return {
          id: doc.id,
          ...docData,
          createdAt: docData.createdAt?.toDate ? docData.createdAt.toDate() : new Date()
        };
      });
      
      console.log('Processed enquiries:', data); // Debug log
      setEnquiries(data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      setError('Failed to load enquiries: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      onLogout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600 mb-4">Please login to view your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <section id="dashboard" className="py-16 min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-neutral-800 mb-2">
              My Dashboard
            </h1>
            <p className="text-neutral-600">
              Welcome back, <span className="font-semibold">{user.displayName || user.email}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors font-medium flex items-center gap-2 w-fit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm mb-1">Total Enquiries</p>
                <p className="text-3xl font-bold text-neutral-800">{enquiries.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {enquiries.filter(e => e.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm mb-1">Confirmed</p>
                <p className="text-3xl font-bold text-green-600">
                  {enquiries.filter(e => e.status === 'confirmed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Enquiries List */}
        {enquiries.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border border-neutral-200">
            <svg className="w-24 h-24 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">No Enquiries Yet</h3>
            <p className="text-neutral-600 mb-6">Start exploring our villas and make your first enquiry!</p>
            <button
              onClick={() => window.location.hash = '#properties'}
              className="px-6 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors font-medium"
            >
              Browse Villas
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-neutral-800 mb-6">
              Your Enquiries
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enquiries.map((enquiry) => (
                <EnquiryCard key={enquiry.id} enquiry={enquiry} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserDashboard;