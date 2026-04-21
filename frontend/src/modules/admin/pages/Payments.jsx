import React, { useState } from 'react';
import { 
  CreditCard, 
  Download, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
  Search,
  FileSpreadsheet
} from 'lucide-react';
import Card from '../../broker/components/ui/Card';
import { AdminTable, AdminTableRow, AdminTableCell, StatusBadge, ActionButton } from '../components/common/AdminUI';
import { payments } from '../data/data';

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.brokerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
     alert('Exporting transaction history to CSV...');
  };

  const downloadReceipt = (p) => {
     alert(`Downloading invoice for TXN-91${p.id}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Ledger</h1>
           <p className="text-slate-500 font-medium mt-1">Full audit trail of all platform-wide payments and subscriptions.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search brokerage..."
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-8 focus:ring-primary-500/5 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button 
             onClick={handleExport}
             className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
           >
              <FileSpreadsheet size={16} className="text-emerald-400" />
              Export CSV
           </button>
        </div>
      </div>


      <Card noPadding classsName="border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
         <AdminTable headers={["Broker / ID", "Amount", "Plan Tier", "Transaction Date", "Status", "Receipt"]}>
            {filteredPayments.map(p => (
               <AdminTableRow key={p.id}>
                  <AdminTableCell>
                     <p className="text-sm font-black text-slate-900 leading-none">{p.brokerName}</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 font-mono">TXN-{91000 + p.id}</p>
                  </AdminTableCell>
                  <AdminTableCell className="font-black text-slate-900">
                     {p.amount > 0 ? `₹${(p.amount).toLocaleString()}` : <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase font-bold">Free</span>}
                  </AdminTableCell>
                  <AdminTableCell><StatusBadge type={p.plan}>{p.plan}</StatusBadge></AdminTableCell>
                  <AdminTableCell className="text-xs text-slate-500 font-bold">{p.date}</AdminTableCell>
                  <AdminTableCell>
                     <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${p.status === 'Success' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'} shadow-sm`} />
                        <span className={`text-[11px] font-black uppercase tracking-wider ${p.status === 'Success' ? 'text-emerald-600' : 'text-red-500'}`}>{p.status}</span>
                     </div>
                  </AdminTableCell>
                  <AdminTableCell>
                     <button 
                       onClick={() => downloadReceipt(p)}
                       className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all border border-transparent hover:border-primary-100"
                     >
                        <Download size={18} />
                     </button>
                  </AdminTableCell>
               </AdminTableRow>
            ))}
         </AdminTable>

      </Card>
      
      {/* Summary Mini Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Weekly Volume</p>
            <h4 className="text-2xl font-black text-emerald-700 tracking-tight">₹1.54L</h4>
         </div>
         <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Active Subscriptions</p>
            <h4 className="text-2xl font-black text-blue-700 tracking-tight">842</h4>
         </div>
         <div className="p-6 bg-red-50/50 border border-red-100 rounded-2xl">
            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Failed Payments</p>
            <h4 className="text-2xl font-black text-red-700 tracking-tight">1.2%</h4>
         </div>
      </div>
    </div>
  );
};

export default Payments;
