import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Settings,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import Table, { TableRow, TableCell } from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { listings } from '../../data/listings';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BannerCarousel = () => {
  const [current, setCurrent] = useState(0);
  const slides = [
    {
      title: "Broker Network Registration",
      subtitle: "Connect with agencies in Gurgaon, Delhi, Noida, Faridabad, Ghaziabad & Greater Noida.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600&h=600",
      badge: "Registration Open"
    },
    {
      title: "Verified Professional Access",
      subtitle: "Mandatory RERA registration & Identity verification for every network member.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1600&h=600",
      badge: "Verified Network"
    },
    {
      title: "Agency Collaboration Hub",
      subtitle: "Direct access to premium listings and requirement matching for certified brokers.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600&h=600",
      badge: "Direct Bridge"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[220px] md:h-[400px] w-full overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl my-10 border border-white/10 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent z-10" />
          <img 
            src={slides[current].image} 
            className="w-full h-full object-cover opacity-60"
            alt={slides[current].title}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-y-0 left-0 p-8 md:p-16 z-20 flex flex-col justify-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          key={`content-${current}`}
          transition={{ delay: 0.3 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-600 rounded-full mb-6 shadow-lg shadow-primary-600/20">
             <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
             <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{slides[current].badge}</span>
          </div>
          <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-[0.95] drop-shadow-2xl">{slides[current].title}</h2>
          <p className="text-sm md:text-xl text-slate-300 font-medium leading-relaxed mb-10 opacity-90">{slides[current].subtitle}</p>
          
          <div className="flex items-center gap-4">
            <Link to="/register">
              <Button 
                variant="primary"
                className="rounded-2xl px-10 py-5 bg-white text-slate-900 font-black uppercase tracking-widest text-[11px] shadow-2xl hover:bg-primary-600 hover:text-white border-none transition-all transform hover:scale-105 active:scale-95" 
                rightIcon={<ArrowRight size={16} />}
              >
                 Join Network Now
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 right-10 z-30 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${current === i ? 'bg-primary-500 w-12' : 'bg-white/20 hover:bg-white/40 w-4'}`}
          />
        ))}
      </div>
    </div>
  );
};

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

  const displayData = useMemo(() => {
    return listings.filter(item => {
      const matchesSearch = !searchTerm || 
                            item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesVertical = item.vertical === vertical;
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
    <section className="px-4 pt-6 pb-20 bg-[#F8FAFC]">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* CRM Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-4 md:px-8 md:py-4 bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/20">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/10">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                 <h2 className="text-xl font-black text-slate-900 tracking-tight">Inventory Management</h2>
                 <Badge variant="success" className="px-2 py-0.5 rounded-md text-[8px] font-black tracking-widest uppercase">Live</Badge>
              </div>
              <p className="text-[11px] font-medium text-slate-500">Real-time property network and CRM sync</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <Link 
               to="/dashboard" 
               className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg shadow-slate-900/10"
             >
               <LayoutGrid size={14} />
               Dashboard
             </Link>

             <button className="relative w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all rounded-xl border border-slate-100">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary-600 rounded-full border-2 border-white shadow-sm" />
             </button>

             <div className="h-8 w-[1px] bg-slate-100 mx-2" />

             <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/profile')}>
                <div className="text-right hidden sm:block">
                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Active Member</p>
                   <p className="text-[13px] font-black text-slate-900 group-hover:text-primary-600 transition-colors">
                      {user?.name || 'Guest Broker'}
                   </p>
                </div>
                <div className="relative">
                   <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-50 text-primary-600 font-black text-xs">
                           BR
                        </div>
                      )}
                   </div>
                   <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                </div>
             </div>
          </div>
        </div>

        {/* Dynamic Banner Carousel (AFTER HEADER) */}
        <BannerCarousel />

        {/* CRM Navigation & Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-2 rounded-[1.5rem] border border-slate-200 shadow-sm">
           {/* Navigation Tabs */}
           <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide p-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab === 'Commercial Inventory') setVertical('Commercial');
                    if (tab === 'Residential Inventory') setVertical('Residential');
                  }}
                  className={`px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap rounded-xl transition-all duration-200 ${
                    activeTab === tab 
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
           </div>

           {/* Integrated Actions & Search */}
           <div className="flex items-center gap-2 p-1">
              <div className="relative flex-1 lg:w-80 group">
                 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search inventories..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-transparent focus:border-slate-200 focus:bg-white rounded-xl text-xs font-bold text-slate-800 outline-none transition-all placeholder:text-slate-400"
                 />
                 {searchTerm && (
                   <button 
                     onClick={resetFilters}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500 transition-colors"
                   >
                     <X size={14} />
                   </button>
                 )}
              </div>
              
              <button className="p-2.5 bg-slate-50 text-slate-500 hover:text-primary-600 hover:bg-primary-50 border border-slate-100 rounded-xl transition-all" title="Advanced Filters">
                 <Filter size={18} />
              </button>
              
              <button 
                onClick={() => navigate('/my-listings', { state: { openPostModal: true }})}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10"
              >
                <Plus size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Add New</span>
              </button>
           </div>
        </div>

        {/* CRM Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: 'Total Listings', value: listings.length, trend: '+12%', color: 'blue' },
             { label: 'Active Pipeline', value: listings.filter(l => l.status === 'Active').length, trend: '85%', color: 'emerald' },
             { label: 'Pending Review', value: listings.filter(l => l.status === 'Pending').length, trend: '5 new', color: 'amber' },
             { label: 'System Reach', value: '4.8k', trend: '+1.2k', color: 'purple' }
           ].map((stat, i) => (
             <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <div className="flex items-end justify-between mt-2">
                   <h4 className="text-2xl font-black text-slate-900 leading-none">{stat.value}</h4>
                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                     stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                     stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                     stat.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                     'bg-purple-50 text-purple-600'
                   }`}>{stat.trend}</span>
                </div>
             </div>
           ))}
        </div>

        {/* Dense Dashboard View (TABLE) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/20 overflow-hidden">
          
          <div className="p-6 md:p-8 space-y-8">
            {/* Filter Controls Row */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-slate-100">
               <div className="space-y-1">
                  <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${vertical === 'Residential' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                     <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">{activeTab}</h3>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing verified network inventories</p>
               </div>

               <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 hover:border-primary-200 transition-colors">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-200 pr-4">Vertical</span>
                    <select 
                      value={vertical}
                      onChange={(e) => setVertical(e.target.value)}
                      className="bg-transparent text-xs font-black text-slate-700 outline-none cursor-pointer appearance-none min-w-[100px]"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                    <ChevronDown size={14} className="text-slate-400" />
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 hover:border-primary-200 transition-colors">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-200 pr-4">Type</span>
                    <select className="bg-transparent text-xs font-black text-slate-700 outline-none cursor-pointer appearance-none min-w-[80px]">
                      <option>All</option>
                      <option>Direct</option>
                      <option>Inventory</option>
                    </select>
                    <ChevronDown size={14} className="text-slate-400" />
                  </div>

                  <button 
                    onClick={() => navigate('/my-listings', { state: { openPostModal: true }})}
                    className="px-8 py-3.5 bg-emerald-500 text-white rounded-2xl flex items-center gap-3 group hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/30"
                  >
                    <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">New Inventory</span>
                  </button>
               </div>
            </div>

            {/* Data Table */}
            <div className="rounded-2xl border border-slate-100 overflow-hidden bg-white">
               <Table headers={["Location", "Project Name", "Conf.", "Area", "Asking Price", "Broker ID", "Status"]}>
                  {displayData.map((item) => (
                    <TableRow 
                      key={item.id} 
                      className="cursor-pointer hover:bg-slate-50/50 transition-colors group border-b border-slate-50 last:border-0"
                      onClick={() => navigate(`/property/${item.id}`)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                           <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                              <MapPin size={14} />
                           </div>
                           <p className="font-bold text-slate-900 text-sm">{item.location.split(',')[0]}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                           <p className="font-bold text-slate-800 text-sm group-hover:text-primary-600 transition-colors">{item.title}</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Verified Asset</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-slate-600 text-sm">{item.beds} BHK</TableCell>
                      <TableCell className="font-medium text-slate-500 text-sm">{item.sqft.toLocaleString()} <span className="text-[10px] text-slate-400">sq.ft</span></TableCell>
                      <TableCell className="font-black text-slate-900">
                        {item.price >= 10000000 ? `₹${(item.price / 10000000).toFixed(2)} Cr` : `₹${(item.price / 100000).toFixed(2)} L`}
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                               {item.broker.substring(0, 1)}
                            </div>
                            <p className="text-[11px] font-bold text-slate-500 tracking-tight">BPS-{item.id + 500}</p>
                         </div>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                           <div className={`w-1 h-1 rounded-full ${item.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                           {item.status === 'Active' ? 'Verified' : 'Review'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
               </Table>
            </div>
            
            {/* Pagination / Table Footer */}
            <div className="flex items-center justify-between pt-6">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sync Hash: {Math.random().toString(36).substring(7).toUpperCase()}</p>
               <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg">1</button>
                  <button className="w-10 h-10 rounded-xl bg-white text-slate-400 border border-slate-100 hover:border-primary-500 hover:text-primary-600 transition-all font-black text-xs">2</button>
                  <button className="w-10 h-10 rounded-xl bg-white text-slate-400 border border-slate-100 hover:border-primary-500 hover:text-primary-600 transition-all font-black text-xs">3</button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InventoryCRMSection;
