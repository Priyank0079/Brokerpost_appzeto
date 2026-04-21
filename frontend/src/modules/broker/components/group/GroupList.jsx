import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import { Users, Plus, Search, Filter, ShieldCheck, ArrowRight } from 'lucide-react';
import { groups } from '../../data/groups';

const GroupList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const openGroupDetails = (group) => {
    setSelectedGroup(group);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Broker Groups</h1>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">Connect • Collaborate • Scale</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="border-slate-200" leftIcon={<Search size={18} />}>Discover Networks</Button>
           <Button variant="primary" className="shadow-lg shadow-primary-600/20" leftIcon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
             Start Group
           </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {groups.map((item) => (
          <Card key={item.id} noPadding className="group hover:border-primary-300 transition-all duration-500 overflow-hidden">
            <div className="h-40 bg-slate-100 relative overflow-hidden">
               <img src={item.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
               <div className="absolute top-4 right-4 focus:ring-4">
                 <Badge variant="dark" className="bg-slate-900/60 backdrop-blur-md border border-white/10 font-bold uppercase tracking-wider">{item.recentPosts} New Updates</Badge>
               </div>
            </div>
            <div className="p-6 relative">
               <div className="absolute -top-10 left-6 w-16 h-16 rounded-2xl bg-white shadow-2xl border border-slate-100 flex items-center justify-center text-primary-600 animate-fade-in">
                  <Users size={32} />
               </div>
               <div className="mt-8 flex items-start justify-between">
                  <div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                       {item.name}
                       <ShieldCheck size={18} className="text-primary-500 shrink-0" />
                    </h4>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="text-[10px] font-black text-blue-600 uppercase tracking-[2px]">{item.members} ACTIVE BROKERS</span>
                       <span className="w-1 h-1 rounded-full bg-slate-300" />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">{item.location}</span>
                    </div>
                  </div>
               </div>
               <p className="text-sm text-slate-500 mt-5 leading-relaxed line-clamp-2 italic">
                  "{item.description}"
               </p>
               <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex -space-x-2.5">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-9 h-9 rounded-xl border-2 border-white bg-slate-50 overflow-hidden shadow-sm">
                         <img src={`https://i.pravatar.cc/100?u=${item.id}${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary-600 font-black uppercase tracking-widest text-[11px] hover:bg-primary-50 px-4 py-2" 
                    rightIcon={<ArrowRight size={14} />}
                    onClick={() => openGroupDetails(item)}
                  >
                    View Network
                  </Button>
               </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Group Details Modal */}
      <Modal 
        isOpen={!!selectedGroup} 
        onClose={() => setSelectedGroup(null)}
        title={selectedGroup?.name}
      >
        {selectedGroup && (
          <div className="space-y-8">
            <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-primary-600 border border-slate-200">
                  <Users size={32} />
               </div>
               <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">{selectedGroup.name}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Founded by {selectedGroup.owner}</p>
               </div>
            </div>

            <div className="space-y-4">
               <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Group Description</h4>
               <p className="text-sm text-slate-600 leading-relaxed font-medium">{selectedGroup.description}</p>
            </div>

            <div className="space-y-4">
               <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Active Members ({selectedGroup.members})</h4>
               <div className="grid grid-cols-1 gap-3">
                  {selectedGroup.membersList.map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-primary-100 transition-all group">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center font-bold text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                             {m.name.charAt(0)}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-900">{m.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.role}</p>
                          </div>
                       </div>
                       <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{m.joined}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="pt-4 flex gap-3">
               <Button variant="primary" className="flex-1 py-4 font-black uppercase tracking-widest text-xs">Send Request to Join</Button>
               <Button variant="outline" className="flex-1 py-4 font-black uppercase tracking-widest text-xs border-slate-200">Message Owner</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Group Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Form New Broker Group"
      >
        <div className="space-y-5">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Network Identity</label>
              <input type="text" className="w-full" placeholder="e.g. South Mumbai Premium Network" />
           </div>
           
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Network Goal</label>
              <textarea className="w-full min-h-[100px]" placeholder="What defines this group? (e.g. Area, Specialization, Goal)"></textarea>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visibility</label>
                 <select className="w-full px-4 py-2 rounded-xl bg-slate-50 border-none font-bold text-xs uppercase tracking-widest">
                    <option>Public Network</option>
                    <option>Private Request</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sector</label>
                 <select className="w-full px-4 py-2 rounded-xl bg-slate-50 border-none font-bold text-xs uppercase tracking-widest">
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Plots/Land</option>
                 </select>
              </div>
           </div>

           <div className="pt-6">
              <Button variant="primary" className="w-full py-4 font-black uppercase tracking-widest text-xs">Initialize Group</Button>
           </div>
        </div>
      </Modal>
    </div>
  );
};


export default GroupList;
