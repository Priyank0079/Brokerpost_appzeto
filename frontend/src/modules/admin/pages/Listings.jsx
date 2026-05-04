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
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [postTypeFilter, setPostTypeFilter] = useState('All Types');
  const [verticalFilter, setVerticalFilter] = useState('All Property Types');
  const [intentFilter, setIntentFilter] = useState('All Transactions');
  const [groupFilter, setGroupFilter] = useState('All Groups');
  const [bhkFilter, setBhkFilter] = useState('All BHK');
  const [constructionStatusFilter, setConstructionStatusFilter] = useState('All Status');
  const [budgetFilter, setBudgetFilter] = useState('All Budgets');
  const [unitFilter, setUnitFilter] = useState('All Units');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsRes, groupsRes] = await Promise.all([
          getPostings(),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/groups`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }).then(res => res.json())
        ]);
        
        if (listingsRes.success) setListings(listingsRes.data);
        if (groupsRes.success) setGroups(groupsRes.data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const brokerName = item.postedBy ? `${item.postedBy.firstName} ${item.postedBy.lastName}`.toLowerCase() : 'system';
      const title = (item.project || '').toLowerCase();
      const location = (item.location || '').toLowerCase();
      const search = searchTerm.toLowerCase();
      
      const matchesSearch = !searchTerm || 
        title.includes(search) ||
        location.includes(search) ||
        brokerName.includes(search);
      
      const matchesPostType = postTypeFilter === 'All Types' || item.postType === postTypeFilter.toUpperCase();
      const matchesVertical = verticalFilter === 'All Property Types' || item.vertical === verticalFilter.toUpperCase();
      const matchesIntent = intentFilter === 'All Transactions' || item.intent === intentFilter.toUpperCase();
      
      const matchesGroup = groupFilter === 'All Groups' || (item.postedBy && groups.find(g => g._id === groupFilter)?.members.some(m => m === item.postedBy._id || m._id === item.postedBy._id));
      
      const matchesBhk = bhkFilter === 'All BHK' || item.bedrooms === bhkFilter;
      const matchesConstruction = constructionStatusFilter === 'All Status' || item.constructionStatus === constructionStatusFilter.toUpperCase();
      
      return matchesSearch && matchesPostType && matchesVertical && matchesIntent && matchesGroup && matchesBhk && matchesConstruction;
    });
  }, [listings, groups, searchTerm, postTypeFilter, verticalFilter, intentFilter, groupFilter, bhkFilter, constructionStatusFilter]);

  const resetFilters = () => {
    setSearchTerm('');
    setPostTypeFilter('All Types');
    setVerticalFilter('All Property Types');
    setIntentFilter('All Transactions');
    setGroupFilter('All Groups');
    setBhkFilter('All BHK');
    setConstructionStatusFilter('All Status');
    setBudgetFilter('All Budgets');
    setUnitFilter('All Units');
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
                placeholder="Search by location, society, broker..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none w-80 focus:ring-4 focus:ring-primary-500/5 transition-all"
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
        <div className="p-5 space-y-4 bg-white rounded-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
             <select 
               value={postTypeFilter}
               onChange={(e) => setPostTypeFilter(e.target.value)}
               className="bg-slate-50 border border-slate-100 text-[11px] font-black uppercase tracking-widest px-4 py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/5 transition-all appearance-none cursor-pointer"
             >
                <option>All Types</option>
                <option>Availability</option>
                <option>Requirement</option>
             </select>

             <select 
               value={verticalFilter}
               onChange={(e) => setVerticalFilter(e.target.value)}
               className="bg-slate-50 border border-slate-100 text-[11px] font-black uppercase tracking-widest px-4 py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/5 transition-all appearance-none cursor-pointer"
             >
                <option>All Property Types</option>
                <option value="RESIDENTIAL">Residential</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="PLOT">Plots</option>
             </select>

             <select 
               value={intentFilter}
               onChange={(e) => setIntentFilter(e.target.value)}
               className="bg-slate-50 border border-slate-100 text-[11px] font-black uppercase tracking-widest px-4 py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/5 transition-all appearance-none cursor-pointer"
             >
                <option>All Transactions</option>
                <option value="SALE">Sale</option>
                <option value="RENT">Rent</option>
                <option value="LEASE">Lease</option>
             </select>

             <select 
               value={groupFilter}
               onChange={(e) => setGroupFilter(e.target.value)}
               className="bg-slate-50 border border-slate-100 text-[11px] font-black uppercase tracking-widest px-4 py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/5 transition-all appearance-none cursor-pointer"
             >
                <option>All Groups</option>
                {groups.map(g => (
                  <option key={g._id} value={g._id}>{g.name}</option>
                ))}
             </select>

             <select 
               value={bhkFilter}
               onChange={(e) => setBhkFilter(e.target.value)}
               className="bg-slate-50 border border-slate-100 text-[11px] font-black uppercase tracking-widest px-4 py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/5 transition-all appearance-none cursor-pointer"
             >
                <option>All BHK</option>
                <option>1 BHK</option>
                <option>2 BHK</option>
                <option>3 BHK</option>
                <option>4 BHK</option>
                <option>5+ BHK</option>
             </select>

             <select 
               value={constructionStatusFilter}
               onChange={(e) => setConstructionStatusFilter(e.target.value)}
               className="bg-slate-50 border border-slate-100 text-[11px] font-black uppercase tracking-widest px-4 py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/5 transition-all appearance-none cursor-pointer"
             >
                <option>All Status</option>
                <option value="READY_TO_MOVE">Ready To Move</option>
                <option value="UNDER_CONSTRUCTION">Under Construction</option>
             </select>

             <select 
               value={budgetFilter}
               onChange={(e) => setBudgetFilter(e.target.value)}
               className="bg-slate-50 border border-slate-100 text-[11px] font-black uppercase tracking-widest px-4 py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/5 transition-all appearance-none cursor-pointer"
             >
                <option>All Budgets</option>
                <option>Below 50L</option>
                <option>50L - 1Cr</option>
                <option>1Cr - 5Cr</option>
                <option>Above 5Cr</option>
             </select>

             <select 
               value={unitFilter}
               onChange={(e) => setUnitFilter(e.target.value)}
               className="bg-slate-50 border border-slate-100 text-[11px] font-black uppercase tracking-widest px-4 py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/5 transition-all appearance-none cursor-pointer"
             >
                <option>All Units</option>
                <option>Apartment</option>
                <option>Villa</option>
                <option>Penthouse</option>
             </select>

             <button className="md:col-span-2 flex items-center justify-center gap-3 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] py-3.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                <Filter size={16} />
                Apply Filters
             </button>
          </div>
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
