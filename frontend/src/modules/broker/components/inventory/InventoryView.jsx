import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import PostInventoryForm from './PostInventoryForm';
import Table, { TableRow, TableCell } from '../ui/Table';
import { Search, Filter, Plus, ChevronDown, Download, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { listings } from '../../data/listings';

const InventoryView = ({ title = "Inventory" }) => {
  // Filter States
  const [vertical, setVertical] = useState('Residential');
  const [flow, setFlow] = useState('Availability');
  const [transaction, setTransaction] = useState('Sale');
  const [propertyType, setPropertyType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
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
                          item.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || 
                          (statusFilter === 'Ready' && item.status === 'Active') || 
                          (statusFilter === 'Const' && item.status === 'Pending');

      return matchVertical && matchFlow && matchTransaction && matchPropType && matchSearch && matchStatus;
    });
  }, [vertical, flow, transaction, propertyType, searchTerm, statusFilter]);

  const resetFilters = () => {
    setVertical('Residential');
    setFlow('Availability');
    setTransaction('Sale');
    setPropertyType('All');
    setSearchTerm('');
    setStatusFilter('All');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
          <p className="text-slate-500 font-medium mt-1">Found {filteredData.length} records matching your criteria.</p>
        </div>
        <Button 
          variant="primary" 
          leftIcon={<Plus size={18} />} 
          className="shadow-xl shadow-primary-600/20 py-3.5 px-6 font-bold"
          onClick={() => setIsPostModalOpen(true)}
        >
          Add {vertical} {transaction}
        </Button>
      </div>

      {/* Filter Bar */}
      <Card noPadding className="border-slate-100 shadow-xl shadow-slate-200/20 overflow-visible">
        <div className="p-4 flex flex-col xl:flex-row xl:items-center gap-4 bg-white rounded-2xl">
          {/* Vertical Toggle */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl self-start">
            <button 
              onClick={() => setVertical('Residential')}
              className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${vertical === 'Residential' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Residential
            </button>
            <button 
              onClick={() => setVertical('Commercial')}
              className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${vertical === 'Commercial' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Commercial
            </button>
          </div>

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

      {/* Table Section */}
      <Card noPadding className="border-slate-100 shadow-2xl shadow-slate-200/20 overflow-hidden">
        <Table headers={["Location Info", "Property Details", "Conf", "Area", "Pricing", "Status"]}>
          {filteredData.map((item) => (
            <TableRow key={item.id} className="group cursor-pointer">
              <TableCell>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                       <MapPin size={18} />
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
                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mt-1">ID: #BP-{item.id + 1000}</p>
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

// Internal replacement for missing icon if needed
const MapPin = ({ size, className }) => (
   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
   </svg>
);

export default InventoryView;
