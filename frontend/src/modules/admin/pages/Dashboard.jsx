import React from 'react';
import { 
  Users, 
  Building2, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  UserPlus,
  ShieldAlert,
  ArrowDownRight
} from 'lucide-react';
import Card from '../../broker/components/ui/Card';
import { AdminTable, AdminTableRow, AdminTableCell, StatusBadge } from '../components/common/AdminUI';
import { brokers, listings, payments } from '../data/data';

const Dashboard = () => {
  const stats = [
    { label: 'Total Brokers', value: '1,284', icon: <Users className="text-blue-600" />, trend: '+12%', up: true },
    { label: 'Active Listings', value: '4,821', icon: <Building2 className="text-purple-600" />, trend: '+5.4%', up: true },
    { label: 'Platform Users', value: '18.5k', icon: <Activity className="text-emerald-600" />, trend: '+8%', up: true },
    { label: 'Total Revenue', value: '₹12.4L', icon: <TrendingUp className="text-amber-600" />, trend: '-2.1%', up: false },
  ];

  const [groupFilter, setGroupFilter] = React.useState('All Groups');

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics Overview</h1>
            <p className="text-slate-500 text-sm mt-1">Real-time performance metrics and platform health.</p>
          </div>
          <div className="h-10 w-[1px] bg-slate-200 hidden md:block" />
          <select 
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl focus:ring-4 focus:ring-primary-500/5 outline-none shadow-sm"
          >
            <option value="All Groups">Filter: All Groups</option>
            <option value="Mumbai Luxury Brokers">Mumbai Luxury Brokers</option>
            <option value="South Delhi Top Agents">South Delhi Top Agents</option>
            <option value="Bangalore Tech Park Deals">Bangalore Tech Park Deals</option>
          </select>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100 h-fit">
           <button className="px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-lg">Today</button>
           <button className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-900">7 Days</button>
           <button className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-900">30 Days</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <Card key={i} noPadding className="hover:border-primary-100 transition-all group overflow-hidden">
             <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                   <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center transition-transform group-hover:scale-110">
                      {s.icon}
                   </div>
                   <div className={`flex items-center gap-1 text-xs font-black ${s.up ? 'text-emerald-600' : 'text-red-500'}`}>
                      {s.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {s.trend}
                   </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{s.value}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{s.label}</p>
             </div>
             <div className={`h-1.5 w-full bg-slate-100 relative overflow-hidden`}>
                <div className={`absolute left-0 top-0 h-full w-2/3 ${s.up ? 'bg-emerald-500' : 'bg-red-500'}`} />
             </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Brokers */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">New Registrations</h2>
              <button className="text-xs font-bold text-primary-600 uppercase tracking-widest hover:underline">View All Brokers</button>
           </div>
           <Card noPadding className="border-slate-100">
             <AdminTable headers={["Broker", "Location", "Plan", "Status"]}>
                {brokers.slice(0, 5).map(b => (
                   <AdminTableRow key={b.id}>
                      <AdminTableCell>
                         <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold">
                               {b.name.charAt(0)}
                            </div>
                            <div>
                               <p className="text-sm font-bold text-slate-900">{b.name}</p>
                               <p className="text-[10px] text-slate-400">{b.email}</p>
                            </div>
                         </div>
                      </AdminTableCell>
                      <AdminTableCell className="text-sm text-slate-600 font-medium">{b.location}</AdminTableCell>
                      <AdminTableCell><StatusBadge type={b.plan}>{b.plan}</StatusBadge></AdminTableCell>
                      <AdminTableCell><StatusBadge type={b.status}>{b.status}</StatusBadge></AdminTableCell>
                   </AdminTableRow>
                ))}
             </AdminTable>
           </Card>
        </div>

        {/* Activity Feed */}
        <div className="space-y-6">
           <h2 className="text-xl font-bold text-slate-900">Live Activity</h2>
           <Card noPadding className="border-slate-100 divide-y divide-slate-50">
              <div className="p-4 flex gap-4 hover:bg-slate-50 transition-all cursor-pointer group">
                 <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <UserPlus size={18} />
                 </div>
                 <div>
                    <p className="text-sm text-slate-600">
                       <span className="font-bold text-slate-900">New Broker</span> application received from Pune.
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Just Now</p>
                 </div>
              </div>
              <div className="p-4 flex gap-4 hover:bg-slate-50 transition-all cursor-pointer group">
                 <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <ShieldAlert size={18} />
                 </div>
                 <div>
                    <p className="text-sm text-slate-600">
                       <span className="font-bold text-slate-900">Spam Detected</span> in Borivali listing #BPS-442.
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">24 Mins Ago</p>
                 </div>
              </div>
              {payments.slice(0, 2).map(p => (
                <div key={p.id} className="p-4 flex gap-4 hover:bg-slate-50 transition-all cursor-pointer group">
                   <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <TrendingUp size={18} />
                   </div>
                   <div>
                      <p className="text-sm text-slate-600">
                         <span className="font-bold text-slate-900">Payment Success</span> of ₹{(p.amount).toLocaleString()} from {p.brokerName}.
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">2 Hours Ago</p>
                   </div>
                </div>
              ))}
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
