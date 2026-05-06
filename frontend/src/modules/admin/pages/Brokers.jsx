import React, { useState } from 'react';
import { Search, ArrowLeft, Phone, MessageSquare, Edit2, Ban, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Brokers = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Brokers', value: '17' },
    { label: 'Active', value: '17' },
    { label: 'Blocked', value: '0' },
    { label: 'Total Listings', value: '45' },
  ];

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

  const brokers = [
    { id: 1, name: 'D R Sharma', firm: 'Gyatari Associates', email: 'sharma@gmail.com', city: 'Gurugram', phone: '9876543210', listings: '0/25', joined: '2026-05-04', status: 'Active' },
    { id: 2, name: 'Sheetal', firm: 'Global Estate', email: 'sheetal@gmail.com', city: 'Gurugram', phone: '6261265704', listings: '17/25', groups: ['GURGAON REALTORS GROUP (GRG)'], joined: '2026-05-03', status: 'Active' },
    { id: 3, name: 'Abhishek Jha', firm: 'Best Realty Group', email: 'abhishek@gmail.com', city: 'Gurugram', phone: '9876543210', listings: '4/25', groups: ['GURGAON REALTORS GROUP (GRG)'], joined: '2026-05-04', status: 'Active' },
    { id: 4, name: 'Baldev Rawat', firm: 'Asian Realty', email: 'asian@gmail.com', city: 'Gurugram', phone: '9810207073', listings: '0/25', joined: '2026-05-02', status: 'Active' },
    { id: 5, name: 'Baldev Rawat', firm: 'Asian Realty', email: 'rawatb2025@gmail.com', city: 'Gurugram', phone: '9810207073', listings: '0/25', joined: '2026-05-02', status: 'Active' },
    { id: 6, name: 'Neha Negi', firm: 'Realty Beast India', email: 'neha@gmail.com', city: 'Gurugram', phone: '9876543210', listings: '0/25', joined: '2026-05-04', status: 'Active' },
    { id: 7, name: 'Anirudh Panda', firm: 'New India Realty', email: 'anirudh@gmail.com', city: 'Gurugram', phone: '9876543210', listings: '1/25', joined: '2026-05-04', status: 'Active' },
  ];

  return (
    <div className="-mx-6 lg:-mx-10 -my-6 lg:-my-10 px-6 lg:px-10 py-6 lg:py-10 bg-[#faf9f6] min-h-screen">
      <div className="space-y-8 pb-10">
        {/* Custom Header */}
        <div className="-mx-6 lg:-mx-10 -mt-6 lg:-mt-10 mb-4 px-6 lg:px-10 py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-serif text-black">Manage Brokers</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3b82f6]" size={14} />
              <input 
                type="text" 
                placeholder="Search listings..."
                className="w-[240px] pl-9 pr-4 py-1.5 bg-[#fefce8] border border-slate-200 rounded-lg text-[11px] font-medium outline-none focus:border-[#eab308]/40 transition-all text-slate-600"
              />
            </div>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-1.5 rounded-full border border-slate-200 text-black text-[11px] font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={14} /> Public Site
          </button>
        </div>

        {/* Title Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif text-black">Manage Brokers</h2>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight">Approve, edit or remove brokers</p>
          </div>
          <button 
            onClick={() => {
              setEditingBroker(null);
              setFormData({
                fullName: '', company: '', phone: '', email: '', password: '', city: '', address: '', role: 'Broker', listingLimit: '25'
              });
              setIsAddModalOpen(true);
            }}
            className="bg-[#c0922e] text-white px-5 py-2 rounded-lg text-[11px] font-bold flex items-center gap-2 hover:bg-[#a67d26] transition-all shadow-lg shadow-[#c0922e]/20"
          >
            <Plus size={14} /> Add Broker
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-3xl font-serif text-black">{stat.value}</span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{stat.label}</p>
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
                {brokers.map((broker, idx) => (
                  <tr key={broker.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-4 text-[11px] text-slate-400 font-bold">{idx + 1}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px] overflow-hidden">
                          {broker.id % 3 === 0 ? <img src={`https://i.pravatar.cc/100?u=${broker.id}`} alt="" /> : broker.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-slate-900 leading-none mb-1 truncate">{broker.name}</p>
                          <p className="text-[9px] text-slate-400 font-medium mb-1 truncate">{broker.firm}</p>
                          <p className="text-[9px] text-[#3b82f6] font-medium truncate">{broker.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[11px] font-bold text-slate-900 mb-0.5 truncate">{broker.city}</p>
                      <p className="text-[9px] text-slate-400 font-medium">122009</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-900">{broker.phone}</p>
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
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[8px] font-bold border border-blue-100">broker</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1 w-full">
                        <p className="text-[10px] font-bold text-slate-900">{broker.listings}</p>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-slate-400 rounded-full" 
                            style={{ width: `${(parseInt(broker.listings.split('/')[0]) / 25) * 100}%` }}
                          />
                        </div>
                        <button className="text-[8px] font-bold text-orange-500 flex items-center gap-1 hover:underline">
                           Limit
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {broker.groups ? (
                        <div className="flex flex-wrap gap-1">
                          {broker.groups.map((group, gIdx) => (
                            <span key={gIdx} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[7px] font-bold leading-tight">
                              {group.split(' ')[0]}...
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[9px] text-slate-400 font-medium italic">None</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-[9px] font-bold text-slate-400">{broker.joined}</td>
                    <td className="px-4 py-4">
                      <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[8px] font-bold border border-emerald-100">Active</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => handleEditClick(broker)}
                          className="p-1.5 border border-slate-200 text-slate-600 rounded-lg text-[9px] font-bold hover:bg-slate-50 transition-all flex items-center gap-1"
                        >
                          <Edit2 size={8} className="text-orange-500" /> Edit
                        </button>
                        <button className="p-1.5 border border-slate-200 text-slate-600 rounded-lg text-[9px] font-bold hover:bg-slate-50 transition-all flex items-center gap-1">
                          <Ban size={8} className="text-orange-500" /> Block
                        </button>
                        <button className="p-1.5 bg-[#7f1d1d] text-white rounded-lg text-[9px] font-bold hover:bg-[#991b1b] transition-all flex items-center gap-1">
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
          <div className="relative w-full max-w-[700px] bg-white rounded-[24px] shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
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
                    <option value="Admin">Admin</option>
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
