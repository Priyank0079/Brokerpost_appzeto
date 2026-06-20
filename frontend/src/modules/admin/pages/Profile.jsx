import React, { useState, useRef } from 'react';
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
  Key,
  Eye,
  EyeOff
} from 'lucide-react';

const AdminProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || 'System Admin',
    email: user?.email || 'admin@gmail.com',
    mobile: user?.mobile || '9111966732',
    adminId: user?.id || 'ADMIN-001',
    accessLevel: 'Level 10 (Full Access)',
    password: '',
    newPassword: '',
    confirmPassword: '',
    profileImage: user?.profileImage || null
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, profileImage: url }));
    }
  };

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
              <User className="text-[#c8962a]" size={24} />
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Admin Profile</h1>
           </div>
           <p className="text-sm text-slate-500 font-medium mt-1 ml-8">Manage your admin account details and preferences.</p>
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
                <Button variant="primary" onClick={() => setIsEditing(true)} leftIcon={<Key size={18} />} className="px-8 font-bold bg-[#c8962a] hover:bg-[#B48C35] text-white border-transparent shadow-lg shadow-[#c8962a]/20">Edit Profile</Button>
             </div>
           )}
        </div>
      </div>

      {saveStatus && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2 duration-500">
           <CheckCircle2 className="text-emerald-500" size={20} />
           <p className="text-sm font-bold text-emerald-900">Administrative profile synchronized successfully.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Terminal Card */}
        <div className="space-y-6">
           <Card className="overflow-hidden border-slate-200 shadow-sm bg-white">
              <div className="h-2 bg-[#1e3a5f] -mx-6 -mt-6" />
              <div className="mt-6 flex flex-col items-center">
                 <div className="relative group cursor-pointer" onClick={() => isEditing && fileInputRef.current?.click()}>
                    <div className="w-24 h-24 rounded-full bg-[#f8fafc] border border-slate-200 flex items-center justify-center overflow-hidden">
                       {formData.profileImage ? (
                         <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                       ) : (
                         <User size={40} className="text-slate-400" />
                       )}
                    </div>
                    {isEditing && (
                      <button className="absolute -bottom-2 -right-2 p-2 bg-[#c8962a] text-white rounded-full shadow-lg hover:scale-110 transition-transform border-4 border-white pointer-events-none">
                         <Camera size={14} />
                      </button>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 mt-6">{user?.name}</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{user?.role}</p>
              </div>
              
              <div className="mt-8 space-y-4 border-t border-slate-100 pt-6">
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Admin ID</span>
                    <span className="text-slate-900 font-bold">{formData.adminId}</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Email</span>
                    <span className="text-slate-900 font-bold">{formData.email}</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Status</span>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                 </div>
              </div>
           </Card>

           <Card title="Security & Logs" className="border-slate-200 shadow-sm">
              <div className="space-y-2">
                 <button onClick={() => setShowPasswordFields(true)} className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-all group border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-[#eff6ff] text-[#1d4ed8] flex items-center justify-center">
                          <Lock size={16} />
                       </div>
                       <span className="text-xs font-bold text-slate-700">Change Password</span>
                    </div>
                 </button>

              </div>
           </Card>
        </div>

        {/* Right: Master Data */}
        <div className="lg:col-span-2 space-y-6">
           {showPasswordFields ? (
              <Card className="border-slate-100 shadow-xl shadow-slate-200/20 px-8 py-10 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-3 mb-10 border-b border-slate-200 pb-6">
                   <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
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
                      <div className="relative">
                        <input 
                           type={showCurrentPassword ? "text" : "password"} 
                           className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-lg outline-none focus:bg-white focus:border-primary-200 transition-all text-sm font-bold text-slate-900 pr-10"
                           placeholder="••••••••"
                        />
                        <button 
                           type="button"
                           onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                           className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                           {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Secure Password</label>
                      <div className="relative">
                        <input 
                           type={showNewPassword ? "text" : "password"} 
                           className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-lg outline-none focus:bg-white focus:border-primary-200 transition-all text-sm font-bold text-slate-900 pr-10"
                           placeholder="Min 8 characters"
                        />
                        <button 
                           type="button"
                           onClick={() => setShowNewPassword(!showNewPassword)}
                           className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                           {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                      <div className="relative">
                        <input 
                           type={showConfirmPassword ? "text" : "password"} 
                           className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-lg outline-none focus:bg-white focus:border-primary-200 transition-all text-sm font-bold text-slate-900 pr-10"
                           placeholder="Repeat new password"
                        />
                        <button 
                           type="button"
                           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                           className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                           {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                   </div>
                </div>
              </Card>
           ) : (
               <Card className="border-slate-200 shadow-sm px-8 py-8">
                 <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-5">
                    <div className="w-10 h-10 rounded-full bg-[#f8fafc] border border-slate-200 flex items-center justify-center text-slate-500">
                       <User size={18} />
                    </div>
                    <div>
                       <h4 className="text-lg font-bold text-slate-900 leading-none">Account Information</h4>
                       <p className="text-xs text-slate-500 mt-1">Your basic administrative identity details.</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                       <input 
                          disabled={!isEditing}
                          type="text" 
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-[#c8962a] transition-all text-sm font-bold text-slate-800 disabled:opacity-70 disabled:bg-slate-100"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                       />
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                       <input 
                          disabled={!isEditing}
                          type="email" 
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-[#c8962a] transition-all text-sm font-bold text-slate-800 disabled:opacity-70 disabled:bg-slate-100"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                       />
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
                       <input 
                          disabled={!isEditing}
                          type="text" 
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-[#c8962a] transition-all text-sm font-bold text-slate-800 disabled:opacity-70 disabled:bg-slate-100"
                          value={formData.mobile}
                          onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                       />
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Access Level</label>
                       <input 
                          disabled={true}
                          type="text" 
                          className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-sm font-bold text-slate-500"
                          value={formData.accessLevel}
                       />
                    </div>
                 </div>
               </Card>
           )}


        </div>
      </div>
    </div>
  );
};


export default AdminProfile;
