import React, { useState } from 'react';
import { 
  UsersRound, 
  MapPin, 
  Eye, 
  Trash2, 
  UserMinus,
  Search,
  MoreVertical,
  Plus
} from 'lucide-react';
import Card from '../../broker/components/ui/Card';
import Button from '../../broker/components/ui/Button';
import { AdminTable, AdminTableRow, AdminTableCell, ActionButton } from '../components/common/AdminUI';
import { getGroups, createGroup, deleteGroup, getGroup } from '../services/groupService';
import CreateGroupModal from '../components/common/CreateGroupModal';
import GroupMembersModal from '../components/common/GroupMembersModal';

const Groups = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupList, setGroupList] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchGroups = async () => {
    setLoading(true);
    try {
      const result = await getGroups();
      if (result.success) {
        setGroupList(result.data);
      }
    } catch (error) {
      console.error('Fetch groups error:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async (newGroupData) => {
    try {
      const result = await createGroup({
        name: newGroupData.name,
        members: newGroupData.members.map(m => m._id)
      });
      if (result.success) {
        fetchGroups();
      }
    } catch (error) {
      console.error('Create group error:', error);
    }
  };

  const handleDeleteGroup = async (id) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        const result = await deleteGroup(id);
        if (result.success) {
          fetchGroups();
        }
      } catch (error) {
        console.error('Delete group error:', error);
      }
    }
  };


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Group Oversight</h1>
           <p className="text-slate-500 text-sm mt-1">Manage broker communities and network regions.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600" size={16} />
              <input 
                type="text" 
                placeholder="Search groups..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none w-64 focus:ring-4 focus:ring-primary-500/5 transition-all"
              />
           </div>
           <Button 
             variant="primary" 
             className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6"
             onClick={() => setIsModalOpen(true)}
             leftIcon={<Plus size={18} />}
           >
             Create Group
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         {groupList.map(g => (
           <Card key={g._id} noPadding className="border-slate-100 group relative">
              <div className="p-6">
                 <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100 shadow-sm shadow-primary-500/5 group-hover:scale-110 transition-transform duration-500">
                       <UsersRound size={28} />
                    </div>
                    <div className="transition-opacity">
                       <button className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-50"><MoreVertical size={20} /></button>
                    </div>
                 </div>
                 
                 <h3 className="text-xl font-black text-slate-900 leading-tight">{g.name}</h3>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-1">
                    <MapPin size={12} className="text-primary-500" />
                    {g.members?.[0]?.operatingCity || 'Multi-region'}
                 </p>

                 <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-50 pt-6">
                    <div>
                       <p className="text-lg font-black text-slate-900">{g.members?.length || 0}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Members</p>
                    </div>
                    <div className="border-l border-slate-100 pl-4">
                       <p className="text-sm font-bold text-slate-900 truncate">Admin</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Owner</p>
                    </div>
                 </div>

                 <div className="mt-8 flex gap-2">
                    <button 
                      onClick={async () => {
                        const result = await getGroup(g._id);
                        if (result.success) {
                          setSelectedGroup(result.data);
                          setIsMembersModalOpen(true);
                        }
                      }}
                      className="flex-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                    >
                      View Members
                    </button>
                    <button 
                      onClick={() => handleDeleteGroup(g._id)}
                      className="px-4 border border-red-100 text-red-500 bg-red-50/10 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                 </div>
              </div>
           </Card>
         ))}


         {/* Create Link Mockup */}
         <div 
           onClick={() => setIsModalOpen(true)}
           className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4 hover:border-primary-400 hover:bg-primary-50/5 transition-all cursor-pointer group min-h-[320px]"
         >
            <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
               <Plus size={28} />
            </div>
            <div>
               <h4 className="text-lg font-black text-slate-900">Create Official Group</h4>
               <p className="text-xs font-medium text-slate-400 mt-1">Found a new region-based community.</p>
            </div>
         </div>
      </div>

      <CreateGroupModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreateGroup}
      />

      <GroupMembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        group={selectedGroup}
        onUpdate={async () => {
          const result = await getGroup(selectedGroup._id);
          if (result.success) {
            setSelectedGroup(result.data);
            fetchGroups(); // Refresh main list too
          }
        }}
      />

    </div>
  );
};

export default Groups;
