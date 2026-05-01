import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Eye, 
  Edit3, 
  Trash2, 
  AlertTriangle,
  Search,
  Filter,
  RotateCcw,
  Loader2
} from 'lucide-react';
import Card from '../../broker/components/ui/Card';
import Button from '../../broker/components/ui/Button';
import { AdminTable, AdminTableRow, AdminTableCell, StatusBadge, ActionButton } from '../components/common/AdminUI';
import { getPostings } from '../../broker/services/postingService';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [transactionFilter, setTransactionFilter] = useState('All Transactions');
  const [statusFilter, setStatusFilter] = useState('All Status');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPostings();
        if (res.success) {
          setListings(res.data);
        }
      } catch (err) {
        console.error('Fetch listings error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const brokerName = item.postedBy ? `${item.postedBy.firstName} ${item.postedBy.lastName}` : 'System';
      const title = item.project || item.location;
      
      const matchesSearch = !searchTerm || 
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brokerName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'All Types' || 
        (typeFilter === 'Residential' && item.vertical === 'RESIDENTIAL') ||
        (typeFilter === 'Commercial' && item.vertical === 'COMMERCIAL');

      const matchesTransaction = transactionFilter === 'All Transactions' || 
        (transactionFilter === 'Sale' && (item.intent === 'SALE' || item.intent === 'PURCHASE')) ||
        (transactionFilter === 'Rent' && (item.intent === 'RENT' || item.intent === 'RENTALS' || item.intent === 'LEASE'));

      const matchesStatus = statusFilter === 'All Status' || 
        (statusFilter === 'Active' && item.isActive) ||
        (statusFilter === 'Inactive' && !item.isActive);
      
      return matchesSearch && matchesType && matchesTransaction && matchesStatus;
    });
  }, [listings, searchTerm, typeFilter, transactionFilter, statusFilter]);

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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border-slate-100 text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/5"
            >
               <option>All Status</option>
               <option>Active</option>
               <option>Inactive</option>
            </select>

            <button className="md:col-span-2 flex items-center justify-center gap-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl hover:bg-slate-800 transition-all">
               <Filter size={14} />
               Apply Filters
            </button>
        </div>
      </Card>

      {/* Table Card */}
      <Card noPadding className="border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
         <AdminTable headers={["Property Name", "Details", "Price", "Posted By", "Status", "Actions"]}>
            {loading ? (
              <AdminTableRow>
                <AdminTableCell colSpan={6} className="text-center py-20">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="text-primary-600 animate-spin" size={32} />
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading Listings...</p>
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ) : filteredListings.length === 0 ? (
              <AdminTableRow>
                <AdminTableCell colSpan={6} className="text-center py-20">
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No listings found</p>
                </AdminTableCell>
              </AdminTableRow>
            ) : filteredListings.map(item => (
               <AdminTableRow key={item._id}>
                  <AdminTableCell>
                     <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                           <img 
                            src={item.images?.[0] || `https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=100&h=100&u=${item._id}`} 
                            alt="" 
                            className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                           />
                        </div>
                        <div>
                           <p className="text-sm font-black text-slate-900 leading-tight">{item.project || 'Untitled Project'}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID: #{item._id.slice(-6).toUpperCase()}</p>
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
                           <StatusBadge type={item.vertical === 'RESIDENTIAL' ? 'Residential' : 'Commercial'}>
                             {item.vertical === 'RESIDENTIAL' ? 'Residential' : 'Commercial'}
                           </StatusBadge>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                             {item.intent}
                           </span>
                        </div>
                     </div>
                  </AdminTableCell>
                  <AdminTableCell className="text-sm font-black text-slate-900">
                     {item.totalAmount ? `₹${item.totalAmount} ${item.totalAmountUnit}` : item.budgetMax ? `₹${item.budgetMax} ${item.budgetUnit}` : 'N/A'}
                  </AdminTableCell>
                  <AdminTableCell>
                     <p className="text-sm font-bold text-slate-900 hover:text-primary-600 transition-all cursor-pointer underline decoration-dotted underline-offset-4 decoration-slate-200 hover:decoration-primary-600">
                       {item.postedBy ? `${item.postedBy.firstName} ${item.postedBy.lastName}` : 'N/A'}
                     </p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                       {item.postedBy?.companyName || 'Verified Broker'}
                     </p>
                  </AdminTableCell>
                  <AdminTableCell>
                    <StatusBadge type={item.isActive ? 'Active' : 'Inactive'}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </StatusBadge>
                  </AdminTableCell>
                  <AdminTableCell>
                     <div className="flex items-center gap-1">
                        <ActionButton icon={<Eye size={16} />} label="View Listing" variant="primary" />
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
