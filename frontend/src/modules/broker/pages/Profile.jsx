import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { uploadProfileImage } from '../services/postingService';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // { type: 'success' | 'error', message: string }
  
  // Personal Info Form Data
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    companyName: user?.companyName || '',
    officeAddress: user?.officeAddress || '',
    officeCity: user?.officeCity || 'Gurugram',
    pinCode: user?.pinCode || ''
  });

  // Change Password Form Data
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Re-sync form data if user context updates
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        companyName: user.companyName || '',
        officeAddress: user.officeAddress || '',
        officeCity: user.officeCity || 'Gurugram',
        pinCode: user.pinCode || ''
      });
    }
  }, [user]);

  // Handle Full Name Input change to map to firstName & lastName in DB
  const handleFullNameChange = (val) => {
    const parts = val.split(/\s+/);
    const first = parts[0] || '';
    const last = parts.slice(1).join(' ') || '';
    setFormData(prev => ({
      ...prev,
      firstName: first,
      lastName: last
    }));
  };

  const getFullName = () => {
    return `${formData.firstName} ${formData.lastName}`.trim();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.phoneNumber || !formData.companyName) {
      setSaveStatus({ type: 'error', message: 'Please fill in all mandatory fields' });
      return;
    }

    try {
      setLoading(true);
      setSaveStatus(null);
      
      const response = await api.put('/auth/updateme', formData);
      
      if (response.success) {
        updateUser(response.data);
        setSaveStatus({ type: 'success', message: 'Profile updated successfully!' });
      } else {
        setSaveStatus({ type: 'error', message: response.message || 'Update failed' });
      }
    } catch (err) {
      setSaveStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setSaveStatus({ type: 'error', message: 'Please fill in all password fields' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setSaveStatus({ type: 'error', message: 'New password and confirm password do not match' });
      return;
    }
    if (newPassword.length < 6) {
      setSaveStatus({ type: 'error', message: 'New password must be at least 6 characters' });
      return;
    }

    try {
      setPasswordLoading(true);
      setSaveStatus(null);
      
      const response = await api.put('/auth/updatepassword', {
        currentPassword,
        newPassword
      });
      
      if (response.success) {
        setSaveStatus({ type: 'success', message: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setSaveStatus({ type: 'error', message: response.message || 'Failed to update password' });
      }
    } catch (err) {
      setSaveStatus({ type: 'error', message: err.message || 'Incorrect current password' });
    } finally {
      setPasswordLoading(false);
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setSaveStatus(null);
      const result = await uploadProfileImage(file);
      if (result.success) {
        const updateRes = await api.put('/auth/updateme', { profileImage: result.data });
        if (updateRes.success) {
          updateUser(updateRes.data);
          setSaveStatus({ type: 'success', message: 'Profile image updated!' });
        }
      } else {
        setSaveStatus({ type: 'error', message: result.message || 'Upload failed' });
      }
    } catch (err) {
      setSaveStatus({ type: 'error', message: 'Image upload failed' });
    } finally {
      setLoading(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in py-6">
      
      {/* Title & Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-normal font-serif text-[#0d1b2a]">My Profile</h1>
          <p className="text-sm text-[#718199] mt-1">Update your information, password and photo</p>
        </div>
        <button 
          onClick={handleLogout}
          className="mt-4 sm:mt-0 px-6 py-2.5 bg-[#1a365d] hover:bg-[#112540] text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-md active:scale-95"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* Save Status Alert Banner */}
      {saveStatus && (
        <div className={`p-4 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2 duration-500 border ${
          saveStatus.type === 'success' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
        }`}>
          {saveStatus.type === 'success' ? <CheckCircle2 className="text-emerald-500" size={20} /> : <AlertCircle className="text-red-500" size={20} />}
          <p className={`text-sm font-bold ${saveStatus.type === 'success' ? 'text-emerald-900' : 'text-red-900'}`}>
            {saveStatus.message}
          </p>
        </div>
      )}

      {/* Side-by-Side Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Card: Personal Information */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col p-6">
          <h3 className="text-[14px] font-bold text-[#1e3a5f] border-b border-slate-100 pb-3 mb-5">Personal Information</h3>
          
          <div className="space-y-4">
            
            {/* PROFILE PHOTO */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Profile Photo</label>
              <div className="relative border-2 border-dashed border-slate-200 rounded-lg p-4 flex items-center gap-4 hover:bg-slate-50 transition-all cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200 shrink-0 relative">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#FAF9F6] flex items-center justify-center">
                      <span className="text-[20px] font-bold text-[#c8962a]">
                        {user?.firstName?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  {loading && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <Loader2 className="text-[#c8962a] animate-spin" size={16} />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Click to change</p>
                  <p className="text-[10px] text-slate-400 font-medium">JPG or PNG</p>
                </div>
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  accept="image/*" 
                  onChange={handleProfileImageUpload} 
                  disabled={loading} 
                />
              </div>
            </div>

            {/* FULL NAME */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name *</label>
              <input 
                type="text" 
                placeholder="Enter full name"
                value={getFullName()}
                onChange={(e) => handleFullNameChange(e.target.value)}
                className="w-full pl-4 pr-4 py-3 bg-[#faf7f2] border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-[#c8962a]/30 transition-all text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* COMPANY / FIRM */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company / Firm *</label>
              <input 
                type="text" 
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                className="w-full pl-4 pr-4 py-3 bg-[#faf7f2] border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-[#c8962a]/30 transition-all text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* PHONE */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone *</label>
              <input 
                type="text" 
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                className="w-full pl-4 pr-4 py-3 bg-[#faf7f2] border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-[#c8962a]/30 transition-all text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* EMAIL (Non-editable) */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</label>
              <input 
                type="email" 
                value={formData.email}
                disabled
                className="w-full pl-4 pr-4 py-3 bg-[#f1f3f5] border border-slate-200 rounded-lg text-sm font-bold text-slate-400 cursor-not-allowed outline-none"
              />
            </div>

            {/* ADDRESS */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Address</label>
              <input 
                type="text" 
                placeholder="Enter office address"
                value={formData.officeAddress}
                onChange={(e) => setFormData({...formData, officeAddress: e.target.value})}
                className="w-full pl-4 pr-4 py-3 bg-[#faf7f2] border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-[#c8962a]/30 transition-all text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* CITY (Select Dropdown) */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">City</label>
              <select
                value={formData.officeCity}
                onChange={(e) => setFormData({...formData, officeCity: e.target.value})}
                className="w-full pl-4 pr-10 py-3 bg-[#faf7f2] border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-[#c8962a]/30 transition-all text-slate-800 appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em_1em]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`
                }}
              >
                <option value="Gurugram">Gurugram</option>
                <option value="New Delhi">New Delhi</option>
                <option value="Noida">Noida</option>
                <option value="Faridabad">Faridabad</option>
                <option value="Ghaziabad">Ghaziabad</option>
              </select>
            </div>

            {/* PIN CODE */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pin Code</label>
              <input 
                type="text" 
                placeholder="Enter pin code"
                value={formData.pinCode}
                onChange={(e) => setFormData({...formData, pinCode: e.target.value})}
                className="w-full pl-4 pr-4 py-3 bg-[#faf7f2] border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-[#c8962a]/30 transition-all text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* Save Changes Button */}
            <div className="pt-2">
              <button 
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2.5 bg-[#c8962a] hover:bg-[#b08425] text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#c8962a]/10 active:scale-95 flex items-center justify-center gap-2 min-w-[120px]"
              >
                {loading ? <Loader2 className="animate-spin" size={14} /> : 'Save Changes'}
              </button>
            </div>

          </div>
        </div>

        {/* Right Card: Change Password */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col p-6">
          <h3 className="text-[14px] font-bold text-[#1e3a5f] border-b border-slate-100 pb-3 mb-5">Change Password</h3>
          
          <div className="space-y-4">
            
            {/* CURRENT PASSWORD (Light blue styled) */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Password</label>
              <input 
                type="password" 
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-4 pr-4 py-3 bg-[#eff6ff] border border-[#dbeafe] rounded-lg text-sm font-bold outline-none focus:border-[#1d4ed8]/30 transition-all text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* NEW PASSWORD */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">New Password</label>
              <input 
                type="password" 
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-4 pr-4 py-3 bg-[#faf7f2] border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-[#c8962a]/30 transition-all text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* CONFIRM NEW PASSWORD */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
              <input 
                type="password" 
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-4 pr-4 py-3 bg-[#faf7f2] border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-[#c8962a]/30 transition-all text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* Update Password Button */}
            <div className="pt-2">
              <button 
                onClick={handleUpdatePassword}
                disabled={passwordLoading}
                className="px-6 py-2.5 bg-[#1a365d] hover:bg-[#112540] text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#1a365d]/10 active:scale-95 flex items-center justify-center gap-2 min-w-[130px]"
              >
                {passwordLoading ? <Loader2 className="animate-spin" size={14} /> : 'Update Password'}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
