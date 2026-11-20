// src/components/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getCurrentUser, logOut } from '../../firebase/authService';
import { formatDateTime, formatDate } from '../../utils/helpers';
import { STATUS_COLORS } from '../../utils/constants';
import Loading from '../Common/Loading';
import AdminVillaManagement from './AdminVillaManagement';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('villas'); // Default to villas as requested for photo listing
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
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
    } else {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    applyFilters();
  }, [filters, enquiries]);

  const loadAllEnquiries = async () => {
    try {
      setLoading(true);
      
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
      
      data.sort((a, b) => b.createdAt - a.createdAt);
      setEnquiries(data);
      setFilteredEnquiries(data);
    } catch (err) {
      console.error('Error fetching enquiries:', err);
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
        updatedAt: Timestamp.now()
      });
      
      setEnquiries(prev => prev.map(enq => 
        enq.id === enquiryId ? { ...enq, status: newStatus } : enq
      ));
      
      setSelectedEnquiry(null);
      await loadAllEnquiries();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      if (onLogout) onLogout();
    } catch (err) {
      console.error('Logout error:', err);
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
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Glass Header Bar */}
        <div className="glass-panel rounded-3xl p-6 border border-neutral-200/80 dark:border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-500 border border-rose-500/30">
                Admin Console
              </span>
              <span className="text-xs text-neutral-500">
                Cascade Villas Management
              </span>
            </div>
            <h1 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
              Cascade Villas Executive Hub
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Logged in as <span className="font-semibold text-neutral-800 dark:text-neutral-200">{user?.email}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-neutral-200/80 dark:bg-white/10 hover:bg-rose-500/10 hover:text-rose-500 dark:hover:bg-rose-500/20 text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex space-x-2 p-1.5 rounded-2xl glass-panel border border-neutral-200 dark:border-white/10 w-fit">
          <button
            onClick={() => setActiveTab('villas')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
              activeTab === 'villas'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-md scale-[1.02]'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <span>🏡 Villa Listings & Server Uploads</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
              activeTab === 'enquiries'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-md scale-[1.02]'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <span>📬 Guest Enquiries</span>
            {stats.pending > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-neutral-950">
                {stats.pending}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'villas' ? (
          <AdminVillaManagement />
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <div className="glass-card rounded-2xl p-4 border border-neutral-200/70 dark:border-white/10">
                <span className="text-[11px] font-semibold text-neutral-500 uppercase">Total Enquiries</span>
                <p className="text-2xl font-black text-neutral-900 dark:text-white mt-1">{stats.total}</p>
              </div>
              <div className="glass-card rounded-2xl p-4 border border-amber-500/20 bg-amber-500/5">
                <span className="text-[11px] font-semibold text-amber-500 uppercase">Pending</span>
                <p className="text-2xl font-black text-amber-500 mt-1">{stats.pending}</p>
              </div>
              <div className="glass-card rounded-2xl p-4 border border-sky-500/20 bg-sky-500/5">
                <span className="text-[11px] font-semibold text-sky-500 uppercase">Contacted</span>
                <p className="text-2xl font-black text-sky-500 mt-1">{stats.contacted}</p>
              </div>
              <div className="glass-card rounded-2xl p-4 border border-emerald-500/20 bg-emerald-500/5">
                <span className="text-[11px] font-semibold text-emerald-500 uppercase">Confirmed</span>
                <p className="text-2xl font-black text-emerald-500 mt-1">{stats.confirmed}</p>
              </div>
              <div className="glass-card rounded-2xl p-4 border border-rose-500/20 bg-rose-500/5">
                <span className="text-[11px] font-semibold text-rose-500 uppercase">Cancelled</span>
                <p className="text-2xl font-black text-rose-500 mt-1">{stats.cancelled}</p>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="glass-card rounded-2xl p-5 border border-neutral-200 dark:border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1">
                    Search Guest / Villa
                  </label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    placeholder="Search by name, email, phone..."
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1">
                    Filter Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs bg-neutral-100 dark:bg-neutral-900"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1">
                    Filter Property
                  </label>
                  <select
                    value={filters.villaName}
                    onChange={(e) => setFilters(prev => ({ ...prev, villaName: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs bg-neutral-100 dark:bg-neutral-900"
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
            <div className="glass-card rounded-3xl border border-neutral-200 dark:border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-100/70 dark:bg-white/5 border-b border-neutral-200 dark:border-white/10 uppercase font-black text-neutral-500">
                    <tr>
                      <th className="px-6 py-4">Guest Details</th>
                      <th className="px-6 py-4">Villa</th>
                      <th className="px-6 py-4">Dates</th>
                      <th className="px-6 py-4">Source</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Created</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200/60 dark:divide-white/5 font-medium">
                    {filteredEnquiries.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-neutral-500">
                          No enquiries found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredEnquiries.map((enquiry) => (
                        <tr key={enquiry.id} className="hover:bg-neutral-100/50 dark:hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-neutral-900 dark:text-white">{enquiry.userName}</div>
                            <div className="text-neutral-500">{enquiry.email}</div>
                            <div className="text-emerald-500 font-semibold">{enquiry.phone}</div>
                          </td>
                          <td className="px-6 py-4 font-bold text-neutral-800 dark:text-neutral-200">
                            {enquiry.villaName}
                          </td>
                          <td className="px-6 py-4 text-neutral-600 dark:text-neutral-300">
                            {enquiry.checkInDate ? (
                              <div>
                                <span>{formatDate(enquiry.checkInDate)}</span>
                                <span className="text-neutral-400 mx-1">→</span>
                                <span>{formatDate(enquiry.checkOutDate)}</span>
                              </div>
                            ) : (
                              'Dates on request'
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              enquiry.source === 'whatsapp' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-sky-500/15 text-sky-500'
                            }`}>
                              {enquiry.source || 'Website'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${STATUS_COLORS[enquiry.status] || STATUS_COLORS.pending} capitalize`}>
                              {enquiry.status || 'pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-neutral-500">
                            {formatDateTime(enquiry.createdAt)}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setSelectedEnquiry(enquiry)}
                              className="px-3 py-1.5 rounded-lg bg-neutral-200 dark:bg-white/10 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 font-bold transition-all"
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

            {/* Manage Enquiry Modal */}
            {selectedEnquiry && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="glass-panel bg-neutral-950 text-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/15 p-6 shadow-2xl">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                    <h3 className="text-xl font-bold">Manage Guest Enquiry</h3>
                    <button
                      onClick={() => setSelectedEnquiry(null)}
                      className="p-1.5 text-neutral-400 hover:text-white rounded-lg bg-white/5"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-xl bg-white/5 space-y-1.5">
                      <p><span className="text-neutral-400">Guest:</span> <strong className="text-white">{selectedEnquiry.userName}</strong></p>
                      <p><span className="text-neutral-400">Email:</span> <a href={`mailto:${selectedEnquiry.email}`} className="text-sky-400 hover:underline">{selectedEnquiry.email}</a></p>
                      <p><span className="text-neutral-400">Phone:</span> <a href={`tel:${selectedEnquiry.phone}`} className="text-emerald-400 hover:underline">{selectedEnquiry.phone}</a></p>
                      <p><span className="text-neutral-400">Villa:</span> <strong className="text-white">{selectedEnquiry.villaName}</strong></p>
                      {selectedEnquiry.checkInDate && (
                        <p><span className="text-neutral-400">Requested Dates:</span> {formatDate(selectedEnquiry.checkInDate)} to {formatDate(selectedEnquiry.checkOutDate)}</p>
                      )}
                      {selectedEnquiry.message && (
                        <p className="pt-2 text-neutral-300 italic border-t border-white/10">&quot;{selectedEnquiry.message}&quot;</p>
                      )}
                    </div>

                    <div>
                      <span className="block text-xs font-bold uppercase text-neutral-300 mb-2">Change Status</span>
                      <div className="grid grid-cols-2 gap-2">
                        {['pending', 'contacted', 'confirmed', 'cancelled'].map((st) => (
                          <button
                            key={st}
                            onClick={() => updateEnquiryStatus(selectedEnquiry.id, st)}
                            disabled={updating || selectedEnquiry.status === st}
                            className={`py-2 px-3 rounded-xl font-bold capitalize transition-all ${
                              selectedEnquiry.status === st
                                ? 'bg-emerald-500 text-neutral-950 shadow'
                                : 'bg-white/10 hover:bg-white/20 text-neutral-300'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
