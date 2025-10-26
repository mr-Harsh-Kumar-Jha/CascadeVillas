// src/components/Admin/AdminDashboard.jsx - FIXED WITH TABS
import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getCurrentUser, logOut } from '../../firebase/authService';
import { formatDateTime, formatDate } from '../../utils/helpers';
import { STATUS_COLORS } from '../../utils/constants';
import Loading from '../Common/Loading';
import AdminVillaManagement from './AdminVillaManagement'; // ✅ ADDED: Import VillaManagement

const AdminDashboard = ({ onLogout }) => {
  // ✅ ADDED: Tab state
  const [activeTab, setActiveTab] = useState('enquiries'); // 'enquiries' or 'villas'
  
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
    setUser(currentUser);
    if (activeTab === 'enquiries') {
      loadAllEnquiries();
    }
  }, [activeTab]);

  useEffect(() => {
    applyFilters();
  }, [filters, enquiries]);

  const loadAllEnquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const enquiriesRef = collection(db, 'enquiries');
      const q = query(enquiriesRef);
      const snapshot = await getDocs(q);
      
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

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(enq => 
        enq.userName?.toLowerCase().includes(searchLower) ||
        enq.email?.toLowerCase().includes(searchLower) ||
        enq.phone?.includes(searchLower) ||
        enq.villaName?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(enq => enq.status === filters.status);
    }

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
      
      setEnquiries(prev => prev.map(enq => 
        enq.id === enquiryId ? { ...enq, status: newStatus } : enq
      ));
      
      setSelectedEnquiry(null);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      if (onLogout) onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUniqueVillaNames = () => {
    const names = enquiries.map(enq => enq.villaName).filter(Boolean);
    return [...new Set(names)];
  };

  const stats = {
    total: enquiries.length,
    pending: enquiries.filter(e => e.status === 'pending').length,
    contacted: enquiries.filter(e => e.status === 'contacted').length,
    confirmed: enquiries.filter(e => e.status === 'confirmed').length,
    cancelled: enquiries.filter(e => e.status === 'cancelled').length,
  };

  if (loading && activeTab === 'enquiries') {
    return <Loading fullScreen text="Loading admin dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-neutral-800">Admin Dashboard</h1>
              {user && (
                <p className="text-sm text-neutral-600">{user.email}</p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-neutral-700 hover:text-neutral-900 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* ✅ ADDED: Tab Navigation */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('enquiries')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'enquiries'
                  ? 'border-neutral-800 text-neutral-800'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              Enquiries
              {stats.total > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-neutral-200 text-neutral-700 rounded-full text-xs">
                  {stats.total}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('villas')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'villas'
                  ? 'border-neutral-800 text-neutral-800'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              Villa Management
            </button>
          </div>
        </div>
      </div>

      {/* ✅ ADDED: Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'enquiries' ? (
          /* ENQUIRIES TAB CONTENT */
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white rounded-lg p-6 border border-neutral-200">
                <p className="text-sm text-neutral-600 mb-1">Total</p>
                <p className="text-3xl font-bold text-neutral-800">{stats.total}</p>
              </div>
              <div className="bg-white rounded-lg p-6 border border-neutral-200">
                <p className="text-sm text-neutral-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="bg-white rounded-lg p-6 border border-neutral-200">
                <p className="text-sm text-neutral-600 mb-1">Contacted</p>
                <p className="text-3xl font-bold text-blue-600">{stats.contacted}</p>
              </div>
              <div className="bg-white rounded-lg p-6 border border-neutral-200">
                <p className="text-sm text-neutral-600 mb-1">Confirmed</p>
                <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <div className="bg-white rounded-lg p-6 border border-neutral-200">
                <p className="text-sm text-neutral-600 mb-1">Cancelled</p>
                <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg p-6 mb-6 border border-neutral-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    placeholder="Name, email, phone, villa..."
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Villa
                  </label>
                  <select
                    value={filters.villaName}
                    onChange={(e) => setFilters(prev => ({ ...prev, villaName: e.target.value }))}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
                  >
                    <option value="all">All Villas</option>
                    {getUniqueVillaNames().map(name => (
                      <option key={name} value={name}>{name}</option>
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
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Villa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {filteredEnquiries.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center text-neutral-500">
                          {filters.search || filters.status !== 'all' || filters.villaName !== 'all'
                            ? 'No enquiries match your filters'
                            : 'No enquiries yet'}
                        </td>
                      </tr>
                    ) : (
                      filteredEnquiries.map((enquiry) => (
                        <tr key={enquiry.id} className="hover:bg-neutral-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-neutral-800">
                              {enquiry.userName}
                            </div>
                            <div className="text-sm text-neutral-600">
                              {enquiry.email}
                            </div>
                            <div className="text-sm text-neutral-600">
                              {enquiry.phone}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-800">
                            {enquiry.villaName}
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-600">
                            {enquiry.checkInDate ? (
                              <>
                                <div>{formatDate(enquiry.checkInDate)}</div>
                                <div>to</div>
                                <div>{formatDate(enquiry.checkOutDate)}</div>
                              </>
                            ) : (
                              'Not specified'
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              enquiry.source === 'whatsapp' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
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
                    <h3 className="text-2xl font-bold text-neutral-800">
                      Enquiry Details
                    </h3>
                    <button
                      onClick={() => setSelectedEnquiry(null)}
                      className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-700 mb-2">Customer Information</h4>
                      <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
                        <p className="text-sm"><span className="font-medium">Name:</span> {selectedEnquiry.userName}</p>
                        <p className="text-sm"><span className="font-medium">Email:</span> {selectedEnquiry.email}</p>
                        <p className="text-sm"><span className="font-medium">Phone:</span> {selectedEnquiry.phone}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-neutral-700 mb-2">Booking Details</h4>
                      <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
                        <p className="text-sm"><span className="font-medium">Villa:</span> {selectedEnquiry.villaName}</p>
                        {selectedEnquiry.checkInDate && (
                          <>
                            <p className="text-sm"><span className="font-medium">Check-in:</span> {formatDate(selectedEnquiry.checkInDate)}</p>
                            <p className="text-sm"><span className="font-medium">Check-out:</span> {formatDate(selectedEnquiry.checkOutDate)}</p>
                          </>
                        )}
                        {selectedEnquiry.numberOfGuests && (
                          <p className="text-sm"><span className="font-medium">Guests:</span> {selectedEnquiry.numberOfGuests}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-neutral-700 mb-2">Message</h4>
                      <div className="bg-neutral-50 rounded-lg p-4">
                        <p className="text-sm text-neutral-700">{selectedEnquiry.message}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-neutral-700 mb-2">Update Status</h4>
                      <div className="flex flex-wrap gap-2">
                        {['pending', 'contacted', 'confirmed', 'cancelled'].map((status) => (
                          <button
                            key={status}
                            onClick={() => updateEnquiryStatus(selectedEnquiry.id, status)}
                            disabled={updating || selectedEnquiry.status === status}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                              selectedEnquiry.status === status
                                ? 'bg-neutral-800 text-white cursor-not-allowed'
                                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                            }`}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* ✅ VILLA MANAGEMENT TAB CONTENT */
          <AdminVillaManagement />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;