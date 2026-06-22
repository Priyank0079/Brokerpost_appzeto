import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { api } from '../services/api';
import { uploadProfileImage } from '../services/postingService';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  
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

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    const sanitized = val.replace(/[^a-zA-Z\s]/g, '');
    const parts = sanitized.split(/\s+/);
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
    if (newPassword.length > 20) {
      setSaveStatus({ type: 'error', message: 'New password cannot exceed 20 characters' });
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

  const [stats, setStats] = useState({ listings: '—', groups: '—', matches: '—' });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { getPostingStats } = await import('../services/postingService');
        const { getGroups } = await import('../services/groupService');
        
        const [statsRes, groupsRes, matchesRes] = await Promise.all([
          getPostingStats(),
          getGroups(),
          api.get('/postings/smart-matches')
        ]);

        setStats({
          listings: statsRes.success && statsRes.data ? (statsRes.data.myListings || 0) : 0,
          groups: groupsRes.success && groupsRes.data ? groupsRes.data.length : 0,
          matches: matchesRes.success && matchesRes.data ? matchesRes.data.reduce((acc, curr) => acc + curr.matches.length, 0) : 0
        });
      } catch (err) {
        console.error('Failed to fetch profile stats', err);
      }
    };
    if (user) {
      fetchStats();
    }
  }, [user]);

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

  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ''}`.toUpperCase()
    : (user?.name?.slice(0,2) || 'BR').toUpperCase();
  const fullName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user?.name || 'Broker');

  return (
    <>
      {/* ── MOBILE HERO HEADER ── */}
      <div className="md:hidden mob-prof-hero" style={{ textAlign: 'center' }}>
        {/* Avatar */}
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#e8b84b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#0d1520', margin: '0 auto 8px', overflow: 'hidden' }}>
          {user?.profileImage ? <img src={user.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{fullName}</div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
          Broker{user?.companyName ? ` · ${user.companyName}` : ''}{user?.officeCity ? ` · ${user.officeCity}` : ''}
        </div>
        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 10 }}>
          {[
            ['Listings', stats.listings], 
            ['Groups', stats.groups], 
            ['Matches', stats.matches]
          ].map(([label, val], i) => (
            <React.Fragment key={label}>
              {i > 0 && <div style={{ width: 0.5, background: 'rgba(255,255,255,0.1)' }} />}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#e8b84b' }}>{val}</div>
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>{label}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── PROFILE FORMS (Desktop & Mobile) ── */}
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in py-6 px-4 md:px-6 pb-40 md:pb-6">
        <div className="hidden md:flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-normal font-serif text-[#0d1b2a]">My Profile</h1>
            <p className="text-sm text-[#718199] mt-1">Update your information, password and photo</p>
          </div>
          <button onClick={handleLogout} className="mt-4 sm:mt-0 px-6 py-2.5 bg-[#1a365d] hover:bg-[#112540] text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-md active:scale-95">
            <LogOut size={14} /> Logout
          </button>
        </div>
        {saveStatus && (
          <div className={`p-4 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2 duration-500 border ${saveStatus.type === 'success' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            {saveStatus.type === 'success' ? <CheckCircle2 className="text-emerald-500" size={20} /> : <AlertCircle className="text-red-500" size={20} />}
            <p className={`text-sm font-bold ${saveStatus.type === 'success' ? 'text-emerald-900' : 'text-red-900'}`}>{saveStatus.message}</p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col p-6">
            <h3 className="text-[14px] font-bold text-[#1e3a5f] border-b border-slate-100 pb-3 mb-5">Personal Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Profile Photo</label>
                <div 
                  className={`relative border-2 border-dashed border-slate-200 rounded-lg p-4 flex items-center gap-4 hover:bg-slate-50 transition-all ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!loading) setShowUploadOptions(true);
                  }}
                >
                  <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200 shrink-0 relative">
                    {user?.profileImage ? <img src={user.profileImage} alt="" className="w-full h-full object-cover" /> : (
                      <div className="w-full h-full bg-[#FAF9F6] flex items-center justify-center"><span className="text-[20px] font-bold text-[#c8962a]">{user?.firstName?.charAt(0) || 'U'}</span></div>
                    )}
                    {loading && <div className="absolute inset-0 bg-white/60 flex items-center justify-center"><Loader2 className="text-[#c8962a] animate-spin" size={16} /></div>}
                  </div>
                  <div><p className="text-xs font-bold text-slate-800">Click to change</p><p className="text-[10px] text-slate-400 font-medium">JPG or PNG</p></div>
                  <input id="profile-gallery-input" type="file" className="hidden" accept="image/jpeg, image/png, image/jpg, image/webp" onChange={handleProfileImageUpload} disabled={loading} />
                  <input id="profile-camera-input" type="file" className="hidden" accept="image/*" capture="environment" onChange={handleProfileImageUpload} disabled={loading} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name *</label>
                <input type="text" placeholder="Enter full name" value={getFullName()} onChange={(e) => handleFullNameChange(e.target.value)} className="w-full pl-4 pr-4 py-3 bg-[#faf7f2] border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-[#c8962a]/30 transition-all text-slate-800 placeholder-slate-400" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company / Firm *</label>
                <input type="text" placeholder="Enter company name" value={formData.companyName} onChange={(e) => {
                  const sanitized = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
                  setFormData({...formData, companyName: sanitized});
                }} className="w-full pl-4 pr-4 py-3 bg-[#faf7f2] border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-[#c8962a]/30 transition-all text-slate-800 placeholder-slate-400" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone *</label>
                <input type="text" placeholder="Enter phone number" value={formData.phoneNumber} onChange={(e) => {
                  const sanitized = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData({...formData, phoneNumber: sanitized});
                }} className="w-full pl-4 pr-4 py-3 bg-[#faf7f2] border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-[#c8962a]/30 transition-all text-slate-800 placeholder-slate-400" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</label>
                <input type="email" value={formData.email} disabled className="w-full pl-4 pr-4 py-3 bg-[#f1f3f5] border border-slate-200 rounded-lg text-sm font-bold text-slate-400 cursor-not-allowed outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Address</label>
                <input type="text" placeholder="Enter office address" value={formData.officeAddress} onChange={(e) => {
                  const sanitized = e.target.value.replace(/[^a-zA-Z0-9\s,\.-]/g, '');
                  setFormData({...formData, officeAddress: sanitized});
                }} className="w-full pl-4 pr-4 py-3 bg-[#faf7f2] border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-[#c8962a]/30 transition-all text-slate-800 placeholder-slate-400" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">City</label>
                <select value={formData.officeCity} disabled className="w-full pl-4 pr-10 py-3 bg-[#f1f3f5] border border-slate-200 rounded-lg text-sm font-bold text-slate-400 cursor-not-allowed outline-none appearance-none">
                  <option value="Gurugram">Gurugram</option><option value="New Delhi">New Delhi</option><option value="Noida">Noida</option><option value="Faridabad">Faridabad</option><option value="Ghaziabad">Ghaziabad</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pin Code</label>
                <input type="text" placeholder="Enter pin code" value={formData.pinCode} onChange={(e) => {
                  const sanitized = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setFormData({...formData, pinCode: sanitized});
                }} className="w-full pl-4 pr-4 py-3 bg-[#faf7f2] border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-[#c8962a]/30 transition-all text-slate-800 placeholder-slate-400" />
              </div>
              <div className="pt-2">
                <button onClick={handleSave} disabled={loading} className="w-full md:w-auto px-6 py-3 md:py-2.5 bg-[#c8962a] hover:bg-[#b08425] text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#c8962a]/10 active:scale-95 flex items-center justify-center gap-2 min-w-[120px]">
                  {loading ? <Loader2 className="animate-spin" size={14} /> : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col p-6">
            <h3 className="text-[14px] font-bold text-[#1e3a5f] border-b border-slate-100 pb-3 mb-5">Change Password</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Password</label>
                <div className="relative">
                  <input type={showCurrentPassword ? "text" : "password"} placeholder="Enter current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full pl-4 pr-10 py-3 bg-[#eff6ff] border border-[#dbeafe] rounded-lg text-sm font-bold outline-none focus:border-[#1d4ed8]/30 transition-all text-slate-800 placeholder-slate-400" />
                  <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <input type={showNewPassword ? "text" : "password"} placeholder="Min 6 characters, Max 20" value={newPassword} onChange={(e) => {
                    if(e.target.value.length > 20) {
                      setSaveStatus({ type: 'error', message: 'Password cannot exceed 20 characters' });
                      setTimeout(() => setSaveStatus(null), 3000);
                      return;
                    }
                    setNewPassword(e.target.value);
                  }} className="w-full pl-4 pr-10 py-3 bg-[#faf7f2] border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-[#c8962a]/30 transition-all text-slate-800 placeholder-slate-400" />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
                <div className="relative">
                  <input type={showConfirmPassword ? "text" : "password"} placeholder="Repeat new password" value={confirmPassword} onChange={(e) => {
                    if(e.target.value.length > 20) {
                      setSaveStatus({ type: 'error', message: 'Password cannot exceed 20 characters' });
                      setTimeout(() => setSaveStatus(null), 3000);
                      return;
                    }
                    setConfirmPassword(e.target.value);
                  }} className="w-full pl-4 pr-10 py-3 bg-[#faf7f2] border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-[#c8962a]/30 transition-all text-slate-800 placeholder-slate-400" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="pt-2">
                <button onClick={handleUpdatePassword} disabled={passwordLoading} className="w-full md:w-auto px-6 py-3 md:py-2.5 bg-[#1a365d] hover:bg-[#112540] text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#1a365d]/10 active:scale-95 flex items-center justify-center gap-2 min-w-[130px]">
                  {passwordLoading ? <Loader2 className="animate-spin" size={14} /> : 'Update Password'}
                </button>
              </div>
            </div>
            
            {/* Mobile-only Logout Button below Change Password */}
            <div className="md:hidden mt-8 border-t border-slate-200 pt-6">
               <button onClick={handleLogout} className="w-full py-3 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Options Action Sheet (Native Clone) */}
      {showUploadOptions && (
        <div className="fixed inset-0 z-[400] flex items-end justify-center bg-black/40" onClick={() => setShowUploadOptions(false)}>
          <div className="bg-white rounded-t-[24px] w-full max-w-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-200 pb-6 pt-2" onClick={e => e.stopPropagation()}>
            <div className="pt-4 pb-2 flex justify-center">
              <h3 className="font-medium text-black text-[18px]">Choose an action</h3>
            </div>
            <div className="flex justify-around items-center px-10 py-6">
              <div 
                onClick={() => {
                  setShowUploadOptions(false);
                  if (window.flutter_inappwebview && window.flutter_inappwebview.callHandler) {
                    const base64ToFile = (base64, filename, mimeType) => {
                      const byteCharacters = atob(base64);
                      const byteNumbers = new Array(byteCharacters.length);
                      for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                      }
                      const byteArray = new Uint8Array(byteNumbers);
                      const blob = new Blob([byteArray], { type: mimeType });
                      return new File([blob], filename, { type: mimeType });
                    };
                    window.flutter_inappwebview.callHandler('openCamera').then(response => {
                      if (response && response.success) {
                        const file = base64ToFile(response.base64, response.fileName, response.mimeType);
                        handleProfileImageUpload({ target: { files: [file] } });
                      }
                    }).catch(err => console.error("Flutter camera error", err));
                  } else {
                    document.getElementById('profile-camera-input').click();
                  }
                }}
                className="flex flex-col items-center gap-3 cursor-pointer"
              >
                <div className="w-[56px] h-[56px] rounded-[16px] bg-gradient-to-b from-[#e8e8e8] to-[#d4d4d4] flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_5px_rgba(0,0,0,0.1)] border border-[#c4c4c4]">
                  <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-inner border border-[#444]">
                    <div className="w-3 h-3 rounded-full bg-[#4a90e2] shadow-[0_0_8px_#4a90e2]"></div>
                  </div>
                </div>
                <span className="text-[13px] text-slate-800 font-medium tracking-wide">Camcorder</span>
              </div>
              
              <div 
                onClick={() => {
                  setShowUploadOptions(false);
                  document.getElementById('profile-gallery-input').click();
                }}
                className="flex flex-col items-center gap-3 cursor-pointer"
              >
                <div className="w-[56px] h-[56px] rounded-[16px] bg-[#4285f4] flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_2px_5px_rgba(0,0,0,0.2)]">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6H12L10 4Z" fill="white"/>
                  </svg>
                </div>
                <span className="text-[13px] text-slate-800 font-medium tracking-wide">Files</span>
              </div>
            </div>
            
            <div className="px-5 mt-2">
              <button 
                onClick={() => setShowUploadOptions(false)}
                className="w-full py-3.5 bg-[#f0f0f0] active:bg-[#e0e0e0] text-[#333] rounded-full font-medium text-[15px] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
