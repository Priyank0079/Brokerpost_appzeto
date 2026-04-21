import React, { useState } from 'react';
import { 
  Zap, 
  Calendar, 
  RefreshCw, 
  AlertCircle,
  Search,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import Card from '../../broker/components/ui/Card';
import { AdminTable, AdminTableRow, AdminTableCell, StatusBadge, ActionButton } from '../components/common/AdminUI';
import { subscriptions } from '../data/data';

const Subscriptions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subList, setSubList] = useState(subscriptions);

  const handleUpdatePlan = (id) => {
    alert(`Initiating Tier Migration flow for subscription #${9000 + id}`);
  };

  const handleViewLogs = (brokerName) => {
    alert(`Accessing administrative audit logs for ${brokerName}`);
  };

  const filteredSubs = subList.filter(s => 
    s.brokerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Revenue & Plans</h1>
           <p className="text-slate-500 font-medium mt-1">Lifecycle management for broker subscription tiers and upgrades.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Find broker subscription..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none w-64 shadow-sm focus:ring-8 focus:ring-primary-500/5 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>
      </div>


      <Card noPadding classsName="border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
         <AdminTable headers={["Broker Name", "Current Plan", "Validity Period", "Time Remaining", "Status", "Actions"]}>
            {filteredSubs.map(s => (
               <AdminTableRow key={s.id} className={`${s.status === 'Expired' ? 'bg-slate-50/40' : ''} group`}>
                  <AdminTableCell>
                     <p className="font-black text-slate-900 text-sm">{s.brokerName}</p>
                     <p className="text-[9px] text-slate-400 font-black uppercase tracking-[2px] mt-1">ID: BRP-{8800 + s.id}</p>
                  </AdminTableCell>
                  <AdminTableCell><StatusBadge type={s.plan}>{s.plan}</StatusBadge></AdminTableCell>
                  <AdminTableCell>
                     <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <Calendar size={12} className="text-slate-300" />
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{s.start} — {s.expiry}</p>
                        </div>
                     </div>
                  </AdminTableCell>
                  <AdminTableCell>
                     <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-[100px] h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                           <div 
                             className={`h-full rounded-full transition-all duration-1000 ${s.status === 'Expired' ? 'bg-slate-300' : 'bg-gradient-to-r from-primary-500 to-primary-600'}`} 
                             style={{ width: s.status === 'Expired' ? '100%' : '65%' }} 
                           />
                        </div>
                        <span className={`text-[10px] font-black tracking-tight ${s.status === 'Expired' ? 'text-slate-400' : 'text-slate-900'}`}>
                           {s.status === 'Expired' ? '0D' : '124D'}
                        </span>
                     </div>
                  </AdminTableCell>
                  <AdminTableCell><StatusBadge type={s.status} /></AdminTableCell>
                  <AdminTableCell>
                     <div className="flex items-center gap-2">
                        <button 
                           onClick={() => handleUpdatePlan(s.id)}
                           className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:border-primary-200 hover:text-primary-600 hover:bg-primary-50/50 transition-all shadow-sm"
                        >
                           <RefreshCw size={12} />
                           Modify
                        </button>
                        <button 
                           onClick={() => handleViewLogs(s.brokerName)}
                           className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                        >
                           <AlertCircle size={18} />
                        </button>
                     </div>
                  </AdminTableCell>
               </AdminTableRow>
            ))}
         </AdminTable>

      </Card>
    </div>
  );
};

export default Subscriptions;
