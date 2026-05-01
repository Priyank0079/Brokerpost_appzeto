import React from 'react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Table, { TableRow, TableCell } from '../components/ui/Table';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  CheckCircle2, 
  ClipboardList, 
  Zap, 
  ArrowUpRight, 
  MoreHorizontal,
  ExternalLink,
  Plus,
  ShieldAlert,
  Building
} from 'lucide-react';

import { listings as staticListings } from '../data/listings';
import { getMyPostings, getPostings } from '../services/postingService';

// Constants for display
const INTENT_MAP = {
  'PURCHASE': 'Sale',
  'RENT': 'Rent',
  'SALE': 'Sale',
  'RENTALS': 'Rent',
  'LEASE': 'Lease'
};

const SUBTYPE_DISPLAY_MAP = {
  'APARTMENTS': 'Apartments',
  'LOW_RISE_FLOORS': 'Low Rise Floors',
  'KOTHI_VILLAS': 'Kothi / Villas',
  'PLOTS': 'Plots',
  'SHOP_SHOWROOM': 'Shop / Showroom',
  'OFFICE': 'Office',
  'WAREHOUSE': 'Warehouse',
  'STANDALONE_BUILDING': 'Standalone Building',
  'PLOT': 'Plot',
  'COMMERCIAL_APARTMENTS': 'Apartments (Com)'
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentPostings, setRecentPostings] = React.useState([]);
  const [stats, setStats] = React.useState([
    { label: 'Total Posts', value: '0', icon: <FileText className="text-blue-500" />, trend: '...', trendUp: true },
    { label: 'Active Listings', value: '0', icon: <CheckCircle2 className="text-emerald-500" />, trend: '...', trendUp: true },
    { label: 'Requirements', value: '0', icon: <ClipboardList className="text-amber-500" />, trend: '...', trendUp: false },
    { label: 'Subscription', value: 'Gold', icon: <Zap className="text-purple-500" />, trend: 'Active', trendUp: true, variant: 'primary' },
  ]);

  const fetchData = async () => {
    try {
      // Fetch my stats
      const myResult = await getMyPostings({ limit: 100 });
      if (myResult.success) {
        const total = myResult.total;
        const active = myResult.data.filter(p => p.postType === 'AVAILABILITY').length;
        const reqs = myResult.data.filter(p => p.postType === 'REQUIREMENT').length;

        setStats(prev => [
          { ...prev[0], value: total.toString() },
          { ...prev[1], value: active.toString() },
          { ...prev[2], value: reqs.toString() },
          prev[3]
        ]);
      }

      // Fetch global recent postings
      const recentResult = await getPostings({ limit: 6 });
      if (recentResult.success) {
        setRecentPostings(recentResult.data);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);


  return (
    <div className="space-y-12 animate-fade-in pb-10">
      {/* Premium Header Section */}
      <div className="relative">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-[2px] bg-primary-600 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600">Executive Control</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
              Strategic <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-900">Overview</span>
            </h1>
            <p className="text-slate-400 font-medium text-sm max-w-md">
              Welcome back, <span className="text-slate-900 font-bold">{user?.name || 'Partner'}</span>. Your real-time network performance is summarized below.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md p-1.5 rounded-full border border-slate-200/60 shadow-sm">
            <button
              onClick={() => navigate('/post-property?type=RESIDENTIAL')}
              className="h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-600/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <Plus size={14} /> Residential
            </button>
            <button
              onClick={() => navigate('/post-property?type=COMMERCIAL')}
              className="h-10 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 active:scale-95 transition-all flex items-center gap-2"
            >
              <Plus size={14} /> Commercial
            </button>
          </div>
        </div>
      </div>

      {user?.status === 'Pending Approval' && (
        <div className="relative overflow-hidden bg-slate-900 rounded-[2rem] p-6 text-white group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary-600/20 transition-all duration-700" />
           <div className="relative flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-primary-400">
                 <ShieldAlert size={28} />
              </div>
              <div>
                 <h4 className="text-lg font-black tracking-tight">Credentials Under Verification</h4>
                 <p className="text-slate-400 text-sm font-medium mt-1">Our compliance team is currently auditing your brokerage profile. Full feature set will be unlocked post-approval.</p>
              </div>
           </div>
        </div>
      )}

      {/* High-Fidelity Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => {
          const getRoute = (label) => {
            switch(label) {
              case 'Total Posts':
              case 'Active Listings': return '/my-listings';
              case 'Requirements': return '/my-requirements';
              case 'Subscription': return '/subscription';
              default: return '/dashboard';
            }
          };

          return (
            <div 
              key={i} 
              className="relative group cursor-pointer active:scale-95 transition-all duration-500"
              onClick={() => navigate(getRoute(stat.label))}
            >
              {/* Card Background with Layered Effects */}
              <div className="absolute inset-0 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-500" />
              <div className="absolute inset-x-6 -bottom-2 h-10 bg-slate-900/[0.02] blur-xl rounded-[2.5rem]" />
              
              <div className="relative p-8 overflow-hidden rounded-[2.5rem] border border-slate-100 group-hover:border-primary-100 transition-all duration-500">
                {/* Decorative Pattern */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 scale-0 group-hover:scale-150" />
                
                <div className="flex items-center justify-between mb-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${stat.label === 'Subscription' ? 'bg-primary-50 text-primary-600' : 'bg-slate-50 text-slate-600 group-hover:bg-primary-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary-600/30'}`}>
                    {React.cloneElement(stat.icon, { size: 24, strokeWidth: 2.5 })}
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.1em] uppercase ${stat.label === 'Subscription' ? 'bg-primary-600 text-white' : stat.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {stat.trend}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter transition-all duration-500 group-hover:translate-x-1">{stat.value}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                    <div className="flex-1 h-[1px] bg-slate-100 group-hover:bg-primary-100 transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Listings */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-bold text-slate-900">Recent Postings</h2>
             <Button variant="ghost" size="sm" className="text-primary-600 font-bold" rightIcon={<ArrowUpRight size={14} />}>
               Go to Inventory
             </Button>
          </div>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Card noPadding className="border-slate-100 overflow-hidden">
              <Table headers={["Property", "Type", "Budget/Price", "Status"]}>
                {recentPostings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="4" className="text-center py-10 text-slate-400">No recent postings</TableCell>
                  </TableRow>
                ) : (
                  recentPostings.map((item) => (
                    <TableRow key={item._id} className="cursor-pointer hover:bg-slate-50" onClick={() => navigate(`/property/${item._id}`)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                             <Building size={20} className="text-slate-400" />
                           </div>
                           <div className="min-w-0">
                             <p className="font-bold text-slate-900 truncate">{item.project || 'No Project'}</p>
                             <p className="text-xs text-slate-400 truncate">{item.location}</p>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-bold text-[10px]">{SUBTYPE_DISPLAY_MAP[item.subType]}</Badge>
                      </TableCell>
                      <TableCell className="font-bold text-slate-900">
                        {item.totalAmount ? `₹${item.totalAmount} ${item.totalAmountUnit}` : item.budgetMax ? `₹${item.budgetMax} ${item.budgetUnit}` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.postType === 'AVAILABILITY' ? 'success' : 'warning'}>
                           {item.postType === 'AVAILABILITY' ? 'Available' : 'Wanted'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </Table>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {recentPostings.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4" onClick={() => navigate(`/property/${item._id}`)}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                    <Building size={24} className="text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary" className="font-extrabold text-[10px] uppercase">{SUBTYPE_DISPLAY_MAP[item.subType]}</Badge>
                      <Badge variant={item.postType === 'AVAILABILITY' ? 'success' : 'warning'} className="text-[10px]">
                         {item.postType === 'AVAILABILITY' ? 'Available' : 'Wanted'}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-slate-900 truncate mt-1">{item.project || 'No Project'}</h4>
                    <p className="text-xs text-slate-500 truncate">{item.location}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Budget/Price</span>
                  <span className="font-black text-slate-900 text-lg">
                    {item.totalAmount ? `₹${item.totalAmount} ${item.totalAmountUnit}` : item.budgetMax ? `₹${item.budgetMax} ${item.budgetUnit}` : 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-6">
           <h2 className="text-xl font-bold text-slate-900">Network Activity</h2>
           <Card noPadding className="divide-y divide-slate-50 border-slate-100">
              {recentPostings.length === 0 ? (
                 <div className="p-8 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">No activity yet</div>
               ) : (
                 recentPostings.map((item) => (
                  <div key={item._id} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => navigate(`/property/${item._id}`)}>
                     <div className={`w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 ${item.postType === 'AVAILABILITY' ? 'text-blue-500' : 'text-amber-500'}`}>
                        {item.postType === 'AVAILABILITY' ? <ExternalLink size={20} /> : <ClipboardList size={20} />}
                     </div>
                     <div className="flex-1">
                        <p className="text-sm text-slate-600 line-clamp-2">
                           <span className="font-bold text-slate-900">{item.postedBy ? `${item.postedBy.firstName} ${item.postedBy.lastName}` : 'System Agent'}</span> 
                           {item.postType === 'AVAILABILITY' ? ' posted a new availability for ' : ' added a requirement for '}
                           <span className="text-primary-600 font-semibold">
                             {item.bedrooms ? `${item.bedrooms} BHK` : SUBTYPE_DISPLAY_MAP[item.subType]} in {item.location}
                           </span>
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                     </div>
                  </div>
                ))
               )}
               <div className="p-4 text-center">
                  <button onClick={() => navigate('/feed')} className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-all uppercase tracking-widest">View Global Feed</button>
               </div>
            </Card>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
