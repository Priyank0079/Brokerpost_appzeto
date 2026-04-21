import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Camera, 
  Lock, 
  Bell, 
  ChevronRight,
  Save,
  CheckCircle2,
  Trash2
} from 'lucide-react';

const Profile = ({ title = "My Profile" }) => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    officeAddress: user?.officeAddress || 'Not set',
    workLocation: user?.workLocation || 'Mumbai',
    reraNumber: user?.reraNumber || 'Not set',
    groupName: user?.groupName || 'Not set'
  });

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in py-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
           <p className="text-slate-500 font-medium mt-1">Manage your professional identity and account settings.</p>
        </div>
        <div className="flex items-center gap-3">
           {isEditing ? (
             <>
               <Button variant="ghost" onClick={() => setIsEditing(false)} className="font-bold text-slate-400">Discard</Button>
               <Button variant="primary" onClick={handleSave} leftIcon={<Save size={18} />} className="shadow-lg shadow-primary-600/20 px-8">Save Changes</Button>
             </>
           ) : (
             <Button variant="primary" onClick={() => setIsEditing(true)} leftIcon={<Camera size={18} />} className="px-8 font-bold">Edit Profile</Button>
           )}
        </div>
      </div>

      {saveStatus && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-500">
           <CheckCircle2 className="text-emerald-500" size={20} />
           <p className="text-sm font-bold text-emerald-900">Profile updated successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Visual Profile */}
        <div className="space-y-6">
           <Card className="text-center overflow-hidden border-slate-100 shadow-xl shadow-slate-200/20">
              <div className="h-24 bg-gradient-to-br from-primary-600 to-blue-700 -mx-6 -mt-6" />
              <div className="relative -mt-12 mb-6 inline-block">
                 <div className="w-24 h-24 rounded-3xl bg-white p-1.5 shadow-2xl relative">
                    <div className="w-full h-full rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-100">
                       {user?.avatar ? (
                         <img src={user.avatar} className="w-full h-full object-cover" />
                       ) : (
                         <User size={32} className="text-slate-300" />
                       )}
                    </div>
                    {isEditing && (
                      <button className="absolute -bottom-2 -right-2 p-2 bg-primary-600 text-white rounded-xl shadow-lg border-4 border-white hover:scale-110 transition-transform">
                         <Camera size={14} />
                      </button>
                    )}
                 </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 leading-tight">{user?.name || 'Broker Partner'}</h3>
              <p className="text-xs font-black text-primary-600 uppercase tracking-widest mt-2 px-3 py-1 bg-primary-50 rounded-full inline-block">
                 {user?.role || 'Professional Broker'}
              </p>
              
              <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-2 gap-4">
                 <div className="text-center">
                    <p className="text-lg font-black text-slate-900 tracking-tight">45</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Posts</p>
                 </div>
                 <div className="text-center">
                    <p className="text-lg font-black text-slate-900 tracking-tight">12</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Networks</p>
                 </div>
              </div>
           </Card>

           <Card title="Account Security" className="border-slate-100">
              <button className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all group">
                 <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                       <Lock size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">Change Password</span>
                 </div>
                 <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-600" />
              </button>
              <button className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all group mt-2">
                 <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                       <Bell size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">Notifications</span>
                 </div>
                 <div className="w-10 h-5 bg-primary-600 rounded-full flex items-center justify-end px-1">
                    <div className="w-3.5 h-3.5 bg-white rounded-full" />
                 </div>
              </button>
           </Card>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
           <Card className="border-slate-100 shadow-xl shadow-slate-200/20">
              <div className="flex items-center gap-2 mb-8 border-b border-slate-50 pb-4">
                 <ShieldCheck className="text-emerald-500" size={24} />
                 <div>
                    <h4 className="text-lg font-black text-slate-900 tracking-tight">Identity & Business</h4>
                    <p className="text-xs font-medium text-slate-400">Verified Professional Information</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Professional Name</label>
                    <div className="relative group">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600" size={18} />
                       <input 
                          disabled={!isEditing}
                          type="text" 
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-200 focus:ring-8 focus:ring-primary-500/5 transition-all text-sm font-bold text-slate-900 disabled:opacity-60"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Email Address</label>
                    <div className="relative group">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600" size={18} />
                       <input 
                          disabled={!isEditing}
                          type="email" 
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-200 focus:ring-8 focus:ring-primary-500/5 transition-all text-sm font-bold text-slate-900 disabled:opacity-60"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Contact</label>
                    <div className="relative group">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600" size={18} />
                       <input 
                          disabled={!isEditing}
                          type="text" 
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-200 focus:ring-8 focus:ring-primary-500/5 transition-all text-sm font-bold text-slate-900 disabled:opacity-60"
                          value={formData.mobile}
                          onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">RERA Number</label>
                    <div className="relative group">
                       <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600" size={18} />
                       <input 
                          disabled={!isEditing}
                          type="text" 
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-200 focus:ring-8 focus:ring-primary-500/5 transition-all text-sm font-bold text-slate-900 disabled:opacity-60"
                          value={formData.reraNumber}
                          onChange={(e) => setFormData({...formData, reraNumber: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Office Presence</label>
                    <div className="relative group">
                       <MapPin className="absolute left-4 top-4 text-slate-300 group-focus-within:text-primary-600" size={18} />
                       <textarea 
                          disabled={!isEditing}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-200 focus:ring-8 focus:ring-primary-500/5 transition-all text-sm font-bold text-slate-900 h-24 resize-none disabled:opacity-60"
                          value={formData.officeAddress}
                          onChange={(e) => setFormData({...formData, officeAddress: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Location Hub</label>
                    <div className="relative group">
                       <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <select 
                          disabled={!isEditing}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all text-sm font-bold text-slate-900 appearance-none disabled:opacity-60"
                          value={formData.workLocation}
                          onChange={(e) => setFormData({...formData, workLocation: e.target.value})}
                       >
                          <option>Mumbai</option>
                          <option>Delhi</option>
                          <option>Bangalore</option>
                          <option>Pune</option>
                       </select>
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Broker Group (Network)</label>
                    <div className="relative group">
                       <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input 
                          disabled={true}
                          type="text" 
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl outline-none text-sm font-bold text-slate-500 opacity-60"
                          value={formData.groupName}
                       />
                    </div>
                 </div>
              </div>
           </Card>

           <div className="flex items-center justify-between p-6 bg-red-50 border border-red-100 rounded-[32px] overflow-hidden relative">
              <div className="relative z-10">
                 <h4 className="text-sm font-black text-red-900 uppercase tracking-wider">Account Termination</h4>
                 <p className="text-[11px] font-medium text-red-600 mt-1">This will permanently delete your listings and history.</p>
              </div>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all relative z-10 px-6 font-bold" leftIcon={<Trash2 size={16} />}>
                 Delete My Data
              </Button>
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-100 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
