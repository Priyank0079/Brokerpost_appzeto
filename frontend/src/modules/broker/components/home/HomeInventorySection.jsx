import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronDown, 
  MapPin, 
  Building2, 
  User, 
  Home as HomeIcon,
  X,
  LayoutGrid,
  List,
  CheckCircle2,
  Clock,
  Bell,
  LogOut,
  Settings
} from 'lucide-react';
import Table, { TableRow, TableCell } from '../ui/Table';
import Badge from '../ui/Badge';
import { listings } from '../../data/listings';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const InventoryCRMSection = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Residential Inventory');
  const [vertical, setVertical] = useState('Residential');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    'Residential Inventory', 
    'Commercial Inventory',
    'Availability', 
    'Requirement', 
    'Sale', 
    'Multistory Apartments'
  ];

  const resetFilters = () => {
    setActiveTab('Residential Inventory');
    setVertical('Residential');
    setSearchTerm('');
  };

  // Logic to simulate filtering
  const displayData = useMemo(() => {
    return listings.filter(item => {
      // Basic Search
      const matchesSearch = !searchTerm || 
                            item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Vertical Filter (Independent or synced with top tabs)
      const matchesVertical = item.vertical === vertical;

      // Tab Specific Filters
      let matchesTab = true;
      if (activeTab === 'Commercial Inventory') matchesTab = item.vertical === 'Commercial';
      if (activeTab === 'Availability') matchesTab = item.flow === 'Availability';
      if (activeTab === 'Requirement') matchesTab = item.flow === 'Requirement';
      if (activeTab === 'Sale') matchesTab = item.transaction === 'Sale';
      if (activeTab === 'Multistory Apartments') matchesTab = item.type === 'Apartment';

      return matchesSearch && matchesVertical && matchesTab;
    }).slice(0, 6);
  }, [searchTerm, vertical, activeTab]);

  return (
    <section className="px-4 pt-4 pb-12 bg-[#F8FAFC]">
      <div className="max-w-[1400px] mx-auto space-y-4">
        
        {/* CRM Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-4 bg-white/50 rounded-3xl border border-slate-100/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-2xl shadow-primary-600/30">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Broker Inventory Management</h2>
              <div className="flex items-center gap-2 mt-1.5">
                 <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                 </span>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live CRM Dashboard • System Stable</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             {/* Notification */}
             <button className="relative p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all rounded-xl border border-transparent hover:border-primary-100 group">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm ring-1 ring-rose-500/20 group-hover:scale-110 transition-transform">3</span>
             </button>

             <div className="h-10 w-[1px] bg-slate-100" />

             {/* Profile Section */}
             <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/profile')}>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Profile</p>
                   <p className="text-sm font-black text-slate-900 group-hover:text-primary-600 transition-colors">
                      {user?.name || 'Guest Broker'} <span className="text-[10px] ml-0.5 opacity-50">▼</span>
                   </p>
                </div>
                <div className="relative">
                   <div className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-white shadow-xl overflow-hidden group-hover:scale-105 transition-transform">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-50 text-primary-600 font-black text-xs">
                           {user?.name?.substring(0, 2).toUpperCase() || 'BR'}
                        </div>
                      )}
                   </div>
                   <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                </div>
             </div>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <div className="bg-white p-1 rounded-2xl border border-slate-100 shadow-sm flex items-center overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === 'Commercial Inventory') setVertical('Commercial');
                if (tab === 'Residential Inventory') setVertical('Residential');
              }}
              className={`px-6 py-3 text-xs font-black uppercase tracking-widest whitespace-nowrap rounded-xl transition-all ${
                activeTab === tab 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-6 px-6 text-slate-300">
             <div className="w-[1px] h-6 bg-slate-100" />
             <div className="flex items-center gap-4">
                <button 
                  onClick={resetFilters}
                  className="text-[10px] font-black uppercase tracking-tighter text-slate-400 hover:text-primary-600 transition-colors"
                >
                  Clear Filters
                </button>
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg shadow-slate-900/10"
                >
                  <LayoutGrid size={14} />
                  Go to Dashboard
                </Link>
             </div>
          </div>
        </div>

        {/* Dense Dashboard View */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
          
          {/* Main Controls */}
          <div className="p-6 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{activeTab}</h3>
              <div className="flex items-center gap-2">
                 <button className="px-4 py-2 bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2">
                    <X size={14} /> Clear Filters
                 </button>
              </div>
            </div>

            {/* Filter Pills Grid */}
            <div className="flex flex-wrap items-center gap-3 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
               <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm hover:border-primary-200 transition-colors">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100 pr-3 mr-1">Vertical</span>
                  <select 
                    value={vertical}
                    onChange={(e) => setVertical(e.target.value)}
                    className="bg-transparent text-xs font-black text-slate-700 outline-none cursor-pointer appearance-none"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                  <ChevronDown size={12} className="text-slate-400" />
               </div>

               <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm hover:border-primary-200 transition-colors">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100 pr-3 mr-1">Listing Type</span>
                  <select className="bg-transparent text-xs font-black text-slate-700 outline-none cursor-pointer appearance-none">
                    <option>All Types</option>
                    <option>Direct</option>
                    <option>Inventory</option>
                  </select>
                  <ChevronDown size={12} className="text-slate-400" />
               </div>

               <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm hover:border-primary-200 transition-colors">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100 pr-3 mr-1">Availability</span>
                  <select className="bg-transparent text-xs font-black text-slate-700 outline-none cursor-pointer appearance-none">
                    <option>All</option>
                    <option>Ready</option>
                    <option>Construction</option>
                  </select>
                  <ChevronDown size={12} className="text-slate-400" />
               </div>

               <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm hover:border-primary-200 transition-colors">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100 pr-3 mr-1">Transaction</span>
                   <select className="bg-transparent text-xs font-black text-slate-700 outline-none cursor-pointer appearance-none">
                    <option>Sale</option>
                    <option>Rent</option>
                  </select>
                  <ChevronDown size={12} className="text-slate-400" />
               </div>

               <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm group focus-within:ring-2 focus-within:ring-primary-500/20 transition-all ml-auto min-w-[240px]">
                  <Search size={14} className="text-slate-400 group-focus-within:text-primary-600" />
                  <input 
                    type="text" 
                    placeholder="Search inventories, brokers or regions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent text-xs font-black text-slate-700 outline-none flex-1 placeholder:text-slate-300 placeholder:font-bold"
                  />
               </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3">
               <button 
                onClick={() => navigate('/my-listings', { state: { openPostModal: true }})}
                className="px-6 py-4 bg-[#ECFDF5] text-emerald-600 rounded-2xl flex items-center gap-4 group hover:bg-emerald-100 transition-all border border-emerald-100/50 shadow-sm"
               >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                     <Plus size={20} strokeWidth={3} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Available for Sale</span>
               </button>
            </div>

            {/* Content Meta */}
            <div className="flex items-center justify-between">
               <h4 className="text-base font-black text-slate-900 tracking-tight">Active Inventory Units</h4>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{displayData.length} Listings Found</p>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
               <Table headers={["Location", "Project / Society Name", "BHK", "Area (Sq.Ft.)", "Price", "Broker Name", "Status"]}>
                  {displayData.map((item) => (
                    <TableRow 
                      key={item.id} 
                      className="cursor-pointer hover:bg-slate-50/80"
                      onClick={() => navigate(`/property/${item.id}`)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                              <MapPin size={14} />
                           </div>
                           <p className="font-bold text-slate-700">{item.location.split(',')[0]}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                           <p className="font-black text-slate-900">{item.title}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Premium Collection</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-black text-slate-600">{item.beds} BHK</TableCell>
                      <TableCell className="font-bold text-slate-500 italic">{item.sqft.toLocaleString()} Sq.Ft.</TableCell>
                      <TableCell className="font-black text-slate-900">
                        {item.price >= 10000000 ? `₹${(item.price / 10000000).toFixed(2)} Cr` : `₹${(item.price / 100000).toFixed(2)} L`}
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden border border-white shadow-sm">
                               <img src={`https://i.pravatar.cc/100?u=${item.id}`} alt="" />
                            </div>
                            <span className="text-xs font-bold text-slate-700">Broker ID-{item.id + 500}</span>
                         </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={item.status === 'Active' ? 'success' : 'warning'}
                          className="px-3 py-1 flex items-center gap-1.5 w-fit"
                        >
                           {item.status === 'Active' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                           <span className="text-[9px] font-black uppercase tracking-widest">
                              {item.status === 'Active' ? 'Ready to Move' : 'Under Construction'}
                           </span>
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
               </Table>
            </div>
          </div>
          
          {/* Footer Ribbon */}
          <div className="bg-slate-50 p-4 px-6 flex items-center justify-between border-t border-slate-100">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Inventory Status: Synchronized</p>
             <div className="flex items-center gap-2">
                {[1, 2, 3].map(p => (
                  <button key={p} className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${p === 1 ? 'bg-primary-600 text-white shadow-lg' : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-200'}`}>
                    {p}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InventoryCRMSection;
