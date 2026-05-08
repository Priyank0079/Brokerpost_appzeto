import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, Phone, MessageSquare, Edit2, Ban, Trash2, Plus, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../broker/services/api';

const Brokers = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brokers, setBrokers] = useState([]);
  const [stats, setStats] = useState([
    { label: 'Total Brokers', value: '0' },
    { label: 'Pending', value: '0' },
    { label: 'Verified', value: '0' },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBroker, setEditingBroker] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    phone: '',
    email: '',
    password: '',
    city: '',
    address: '',
    role: 'Broker',
    listingLimit: '25',
    status: 'Active',
    groupAssignment: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (broker) => {
    setEditingBroker(broker);
    setFormData({
      fullName: broker.name,
      company: broker.firm,
      phone: broker.phone,
      email: broker.email,
      password: '', // Hidden in edit usually
      city: broker.city,
      address: 'H.No. 2322 Sushant Lok-2', // Mock address
      role: 'Broker',
      listingLimit: broker.listings.split('/')[1] || '25',
      status: broker.status,
      groupAssignment: broker.groups || []
    });
    setIsEditModalOpen(true);
  };

  const fetchBrokers = async () => {
    try {
      const response = await api.get('/auth/brokers');
      if (response.success) {
        setBrokers(response.data);
      }
    } catch (err) {
      console.error('Error fetching brokers:', err);
      setError('Failed to load brokers');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/auth/stats');
      if (response.success) {
        setStats([
          { label: 'Total Brokers', value: response.data.totalBrokers || 0 },
          { label: 'Pending', value: response.data.pendingBrokers || 0 },
          { label: 'Verified', value: response.data.verifiedBrokers || 0 },
        ]);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchBrokers(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this broker?')) {
      try {
        const response = await api.delete(`/auth/brokers/${id}`);
        if (response.success) {
          setBrokers(prev => prev.filter(b => b._id !== id));
          fetchStats();
        }
      } catch (err) {
        alert('Failed to delete broker');
      }
    }
  };

  const toggleStatus = async (broker) => {
    try {
      const response = await api.patch(`/auth/brokers/${broker._id}/status`, {
        isVerified: !broker.isVerified
      });
      if (response.success) {
        setBrokers(prev => prev.map(b => b._id === broker._id ? { ...b, isVerified: !broker.isVerified } : b));
        fetchStats();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="-mx-4 md:-mx-6 lg:-mx-10 -my-4 md:-my-6 lg:-my-10 px-4 md:px-6 lg:px-10 py-4 md:py-6 lg:py-10 bg-[#faf9f6] min-h-screen">
      <div className="space-y-6 md:space-y-8 pb-10">
        {/* Custom Header */}
        <div className="-mx-4 md:-mx-6 lg:-mx-10 -mt-4 md:-mt-6 lg:-mt-10 mb-4 px-4 md:px-6 lg:px-10 py-3 md:py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 md:gap-6">
            <h1 className="text-base md:text-lg font-serif text-black">Manage Brokers</h1>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3b82f6]" size={14} />
              <input 
                type="text" 
                placeholder="Search listings..."
                className="w-[180px] lg:w-[240px] pl-9 pr-4 py-1.5 bg-[#fefce8] border border-slate-200 rounded-lg text-[11px] font-medium outline-none focus:border-[#eab308]/40 transition-all text-slate-600"
              />
            </div>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="px-3 md:px-4 py-1.5 rounded-full border border-slate-200 text-black text-[10px] md:text-[11px] font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shrink-0"
          >
            <ArrowLeft size={14} /> 
            <span className="hidden xs:inline">Public Site</span>
          </button>
        </div>

        {/* Action Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 px-2 md:px-0">
          <button 
            onClick={() => {
              setEditingBroker(null);
              setFormData({
                fullName: '', company: '', phone: '', email: '', password: '', city: '', address: '', role: 'Broker', listingLimit: '25'
              });
              setIsAddModalOpen(true);
            }}
            className="w-full sm:w-auto bg-[#c0922e] text-white px-5 py-2.5 sm:py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-2 hover:bg-[#a67d26] transition-all shadow-lg shadow-[#c0922e]/20"
          >
            <Plus size={14} /> Add Broker
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 px-2 md:px-0">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-xl md:text-3xl font-serif text-black">{stat.value}</span>
              <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 md:mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-8">#</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[22%]">BROKER DETAILS</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[10%]">CITY</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[12%]">CONTACT</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-16">ROLE</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[12%]">LISTINGS</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[12%]">GROUPS</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-20">JOINED</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-16">STATUS</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center w-[18%]">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="10" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-[#c0922e]" size={32} />
                        <p className="text-[11px] font-bold text-slate-400">Loading brokers...</p>
                      </div>
                    </td>
                  </tr>
                ) : brokers.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-4 py-12 text-center text-[11px] font-bold text-slate-400">
                      No brokers found.
                    </td>
                  </tr>
                ) : brokers.map((broker, idx) => (
                  <tr key={broker._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-4 text-[11px] text-slate-400 font-bold">{idx + 1}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px] overflow-hidden">
                          {broker.profileImage ? <img src={broker.profileImage} alt="" /> : broker.firstName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-slate-900 leading-none mb-1 truncate">{broker.firstName} {broker.lastName}</p>
                          <p className="text-[9px] text-slate-400 font-medium mb-1 truncate">{broker.companyName}</p>
                          <p className="text-[9px] text-[#3b82f6] font-medium truncate">{broker.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[11px] font-bold text-slate-900 mb-0.5 truncate">{broker.operatingCity}</p>
                      <p className="text-[9px] text-slate-400 font-medium">{broker.pinCode}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-900">{broker.phoneNumber}</p>
                        <div className="flex gap-1">
                          <button className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[8px] font-bold hover:bg-emerald-100 transition-all border border-emerald-100/50">
                            WA
                          </button>
                          <button className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-bold hover:bg-blue-100 transition-all border border-blue-100/50">
                            Call
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[8px] font-bold border border-blue-100">{broker.role.toLowerCase()}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1 w-full">
                        <p className="text-[10px] font-bold text-slate-900">0/25</p>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-slate-400 rounded-full" 
                            style={{ width: `0%` }}
                          />
                        </div>
                        <button className="text-[8px] font-bold text-primary-500 flex items-center gap-1 hover:underline">
                           Limit
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {broker.associatedGroup ? (
                        <div className="flex flex-wrap gap-1">
                          <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[7px] font-bold leading-tight">
                            {broker.associatedGroup.split(' ')[0]}...
                          </span>
                        </div>
                      ) : (
                        <span className="text-[9px] text-slate-400 font-medium italic">None</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-[9px] font-bold text-slate-400">{new Date(broker.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${broker.isVerified ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                        {broker.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => handleEditClick(broker)}
                          className="p-1.5 border border-slate-200 text-slate-600 rounded-lg text-[9px] font-bold hover:bg-slate-50 transition-all flex items-center gap-1"
                        >
                          <Edit2 size={8} className="text-primary-500" /> Edit
                        </button>
                        <button 
                          onClick={() => toggleStatus(broker)}
                          className={`p-1.5 border border-slate-200 text-slate-600 rounded-lg text-[9px] font-bold hover:bg-slate-50 transition-all flex items-center gap-1 ${broker.isVerified ? 'hover:text-amber-600' : 'hover:text-emerald-600'}`}
                        >
                          {broker.isVerified ? <XCircle size={8} className="text-amber-500" /> : <CheckCircle size={8} className="text-emerald-500" />} 
                          {broker.isVerified ? 'Unverify' : 'Verify'}
                        </button>
                        <button 
                          onClick={() => handleDelete(broker._id)}
                          className="p-1.5 bg-[#7f1d1d] text-white rounded-lg text-[9px] font-bold hover:bg-[#991b1b] transition-all flex items-center gap-1"
                        >
                          <Trash2 size={8} /> Del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Broker Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} />
          <div className="relative w-full max-w-[700px] bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif text-black">{isEditModalOpen ? `Edit Broker: ${editingBroker?.name}` : 'Add Broker'}</h3>
                <p className="text-[11px] text-slate-400 font-medium">{isEditModalOpen ? 'Update profile and group assignment' : 'Add a verified broker manually'}</p>
              </div>
              <button 
                onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 transition-all"
              >
                <Plus size={20} className="rotate-45" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">FULL NAME *</label>
                  <input 
                    type="text" name="fullName" placeholder="Full name"
                    value={formData.fullName} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none focus:border-[#eab308]/40 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">COMPANY *</label>
                  <input 
                    type="text" name="company" placeholder="Firm name"
                    value={formData.company} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none focus:border-[#eab308]/40 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">PHONE *</label>
                  <input 
                    type="text" name="phone" placeholder="10-digit mobile"
                    value={formData.phone} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none focus:border-[#eab308]/40 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">EMAIL *</label>
                  <input 
                    type="email" name="email" placeholder="Email address"
                    value={formData.email} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none focus:border-[#eab308]/40 transition-all"
                    disabled={isEditModalOpen}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">CITY</label>
                  <select 
                    name="city" value={formData.city} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none focus:border-[#eab308]/40 transition-all appearance-none"
                  >
                    <option value="">— Select —</option>
                    <option value="Gurugram">Gurugram</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">ADDRESS</label>
                  <input 
                    type="text" name="address" placeholder="Office address"
                    value={formData.address} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none focus:border-[#eab308]/40 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">ROLE</label>
                  <select 
                    name="role" value={formData.role} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none focus:border-[#eab308]/40 transition-all appearance-none"
                  >
                    <option value="Broker">Broker</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">STATUS</label>
                  <select 
                    name="status" value={formData.status} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none focus:border-[#eab308]/40 transition-all appearance-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">LISTING LIMIT</label>
                  <input 
                    type="text" name="listingLimit" 
                    value={formData.listingLimit} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-bold outline-none focus:border-[#eab308]/40 transition-all"
                  />
                </div>
              </div>

              {/* Group Assignment Section */}
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-widest ml-1">GROUP ASSIGNMENT</label>
                <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                   <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-200 text-[#c0922e] focus:ring-[#c0922e]" defaultChecked={formData.groupAssignment?.includes('GURGAON REALTORS GROUP (GRG)')} />
                      <span className="text-[11px] font-bold text-slate-900 group-hover:text-black transition-colors uppercase tracking-tight">GURGAON REALTORS GROUP (GRG)</span>
                   </label>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button 
                  onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                  className="px-6 py-2 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  className="px-6 py-2 rounded-lg bg-[#c0922e] text-white text-[11px] font-bold hover:bg-[#a67d26] transition-all shadow-lg shadow-[#c0922e]/20"
                >
                  Save Listing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brokers;
