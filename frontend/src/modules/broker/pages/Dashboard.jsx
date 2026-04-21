import React, { useState } from 'react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Table, { TableRow, TableCell } from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import PostInventoryForm from '../components/inventory/PostInventoryForm';
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
  ShieldAlert
} from 'lucide-react';

import { listings } from '../data/listings';

const Dashboard = () => {
  const { user } = useAuth();
  const [showPostModal, setShowPostModal] = useState(false);
  const stats = [
    { label: 'Total Posts', value: '45', icon: <FileText className="text-blue-500" />, trend: '+12%', trendUp: true },
    { label: 'Active Listings', value: '12', icon: <CheckCircle2 className="text-emerald-500" />, trend: '+2', trendUp: true },
    { label: 'Requirements', value: '8', icon: <ClipboardList className="text-amber-500" />, trend: '-5%', trendUp: false },
    { label: 'Subscription', value: 'Gold', icon: <Zap className="text-purple-500" />, trend: 'Active', trendUp: true, variant: 'primary' },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Good morning, {user?.name?.split(' ')[0] || 'Broker'}. Welcome to your dashboard.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" leftIcon={<ArrowUpRight size={18} />}>Export Data</Button>
           <Button variant="primary" onClick={() => setShowPostModal(true)} leftIcon={<Plus size={18} />}>New Post</Button>
        </div>
      </div>

      {user?.status === 'Pending Approval' && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-4 animate-pulse">
           <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
              <ShieldAlert size={20} />
           </div>
           <div>
              <p className="text-sm font-bold text-amber-900">Account Pending Approval</p>
              <p className="text-xs text-amber-700">Your professional profile is currently being reviewed by our team. Some features may be limited.</p>
           </div>
        </div>
      )}



      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} noPadding className="hover:border-primary-200 transition-all">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                  {stat.icon}
                </div>
                <Badge variant={stat.label === 'Subscription' ? 'primary' : stat.trendUp ? 'success' : 'danger'}>
                  {stat.trend}
                </Badge>
              </div>
              <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
              <p className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-wider">{stat.label}</p>
            </div>
          </Card>
        ))}
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
          <Card noPadding className="border-slate-100 overflow-hidden">
            <Table headers={["Property", "Type", "Price", "Status"]}>
              {listings.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                         <img src={item.image} alt="" className="w-full h-full object-cover" />
                       </div>
                       <div className="min-w-0">
                         <p className="font-bold text-slate-900 truncate">{item.title}</p>
                         <p className="text-xs text-slate-400 truncate">{item.location}</p>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-bold text-[10px]">{item.type}</Badge>
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">₹{(item.price / 10000000).toFixed(2)} Cr</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'Active' ? 'success' : 'warning'}>
                       {item.status === 'Active' ? 'Verified' : 'Reviewing'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </Card>
        </div>

        {/* Activity Feed */}
        <div className="space-y-6">
           <h2 className="text-xl font-bold text-slate-900">Network Activity</h2>
           <Card noPadding className="divide-y divide-slate-50 border-slate-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                   <div className={`w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 ${i % 2 === 0 ? 'text-blue-500' : 'text-amber-500'}`}>
                      {i % 2 === 0 ? <ExternalLink size={20} /> : <ClipboardList size={20} />}
                   </div>
                   <div className="flex-1">
                      <p className="text-sm text-slate-600 line-clamp-2">
                         <span className="font-bold text-slate-900">Rajesh Malhotra</span> 
                         {i % 2 === 0 ? ' posted a new availability for ' : ' added a requirement for '}
                         <span className="text-primary-600 font-semibold">3BHK in Hiranandani Estate</span>
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">12 MINS AGO</p>
                   </div>
                </div>
              ))}
              <div className="p-4 text-center">
                 <button className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-all uppercase tracking-widest">Load More Activities</button>
              </div>
           </Card>
        </div>
      </div>

      {/* Post Inventory Modal */}
      <Modal 
        isOpen={showPostModal} 
        onClose={() => setShowPostModal(false)}
        title="Post New Inventory"
      >
        <PostInventoryForm onSuccess={() => setShowPostModal(false)} />
      </Modal>
    </div>
  );
};

export default Dashboard;
