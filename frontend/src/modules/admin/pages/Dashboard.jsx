import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  UserPlus,
  ShieldAlert,
  ArrowDownRight,
  Loader2,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../broker/components/ui/Card';
import { AdminTable, AdminTableRow, AdminTableCell, StatusBadge } from '../components/common/AdminUI';
import { api } from '../../broker/services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentBrokers, setRecentBrokers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, brokersRes] = await Promise.all([
        api.get('/auth/stats'),
        api.get('/auth/brokers')
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (brokersRes.success) {
        // Take top 5 recent
        setRecentBrokers(brokersRes.data.slice(0, 5));
      }
    } catch (err) {
      console.error('Dashboard fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Brokers', value: stats?.totalBrokers || '0', icon: <Users className="text-blue-600" />, trend: '+12%', up: true },
    { label: 'Active Listings', value: stats?.activeListings || '0', icon: <Building2 className="text-purple-600" />, trend: '+5.4%', up: true },
    { label: 'Platform Users', value: (stats?.totalUsers / 1000).toFixed(1) + 'k' || '0', icon: <Activity className="text-emerald-600" />, trend: '+8%', up: true },
    { label: 'Pending Verifications', value: stats?.pendingBrokers || '0', icon: <ShieldAlert className="text-amber-600" />, trend: 'Manual', up: false },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Compiling Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time performance metrics and platform health.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100 h-fit">
           <button className="px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-lg">Real-time</button>
           <button className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-900">History</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s, i) => (
          <Card 
            key={i} 
            noPadding 
            className={`hover:border-primary-100 transition-all group overflow-hidden ${i === 0 ? 'cursor-pointer hover:shadow-lg active:scale-[0.98]' : 'cursor-default'}`}
            onClick={() => i === 0 && navigate('/admin/brokers')}
          >
             <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                   <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center transition-transform group-hover:scale-110">
                      {s.icon}
                   </div>
                   <div className={`flex items-center gap-1 text-xs font-black ${s.up ? 'text-emerald-600' : 'text-amber-500'}`}>
                      {s.up ? <ArrowUpRight size={14} /> : <Clock size={14} />}
                      {s.trend}
                   </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{s.value}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{s.label}</p>
             </div>
             <div className={`h-1.5 w-full bg-slate-100 relative overflow-hidden`}>
                <div className={`absolute left-0 top-0 h-full w-2/3 ${s.up ? 'bg-emerald-500' : 'bg-amber-500'}`} />
             </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Brokers */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">New Registrations</h2>
              <button 
                onClick={() => navigate('/admin/brokers')}
                className="text-xs font-bold text-primary-600 uppercase tracking-widest hover:underline"
              >
                View All Brokers
              </button>
           </div>
           <Card noPadding className="border-slate-100 overflow-hidden">
             <AdminTable headers={["BROKER", "LOCATION", "VERIFICATION", "ACTION"]}>
                {recentBrokers.map(b => (
                   <AdminTableRow key={b._id} className="cursor-pointer hover:bg-slate-50/80 transition-all" onClick={() => navigate(`/admin/brokers/${b._id}`)}>
                      <AdminTableCell>
                         <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold uppercase">
                               {b.firstName?.charAt(0)}
                            </div>
                            <div>
                               <p className="text-sm font-bold text-slate-900">{b.firstName} {b.lastName}</p>
                               <p className="text-[10px] text-slate-400">{b.email}</p>
                            </div>
                         </div>
                      </AdminTableCell>
                      <AdminTableCell className="text-sm text-slate-600 font-medium">{b.operatingCity}</AdminTableCell>
                      <AdminTableCell>
                        <StatusBadge type={b.isVerified ? 'Approved' : 'Pending'} />
                      </AdminTableCell>
                      <AdminTableCell>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/brokers/${b._id}`);
                          }}
                          className="text-[10px] font-black text-primary-600 uppercase hover:underline"
                        >
                          View Profile
                        </button>
                      </AdminTableCell>
                   </AdminTableRow>
                ))}
             </AdminTable>
           </Card>
        </div>

        {/* Activity Feed */}
        <div className="space-y-6">
           <h2 className="text-xl font-bold text-slate-900">System Activity</h2>
           <Card noPadding className="border-slate-100 divide-y divide-slate-50">
              <div className="p-4 flex gap-4 hover:bg-slate-50 transition-all cursor-pointer group">
                 <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <UserPlus size={18} />
                 </div>
                 <div>
                    <p className="text-sm text-slate-600">
                       <span className="font-bold text-slate-900">Sync Success</span>: Registered brokers synchronized with Auth database.
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Active</p>
                 </div>
              </div>
              <div className="p-4 flex gap-4 hover:bg-slate-50 transition-all cursor-pointer group">
                 <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldAlert size={18} />
                 </div>
                 <div>
                    <p className="text-sm text-slate-600">
                       <span className="font-bold text-slate-900">Security Check</span>: 0 vulnerabilities found in recent scans.
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Checked</p>
                 </div>
              </div>
              <div className="p-4 text-center">
                 <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all">View Monitoring Logs</button>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
