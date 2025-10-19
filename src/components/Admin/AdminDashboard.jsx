// src/components/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getCurrentUser, logOut } from '../../firebase/authService';
import { formatDateTime, formatDate } from '../../utils/helpers';
import { STATUS_COLORS } from '../../utils/constants';
import Loading from '../Common/Loading';

const AdminDashboard = ({ onLogout }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    villaName: 'all'
  });
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    console.log('Admin - Current user:', currentUser); // Debug
    setUser(currentUser);
    loadAllEnquiries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, enquiries]);

  const loadAllEnquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading all enquiries...'); // Debug
      
      const enquiriesRef = collection(db, 'enquiries');
      const q = query(enquiriesRef);
      const snapshot = await getDocs(q);
      
      console.log('Admin - Found documents:', snapshot.size); // Debug
      
      const data = snapshot.docs.map(doc => {
        const docData = doc.data();
        return {
          id: doc.id,
          ...docData,
          createdAt: docData.createdAt?.toDate ? docData.createdAt.toDate() : new Date()
        };
      });
      
      // Sort by date descending
      data.sort((a, b) => b.createdAt - a.createdAt);
      
      console.log('Admin - Processed enquiries:', data); // Debug
      setEnquiries(data);
      setFilteredEnquiries(data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      setError('Failed to load enquiries: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...enquiries];

    // Search filter (name, email, phone, villa name)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(enq => 
        enq.userName?.toLowerCase().includes(searchLower) ||
        enq.email?.toLowerCase().includes(searchLower) ||
        enq.phone?.includes(searchLower) ||
        enq.villaName?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(enq => enq.status === filters.status);
    }

    // Villa filter
    if (filters.villaName !== 'all') {
      filtered = filtered.filter(enq => enq.villaName === filters.villaName);
    }

    setFilteredEnquiries(filtered);
  };

  const updateEnquiryStatus = async (enquiryId, newStatus) => {
    try {
      setUpdating(true);
      const enquiryRef = doc(db, 'enquiries', enquiryId);
      await updateDoc(enquiryRef, {
        status: newStatus,
        updatedAt: new Date()
      });

      // Update local state
      setEnquiries(prev => prev.map(enq => 
        enq.id === enquiryId ? { ...enq, status: newStatus } : enq
      ));

      alert(`Enquiry status updated to ${newStatus}`);
      setSelectedEnquiry(null);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status: ' + error.message);
    } finally {
      setUpdating(false);
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

  const getUniqueVillas = () => {
    const villas = [...new Set(enquiries.map(enq => enq.villaName))].filter(Boolean);
    return villas.sort();
  };

  const getStats = () => {
    return {
      total: enquiries.length,
      pending: enquiries.filter(e => e.status === 'pending').length,
      contacted: enquiries.filter(e => e.status === 'contacted').length,
      confirmed: enquiries.filter(e => e.status === 'confirmed').length,
      cancelled: enquiries.filter(e => e.status === 'cancelled').length,
      whatsapp: enquiries.filter(e => e.source === 'whatsapp').length,
      website: enquiries.filter(e => e.source === 'website' || !e.source).length
    };
  };

  if (loading) {
    return <Loading fullScreen text="Loading admin dashboard..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadAllEnquiries}
            className="px-6 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <section className="py-8 min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-neutral-800 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-neutral-600">
              Manage all villa enquiries
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-neutral-200">
            <p className="text-neutral-600 text-sm mb-1">Total</p>
            <p className="text-2xl font-bold text-neutral-800">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-yellow-700 text-sm mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-blue-700 text-sm mb-1">Contacted</p>
            <p className="text-2xl font-bold text-blue-700">{stats.contacted}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-green-700 text-sm mb-1">Confirmed</p>
            <p className="text-2xl font-bold text-green-700">{stats.confirmed}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <p className="text-red-700 text-sm mb-1">Cancelled</p>
            <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-green-700 text-sm mb-1">WhatsApp</p>
            <p className="text-2xl font-bold text-green-700">{stats.whatsapp}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-blue-700 text-sm mb-1">Website</p>
            <p className="text-2xl font-bold text-blue-700">{stats.website}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 mb-6 border border-neutral-200">
          <h3 className="text-lg font-bold text-neutral-800 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Search (Name, Email, Phone, Villa)
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search enquiries..."
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Villa Filter */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Villa
              </label>
              <select
                value={filters.villaName}
                onChange={(e) => setFilters(prev => ({ ...prev, villaName: e.target.value }))}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
              >
                <option value="all">All Villas</option>
                {getUniqueVillas().map((villa) => (
                  <option key={villa} value={villa}>{villa}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Enquiries Table */}
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase">Villa</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-neutral-600">
                      {filters.search || filters.status !== 'all' || filters.villaName !== 'all' 
                        ? 'No enquiries match your filters'
                        : 'No enquiries found'}
                    </td>
                  </tr>
                ) : (
                  filteredEnquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-neutral-800">{enquiry.userName || 'N/A'}</p>
                          <p className="text-sm text-neutral-600">{enquiry.email || 'N/A'}</p>
                          <p className="text-sm text-neutral-600">{enquiry.phone || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-neutral-800">{enquiry.villaName || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">
                        {enquiry.checkInDate ? (
                          <>
                            <p>{formatDate(new Date(enquiry.checkInDate))}</p>
                            {enquiry.checkOutDate && (
                              <p>to {formatDate(new Date(enquiry.checkOutDate))}</p>
                            )}
                          </>
                        ) : (
                          <span className="text-neutral-400">No dates</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          enquiry.source === 'whatsapp' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {enquiry.source || 'website'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[enquiry.status] || STATUS_COLORS.pending} capitalize`}>
                          {enquiry.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">
                        {formatDateTime(enquiry.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="text-neutral-600 hover:text-neutral-800 font-medium text-sm"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enquiry Detail Modal */}
        {selectedEnquiry && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-neutral-800">Manage Enquiry</h3>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="p-2 hover:bg-neutral-100 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">Customer Information</h4>
                  <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedEnquiry.userName || 'N/A'}</p>
                    <p><span className="font-medium">Email:</span> {selectedEnquiry.email || 'N/A'}</p>
                    <p><span className="font-medium">Phone:</span> {selectedEnquiry.phone || 'N/A'}</p>
                  </div>
                </div>

                {/* Villa Info */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">Villa Details</h4>
                  <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
                    <p><span className="font-medium">Villa:</span> {selectedEnquiry.villaName || 'N/A'}</p>
                    {selectedEnquiry.checkInDate && (
                      <p><span className="font-medium">Check-in:</span> {formatDate(new Date(selectedEnquiry.checkInDate))}</p>
                    )}
                    {selectedEnquiry.checkOutDate && (
                      <p><span className="font-medium">Check-out:</span> {formatDate(new Date(selectedEnquiry.checkOutDate))}</p>
                    )}
                    {selectedEnquiry.numberOfGuests && (
                      <p><span className="font-medium">Guests:</span> {selectedEnquiry.numberOfGuests}</p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">Message</h4>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <p className="text-neutral-700">{selectedEnquiry.message || 'No message provided'}</p>
                  </div>
                </div>

                {/* Update Status */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">Update Status</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => updateEnquiryStatus(selectedEnquiry.id, 'pending')}
                      disabled={updating || selectedEnquiry.status === 'pending'}
                      className="px-4 py-3 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      Mark Pending
                    </button>
                    <button
                      onClick={() => updateEnquiryStatus(selectedEnquiry.id, 'contacted')}
                      disabled={updating || selectedEnquiry.status === 'contacted'}
                      className="px-4 py-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      Mark Contacted
                    </button>
                    <button
                      onClick={() => updateEnquiryStatus(selectedEnquiry.id, 'confirmed')}
                      disabled={updating || selectedEnquiry.status === 'confirmed'}
                      className="px-4 py-3 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      Mark Confirmed
                    </button>
                    <button
                      onClick={() => updateEnquiryStatus(selectedEnquiry.id, 'cancelled')}
                      disabled={updating || selectedEnquiry.status === 'cancelled'}
                      className="px-4 py-3 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      Mark Cancelled
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminDashboard;