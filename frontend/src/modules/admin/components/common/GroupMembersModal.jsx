import React, { useState } from 'react';
import { UserMinus, UserPlus, Search, X } from 'lucide-react';
import Modal from '../../../broker/components/ui/Modal';
import Button from '../../../broker/components/ui/Button';
import { addGroupMembers, removeGroupMember } from '../../services/groupService';
import { getAllBrokers } from '../../services/brokerService';

const GroupMembersModal = ({ isOpen, onClose, group, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [allBrokers, setAllBrokers] = useState([]);
  const [searchBrokers, setSearchBrokers] = useState('');

  const handleRemove = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        const result = await removeGroupMember(group._id, memberId);
        if (result.success) {
          onUpdate();
        }
      } catch (error) {
        console.error('Remove member error:', error);
      }
    }
  };

  const fetchAllBrokers = async () => {
    try {
      const result = await getAllBrokers();
      if (result.success) {
        // Filter out existing members
        const existingIds = group.members.map(m => m._id);
        setAllBrokers(result.data.filter(b => !existingIds.includes(b._id)));
      }
    } catch (error) {
      console.error('Fetch brokers error:', error);
    }
  };

  const handleAddMember = async (brokerId) => {
    try {
      const result = await addGroupMembers(group._id, [brokerId]);
      if (result.success) {
        setIsAdding(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Add member error:', error);
    }
  };

  const filteredMembers = group?.members?.filter(m => {
    const fullName = `${m?.firstName || ''} ${m?.lastName || ''}`.toLowerCase();
    const company = (m?.companyName || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || company.includes(search);
  }) || [];


  const filteredAllBrokers = allBrokers.filter(b => {
    const fullName = `${b?.firstName || ''} ${b?.lastName || ''}`.toLowerCase();
    const city = (b?.operatingCity || '').toLowerCase();
    const search = searchBrokers.toLowerCase();
    return fullName.includes(search) || city.includes(search);
  });


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${group?.name} - Members`}
    >
      <div className="space-y-6">
        {!isAdding ? (
          <>
            <div className="flex items-center justify-between">
              <div className="relative flex-1 mr-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search members..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary-500/5 outline-none text-sm font-medium transition-all"
                />
              </div>
              <Button 
                variant="primary"
                onClick={() => { setIsAdding(true); fetchAllBrokers(); }}
                className="bg-slate-900 text-white rounded-xl px-4 h-[46px]"
                leftIcon={<UserPlus size={18} />}
              >
                Add
              </Button>
            </div>

            <div className="max-h-[400px] overflow-y-auto border border-slate-50 rounded-2xl divide-y divide-slate-50 custom-scrollbar">
              {filteredMembers.length > 0 ? (
                filteredMembers.map(m => (
                  <div key={m._id} className="p-4 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs shadow-sm uppercase">
                        {m.firstName?.[0]}{m.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{m.firstName} {m.lastName}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{m.companyName || 'Independent'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemove(m._id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <UserMinus size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-400 font-medium text-sm">
                  No members found
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Add New Members</h4>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><X size={18} /></button>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={searchBrokers}
                onChange={(e) => setSearchBrokers(e.target.value)}
                placeholder="Search brokers to add..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary-500/5 outline-none text-sm font-medium transition-all"
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto border border-slate-50 rounded-2xl divide-y divide-slate-50 custom-scrollbar">
              {filteredAllBrokers.length > 0 ? (
                filteredAllBrokers.map(b => (
                  <div key={b._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs shadow-sm uppercase">
                        {b.firstName?.[0]}{b.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{b.firstName} {b.lastName}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{b.operatingCity}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAddMember(b._id)}
                      className="p-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-all"
                    >
                      <UserPlus size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-400 font-medium text-sm">
                  No brokers available to add
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-2">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="w-full py-4 font-black uppercase tracking-widest text-[11px]"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default GroupMembersModal;
