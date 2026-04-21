import React, { useState } from 'react';
import { useAuth } from '../../broker/context/AuthContext';
import Card from '../../broker/components/ui/Card';
import Button from '../../broker/components/ui/Button';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Camera, 
  Lock, 
  Save,
  CheckCircle2,
  Terminal,
  Activity,
  Key
} from 'lucide-react';

const AdminProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || 'System Admin',
    email: user?.email || 'admin@gmail.com',
    mobile: user?.mobile || '9111966732',
    adminId: user?.id || 'ADMIN-001',
    accessLevel: 'Level 10 (Full Access)',
    password: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
    setShowPasswordFields(false);
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in py-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-2">
              <ShieldCheck className="text-primary-600" size={24} />
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Superuser Identity</h1>
           </div>
           <p className="text-slate-500 font-medium mt-1 ml-8">Manage terminal credentials and administrative presence.</p>
        </div>
        <div className="flex items-center gap-3">
           {(isEditing || showPasswordFields) ? (
             <>
               <Button variant="ghost" onClick={() => { setIsEditing(false); setShowPasswordFields(false); }} className="font-bold text-slate-400">Cancel</Button>
               <Button variant="primary" onClick={handleSave} leftIcon={<Save size={18} />} className="shadow-lg shadow-primary-600/20 px-8">Commit Changes</Button>
             </>
           ) : (
             <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowPasswordFields(true)} leftIcon={<Lock size={18} />} className="px-6 font-bold bg-white">Change Password</Button>
                <Button variant="primary" onClick={() => setIsEditing(true)} leftIcon={<Key size={18} />} className="px-8 font-bold">Edit Profile</Button>
             </div>
           )}
        </div>
      </div>

      {saveStatus && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-500">
           <CheckCircle2 className="text-emerald-500" size={20} />
           <p className="text-sm font-bold text-emerald-900">Administrative profile synchronized successfully.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Terminal Card */}
        <div className="space-y-6">
           <Card className="overflow-hidden border-slate-100 shadow-xl shadow-slate-200/20 bg-slate-900 text-white">
              <div className="h-1 bg-gradient-to-r from-primary-600 to-blue-400 -mx-6 -mt-6" />
              <div className="mt-6 flex flex-col items-center">
                 <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden">
                       <User size={40} className="text-slate-500" />
                    </div>
                    {isEditing && (
                      <button className="absolute -bottom-2 -right-2 p-2 bg-primary-600 text-white rounded-xl shadow-lg hover:scale-110 transition-transform border-4 border-slate-900">
                         <Camera size={14} />
                      </button>
                    )}
                 </div>
                 <h3 className="text-xl font-black text-white mt-6">{user?.name}</h3>
                 <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mt-2">{user?.role}</p>
              </div>
              
              <div className="mt-10 space-y-4 border-t border-slate-800 pt-6">
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Terminal ID</span>
                    <span className="text-slate-300 font-mono font-bold">{formData.adminId}</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Master Email</span>
                    <span className="text-slate-400 font-bold">{formData.email}</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Uptime</span>
                    <span className="text-emerald-400 font-bold">14d 6h 22m</span>
                 </div>
              </div>
           </Card>

           <Card title="Security Protocol" className="border-slate-100">
              <div className="space-y-2">
                 <button onClick={() => setShowPasswordFields(true)} className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all group">
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                          <Lock size={18} />
                       </div>
                       <span className="text-sm font-bold text-slate-700">Rotate Access Key</span>
                    </div>
                 </button>
                 <button className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all group">
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Activity size={18} />
                       </div>
                       <span className="text-sm font-bold text-slate-700">Audit Logs</span>
                    </div>
                 </button>
              </div>
           </Card>
        </div>

        {/* Right: Master Data */}
        <div className="lg:col-span-2 space-y-6">
           {showPasswordFields ? (
              <Card className="border-slate-100 shadow-xl shadow-slate-200/20 px-8 py-10 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-3 mb-10 border-b border-slate-50 pb-6">
                   <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                      <Lock size={20} />
                   </div>
                   <div>
                      <h4 className="text-xl font-bold text-slate-900 leading-none">Reset Master Access Key</h4>
                      <p className="text-xs text-slate-400 mt-2">Update the superuser passcode for terminal access.</p>
                   </div>
                </div>

                <div className="space-y-6 max-w-md">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                      <input 
                         type="password" 
                         className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all text-sm font-bold text-slate-900"
                         placeholder="••••••••"
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Secure Password</label>
                      <input 
                         type="password" 
                         className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all text-sm font-bold text-slate-900"
                         placeholder="Min 8 characters"
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                      <input 
                         type="password" 
                         className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all text-sm font-bold text-slate-900"
                         placeholder="Repeat new password"
                      />
                   </div>
                </div>
              </Card>
           ) : (
              <Card className="border-slate-100 shadow-xl shadow-slate-200/20 px-8 py-10">
                <div className="flex items-center gap-3 mb-10 border-b border-slate-50 pb-6">
                   <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <Terminal size={20} />
                   </div>
                   <div>
                      <h4 className="text-xl font-bold text-slate-900 leading-none">Administrative Credentials</h4>
                      <p className="text-xs text-slate-400 mt-2">Authenticated terminal identity information.</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Supervisor Name</label>
                      <input 
                         disabled={!isEditing}
                         type="text" 
                         className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-200 focus:ring-8 focus:ring-primary-500/5 transition-all text-sm font-bold text-slate-900 disabled:opacity-60"
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Authority</label>
                      <input 
                         disabled={!isEditing}
                         type="email" 
                         className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-200 focus:ring-8 focus:ring-primary-500/5 transition-all text-sm font-bold text-slate-900 disabled:opacity-60"
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Contact Number</label>
                      <input 
                         disabled={!isEditing}
                         type="text" 
                         className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-200 focus:ring-8 focus:ring-primary-500/5 transition-all text-sm font-bold text-slate-900 disabled:opacity-60"
                         value={formData.mobile}
                         onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      />
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Access Level</label>
                      <input 
                         disabled={true}
                         type="text" 
                         className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-2xl outline-none text-sm font-bold text-slate-400 opacity-60"
                         value={formData.accessLevel}
                      />
                   </div>
                </div>
              </Card>
           )}

           {/* Permission Summary */}
           <div className="p-8 bg-primary-600 rounded-[32px] text-white relative overflow-hidden group">
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                       <ShieldCheck size={18} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Active Privileges</span>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['RERA Override', 'Bulk Deletion', 'Financial Audit', 'Global Broadcast'].map((p, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-primary-100">
                         <div className="w-1 h-1 rounded-full bg-primary-300" />
                         {p}
                      </div>
                    ))}
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
           </div>
        </div>
      </div>
    </div>
  );
};


export default AdminProfile;
