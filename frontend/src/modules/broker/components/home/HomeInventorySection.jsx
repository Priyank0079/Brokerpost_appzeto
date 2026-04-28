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
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
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
            className="rounded-2xl px-8 md:px-10 py-4 md:py-5 bg-white text-slate-900 font-black uppercase tracking-widest text-[11px] shadow-2xl hover:bg-primary-600 hover:text-white border-none transition-all transform hover:scale-105 active:scale-95"
            rightIcon={<ArrowRight size={16} />}
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

      return matchesSearch && matchesType && matchesPropertyType && matchesTransaction;
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

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
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
                    onClick={() => navigate(`/property/${item.id}`)}
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
                    <td className="px-4 py-5 text-sm font-medium text-slate-600">{phoneByBroker[item.broker] || '-'}</td>
                    <td className="px-4 py-5">
                      <Button
                        variant="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/property/${item.id}`);
                        }}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/property/${item.id}`);
                    }}
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
                    <p className="font-medium text-slate-700">{phoneByBroker[item.broker] || '-'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeInventorySection;
