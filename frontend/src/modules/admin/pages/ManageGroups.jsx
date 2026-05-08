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
    try {
      const response = await api.put(`/groups/${selectedGroup._id}`, formData);
      if (response.success) {
        setGroups(groups.map(g => g._id === selectedGroup._id ? { ...g, ...response.data } : g));
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
      <div className="space-y-6 md:space-y-8 pb-10">
        {/* Custom Header */}
        <div className="-mx-4 md:-mx-6 lg:-mx-10 -mt-4 md:-mt-6 lg:-mt-10 mb-4 px-4 md:px-6 lg:px-10 py-3 md:py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 md:gap-6">
            <h1 className="text-base md:text-lg font-serif text-black">Manage Groups</h1>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3b82f6]" size={14} />
              <input 
                type="text" 
                placeholder="Search groups..."
                value={tableSearchQuery}
                onChange={(e) => setTableSearchQuery(e.target.value)}
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
              setFormData({ name: '', description: '' });
              setSelectedMembers([]);
              setCreateSearchQuery('');
              setIsCreateModalOpen(true);
            }}
            className="w-full sm:w-auto bg-[#c0922e] text-white px-5 py-2.5 sm:py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-2 hover:bg-[#a67d26] transition-all shadow-lg shadow-[#c0922e]/20"
          >
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
                            setFormData({ name: group.name, description: group.description || '' });
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
            <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-serif text-black">{isCreateModalOpen ? 'Create New Group' : 'Edit Group'}</h3>
              <button onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 transition-all">
                <Plus size={20} className="rotate-45" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">GROUP NAME *</label>
                  <input 
                    type="text" name="name" required value={formData.name} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none focus:border-[#eab308]/40 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">DESCRIPTION</label>
                  <textarea 
                    name="description" rows="2" value={formData.description} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#fefce8] border border-slate-200 rounded-xl text-[12px] font-medium outline-none focus:border-[#eab308]/40 transition-all resize-none"
                  />
                </div>
              </div>

              {isCreateModalOpen && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-widest">ADD BROKERS ({selectedMembers.length} selected)</label>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Search brokers..."
                      value={createSearchQuery}
                      onChange={(e) => setCreateSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-medium outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                    {filteredBrokersForCreateModal.map(broker => {
                      const isSelected = selectedMembers.includes(broker._id);
                      return (
                        <div 
                          key={broker._id} 
                          onClick={() => toggleMemberSelection(broker._id)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer group ${
                            isSelected ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                              isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {isSelected ? <Check size={14} /> : broker.firstName?.[0]}
                            </div>
                            <div className="min-w-0">
                              <p className={`text-[10px] font-bold truncate ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                                {broker.firstName} {broker.lastName}
                              </p>
                              <p className="text-[8px] text-slate-400 font-medium truncate">{broker.companyName}</p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                            isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 group-hover:border-slate-300'
                          }`}>
                            {isSelected && <Check size={12} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3 flex-shrink-0">
              <button type="button" onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }} className="px-6 py-2 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={isCreateModalOpen ? handleCreateGroup : handleUpdateGroup} className="px-6 py-2 rounded-lg bg-[#c0922e] text-white text-[11px] font-bold hover:bg-[#a67d26] shadow-lg">
                {isCreateModalOpen ? 'Create Group' : 'Save Changes'}
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
                <p className="text-[11px] text-slate-400 italic text-center py-8">No members in this group yet.</p>
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
