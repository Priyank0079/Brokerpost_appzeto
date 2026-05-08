import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, ArrowLeft, Loader2, Users, List, Building, MapPin } from 'lucide-react';
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
  const [myPostings, setMyPostings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, postingsRes] = await Promise.all([
          getPostingStats(),
          getMyPostings()
        ]);
        
        if (statsRes.success) {
          setStats(statsRes.data);
        }
        if (postingsRes.success) {
          setMyPostings(postingsRes.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
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

  // Fallback values
  const s = stats || {
    myListings: 0,
    totalListings: 0,
    totalBrokers: 0,
    availabilityCount: 0,
    requirementCount: 0,
    breakdown: { residentialAvailable: 0, commercialAvailable: 0, residentialWanted: 0, commercialWanted: 0 }
  };

  const recentListings = [...myPostings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const getSubtypeDisplay = (subType) => {
    if (!subType) return 'Property';
    return subType.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
  };

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
        {/* Recent Listings Column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#c8962a]" />
                <h3 className="text-sm font-bold text-slate-900">My Recent Listings</h3>
              </div>
              <Link to="/my-listings" className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white hover:shadow-sm transition-all">
                Manage All
              </Link>
            </div>
            
            {recentListings.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-200">
                  <List size={40} />
                </div>
                <h4 className="text-sm font-bold text-slate-900">You haven't listed anything yet</h4>
                <p className="text-xs text-slate-400 mt-2 max-w-[200px]">Your listings will appear here once you add them in the inventory sections.</p>
                <div className="mt-6 flex gap-3">
                   <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/residential')}>Add Residential</Button>
                   <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/commercial')}>Add Commercial</Button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {recentListings.map(post => (
                  <div key={post._id} className="p-4 sm:px-6 hover:bg-slate-50/50 transition-colors flex items-center justify-between group">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={post.postType === 'AVAILABILITY' ? 'success' : 'warning'} className="text-[9px] px-2 py-0.5 rounded-md">
                          {post.postType}
                        </Badge>
                        <span className="text-xs font-bold text-slate-700">{getSubtypeDisplay(post.subType)}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900 mt-1">{post.project || post.location}</p>
                      <div className="flex items-center gap-1 text-slate-400">
                        <MapPin size={10} />
                        <span className="text-xs">{post.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-sm font-black text-[#1e3a8a]">
                        {post.totalAmount ? `₹${post.totalAmount} ${post.totalAmountUnit}` : 'Price on Request'}
                      </span>
                      <Link to={`/property/${post._id}`}>
                        <Button variant="outline" className="text-[10px] h-7 px-3 group-hover:bg-[#c8962a] group-hover:text-white group-hover:border-[#c8962a] transition-all">View</Button>
                      </Link>
                    </div>
                  </div>
                ))}
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
