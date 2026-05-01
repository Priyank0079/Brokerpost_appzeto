import React, { useState } from 'react';
import { 
  Zap, 
  Calendar, 
  RefreshCw, 
  AlertCircle,
  Search,
  ChevronRight,
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  Check
} from 'lucide-react';
import Card from '../../broker/components/ui/Card';
import Button from '../../broker/components/ui/Button';
import { AdminTable, AdminTableRow, AdminTableCell, StatusBadge, ActionButton } from '../components/common/AdminUI';
import { subscriptions } from '../data/data';
import CreatePlanModal from '../components/common/CreatePlanModal';

const Subscriptions = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [subList, setSubList] = useState(subscriptions);
  const [plansList, setPlansList] = useState([
    { id: 1, name: 'Free', price: 0, duration: 'Lifetime', features: ['Basic Listings', 'Limited Contact Views'], activeUsers: 450 },
    { id: 2, name: 'Silver', price: 4999, duration: '1 Year', features: ['Unlimited Listings', 'Priority Support', 'Group Access'], activeUsers: 128 },
    { id: 3, name: 'Gold', price: 9999, duration: '1 Year', features: ['Verified Badge', 'Featured Listings', 'Direct Leads', 'Advanced Analytics'], activeUsers: 84 },
  ]);

  const handleCreatePlan = (newPlan) => {
    const plan = {
      ...newPlan,
      id: plansList.length + 1,
    };
    setPlansList([...plansList, plan]);
  };

  const handleUpdatePlan = (id) => {
    alert(`Initiating Tier Migration flow for subscription #${9000 + id}`);
  };

  const handleViewLogs = (brokerName) => {
    alert(`Accessing administrative audit logs for ${brokerName}`);
  };

  const filteredSubs = subList.filter(s => 
    s.brokerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Revenue & Plans</h1>
           <p className="text-slate-500 font-medium mt-1">Lifecycle management for broker subscription tiers and upgrades.</p>
        </div>
        <div className="flex items-center gap-3">
           {activeTab === 'users' && (
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Find broker subscription..." 
                  className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none w-64 shadow-sm focus:ring-8 focus:ring-primary-500/5 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
           )}
           {activeTab === 'plans' && (
             <Button 
               variant="primary" 
               className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 shadow-lg shadow-primary-600/20"
               leftIcon={<Plus size={18} />}
               onClick={() => setIsModalOpen(true)}
             >
               Create New Plan
             </Button>
           )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 w-fit rounded-2xl border border-slate-200/60 shadow-inner">
         <button 
           onClick={() => setActiveTab('users')}
           className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'users' ? 'bg-white text-primary-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
         >
           User Subscriptions
         </button>
         <button 
           onClick={() => setActiveTab('plans')}
           className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'plans' ? 'bg-white text-primary-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
         >
           Subscription Plans
         </button>
      </div>

      {activeTab === 'users' ? (
        <Card noPadding className="border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
           <AdminTable headers={["Broker Name", "Current Plan", "Validity Period", "Time Remaining", "Status", "Actions"]}>
              {filteredSubs.map(s => (
                 <AdminTableRow key={s.id} className={`${s.status === 'Expired' ? 'bg-slate-50/40' : ''} group`}>
                    <AdminTableCell>
                       <p className="font-black text-slate-900 text-sm">{s.brokerName}</p>
                       <p className="text-[9px] text-slate-400 font-black uppercase tracking-[2px] mt-1">ID: BRP-{8800 + s.id}</p>
                    </AdminTableCell>
                    <AdminTableCell><StatusBadge type={s.plan}>{s.plan}</StatusBadge></AdminTableCell>
                    <AdminTableCell>
                       <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <Calendar size={12} className="text-slate-300" />
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{s.start} — {s.expiry}</p>
                          </div>
                       </div>
                    </AdminTableCell>
                    <AdminTableCell>
                       <div className="flex items-center gap-3">
                          <div className="flex-1 min-w-[100px] h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                             <div 
                               className={`h-full rounded-full transition-all duration-1000 ${s.status === 'Expired' ? 'bg-slate-300' : 'bg-gradient-to-r from-primary-500 to-primary-600'}`} 
                               style={{ width: s.status === 'Expired' ? '100%' : '65%' }} 
                             />
                          </div>
                          <span className={`text-[10px] font-black tracking-tight ${s.status === 'Expired' ? 'text-slate-400' : 'text-slate-900'}`}>
                             {s.status === 'Expired' ? '0D' : '124D'}
                          </span>
                       </div>
                    </AdminTableCell>
                    <AdminTableCell><StatusBadge type={s.status} /></AdminTableCell>
                    <AdminTableCell>
                       <div className="flex items-center gap-2">
                          <button 
                             onClick={() => handleUpdatePlan(s.id)}
                             className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:border-primary-200 hover:text-primary-600 hover:bg-primary-50/50 transition-all shadow-sm"
                          >
                             <RefreshCw size={12} />
                             Modify
                          </button>
                          <button 
                             onClick={() => handleViewLogs(s.brokerName)}
                             className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                          >
                             <AlertCircle size={18} />
                          </button>
                       </div>
                    </AdminTableCell>
                 </AdminTableRow>
              ))}
           </AdminTable>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
           {plansList.map(plan => (
             <Card key={plan.id} className="relative overflow-hidden border-slate-100 hover:border-primary-200 transition-all group p-0">
                <div className={`h-2 w-full ${plan.name === 'Gold' ? 'bg-amber-400' : plan.name === 'Silver' ? 'bg-slate-300' : 'bg-slate-100'}`} />
                <div className="p-8">
                   <div className="flex items-center justify-between mb-6">
                      <div>
                         <h3 className="text-2xl font-black text-slate-900 tracking-tight">{plan.name}</h3>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tier Level 0{plan.id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                         <button className="p-2 text-slate-300 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"><Edit3 size={18} /></button>
                         <button className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                      </div>
                   </div>

                   <div className="flex items-baseline gap-1 mb-8">
                      <span className="text-3xl font-black text-slate-900">₹{plan.price.toLocaleString()}</span>
                      <span className="text-xs font-bold text-slate-400 uppercase">/ {plan.duration}</span>
                   </div>

                   <div className="space-y-4 mb-10">
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-3">
                           <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                              <Check size={12} />
                           </div>
                           <span className="text-sm font-medium text-slate-600">{f}</span>
                        </div>
                      ))}
                   </div>

                   <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div>
                         <p className="text-lg font-black text-slate-900">{plan.activeUsers}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Brokers</p>
                      </div>
                      <button className="px-5 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">Manage Details</button>
                   </div>
                </div>
             </Card>
           ))}

           <div 
             onClick={() => setIsModalOpen(true)}
             className="border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-4 hover:border-primary-400 hover:bg-primary-50/5 transition-all cursor-pointer group min-h-[400px]"
           >
              <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                 <Plus size={32} />
              </div>
              <div>
                 <h4 className="text-xl font-black text-slate-900">Create New Plan</h4>
                 <p className="text-xs font-medium text-slate-400 mt-2 max-w-[200px] mx-auto">Define new pricing tiers and feature sets for the platform.</p>
              </div>
           </div>
        </div>
      )}

      <CreatePlanModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreatePlan}
      />
    </div>
  );
};

export default Subscriptions;
