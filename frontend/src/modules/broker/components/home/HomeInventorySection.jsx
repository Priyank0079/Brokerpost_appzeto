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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-2xl shadow-slate-900/20 transform hover:rotate-3 transition-transform">
              <Building2 size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Broker Inventory</h2>
              <div className="flex items-center gap-2 mt-2">
                 <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">System Live</span>
                 </div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Real-time Network Sync</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <Link 
               to="/dashboard" 
               className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-slate-900/20"
             >
               <LayoutGrid size={16} />
               Dashboard
             </Link>

             <button className="relative w-12 h-12 flex items-center justify-center text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all rounded-2xl border border-slate-100 group">
                <Bell size={22} />
                <span className="absolute top-2 right-2 w-4 h-4 bg-primary-600 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-lg">3</span>
             </button>

             <div className="h-10 w-[1px] bg-slate-100" />

             <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/profile')}>
                <div className="text-right hidden sm:block">
                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Active Member</p>
                   <p className="text-sm font-black text-slate-900 group-hover:text-primary-600 transition-colors">
                      {user?.name || 'Guest Broker'}
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

        {/* Dynamic Banner Carousel (AFTER HEADER) */}
        <BannerCarousel />

        {/* Search & Filter Header Area (AFTER BANNER) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
           {/* Navigation Tabs */}
           <div className="lg:col-span-8 bg-white p-1.5 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/20 flex items-center overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab === 'Commercial Inventory') setVertical('Commercial');
                    if (tab === 'Residential Inventory') setVertical('Residential');
                  }}
                  className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap rounded-2xl transition-all ${
                    activeTab === tab 
                      ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
           </div>

           {/* Global Search Bar */}
           <div className="lg:col-span-4 bg-white p-2 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/20 flex items-center gap-4 group focus-within:ring-4 focus-within:ring-primary-500/10 transition-all px-6">
              <Search size={20} className="text-slate-300 group-focus-within:text-primary-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search premium inventories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-sm font-black text-slate-800 outline-none flex-1 placeholder:text-slate-300 placeholder:font-bold py-3"
              />
              <button 
                onClick={resetFilters}
                className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
              >
                <X size={18} />
              </button>
           </div>
        </div>

        {/* Dense Dashboard View (TABLE) */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          
          <div className="p-8 md:p-12 space-y-10">
            {/* Filter Controls Row */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 pb-8 border-b border-slate-50">
               <div className="space-y-1">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{activeTab}</h3>
                  <p className="text-xs font-bold text-slate-400">Showing verified listings from your active regions.</p>
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
            <div className="rounded-3xl border border-slate-100 overflow-hidden shadow-inner bg-slate-50/30">
               <Table headers={["Location", "Project / Society Name", "BHK", "Area (Sq.Ft.)", "Price", "Broker Details", "Status"]}>
                  {displayData.map((item) => (
                    <TableRow 
                      key={item.id} 
                      className="cursor-pointer hover:bg-white transition-colors group"
                      onClick={() => navigate(`/property/${item.id}`)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <MapPin size={16} />
                           </div>
                           <p className="font-black text-slate-900">{item.location.split(',')[0]}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                           <p className="font-black text-slate-900 group-hover:text-primary-600 transition-colors">{item.title}</p>
                           <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Premium Unit</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-black text-slate-500">{item.beds} BHK</TableCell>
                      <TableCell className="font-bold text-slate-400 italic">{item.sqft.toLocaleString()} Sq.Ft.</TableCell>
                      <TableCell className="font-black text-slate-900 text-lg">
                        {item.price >= 10000000 ? `₹${(item.price / 10000000).toFixed(2)} Cr` : `₹${(item.price / 100000).toFixed(2)} L`}
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                               <img src={`https://i.pravatar.cc/100?u=${item.id}`} alt="" />
                            </div>
                            <div className="leading-tight">
                               <p className="text-[10px] font-black text-slate-900">ID-{item.id + 500}</p>
                               <p className="text-[8px] font-bold text-slate-400 uppercase">Verified Broker</p>
                            </div>
                         </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={item.status === 'Active' ? 'success' : 'warning'}
                          className="px-4 py-1.5 flex items-center gap-2 w-fit rounded-full"
                        >
                           <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                           <span className="text-[9px] font-black uppercase tracking-widest">
                              {item.status === 'Active' ? 'Ready' : 'Progress'}
                           </span>
                        </Badge>
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
