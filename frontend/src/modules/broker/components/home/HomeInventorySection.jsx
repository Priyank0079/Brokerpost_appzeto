import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Filter,
  ShieldCheck,
  Bell,
  LayoutGrid,
  ArrowRight,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Phone,
  MessageCircle,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Building,
  Compass,
  Home as HomeIcon,
  Check,
  Share2,
  Bookmark,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Card from '../ui/Card';
import { listings } from '../../data/listings';
import { useAuth } from '../../context/AuthContext';

const phoneByBroker = {
  'John Doe': '9876543210',
  'Jane Smith': '8765432109',
  'Amit Sharma': '9123456780',
  'Priya Verma': '9988776655',
  'Suresh Raina': '8899776655',
  'Rajesh Malhotra': '9876501122',
  'Neha Gupta': '9822334455',
  'Mike Wilson': '9001122334',
};

const bannerSlides = [
  {
    title: 'Broker Network Registration',
    subtitle: 'Connect with agencies in Gurgaon, Delhi, Noida, Faridabad, Ghaziabad & Greater Noida.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600&h=600',
    badge: 'Registration Open',
  },
  {
    title: 'Verified Professional Access',
    subtitle: 'Mandatory RERA registration & Identity verification for every network member.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1600&h=600',
    badge: 'Verified Network',
  },
  {
    title: 'Agency Collaboration Hub',
    subtitle: 'Direct access to premium listings and requirement matching for certified brokers.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600&h=600',
    badge: 'Direct Bridge',
  },
];

const BannerCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[220px] md:h-[400px] w-full overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl my-8 border border-white/10 group">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent z-10" />
        <img
          src={bannerSlides[current].image}
          className="w-full h-full object-cover opacity-60 transition-opacity duration-700"
          alt={bannerSlides[current].title}
        />
      </div>

      <div className="absolute inset-y-0 left-0 p-6 md:p-16 z-20 flex flex-col justify-center max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-600 rounded-full mb-5 shadow-lg shadow-primary-600/20">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
            {bannerSlides[current].badge}
          </span>
        </div>
        <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter mb-3 leading-[0.95] drop-shadow-2xl">
          {bannerSlides[current].title}
        </h2>
        <p className="text-sm md:text-xl text-slate-300 font-medium leading-relaxed mb-8 opacity-90">
          {bannerSlides[current].subtitle}
        </p>

        <Link to="/register">
          <Button
            variant="primary"
            className="rounded-[1.25rem] px-10 py-5 bg-white !text-slate-900 font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:!bg-primary-600 hover:!text-white border-none transition-all transform hover:translate-y-[-2px] active:scale-95 flex items-center gap-3"
            rightIcon={<ArrowRight size={18} strokeWidth={3} />}
          >
            Join Network Now
          </Button>
        </Link>
      </div>

      <div className="absolute bottom-8 right-8 z-30 flex gap-3">
        {bannerSlides.map((_, i) => (
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

const HomeInventorySection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('All Property Types');
  const [transactionFilter, setTransactionFilter] = useState('All Transactions');
  const [sortKey, setSortKey] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupFilter, setGroupFilter] = useState('All Groups');
  const [bhkFilter, setBhkFilter] = useState('All BHK');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [budgetFilter, setBudgetFilter] = useState('All Budgets');
  const [unitFilter, setUnitFilter] = useState('All Units');

  const propertyTypeOptions = useMemo(() => {
    const uniqueTypes = Array.from(new Set(listings.map((item) => item.type)));
    return ['All Property Types', ...uniqueTypes];
  }, []);

  const filteredListings = useMemo(() => {
    const filtered = listings.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.broker.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'All Types' || item.flow === typeFilter;
      const matchesPropertyType =
        propertyTypeFilter === 'All Property Types' || item.type === propertyTypeFilter;
      const matchesTransaction =
        transactionFilter === 'All Transactions' || item.transaction === transactionFilter;
      const matchesGroup = groupFilter === 'All Groups' || item.group === groupFilter;
      const matchesBhk = bhkFilter === 'All BHK' || `${item.beds} BHK` === bhkFilter;
      const matchesStatus = statusFilter === 'All Status' || 
                           (statusFilter === 'Ready to Move' && item.status === 'Active') ||
                           (statusFilter === 'Under Construction' && item.status === 'Pending');
      
      let matchesBudget = true;
      if (budgetFilter !== 'All Budgets') {
        const price = item.price;
        if (budgetFilter === 'Under 50L') matchesBudget = price < 5000000;
        else if (budgetFilter === '50L - 1Cr') matchesBudget = price >= 5000000 && price <= 10000000;
        else if (budgetFilter === '1Cr - 5Cr') matchesBudget = price > 10000000 && price <= 50000000;
        else if (budgetFilter === 'Above 5Cr') matchesBudget = price > 50000000;
      }

      return matchesSearch && matchesType && matchesPropertyType && matchesTransaction && matchesGroup && matchesBhk && matchesStatus && matchesBudget;
    });
    const sorted = [...filtered].sort((a, b) => {
      const getSortValue = (item) => {
        switch (sortKey) {
          case 'propertyType':
            return item.type;
          case 'location':
            return item.location.split(',')[0];
          case 'phone':
            return phoneByBroker[item.broker] || '';
          default:
            return item[sortKey];
        }
      };

      const aValue = getSortValue(a);
      const bValue = getSortValue(b);

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return sortDirection === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    return sorted;
  }, [searchQuery, typeFilter, propertyTypeFilter, transactionFilter, sortKey, sortDirection]);

  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  const handleApplyFilters = () => {
    setSearchQuery(searchInput.trim());
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortKey(key);
    setSortDirection('asc');
  };

  const SortIcon = ({ columnKey }) => {
    if (sortKey !== columnKey) {
      return <ArrowUpDown size={12} className="text-slate-400" />;
    }

    return sortDirection === 'asc'
      ? <ArrowUp size={12} className="text-slate-700" />
      : <ArrowDown size={12} className="text-slate-700" />;
  };

  const handleView = (e, item) => {
    e.stopPropagation();
    if (window.innerWidth >= 1280) { // XL and above for desktop modal
      setSelectedProperty(item);
      setIsModalOpen(true);
    } else {
      navigate(`/property/${item.id}`);
    }
  };

  return (
    <section className="px-4 pt-6 pb-20 bg-[#F8FAFC]">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-4 md:px-8 md:py-4 bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/20">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/10">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Inventory Management</h2>
                <Badge variant="success" className="px-2 py-0.5 rounded-md text-[8px] font-black tracking-widest uppercase">
                  Live
                </Badge>
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

        <BannerCarousel />

        <div className="rounded-[24px] bg-white p-4 md:p-5 shadow-[0_10px_40px_rgba(15,23,42,0.05)] border border-slate-100">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by location, society, broker..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none focus:border-primary-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </div>

            <Button
              variant="primary"
              onClick={handleSearch}
              className="h-[48px] min-w-[220px] bg-orange-500 hover:bg-orange-600 shadow-none text-white font-semibold"
              leftIcon={<Search size={18} />}
            >
              Search
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary-400"
            >
              <option>All Types</option>
              <option>Availability</option>
              <option>Requirement</option>
            </select>

            <select
              value={propertyTypeFilter}
              onChange={(e) => setPropertyTypeFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary-400"
            >
              {propertyTypeOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>

            <select
              value={transactionFilter}
              onChange={(e) => setTransactionFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary-400"
            >
              <option>All Transactions</option>
              <option>Sale</option>
              <option>Rent</option>
            </select>

            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary-400"
            >
              <option value="All Groups">All Groups</option>
              <option value="Mumbai Luxury Brokers">Mumbai Luxury Brokers</option>
              <option value="South Delhi Top Agents">South Delhi Top Agents</option>
              <option value="Bangalore Tech Park Deals">Bangalore Tech Park Deals</option>
            </select>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
            <select
              value={bhkFilter}
              onChange={(e) => setBhkFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary-400"
            >
              <option>All BHK</option>
              <option>1 BHK</option>
              <option>2 BHK</option>
              <option>3 BHK</option>
              <option>4 BHK</option>
              <option>5 BHK</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary-400"
            >
              <option>All Status</option>
              <option>Ready to Move</option>
              <option>Under Construction</option>
            </select>

            <select
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary-400"
            >
              <option>All Budgets</option>
              <option>Under 50L</option>
              <option>50L - 1Cr</option>
              <option>1Cr - 5Cr</option>
              <option>Above 5Cr</option>
            </select>

            <select
              value={unitFilter}
              onChange={(e) => setUnitFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary-400"
            >
              <option>All Units</option>
              <option>Sq. Ft.</option>
              <option>Sq. Yd.</option>
              <option>Sq. Mt.</option>
            </select>

            <Button
              variant="outline"
              onClick={handleApplyFilters}
              className="h-[48px] border-primary-200 text-primary-600 font-semibold"
              leftIcon={<Filter size={16} />}
            >
              Apply Filters
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/20">
          <div className="hidden xl:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  {[
                    ['type', 'Type'],
                    ['propertyType', 'Property Type'],
                    ['transaction', 'Transaction'],
                    ['location', 'Location'],
                    ['title', 'Society Name'],
                    ['broker', 'Broker Name'],
                    ['phone', 'Phone No.'],
                    ['action', 'Action'],
                  ].map(([key, label]) => (
                    <th
                      key={key}
                      className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      {key === 'action' ? (
                        <span className="flex items-center gap-1">Action</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSort(key)}
                          className="w-full flex items-center gap-1.5 justify-start hover:text-slate-900 transition-colors"
                        >
                          <span>{label}</span>
                          <SortIcon columnKey={key} />
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredListings.slice(0, 6).map((item) => (
                  <tr
                    key={item.id}
                    className="cursor-pointer hover:bg-slate-50/60 transition-colors group"
                    onClick={(e) => handleView(e, item)}
                  >
                    <td className="px-4 py-5">
                      <Badge
                        variant={item.flow === 'Availability' ? 'success' : 'warning'}
                        className="rounded-full px-3 py-1 text-[11px] font-bold"
                      >
                        {item.flow}
                      </Badge>
                    </td>
                    <td className="px-4 py-5 text-sm font-medium text-slate-700">{item.type}</td>
                    <td className="px-4 py-5 text-sm font-medium text-slate-600">{item.transaction}</td>
                    <td className="px-4 py-5 text-sm font-medium text-slate-600">{item.location.split(',')[0]}</td>
                    <td className="px-4 py-5 text-sm font-semibold text-slate-900">{item.title}</td>
                    <td className="px-4 py-5 text-sm font-medium text-slate-600">{item.broker}</td>
                    <td className="px-4 py-5 text-sm font-medium text-slate-600">
                      {(() => {
                        const phone = phoneByBroker[item.broker];
                        if (!phone) return '-';
                        return `${phone.slice(0, 2)}******${phone.slice(-2)}`;
                      })()}
                    </td>
                    <td className="px-4 py-5">
                      <Button
                        variant="primary"
                        onClick={(e) => handleView(e, item)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-xs font-bold shadow-none"
                        leftIcon={<Eye size={14} />}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="xl:hidden p-4 space-y-4">
            {filteredListings.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                onClick={() => navigate(`/property/${item.id}`)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge
                      variant={item.flow === 'Availability' ? 'success' : 'warning'}
                      className="rounded-full px-3 py-1 text-[11px] font-bold"
                    >
                      {item.flow}
                    </Badge>
                    <h3 className="mt-3 text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-500">{item.location}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="px-3 py-2 text-xs font-bold"
                    onClick={(e) => handleView(e, item)}
                  >
                    View
                  </Button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Property Type</p>
                    <p className="font-medium text-slate-700">{item.type}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Broker Name</p>
                    <p className="font-medium text-slate-700">{item.broker}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Transaction</p>
                    <p className="font-medium text-slate-700">{item.transaction}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Phone No.</p>
                    <p className="font-medium text-slate-700">
                      {(() => {
                        const phone = phoneByBroker[item.broker];
                        if (!phone) return '-';
                        return `${phone.slice(0, 2)}******${phone.slice(-2)}`;
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Property Spotlight"
      >
        {selectedProperty && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Image & Price Header */}
            <div className="relative rounded-2xl overflow-hidden aspect-video shadow-2xl">
              <img 
                src={selectedProperty.image} 
                className="w-full h-full object-cover" 
                alt={selectedProperty.title}
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant={selectedProperty.flow === 'Availability' ? 'success' : 'warning'} className="px-3 py-1 rounded-full font-black uppercase text-[9px] tracking-widest shadow-xl">
                  {selectedProperty.flow}
                </Badge>
                <Badge className="bg-white/90 backdrop-blur-md text-slate-900 shadow-xl px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                  Verified
                </Badge>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent">
                <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mb-1 italic">Asking Price</p>
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
                  ₹{selectedProperty.price > 0 ? (selectedProperty.price >= 10000000 ? `${(selectedProperty.price / 10000000).toFixed(2)} Cr` : `${(selectedProperty.price / 100000).toFixed(2)} L`) : 'Contact'}
                </h3>
              </div>
            </div>

            {/* Core Info */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-end">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-primary-50 text-primary-600 font-black text-[9px] uppercase px-2 py-1 tracking-wider border-none">
                    {selectedProperty.type}
                  </Badge>
                  <span className="text-slate-300">•</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: #BPS-{selectedProperty.id + 1000}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">{selectedProperty.title}</h2>
                <div className="flex items-center gap-1.5 text-slate-500 font-medium text-sm">
                  <MapPin size={16} className="text-primary-500" />
                  {selectedProperty.location}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="p-3 rounded-xl border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                  <Share2 size={18} />
                </button>
                <button className="p-3 rounded-xl border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                  <Bookmark size={18} />
                </button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Bed size={20} />
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic">Accommodation</p>
                  <p className="text-sm font-black text-slate-900">{selectedProperty.beds || 3} BHK</p>
                </div>
              </div>
              <div className="flex items-center gap-3 border-x border-slate-100 px-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Bath size={20} />
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic">Washrooms</p>
                  <p className="text-sm font-black text-slate-900">{selectedProperty.baths || 3} Luxury</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Square size={20} />
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic">Area</p>
                  <p className="text-sm font-black text-slate-900">{selectedProperty.sqft.toLocaleString()} Sqft</p>
                </div>
              </div>
            </div>

            {/* Narrative */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Detailed Narrative</h4>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Explore this exceptional {selectedProperty.title} located in {selectedProperty.location}. 
                Designed for high-end brokerage standards, this property offers premium visibility and matching requirements in the network.
              </p>
            </div>

            {/* Broker Card */}
            <div className="p-6 bg-slate-900 rounded-[2rem] shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-white p-1 overflow-hidden shadow-2xl transform rotate-3">
                    <img src={`https://i.pravatar.cc/150?u=${selectedProperty.broker}`} alt="" className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center text-white border-4 border-slate-900">
                    <ShieldCheck size={16} />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-xl font-black text-white tracking-tight">{selectedProperty.broker}</h4>
                  <p className="text-primary-400 text-[9px] font-black uppercase tracking-[0.3em] mt-0.5">Verified Network Partner</p>
                  <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                    <div className="text-center">
                      <p className="text-white text-sm font-black">124</p>
                      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Managed</p>
                    </div>
                    <div className="w-[1px] h-4 bg-white/10" />
                    <div className="text-center">
                      <p className="text-white text-sm font-black">4.9</p>
                      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Trust</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <Button className="bg-white text-slate-900 hover:bg-primary-600 hover:text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] border-none transition-all">
                    Call Broker
                  </Button>
                  <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px]">
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default HomeInventorySection;
