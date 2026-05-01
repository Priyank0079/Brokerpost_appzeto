import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import PostInventoryForm from './PostInventoryForm';
import Table, { TableRow, TableCell } from '../ui/Table';
import { Search, Filter, Plus, ChevronDown, Download, SlidersHorizontal, RotateCcw, MapPin as MapPinIcon, LayoutGrid, List } from 'lucide-react';
import { listings } from '../../data/listings';
import { Link, useNavigate } from 'react-router-dom';
import PropertyCard from '../common/PropertyCard';

const InventoryView = ({
  title = "Inventory",
  defaultVertical = 'Residential',
  verticalOptions = ['Residential', 'Commercial'],
  addButtonLabel,
  addButtonTo,
}) => {
  const navigate = useNavigate();
  // View states
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  // Filter States
  const [vertical, setVertical] = useState(defaultVertical);
  const [flow, setFlow] = useState('Availability');
  const [transaction, setTransaction] = useState('Sale');
  const [propertyType, setPropertyType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [groupFilter, setGroupFilter] = useState('All Groups');
  const [bhkFilter, setBhkFilter] = useState('All BHK');
  const [budgetFilter, setBudgetFilter] = useState('All Budgets');
  const [unitFilter, setUnitFilter] = useState('All Units');
  
  // Modal State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Derived Filtered Data
  const filteredData = useMemo(() => {
    return listings.filter(item => {
      const matchVertical = item.vertical === vertical;
      const matchFlow = item.flow === flow;
      const matchTransaction = item.transaction === transaction;
      const matchPropType = propertyType === 'All' || item.type === propertyType;
      const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.broker.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = statusFilter === 'All' || 
                          (statusFilter === 'Ready' && item.status === 'Active') || 
                          (statusFilter === 'Const' && item.status === 'Pending');

      const matchGroup = groupFilter === 'All Groups' || item.group === groupFilter;
      const matchBhk = bhkFilter === 'All BHK' || `${item.beds} BHK` === bhkFilter;
      
      let matchBudget = true;
      if (budgetFilter !== 'All Budgets') {
        const price = item.price;
        if (budgetFilter === 'Under 50L') matchBudget = price < 5000000;
        else if (budgetFilter === '50L - 1Cr') matchBudget = price >= 5000000 && price <= 10000000;
        else if (budgetFilter === '1Cr - 5Cr') matchBudget = price > 10000000 && price <= 50000000;
        else if (budgetFilter === 'Above 5Cr') matchBudget = price > 50000000;
      }

      return matchVertical && matchFlow && matchTransaction && matchPropType && matchSearch && matchStatus && matchGroup && matchBhk && matchBudget;
    });
  }, [vertical, flow, transaction, propertyType, searchTerm, statusFilter, groupFilter, bhkFilter, budgetFilter]);

  const resetFilters = () => {
    setVertical(defaultVertical);
    setFlow('Availability');
    setTransaction('Sale');
    setPropertyType('All');
    setSearchTerm('');
    setStatusFilter('All');
    setGroupFilter('All Groups');
    setBhkFilter('All BHK');
    setBudgetFilter('All Budgets');
    setUnitFilter('All Units');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
          <p className="text-slate-500 font-medium mt-1">Found {filteredData.length} records matching your criteria.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
             <button 
               onClick={() => setViewMode('grid')}
               className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               title="Grid View"
             >
                <LayoutGrid size={20} />
             </button>
             <button 
               onClick={() => setViewMode('table')}
               className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               title="Table View"
             >
                <List size={20} />
             </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="primary" 
              className="bg-primary-600 hover:bg-primary-700 text-white shadow-xl shadow-primary-600/20 font-bold"
              onClick={() => navigate('/post-property?type=RESIDENTIAL')}
            >
              Post Residential
            </Button>
            <Button 
              variant="primary" 
              className="bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20 font-bold"
              onClick={() => navigate('/post-property?type=COMMERCIAL')}
            >
              Post Commercial
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <Card noPadding className="border-slate-100 shadow-xl shadow-slate-200/20 overflow-visible">
        <div className="p-4 flex flex-col xl:flex-row xl:items-center gap-4 bg-white rounded-2xl">
          {/* Vertical Toggle */}
          {verticalOptions.length > 1 ? (
            <div className="flex bg-slate-100 p-1.5 rounded-xl self-start">
              {verticalOptions.map((option) => (
                <button 
                  key={option}
                  onClick={() => setVertical(option)}
                  className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${vertical === option ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-6 py-2.5 rounded-xl bg-slate-100 text-sm font-bold text-primary-600 self-start">
              {verticalOptions[0]}
            </div>
          )}

          <div className="h-8 w-[1px] bg-slate-100 hidden xl:block" />

          {/* Type Filters */}
          <div className="flex flex-wrap items-center gap-4">
             <div className="flex bg-slate-50 border border-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setFlow('Availability')}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${flow === 'Availability' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400'}`}
                >
                  Availability
                </button>
                <button 
                  onClick={() => setFlow('Requirement')}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${flow === 'Requirement' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400'}`}
                >
                  Requirement
                </button>
             </div>

             <div className="flex items-center gap-2">
                <select 
                  value={transaction}
                  onChange={(e) => setTransaction(e.target.value)}
                  className="bg-slate-50 border-slate-100 text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl focus:ring-4 focus:ring-primary-500/5 outline-none"
                >
                   <option value="Sale">Transaction: Sale</option>
                   <option value="Rent">Transaction: Rent</option>
                </select>

                <select 
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="bg-slate-50 border-slate-100 text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl focus:ring-4 focus:ring-primary-500/5 outline-none"
                >
                   <option value="All">Property Type: All</option>
                   <option value="Apartment">Apartment</option>
                   <option value="Villa">Villa</option>
                   <option value="Penthouse">Penthouse</option>
                   <option value="Office">Office</option>
                   <option value="Shop">Shop</option>
                </select>

                <select 
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                  className="bg-slate-50 border-slate-100 text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl focus:ring-4 focus:ring-primary-500/5 outline-none"
                >
                   <option value="All Groups">Network Group: All</option>
                   <option value="Mumbai Luxury Brokers">Mumbai Luxury Brokers</option>
                   <option value="South Delhi Top Agents">South Delhi Top Agents</option>
                   <option value="Bangalore Tech Park Deals">Bangalore Tech Park Deals</option>
                </select>

                <select 
                  value={bhkFilter}
                  onChange={(e) => setBhkFilter(e.target.value)}
                  className="bg-slate-50 border-slate-100 text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl focus:ring-4 focus:ring-primary-500/5 outline-none"
                >
                   <option value="All BHK">BHK: All</option>
                   <option value="1 BHK">1 BHK</option>
                   <option value="2 BHK">2 BHK</option>
                   <option value="3 BHK">3 BHK</option>
                   <option value="4 BHK">4 BHK</option>
                   <option value="5 BHK">5 BHK</option>
                </select>

                <select 
                  value={budgetFilter}
                  onChange={(e) => setBudgetFilter(e.target.value)}
                  className="bg-slate-50 border-slate-100 text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl focus:ring-4 focus:ring-primary-500/5 outline-none"
                >
                   <option value="All Budgets">Budget: All</option>
                   <option value="Under 50L">Under 50L</option>
                   <option value="50L - 1Cr">50L - 1Cr</option>
                   <option value="1Cr - 5Cr">1Cr - 5Cr</option>
                   <option value="Above 5Cr">Above 5Cr</option>
                </select>

                <select 
                  value={unitFilter}
                  onChange={(e) => setUnitFilter(e.target.value)}
                  className="bg-slate-50 border-slate-100 text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl focus:ring-4 focus:ring-primary-500/5 outline-none"
                >
                   <option value="All Units">Unit: All</option>
                   <option value="Sq. Ft.">Sq. Ft.</option>
                   <option value="Sq. Yd.">Sq. Yd.</option>
                   <option value="Sq. Mt.">Sq. Mt.</option>
                </select>
             </div>

             <div className="relative flex-1 min-w-[250px] group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search project, location or BHK..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-slate-100 rounded-xl text-sm font-medium outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all"
                />
             </div>

             <button 
                onClick={resetFilters}
                className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all rounded-xl"
                title="Reset Filters"
             >
                <RotateCcw size={20} />
             </button>
          </div>
        </div>
      </Card>

      {/* Stats Quick Picks */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        <button 
          onClick={() => setStatusFilter('All')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${statusFilter === 'All' ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-600/20' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
        >
          All Units
        </button>
        <button 
          onClick={() => setStatusFilter('Ready')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${statusFilter === 'Ready' ? 'bg-primary-600 border-primary-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
        >
          Ready to Move
        </button>
        <button 
          onClick={() => setStatusFilter('Const')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${statusFilter === 'Const' ? 'bg-primary-600 border-primary-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
        >
          Under Construction
        </button>
      </div>

      {/* Content Rendering Logic */}
      {viewMode === 'grid' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
             {filteredData.map(item => (
               <PropertyCard key={item.id} item={item} />
             ))}
          </div>
          {filteredData.length === 0 && (
            <div className="py-24 text-center bg-white rounded-[2rem] border border-slate-100 shadow-soft">
               <div className="w-20 h-20 rounded-full bg-slate-50 text-slate-200 flex items-center justify-center mx-auto mb-4">
                  <SlidersHorizontal size={40} />
               </div>
               <h4 className="text-lg font-black text-slate-900 tracking-tight">Focus lost? No listings found.</h4>
               <p className="text-sm text-slate-400 mt-1">Try resetting your filters to explore more of the network.</p>
               <Button variant="outline" className="mt-8 border-slate-200" onClick={resetFilters}>Clear All Filters</Button>
            </div>
          )}
        </div>
      )}

      {viewMode === 'table' && (
        <div className="space-y-6">
          <div className="hidden lg:block">
            <Card noPadding className="border-slate-100 shadow-2xl shadow-slate-200/20 overflow-hidden">
              <Table headers={["Location Info", "Property Details", "Conf", "Area", "Pricing", "Status"]}>
                {filteredData.map((item) => (
                  <TableRow 
                    key={item.id} 
                    className="group cursor-pointer hover:bg-slate-50/80 transition-colors"
                    onClick={() => navigate(`/property/${item.id}`)}
                  >
                    <TableCell>
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                             <MapPinIcon size={18} />
                          </div>
                          <span className="font-bold text-slate-900">{item.location}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 shadow-sm group-hover:scale-105 transition-transform">
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 leading-tight">{item.title}</p>
                          <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mt-1">ID: #BPS-{item.id + 1000}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-black text-slate-600">{item.beds > 0 ? `${item.beds} BHK` : 'N/A'}</TableCell>
                    <TableCell className="text-sm font-bold text-slate-500 italic">{item.sqft.toLocaleString()} Sq Ft</TableCell>
                    <TableCell className="font-black text-slate-900">
                      {item.price > 0 ? (
                        item.price >= 10000000 ? `₹${(item.price / 10000000).toFixed(2)} Cr` : `₹${(item.price / 100000).toFixed(2)} L`
                      ) : (
                        <span className="text-primary-600">Contact</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'Active' ? 'success' : 'warning'} className="font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg border">
                        {item.status === 'Active' ? 'Verified' : 'Reviewing'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </Table>

              {filteredData.length === 0 && (
                <div className="p-24 text-center">
                   <div className="w-20 h-20 rounded-full bg-slate-50 text-slate-200 flex items-center justify-center mx-auto mb-4">
                      <SlidersHorizontal size={40} />
                   </div>
                   <h4 className="text-lg font-black text-slate-900 tracking-tight">No results matched your filters</h4>
                   <p className="text-sm text-slate-400 mt-1">Try resetting your filters to see more results.</p>
                   <Button variant="outline" className="mt-6 border-slate-200" onClick={resetFilters}>Clear All Filters</Button>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:hidden space-y-4">
            {filteredData.map((item) => (
              <div 
                key={item.id} 
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4 active:bg-slate-50 transition-all cursor-pointer"
                onClick={() => navigate(`/property/${item.id}`)}
              >
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                       <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">#BPS-{item.id + 1000}</p>
                          <Badge variant={item.status === 'Active' ? 'success' : 'warning'} className="text-[9px] uppercase tracking-tighter">
                             {item.status === 'Active' ? 'Verified' : 'Reviewing'}
                          </Badge>
                       </div>
                       <h4 className="font-bold text-slate-900 truncate leading-tight">{item.title}</h4>
                       <div className="flex items-center gap-1 text-slate-400 mt-1">
                          <MapPinIcon size={12} />
                          <span className="text-[13px] font-medium truncate">{item.location}</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-50">
                    <div className="text-center">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conf</p>
                       <p className="text-xs font-black text-slate-700 mt-0.5">{item.beds > 0 ? `${item.beds} BHK` : 'N/A'}</p>
                    </div>
                    <div className="text-center border-x border-slate-50">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Area</p>
                       <p className="text-xs font-black text-slate-700 mt-0.5">{item.sqft.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</p>
                       <p className="text-xs font-black text-slate-700 mt-0.5">{item.type}</p>
                    </div>
                 </div>

                 <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Asking Price</span>
                    <span className="font-black text-slate-900 text-lg">
                      {item.price > 0 ? (
                        item.price >= 10000000 ? `₹${(item.price / 10000000).toFixed(2)} Cr` : `₹${(item.price / 100000).toFixed(2)} L`
                      ) : <span className="text-primary-600">Contact</span>}
                    </span>
                 </div>
              </div>
            ))}
            
            {filteredData.length === 0 && (
              <Card className="p-12 text-center">
                 <p className="text-slate-400 font-bold">No inventory found.</p>
                 <Button variant="ghost" size="sm" onClick={resetFilters} className="mt-2">Clear Filters</Button>
              </Card>
            )}
          </div>
        </div>
      )}
      
      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Inventory Health: 100% Stable</p>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest disabled:opacity-30" disabled>Previous</Button>
          <div className="flex items-center gap-1.5">
            <button className="w-9 h-9 rounded-xl bg-primary-600 text-white text-xs font-black shadow-lg shadow-primary-600/20">1</button>
            <button className="w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900 text-xs font-black transition-all">2</button>
            <button className="w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900 text-xs font-black transition-all">3</button>
          </div>
          <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest">Next</Button>
        </div>
      </div>

      {/* Post Modal */}
      <Modal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)}
        title={`New ${vertical} Posting`}
      >
        <PostInventoryForm onSuccess={() => setIsPostModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default InventoryView;
