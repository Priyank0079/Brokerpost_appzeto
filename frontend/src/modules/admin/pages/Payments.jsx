import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Download, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
  Search,
  FileSpreadsheet,
  ArrowLeft
} from 'lucide-react';
import Card from '../../broker/components/ui/Card';
import { AdminTable, AdminTableRow, AdminTableCell, StatusBadge, ActionButton } from '../components/common/AdminUI';
import { payments } from '../data/data';

const Payments = () => {
  const navigate = useNavigate();
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
    <div className="-mx-6 lg:-mx-10 -my-6 lg:-my-10 px-6 lg:px-10 py-6 lg:py-10 bg-[#faf9f6] min-h-screen">
      <div className="space-y-8 animate-fade-in pb-20">
        {/* Custom Header */}
        <div className="-mx-6 lg:-mx-10 -mt-6 lg:-mt-10 mb-4 px-6 lg:px-10 py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-serif text-[#1e3a8a]">Financial Ledger</h1>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c0922e]" />
              <input 
                type="text" 
                placeholder="Search brokerage..."
                className="w-[240px] pl-9 pr-4 py-1.5 bg-[#fefce8] border border-slate-200 rounded-lg text-[11px] font-medium outline-none focus:border-[#eab308]/40 transition-all text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button 
            className="px-4 py-1.5 rounded-full border border-slate-200 text-[#1e3a8a] text-[11px] font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={14} /> Public Site
          </button>
        </div>

        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif text-[#1e3a8a]">Financial Ledger</h2>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight">Full audit trail of all platform-wide payments and subscriptions.</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={handleExport}
               className="flex items-center gap-2 px-6 py-2 bg-[#c0922e] text-white rounded-xl text-[11px] font-bold hover:bg-[#a67d26] transition-all shadow-lg shadow-[#c0922e]/20"
             >
                <FileSpreadsheet size={16} />
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
         <div className="p-6 bg-white border border-slate-100 rounded-lg shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Weekly Volume</p>
            <h4 className="text-2xl font-serif text-[#1e3a8a] tracking-tight">₹1.54L</h4>
         </div>
         <div className="p-6 bg-white border border-slate-100 rounded-lg shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Subscriptions</p>
            <h4 className="text-2xl font-serif text-[#1e3a8a] tracking-tight">842</h4>
         </div>
         <div className="p-6 bg-white border border-slate-100 rounded-lg shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Failed Payments</p>
            <h4 className="text-2xl font-serif text-red-700 tracking-tight">1.2%</h4>
         </div>
      </div>
      </div>
    </div>
  );
};

export default Payments;
