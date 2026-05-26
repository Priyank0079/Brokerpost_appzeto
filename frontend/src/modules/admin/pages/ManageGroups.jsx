import React, { useState, useEffect, useMemo } from 'react';
import { Search, ArrowLeft, Plus, Users, Edit2, Trash2, Phone, X, Loader2, AlertCircle, UserPlus, UserMinus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../broker/services/api';
import Modal from '../../broker/components/ui/Modal';

const ManageGroups = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [error, setError] = useState(null);
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  
  // Selection
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [createSearchQuery, setCreateSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await api.get('/groups');
      if (response.success) {
        setGroups(response.data);
      }
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const fetchBrokers = async () => {
    try {
      const response = await api.get('/auth/brokers');
      if (response.success) {
        setBrokers(response.data);
      }
    } catch (err) {
      console.error('Error fetching brokers:', err);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchBrokers();
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (formData.leaderMobile && formData.leaderMobile.length !== 10) {
      alert("Leader mobile must be exactly 10 digits");
      return;
    }
    try {
      const response = await api.post('/groups', {
        ...formData,
        members: selectedMembers
      });
      if (response.success) {
        // Fetch the group again to get populated members
        const fullGroupResponse = await api.get(`/groups/${response.data._id}`);
        if (fullGroupResponse.success) {
          setGroups([...groups, fullGroupResponse.data]);
        } else {
          setGroups([...groups, response.data]);
        }
        setIsCreateModalOpen(false);
        setFormData({ name: '', description: '' });
        setSelectedMembers([]);
      }
    } catch (err) {
      alert('Failed to create group');
    }
  };

  const handleUpdateGroup = async (e) => {
    e.preventDefault();
    if (formData.leaderMobile && formData.leaderMobile.length !== 10) {
      alert("Leader mobile must be exactly 10 digits");
      return;
    }
    try {
      const response = await api.put(`/groups/${selectedGroup._id}`, {
        ...formData,
        members: selectedMembers
      });
      if (response.success) {
        setGroups(groups.map(g => g._id === selectedGroup._id ? response.data : g));
        setIsEditModalOpen(false);
      }
    } catch (err) {
      alert('Failed to update group');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!groupToDelete) return;
    try {
      const response = await api.delete(`/groups/${groupToDelete}`);
      if (response.success) {
        setGroups(prev => prev.filter(g => g._id !== groupToDelete));
        setGroupToDelete(null);
      }
    } catch (err) {
      alert('Failed to delete group');
    }
  };

  const handleAddMember = async (brokerId) => {
    try {
      const response = await api.post(`/groups/${selectedGroup._id}/members`, {
        memberIds: [brokerId]
      });
      if (response.success) {
        const fullGroupResponse = await api.get(`/groups/${selectedGroup._id}`);
        if (fullGroupResponse.success) {
          setSelectedGroup(fullGroupResponse.data);
          setGroups(groups.map(g => g._id === selectedGroup._id ? fullGroupResponse.data : g));
        }
      }
    } catch (err) {
      alert('Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      const response = await api.delete(`/groups/${selectedGroup._id}/members/${memberId}`);
      if (response.success) {
        const updatedMembers = selectedGroup.members.filter(m => m._id !== memberId);
        const updatedGroup = { ...selectedGroup, members: updatedMembers };
        setSelectedGroup(updatedGroup);
        setGroups(groups.map(g => g._id === selectedGroup._id ? updatedGroup : g));
      }
    } catch (err) {
      alert('Failed to remove member');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'leaderName') {
      if (value !== '' && !/^[a-zA-Z\s]+$/.test(value)) return;
    }
    
    if (name === 'leaderMobile') {
      if (value !== '' && !/^\d+$/.test(value)) return;
      if (value.length > 10) return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleMemberSelection = (brokerId) => {
    setSelectedMembers(prev => 
      prev.includes(brokerId) 
        ? prev.filter(id => id !== brokerId) 
        : [...prev, brokerId]
    );
  };

  const filteredBrokersForMemberModal = useMemo(() => {
    if (!memberSearchQuery) return brokers.filter(b => 
      !selectedGroup?.members.some(m => m._id === b._id)
    );
    return brokers.filter(b => 
      !selectedGroup?.members.some(m => m._id === b._id) &&
      (b.firstName.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
       b.lastName.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
       b.companyName.toLowerCase().includes(memberSearchQuery.toLowerCase()))
    );
  }, [brokers, selectedGroup, memberSearchQuery]);

  const filteredBrokersForCreateModal = useMemo(() => {
    if (!createSearchQuery) return brokers;
    return brokers.filter(b => 
      (b.firstName.toLowerCase().includes(createSearchQuery.toLowerCase()) ||
       b.lastName.toLowerCase().includes(createSearchQuery.toLowerCase()) ||
       b.companyName.toLowerCase().includes(createSearchQuery.toLowerCase()))
    );
  }, [brokers, createSearchQuery]);

  const filteredGroups = useMemo(() => {
    if (!tableSearchQuery) return groups;
    return groups.filter(g => 
      g.name.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
      g.description?.toLowerCase().includes(tableSearchQuery.toLowerCase())
    );
  }, [groups, tableSearchQuery]);

  return (
    <div className="-mx-4 md:-mx-6 lg:-mx-10 -my-4 md:-my-6 lg:-my-10 px-4 md:px-6 lg:px-10 py-4 md:py-6 lg:py-10 bg-[#faf9f6] min-h-screen">
      <div className="space-y-4 md:space-y-5 pb-10">
        {/* Custom Header */}
        <div className="-mx-4 md:-mx-6 lg:-mx-10 -mt-4 md:-mt-6 lg:-mt-10 px-4 md:px-6 lg:px-10 py-3 md:py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 md:gap-6">
            <h1 className="text-base md:text-lg font-serif text-black">Manage Groups</h1>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3b82f6]" size={14} />
              <input 
                type="text" 
                placeholder="Search groups..."
                value={tableSearchQuery}
                onChange={(e) => setTableSearchQuery(e.target.value)}
                className="w-[180px] lg:w-[240px] pl-9 pr-4 py-1.5 bg-[#faf7f2] border border-slate-200 rounded-lg text-[11px] font-medium outline-none focus:border-[#c8962a]/40 transition-all text-slate-600 placeholder:text-[#7f7f7f] placeholder:font-normal"
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

        <div className="space-y-4 md:space-y-5">
          {/* Page Header */}
          <div className="flex items-start justify-between gap-4 px-2 md:px-0">
            <div className="space-y-1">
              <h1 className="text-2xl font-normal font-serif text-[#0d1b2a]">Community Groups</h1>
              <p className="text-[12px] text-[#718199] mt-0 tracking-tighter font-normal">Organize brokers into collaborative networks</p>
            </div>
            <button 
              onClick={() => {
                setSelectedGroup(null);
                setFormData({ name: '', description: '', focusArea: '', leaderName: '', leaderMobile: '' });
                setSelectedMembers([]);
                setIsCreateModalOpen(true);
              }}
              className="bg-[#c8962a] text-white px-4 py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-2 hover:bg-[#B48C35] transition-all shadow-lg shadow-[#c8962a]/20 shrink-0"
            >
              <Plus size={14} /> Create Group
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-16">#</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">GROUP NAME</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">DESCRIPTION</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">MEMBERS</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">DATE CREATED</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-[#c0922e]" size={32} />
                        <p className="text-[11px] font-bold text-slate-400">Loading groups...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredGroups.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-[11px] font-bold text-slate-400">
                      No groups found.
                    </td>
                  </tr>
                ) : filteredGroups.map((group, idx) => (
                  <tr key={group._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-[11px] text-slate-400 font-bold">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <p className="text-[11px] font-bold text-slate-900 leading-none mb-1 group-hover:text-[#c0922e] transition-colors">{group.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[10px] text-slate-500 font-medium max-w-[300px] truncate">{group.description || 'No description'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-bold border border-blue-100">
                        {group.members?.length || 0} members
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold text-slate-400">{new Date(group.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => {
                            setSelectedGroup(group);
                            setIsMemberModalOpen(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-[9px] font-bold hover:bg-slate-50 transition-all shadow-sm"
                        >
                          <Users size={10} className="text-indigo-600" /> Members
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedGroup(group);
                            setFormData({ 
                              name: group.name, 
                              description: group.description || '',
                              focusArea: group.focusArea || '',
                              leaderName: group.leaderName || '',
                              leaderMobile: group.leaderMobile || ''
                            });
                            setSelectedMembers(group.members ? group.members.map(m => m._id || m) : []);
                            setIsEditModalOpen(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-[9px] font-bold hover:bg-slate-50 transition-all shadow-sm"
                        >
                          <Edit2 size={10} className="text-primary-500" /> Edit
                        </button>
                        <button 
                          onClick={() => setGroupToDelete(group._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7f1d1d] text-white rounded-lg text-[9px] font-bold hover:bg-[#991b1b] transition-all shadow-sm"
                        >
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

      {/* Create/Edit Group Modal */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm" onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }} />
          <div className="relative w-full max-w-[600px] bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-white z-10 shrink-0">
              <div className="space-y-1">
                <h3 className="text-xl font-medium text-slate-800">{isEditModalOpen ? `Edit Group` : 'Create New Group'}</h3>
                <p className="text-[12px] text-slate-400 font-medium">{isEditModalOpen ? 'Update group details, leader & members' : 'Fill group details, assign leader & add members'}</p>
              </div>
              <button 
                onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all shadow-sm"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-5 space-y-5">
              
              {/* Blue Alert Box */}
              <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-lg p-3 text-[11px] text-[#1e40af] font-medium leading-relaxed">
                The group leader is the designated broker who coordinates this group. Admin acts on their instruction only.
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">GROUP NAME *</label>
                  <input 
                    type="text" name="name" required placeholder="South Delhi Premium"
                    value={formData.name} onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-[12px] font-medium outline-none focus:border-[#c8962a]/50 transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">FOCUS AREA</label>
                  <input 
                    type="text" name="focusArea" placeholder="South Delhi, Saket"
                    value={formData.focusArea || ''} onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-[12px] font-medium outline-none focus:border-[#c8962a]/50 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DESCRIPTION</label>
                <input 
                  type="text" name="description" placeholder="Premium residential & luxury commercial"
                  value={formData.description} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-[12px] font-medium outline-none focus:border-[#c8962a]/50 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Group Leader Details (Yellow Box) */}
              <div className="bg-[#fffbeb] border border-[#fde047] rounded-lg p-4 space-y-4">
                <h4 className="text-[10px] font-bold text-[#ca8a04] uppercase tracking-widest">GROUP LEADER DETAILS</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LEADER NAME *</label>
                    <input 
                      type="text" name="leaderName" placeholder="Priya Verma"
                      value={formData.leaderName || ''} onChange={handleInputChange}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-[12px] font-medium outline-none focus:border-[#fde047] transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LEADER MOBILE *</label>
                    <input 
                      type="text" name="leaderMobile" placeholder="9810000020"
                      value={formData.leaderMobile || ''} onChange={handleInputChange}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-[12px] font-medium outline-none focus:border-[#fde047] transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <p className="text-[10px] font-medium text-[#d97706] leading-relaxed">
                  Admin will take add/remove actions only on this leader's instruction. Leader's contact is shown to all group members.
                </p>
              </div>

              {/* Add Members */}
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ADD MEMBERS</label>
                <div className="border border-slate-200 rounded-lg overflow-hidden max-h-[180px] overflow-y-auto">
                  {brokers.map(broker => {
                    const isSelected = selectedMembers.includes(broker._id);
                    const location = broker.operatingCity || broker.city || 'N/A';
                    
                    return (
                      <div 
                        key={broker._id}
                        onClick={() => toggleMemberSelection(broker._id)}
                        className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-all cursor-pointer group"
                      >
                        <div className="flex-shrink-0">
                          <div className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${
                            isSelected ? 'bg-[#c8962a] border-[#c8962a] text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                        </div>
                        <div className="flex-1 text-[11px] font-medium text-slate-600 tracking-wide uppercase">
                          {broker.firstName} {broker.lastName} — {Array.isArray(location) ? location[0] : location}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-end gap-3 shrink-0">
              <button 
                type="button" 
                onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }} 
                className="px-5 py-2 rounded-lg border border-slate-200 text-[12px] font-medium text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={isCreateModalOpen ? handleCreateGroup : handleUpdateGroup} 
                className="px-5 py-2.5 rounded-lg bg-[#c8962a] text-white text-[12px] font-medium hover:bg-[#B48C35] transition-all shadow-sm"
              >
                {isEditModalOpen ? 'Save Changes' : 'Create Group'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Management Modal */}
      <Modal 
        isOpen={isMemberModalOpen} 
        onClose={() => setIsMemberModalOpen(false)}
        title={`Group Members: ${selectedGroup?.name}`}
        className="max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[400px]">
          {/* Current Members */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-[11px] font-bold text-[#1e3a8a] uppercase tracking-widest">ACTIVE MEMBERS ({selectedGroup?.members?.length || 0})</h4>
            </div>
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
              {selectedGroup?.members?.length === 0 ? (
                <p className="text-[11px] text-slate-400 text-center py-8">No members in this group yet.</p>
              ) : selectedGroup?.members?.map(member => (
                <div key={member._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px]">
                      {member.firstName?.[0]}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900">{member.firstName} {member.lastName}</p>
                      <p className="text-[9px] text-slate-400 font-medium truncate max-w-[150px]">{member.companyName}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveMember(member._id)}
                    className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <UserMinus size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Members */}
          <div className="space-y-4 border-l border-slate-100 pl-8">
            <div className="border-b border-slate-100 pb-2">
              <h4 className="text-[11px] font-bold text-[#c0922e] uppercase tracking-widest">ADD BROKERS</h4>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search brokers to add..."
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-medium outline-none focus:border-[#c0922e]/30"
              />
            </div>
            <div className="space-y-2 max-h-[290px] overflow-y-auto pr-2">
              {filteredBrokersForMemberModal.length === 0 ? (
                <p className="text-[11px] text-slate-400 text-center py-8">No brokers found.</p>
              ) : filteredBrokersForMemberModal.map(broker => (
                <div key={broker._id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-100 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-[10px]">
                      {broker.firstName?.[0]}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900">{broker.firstName} {broker.lastName}</p>
                      <p className="text-[9px] text-slate-400 font-medium">{broker.companyName}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleAddMember(broker._id)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <UserPlus size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={!!groupToDelete} 
        onClose={() => setGroupToDelete(null)}
        title="Confirm Deletion"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Delete this group?</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Are you sure you want to delete this group? This action will remove all memberships and cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={() => setGroupToDelete(null)} className="px-6 py-2 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={handleDeleteConfirm} className="px-6 py-2 rounded-lg bg-red-600 text-white text-[11px] font-bold hover:bg-red-700 shadow-lg shadow-red-600/20">Delete Group</button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageGroups;
