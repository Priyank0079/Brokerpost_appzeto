import React, { useState, useEffect } from 'react';
import { Search, Users, ChevronRight, Info, ShieldCheck, MapPin, Building2, Calendar, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getGroups } from '../services/groupService';

const Groups = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await getGroups();
      if (response.success) {
        setGroups(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-[#c8962a]" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synchronizing Groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="-mx-4 md:-mx-6 lg:-mx-10 -my-4 md:-my-6 lg:-my-10 px-4 md:px-6 lg:px-10 py-4 md:py-6 lg:py-10 bg-[#faf9f6] min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#c8962a] rounded-xl flex items-center justify-center shadow-lg shadow-[#c8962a]/20">
                <Users size={20} className="text-white" />
              </div>
              <h1 className="text-3xl font-serif font-black text-slate-900 tracking-tight">Official Groups</h1>
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-13">Collaborate with fellow verified brokers</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search groups..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[12px] font-bold outline-none focus:border-[#c8962a]/30 transition-all shadow-sm"
            />
          </div>
        </div>

        {groups.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Groups List */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-4">My Memberships ({groups.length})</h2>
              {groups.map((group) => (
                <button
                  key={group._id}
                  onClick={() => setSelectedGroup(group)}
                  className={`w-full text-left p-5 rounded-[1.5rem] border transition-all duration-300 flex items-center justify-between group ${
                    selectedGroup?._id === group._id 
                      ? 'bg-white border-[#c8962a] shadow-xl shadow-[#c8962a]/10 translate-x-2' 
                      : 'bg-white/50 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      selectedGroup?._id === group._id ? 'bg-[#c8962a] text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                    }`}>
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-black text-slate-900 group-hover:text-[#c8962a] transition-colors">{group.name}</h3>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5">{group.members?.length || 0} Members</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className={`transition-all ${selectedGroup?._id === group._id ? 'text-[#c8962a] translate-x-1' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>

            {/* Detail View */}
            <div className="lg:col-span-7">
              {selectedGroup ? (
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden sticky top-8">
                  {/* Banner */}
                  <div className="h-32 bg-gradient-to-br from-[#c8962a] to-[#8a6a1e] relative">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                    <div className="absolute -bottom-10 left-8">
                      <div className="w-20 h-20 bg-white rounded-[1.5rem] shadow-xl flex items-center justify-center p-1 border-4 border-white">
                        <div className="w-full h-full bg-slate-50 rounded-xl flex items-center justify-center text-[#c8962a]">
                          <ShieldCheck size={32} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-14 px-8 pb-8 space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-serif font-black text-slate-900">{selectedGroup.name}</h2>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <Calendar size={12} className="text-[#c8962a]" />
                          Created {new Date(selectedGroup.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-[#c8962a] uppercase tracking-widest bg-[#c8962a]/5 px-3 py-1 rounded-full">
                          Official Group
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Info size={14} className="text-[#c8962a]" /> About Group
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        {selectedGroup.description || 'No description provided for this official group.'}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Users size={14} className="text-[#c8962a]" /> Member Directory ({selectedGroup.members?.length || 0})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                        {selectedGroup.members?.map((member) => (
                          <div key={member._id} className="p-3 bg-white border border-slate-100 rounded-xl flex items-center gap-3 hover:border-[#c8962a]/30 transition-all group/member shadow-sm">
                            <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover/member:bg-[#c8962a]/10 group-hover/member:text-[#c8962a] transition-colors">
                              <span className="text-[10px] font-black uppercase">
                                {member.firstName?.[0]}{member.lastName?.[0]}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-black text-slate-900 truncate">
                                {member.firstName} {member.lastName}
                              </p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <Building2 size={10} className="text-slate-300" />
                                <p className="text-[9px] font-bold text-slate-400 truncate">{member.companyName || 'Private Broker'}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 group">
                      Open Group Channel
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[500px] bg-white rounded-[2rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <Info size={32} className="text-slate-200" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-slate-400">Select a group to view details</h3>
                  <p className="text-[10px] font-black text-slate-300 mt-2 uppercase tracking-widest">Explore your memberships and connections</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
              <Users size={40} className="text-slate-200" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-900">No official groups yet</h3>
            <p className="text-[11px] font-black text-slate-400 mt-3 uppercase tracking-[0.2em] max-w-md mx-auto leading-relaxed">
              Groups are managed by official administrators. You will be notified once you are added to a territory or category group.
            </p>
            <button 
              onClick={fetchGroups}
              className="mt-10 px-8 py-3 bg-[#c8962a] text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-lg shadow-[#c8962a]/20 hover:scale-105 transition-all"
            >
              Refresh Status
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
