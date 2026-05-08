import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, Loader2, Clock, MapPin, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../broker/services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, userRes] = await Promise.all([
          api.get('/postings/stats'),
          api.get('/auth/me')
        ]);
        
        if (statsRes.success) setStats(statsRes.data);
        if (userRes.success) setUser(userRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'ALL LISTINGS', value: stats?.totalListings || '0', sub: 'Total platform postings', color: 'text-slate-900', path: '/admin/listings' },
    { label: 'ACTIVE BROKERS', value: stats?.totalBrokers || '0', sub: 'Verified professionals', color: 'text-slate-900', path: '/admin/brokers' },
    { label: 'AVAILABILITY', value: stats?.availabilityCount || '0', sub: 'For sale / rent / lease', color: 'text-slate-900', path: '/admin/listings?postType=AVAILABILITY' },
    { label: 'REQUIREMENTS', value: stats?.requirementCount || '0', sub: 'Wanted buy / rent / lease', color: 'text-slate-900', path: '/admin/listings?postType=REQUIREMENT' },
  ];

  const breakdownItems = [
    { label: 'Residential Available', value: stats?.breakdown?.residentialAvailable || '0' },
    { label: 'Residential Wanted', value: stats?.breakdown?.residentialWanted || '0' },
    { label: 'Commercial Available', value: stats?.breakdown?.commercialAvailable || '0' },
    { label: 'Commercial Wanted', value: stats?.breakdown?.commercialWanted || '0' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-[#c0922e]" size={40} />
        <p className="text-sm font-bold text-slate-400">Syncing dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="-mx-4 md:-mx-6 lg:-mx-10 -my-4 md:-my-6 lg:-my-10 px-4 md:px-6 lg:px-10 py-4 md:py-6 lg:py-10 bg-[#faf9f6] min-h-screen">
      <div className="space-y-6 md:space-y-8 pb-10">
        {/* Custom Header */}
        <div className="-mx-4 md:-mx-6 lg:-mx-10 -mt-4 md:-mt-6 lg:-mt-10 mb-4 px-4 md:px-6 lg:px-10 py-3 md:py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 md:gap-6">
            <h1 className="text-base md:text-lg font-serif text-black">Dashboard</h1>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3b82f6]" size={14} />
              <input 
                type="text" 
                placeholder="Search listings..."
                className="w-[180px] lg:w-[240px] pl-9 pr-4 py-1.5 bg-[#fefce8] border border-slate-200 rounded-lg text-[11px] font-medium outline-none focus:border-[#eab308]/40 transition-all text-slate-600"
              />
            </div>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="px-3 md:px-4 py-1.5 rounded-full border border-slate-200 text-black text-[10px] md:text-[11px] font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shrink-0"
          >
            <ArrowLeft size={14} /> 
            <span className="hidden xs:inline">Public Site</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 px-2 md:px-0">
          {statCards.map((card, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate(card.path)}
              className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md cursor-pointer group"
            >
              <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 md:mb-3 group-hover:text-[#c0922e] transition-colors">{card.label}</p>
              <div className="flex flex-col">
                <span className="text-2xl md:text-4xl font-serif text-[#1e3a8a] leading-none">{card.value}</span>
                <span className="text-[10px] md:text-[11px] text-slate-400 font-medium mt-1.5 md:mt-2 truncate">{card.sub}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 px-2 md:px-0">
          {/* Recent Listings Card */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-xs md:text-sm font-bold text-slate-900">Recent Platform Activity</h3>
              <button 
                onClick={() => navigate('/admin/listings')}
                className="px-3 md:px-4 py-1 rounded-lg border border-slate-200 text-[10px] md:text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                View All
              </button>
            </div>
            <div className="flex-1 overflow-x-auto">
              {stats?.recentListings?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 md:py-16 text-center px-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[#faf9f6] rounded-xl flex items-center justify-center mb-4">
                    <span className="text-xl md:text-2xl opacity-40">📋</span>
                  </div>
                  <h4 className="text-sm md:text-base font-bold text-slate-900">No listings yet</h4>
                </div>
              ) : (
                <div className="divide-y divide-slate-50 min-w-[500px]">
                  {stats.recentListings.map((listing) => (
                    <div key={listing._id} className="p-4 hover:bg-slate-50/50 transition-colors flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          listing.postType === 'Availability' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          <span className="text-xs font-bold uppercase">{listing.vertical[0]}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-slate-900 truncate">
                            {listing.vertical} {listing.intent} in {listing.location}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              listing.postType === 'Availability' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {listing.postType}
                            </span>
                            <span className="text-[9px] text-slate-400 font-medium flex items-center gap-1">
                              <MapPin size={8} /> {listing.project || 'Direct'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center justify-end gap-2 mb-1">
                           <User size={10} className="text-slate-300" />
                           <p className="text-[10px] font-bold text-slate-600">{listing.postedBy?.firstName} {listing.postedBy?.lastName}</p>
                        </div>
                        <p className="text-[9px] text-slate-400 font-medium flex items-center justify-end gap-1">
                           <Clock size={8} /> {new Date(listing.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-5 py-4 border-b border-slate-50">
              <h3 className="text-xs md:text-sm font-bold text-slate-900">Inventory Breakdown</h3>
            </div>
            <div className="p-5 md:p-6 space-y-4 md:space-y-6 flex-1">
              {breakdownItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="space-y-1.5 flex-1 mr-6 md:mr-8">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] md:text-[11px] font-bold text-slate-500 group-hover:text-slate-900 transition-colors leading-none truncate">{item.label}</p>
                      <span className="text-xs md:text-[12px] font-serif font-bold text-[#1e3a8a]">{item.value}</span>
                    </div>
                    <div className="w-full h-[3px] bg-slate-100 rounded-full overflow-hidden">
                       <div 
                        className="h-full bg-[#c0922e] transition-all duration-700 ease-out" 
                        style={{ width: `${Math.min((parseInt(item.value) / (stats?.totalListings || 1)) * 100, 100)}%` }}
                       />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
