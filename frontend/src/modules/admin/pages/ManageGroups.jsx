import React, { useState } from 'react';
import { Search, ArrowLeft, Plus, Users, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManageGroups = () => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [formData, setFormData] = useState({
    groupName: '',
    description: '',
    leaderName: '',
    leaderMobile: ''
  });

  const groups = [
    { 
      id: 1, 
      name: 'GURGAON REALTORS GROUP (GRG)', 
      description: 'Realtors dealing in Resale market',
      leader: 'PRIYANK',
      leaderMobile: '9876543210',
      members: 4,
      dateCreated: '4/5/2026'
    }
  ];

  const members = [
    { id: 1, name: 'D R SHARMA', firm: 'GYATARI ASSOTIATES', selected: false },
    { id: 2, name: 'SHEETAL', firm: 'GLOBAL ESTATE', selected: true },
    { id: 3, name: 'ABHISHEK JHA', firm: 'BEST REALTY GROUP', selected: true },
    { id: 4, name: 'BALDEV', firm: 'ASIAN REALTY', selected: false },
  ];

  const handleEditClick = (group) => {
    setEditingGroup(group);
    setFormData({
      groupName: group.name,
      description: group.description,
      leaderName: group.leader,
      leaderMobile: group.leaderMobile
    });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="-mx-4 md:-mx-6 lg:-mx-10 -my-4 md:-my-6 lg:-my-10 px-4 md:px-6 lg:px-10 py-4 md:py-6 lg:py-10 bg-[#faf9f6] min-h-screen">
      <div className="space-y-6 md:space-y-8 pb-10">
        {/* Custom Header */}
        <div className="-mx-4 md:-mx-6 lg:-mx-10 -mt-4 md:-mt-6 lg:-mt-10 mb-4 px-4 md:px-6 lg:px-10 py-3 md:py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 md:gap-6">
            <h1 className="text-base md:text-lg font-serif text-black">Manage Groups</h1>
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

        {/* Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 md:px-0">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-serif text-black">Manage Groups</h2>
            <p className="text-[10px] md:text-[11px] text-slate-400 font-medium tracking-tight">Create groups and assign brokers</p>
          </div>
          <button className="w-full sm:w-auto bg-[#c0922e] text-white px-5 py-2.5 sm:py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-2 hover:bg-[#a67d26] transition-all shadow-lg shadow-[#c0922e]/20">
            <Plus size={14} /> Create Group
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-16">#</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">GROUP NAME</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">LEADER NAME</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">LEADER MOBILE</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">MEMBERS</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">DATE CREATED</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {groups.map((group, idx) => (
                  <tr key={group.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-[11px] text-slate-400 font-bold">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-slate-900 leading-none mb-1">{group.name}</p>
                        <p className="text-[9px] text-slate-400 font-medium">{group.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[11px] font-bold text-slate-900">{group.leader}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Phone size={10} className="text-[#c0922e]" />
                        <span className="text-[11px] font-bold text-[#3b82f6]">{group.leaderMobile}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-bold border border-blue-100">
                        {group.members} members
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold text-slate-400">{group.dateCreated}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-[9px] font-bold hover:bg-slate-50 transition-all shadow-sm">
                          <Users size={10} className="text-indigo-600" /> Members
                        </button>
                        <button 
                          onClick={() => handleEditClick(group)}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-[9px] font-bold hover:bg-slate-50 transition-all shadow-sm"
                        >
                          <Edit2 size={10} className="text-primary-500" /> Edit
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7f1d1d] text-white rounded-lg text-[9px] font-bold hover:bg-[#991b1b] transition-all shadow-sm">
                          <Trash2 size={10} /> Del
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

      {/* Edit Group Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative w-full max-w-[700px] bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif text-black">Edit Group: {editingGroup?.name}</h3>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 transition-all"
              >
                <Plus size={20} className="rotate-45" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">GROUP NAME</label>
                  <input 
                    type="text" name="groupName" value={formData.groupName} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none focus:border-[#eab308]/40 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">DESCRIPTION</label>
                  <input 
                    type="text" name="description" value={formData.description} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none focus:border-[#eab308]/40 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">LEADER NAME</label>
                  <input 
                    type="text" name="leaderName" value={formData.leaderName} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none focus:border-[#eab308]/40 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">LEADER MOBILE</label>
                  <input 
                    type="text" name="leaderMobile" value={formData.leaderMobile} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none focus:border-[#eab308]/40 transition-all"
                  />
                </div>
              </div>

              {/* Members Section */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">MEMBERS</label>
                <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                  <div className="max-h-[200px] overflow-y-auto p-4 space-y-4">
                    {members.map(member => (
                      <label key={member.id} className="flex items-center gap-4 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            defaultChecked={member.selected}
                            className="peer appearance-none w-10 h-10 border-2 border-slate-200 rounded-lg checked:bg-[#9333ea] checked:border-[#9333ea] transition-all cursor-pointer"
                          />
                          <svg 
                            className="absolute w-6 h-6 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="4" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-slate-900">{member.name}</span>
                          <span className="text-[10px] text-slate-400 font-medium tracking-tight">({member.firm})</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-8 py-2.5 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  className="px-8 py-2.5 rounded-lg bg-[#c0922e] text-white text-[11px] font-bold hover:bg-[#a67d26] transition-all shadow-lg shadow-[#c0922e]/20"
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

const Phone = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export default ManageGroups;
