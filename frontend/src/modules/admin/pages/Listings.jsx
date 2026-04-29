import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Eye, 
  Edit3, 
  Trash2, 
  AlertTriangle,
  Search,
  Filter,
  RotateCcw
} from 'lucide-react';
import Card from '../../broker/components/ui/Card';
import Button from '../../broker/components/ui/Button';
import { AdminTable, AdminTableRow, AdminTableCell, StatusBadge, ActionButton } from '../components/common/AdminUI';
import { listings as initialListings } from '../data/data';

const Listings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('All Property Types');
  const [transactionFilter, setTransactionFilter] = useState('All Transactions');
  const [groupFilter, setGroupFilter] = useState('All Groups');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [budgetFilter, setBudgetFilter] = useState('All Budgets');

  const filteredListings = useMemo(() => {
    return initialListings.filter((item) => {
      const matchesSearch = !searchTerm || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.broker.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'All Types' || item.type === typeFilter;
      const matchesTransaction = transactionFilter === 'All Transactions' || item.category === transactionFilter;
      const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
      
      return matchesSearch && matchesType && matchesTransaction && matchesStatus;
    });
  }, [searchTerm, typeFilter, transactionFilter, statusFilter]);

  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('All Types');
    setPropertyTypeFilter('All Property Types');
    setTransactionFilter('All Transactions');
    setGroupFilter('All Groups');
    setStatusFilter('All Status');
    setBudgetFilter('All Budgets');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Listing Moderation</h1>
           <p className="text-slate-500 text-sm mt-1">Monitor property postings and manage content quality.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600" size={16} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search properties..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none w-64 focus:ring-4 focus:ring-primary-500/5 transition-all"
              />
           </div>
           <button 
             onClick={resetFilters}
             className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary-600 transition-all"
             title="Reset Filters"
           >
              <RotateCcw size={20} />
           </button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card noPadding className="border-slate-100 shadow-xl shadow-slate-200/20 overflow-visible">
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 bg-white rounded-2xl">
           <select 
             value={typeFilter}
             onChange={(e) => setTypeFilter(e.target.value)}
             className="bg-slate-50 border-slate-100 text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/5"
           >
              <option>All Types</option>
              <option>Residential</option>
              <option>Commercial</option>
           </select>

           <select 
             value={transactionFilter}
             onChange={(e) => setTransactionFilter(e.target.value)}
             className="bg-slate-50 border-slate-100 text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/5"
           >
              <option>All Transactions</option>
              <option>Sale</option>
              <option>Rent</option>
           </select>

           <select 
             value={groupFilter}
             onChange={(e) => setGroupFilter(e.target.value)}
             className="bg-slate-50 border-slate-100 text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/5"
           >
              <option>All Groups</option>
              <option>Mumbai Luxury Brokers</option>
              <option>South Delhi Top Agents</option>
              <option>Bangalore Tech Park Deals</option>
           </select>

           <select 
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
             className="bg-slate-50 border-slate-100 text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/5"
           >
              <option>All Status</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Spam</option>
           </select>

           <select 
             value={budgetFilter}
             onChange={(e) => setBudgetFilter(e.target.value)}
             className="bg-slate-50 border-slate-100 text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/5"
           >
              <option>All Budgets</option>
              <option>Under 1Cr</option>
              <option>1Cr - 5Cr</option>
              <option>Above 5Cr</option>
           </select>

           <button className="flex items-center justify-center gap-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl hover:bg-slate-800 transition-all">
              <Filter size={14} />
              Apply
           </button>
        </div>
      </Card>

      {/* Table Card */}
      <Card noPadding className="border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
         <AdminTable headers={["Property Name", "Details", "Price", "Posted By", "Status", "Actions"]}>
            {filteredListings.map(item => (
               <AdminTableRow key={item.id}>
                  <AdminTableCell>
                     <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                           <img src={`https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=100&h=100&u=${item.id}`} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        </div>
                        <div>
                           <p className="text-sm font-black text-slate-900 leading-tight">{item.title}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID: #BPS-{1000 + item.id}</p>
                        </div>
                     </div>
                  </AdminTableCell>
                  <AdminTableCell>
                     <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                           <MapPin size={12} className="text-primary-500" />
                           {item.location}
                        </p>
                        <div className="flex items-center gap-2">
                           <StatusBadge type={item.type}>{item.type}</StatusBadge>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</span>
                        </div>
                     </div>
                  </AdminTableCell>
                  <AdminTableCell className="text-sm font-black text-slate-900">
                     ₹{(item.price / 10000000).toFixed(2)} Cr
                  </AdminTableCell>
                  <AdminTableCell>
                     <p className="text-sm font-bold text-slate-900 hover:text-primary-600 transition-all cursor-pointer underline decoration-dotted underline-offset-4 decoration-slate-200 hover:decoration-primary-600">{item.broker}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 cursor-pointer hover:text-slate-900">View History</p>
                  </AdminTableCell>
                  <AdminTableCell><StatusBadge type={item.status} /></AdminTableCell>
                  <AdminTableCell>
                     <div className="flex items-center gap-1">
                        <ActionButton icon={<Eye size={16} />} label="View Listing" variant="primary" />
                        <ActionButton icon={<Edit3 size={16} />} label="Edit" variant="ghost" />
                        <ActionButton icon={<AlertTriangle size={16} />} label="Mark as Spam" variant="danger" />
                        <ActionButton icon={<Trash2 size={16} />} label="Delete" variant="danger" />
                     </div>
                  </AdminTableCell>
               </AdminTableRow>
            ))}
         </AdminTable>
      </Card>
    </div>
  );
};

export default Listings;
