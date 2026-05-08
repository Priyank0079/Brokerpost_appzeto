import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, ArrowLeft, Loader2, Users, List, Building, MapPin, Globe } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyPostings, getPostingStats } from '../services/postingService';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const StatCard = ({ label, value, subtitle, icon: Icon }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md relative overflow-hidden group">
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
        <h3 className="text-2xl font-serif text-[#1e3a8a] leading-none">{value}</h3>
        <p className="text-[10px] text-slate-400 font-medium">{subtitle}</p>
      </div>
      {Icon && (
        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#c8962a] group-hover:bg-[#c8962a]/5 transition-all">
          <Icon size={20} />
        </div>
      )}
    </div>
  </div>
);

const BreakdownRow = ({ label, value }) => (
  <div className="group">
    <div className="flex items-center gap-4">
      <div className="flex flex-col min-w-[140px]">
        <span className="text-[11px] font-medium text-slate-600">{label}</span>
        <span className="text-[9px] text-slate-400 italic">Total active</span>
      </div>
      <div className="flex-1 h-[1px] bg-slate-100 relative top-1" />
      <span className="text-[13px] font-serif text-[#1e3a8a] font-bold w-6 text-right">{value}</span>
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
    breakdown: { residentialAvailable: 0, commercialAvailable: 0, residentialWanted: 0, commercialWanted: 0 },
    recentListings: []
  };

  const getSubtypeDisplay = (subType) => {
    if (!subType) return 'Property';
    return subType.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
  };

  const displayListings = s.recentListings || [];

  return (
    <div className="space-y-8 pb-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 px-2 md:px-0">
        <StatCard 
          label="YOUR LISTINGS" 
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
          value={user?.associatedGroup ? 1 : 0} 
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
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#c8962a]" />
                  <h3 className="text-sm font-bold text-slate-900">Network Inventory Feed</h3>
                </div>
              </div>
              <Link to="/" className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white hover:shadow-sm transition-all">
                View Global Feed
              </Link>
            </div>
            
            {displayListings.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-200">
                  <Globe size={40} />
                </div>
                <h4 className="text-sm font-bold text-slate-900">No Listings Found</h4>
                <p className="text-xs text-slate-400 mt-2 max-w-[200px]">There are no active listings on the platform currently.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Property</th>
                      <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Posted By</th>
                      <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price/Budget</th>
                      <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {displayListings.map(post => (
                      <tr key={post._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Badge variant={post.postType === 'AVAILABILITY' ? 'success' : 'warning'} className="text-[8px] px-1.5 py-0.5 rounded">
                                {post.postType === 'AVAILABILITY' ? 'SELL/RENT' : 'WANTED'}
                              </Badge>
                              <span className="text-[11px] font-bold text-slate-500">{getSubtypeDisplay(post.subType)}</span>
                            </div>
                            <p className="text-xs font-black text-slate-900 mt-0.5 line-clamp-1">{post.project || post.location}</p>
                            <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                              <MapPin size={10} />
                              <span>{post.city || 'NCR'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <p className="text-xs font-bold text-slate-700">
                              {post.postedBy?.firstName ? `${post.postedBy.firstName} ${post.postedBy.lastName}` : (post.postedBy?.name || 'Network Member')}
                            </p>
                            <p className="text-[10px] text-slate-400 line-clamp-1">{post.postedBy?.companyName || 'Verified Broker'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-black text-[#1e3a8a]">
                            {post.totalAmount ? `₹${post.totalAmount} ${post.totalAmountUnit || 'L'}` : (post.budgetMax ? `₹${post.budgetMin}-${post.budgetMax} L` : 'On Request')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link to={`/property/${post._id}`}>
                            <button className="text-[10px] font-black text-[#c8962a] uppercase tracking-widest hover:underline">
                              Details
                            </button>
                          </Link>
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
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30">
              <h3 className="text-sm font-serif font-bold text-[#1e3a8a]">Portfolio Breakdown</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Residential</p>
                <BreakdownRow label="Available for Sale/Rent" value={s.breakdown.residentialAvailable} />
                <BreakdownRow label="Wanted/Requirements" value={s.breakdown.residentialWanted} />
              </div>

              <div className="h-[1px] bg-slate-100 my-4" />

              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Commercial</p>
                <BreakdownRow label="Available for Lease/Sale" value={s.breakdown.commercialAvailable} />
                <BreakdownRow label="Wanted/Requirements" value={s.breakdown.commercialWanted} />
              </div>
            </div>
          </div>

          {/* Quick Tip */}
          <div className="p-5 bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] rounded-xl text-white shadow-lg shadow-blue-900/10">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Quick Tip</h4>
            <p className="text-sm font-medium leading-relaxed">
              Platform Inventory shows all listings currently available across the entire network. Check them out in the global feed!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
