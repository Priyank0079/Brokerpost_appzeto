import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle, 
  Ban, 
  Eye, 
  Trash2,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import Card from '../../broker/components/ui/Card';
import { AdminTable, AdminTableRow, AdminTableCell, StatusBadge, ActionButton } from '../components/common/AdminUI';
import { brokers } from '../data/data';

const Brokers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [brokerList, setBrokerList] = useState(brokers);

  const handleAction = (id, action) => {
    setBrokerList(prev => {
      if (action === 'delete') return prev.filter(b => b.id !== id);
      return prev.map(b => {
        if (b.id !== id) return b;
        switch(action) {
          case 'approve': return { ...b, status: 'Approved' };
          case 'reject': return { ...b, status: 'Rejected' };
          case 'block': return { ...b, status: 'Blocked' };
          default: return b;
        }
      });
    });
  };

  const filteredBrokers = brokerList.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || b.status === filterStatus;
    return matchesSearch && matchesFilter;
  });


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Broker Management</h1>
           <p className="text-slate-500 text-sm mt-1">Review, approve, and manage registered broker accounts.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600" size={16} />
              <input 
                type="text" 
                placeholder="Search name or email..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
              {['All', 'Approved', 'Pending', 'Blocked'].map(s => (
                <button 
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filterStatus === s ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  {s}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Main Table Card */}
      <Card noPadding className="border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
         <AdminTable headers={["Broker Details", "Contact Information", "Subscription", "Status", "Actions"]}>
            {filteredBrokers.map(b => (
               <AdminTableRow key={b.id}>
                  <AdminTableCell>
                     <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm font-black border border-slate-200 shadow-sm transition-transform group-hover:scale-105">
                           {b.name.charAt(0)}
                        </div>
                        <div>
                           <p className="text-sm font-black text-slate-900">{b.name}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-1">
                              <MapPin size={10} className="text-primary-500" />
                              {b.location}
                           </p>
                        </div>
                     </div>
                  </AdminTableCell>
                  <AdminTableCell>
                      <div className="space-y-1">
                         <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                            <Phone size={12} className="text-slate-400" />
                            {b.mobile}
                         </div>
                         <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                            <Mail size={12} className="text-slate-400" />
                            {b.email}
                         </div>
                      </div>
                  </AdminTableCell>
                  <AdminTableCell><StatusBadge type={b.plan} /></AdminTableCell>
                  <AdminTableCell><StatusBadge type={b.status} /></AdminTableCell>
                  <AdminTableCell>
                     <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ActionButton 
                          icon={<Eye size={16} />} 
                          label="View Details" 
                          variant="primary" 
                          onClick={() => alert(`Showing details for ${b.name}`)}
                        />
                        {b.status === 'Pending' && (
                           <>
                              <ActionButton 
                                icon={<CheckCircle2 size={16} />} 
                                label="Approve" 
                                variant="success" 
                                onClick={() => handleAction(b.id, 'approve')}
                              />
                              <ActionButton 
                                icon={<XCircle size={16} />} 
                                label="Reject" 
                                variant="danger" 
                                onClick={() => handleAction(b.id, 'reject')}
                              />
                           </>
                        )}
                        {b.status !== 'Blocked' && (
                           <ActionButton 
                             icon={<Ban size={16} />} 
                             label="Block Broker" 
                             variant="danger" 
                             onClick={() => handleAction(b.id, 'block')}
                           />
                        )}
                        <ActionButton 
                          icon={<Trash2 size={16} />} 
                          label="Delete Account" 
                          variant="danger" 
                          onClick={() => handleAction(b.id, 'delete')}
                        />
                     </div>
                  </AdminTableCell>

               </AdminTableRow>
            ))}
         </AdminTable>

         {filteredBrokers.length === 0 && (
           <div className="p-20 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-200">
                 <Users size={40} />
              </div>
              <div>
                 <h4 className="text-lg font-bold text-slate-900">No brokers found</h4>
                 <p className="text-sm text-slate-400">Try adjusting your search or filters.</p>
              </div>
           </div>
         )}
         
         <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Showing {filteredBrokers.length} Brokers</p>
            <div className="flex items-center gap-2">
               <button className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-all">Previous</button>
               <button className="px-3 py-1.5 text-[10px] font-black uppercase bg-white border border-slate-200 rounded-lg shadow-sm text-slate-900">1</button>
               <button className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-all">Next</button>
            </div>
         </div>
      </Card>
    </div>
  );
};

export default Brokers;
