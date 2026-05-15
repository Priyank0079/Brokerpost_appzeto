import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, ArrowLeft, Loader2, Users, List, Building, MapPin, Globe } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyPostings, getPostingStats } from '../services/postingService';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const StatCard = ({ label, value, subtitle, icon: Icon }) => (
  <div className="bg-white p-5 rounded-xl border border-[#ede8df] shadow-sm relative overflow-hidden">
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <p className="text-[11px] font-normal text-[#9ba6ae] tracking-wider mb-2">{label}</p>
        <h3 className="text-2xl font-serif text-[#1e3a5f] leading-none">{value}</h3>
        <p className="text-[10px] text-slate-400 font-medium">{subtitle}</p>
      </div>
    </div>
  </div>
);

const BreakdownRow = ({ label, value, onClick }) => (
  <div 
    className="-mx-2 px-2 py-0.5 rounded-lg"
    onClick={onClick}
  >
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-col min-w-[120px]">
        <span className="text-[10px] text-slate-600 font-medium">{label}</span>
        <span className="text-[8px] text-slate-400">...</span>
      </div>
      <div className="flex-grow h-[3px] bg-[#f3ebd9] rounded-full self-center" />
      <span className="text-xs font-bold text-[#1e3a5f] w-6 text-right">{value}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('network'); // 'my' or 'network'
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const statsRes = await getPostingStats();
      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#c8962a]" size={40} />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const s = stats || {
    myListings: 0,
    totalListings: 0,
    totalBrokers: 0,
    availabilityCount: 0,
    requirementCount: 0,
    groupCount: 0,
    breakdown: { 
      residential: { sale: 0, rent: 0, purchase: 0, wantedRent: 0 },
      commercial: { sale: 0, lease: 0, purchase: 0, wantedLease: 0 }
    },
    recentListings: []
  };

  const getSubtypeDisplay = (subType) => {
    if (!subType) return 'Property';
    return subType.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
  };

  const displayListings = s.recentListings || [];

  return (
    <div className="space-y-8 pb-10">
      <div className="px-2 md:px-0">
        <h1 className="text-2xl font-normal font-serif text-[#0d1b2a]">Welcome back, {user?.firstName}</h1>
        <p className="text-sm text-[#718199] mt-0 tracking-tight font-normal">Your personal inventory & network overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 px-2 md:px-0">
        <StatCard 
          label="MY LISTINGS" 
          value={s.myListings} 
          subtitle="Your active inventory" 
          icon={List}
        />
        <StatCard 
          label="PLATFORM INVENTORY" 
          value={s.totalListings} 
          subtitle="Total system-wide posts" 
          icon={Building}
        />
        <StatCard 
          label="MY GROUPS" 
          value={s.groupCount || 0} 
          subtitle="Groups you belong to" 
          icon={Users}
        />
        <StatCard 
          label="ACTIVE BROKERS" 
          value={s.totalBrokers} 
          subtitle="Verified network" 
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Listings Table Column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-lg border border-[#ede8df] shadow-sm overflow-hidden">
            <div className="px-6 py-2 border-b border-[#ede8df] flex items-center justify-between bg-white">
              <h3 className="text-xs font-semibold text-[#1e3a5f]">My Recent Listings</h3>
              <Link to="/" className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-[#ede8df] text-slate-600 hover:bg-white hover:shadow-sm transition-all">
                View All
              </Link>
            </div>
            
            {displayListings.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-white flex items-center justify-center mb-4 text-slate-300">
                  <span className="text-5xl">📋</span>
                </div>
                <h4 className="text-sm font-bold text-[#1e3a5f]">No listings yet</h4>
                <p className="text-xs text-slate-400 mt-1">Use "+ Add Listing" in each section</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Property</th>
                      <th className="px-6 py-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Posted By</th>
                      <th className="px-6 py-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Price/Budget</th>
                      <th className="px-6 py-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ede8df]">
                    {displayListings.map(post => (
                      <tr 
                        key={post._id} 
                        className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                        onClick={() => navigate(`/property/${post._id}`)}
                      >
                        <td className="px-6 py-0.5">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Badge variant={post.postType === 'AVAILABILITY' ? 'success' : 'warning'} className="text-[8px] px-1.5 py-0.5 rounded">
                                {post.postType === 'AVAILABILITY' ? 'SELL/RENT' : 'WANTED'}
                              </Badge>
                              <span className="text-[10px] font-bold text-slate-500">{getSubtypeDisplay(post.subType)}</span>
                            </div>
                            <p className="text-[11px] font-black text-slate-900 mt-0.5 line-clamp-1">{post.project || post.location}</p>
                            <div className="flex items-center gap-1 text-slate-400 text-[9px]">
                              <MapPin size={10} />
                              <span>{post.city || 'NCR'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-0.5">
                          <div className="flex flex-col">
                            <p className="text-[11px] font-bold text-slate-700">
                              {post.postedBy?.firstName ? `${post.postedBy.firstName} ${post.postedBy.lastName}` : (post.postedBy?.name || 'Network Member')}
                            </p>
                            <p className="text-[9px] text-slate-400 line-clamp-1">{post.postedBy?.companyName || 'Verified Broker'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-0.5">
                          <span className="text-[11px] font-black text-[#1e3a8a]">
                            {post.totalAmount ? `₹${post.totalAmount} ${post.totalAmountUnit || 'L'}` : (post.budgetMax ? `₹${post.budgetMin}-${post.budgetMax} L` : 'On Request')}
                          </span>
                        </td>
                        <td className="px-6 py-0.5 text-right">
                          <button className="text-[9px] font-black text-[#c8962a] uppercase tracking-widest hover:underline">
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Breakdown Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-[#ede8df] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#ede8df] bg-white">
              <h3 className="text-xs font-bold text-[#1e3a5f]">My Listing Breakdown</h3>
            </div>
            
            <div className="px-6 pt-4 pb-6 space-y-1">
              <BreakdownRow label="Residential Available" value={s.breakdown.residential.sale} onClick={() => navigate('/residential?intent=SALE')} />
              <BreakdownRow label="Residential Available" value={s.breakdown.residential.rent} onClick={() => navigate('/residential?intent=RENT')} />
              <BreakdownRow label="Residential Wanted on" value={s.breakdown.residential.purchase} onClick={() => navigate('/residential?intent=PURCHASE')} />
              <BreakdownRow label="Residential Wanted on" value={s.breakdown.residential.wantedRent} onClick={() => navigate('/residential?intent=WANTED_RENT')} />
              
              <BreakdownRow label="Commercial Available" value={s.breakdown.commercial.sale} onClick={() => navigate('/commercial?intent=SALE')} />
              <BreakdownRow label="Commercial Available" value={s.breakdown.commercial.lease} onClick={() => navigate('/commercial?intent=LEASE')} />
              <BreakdownRow label="Commercial Wanted on" value={s.breakdown.commercial.purchase} onClick={() => navigate('/commercial?intent=PURCHASE')} />
              <BreakdownRow label="Commercial Wanted on" value={s.breakdown.commercial.wantedLease} onClick={() => navigate('/commercial?intent=WANTED_LEASE')} />
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Dashboard;
