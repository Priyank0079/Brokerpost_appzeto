import React, { useState, useRef } from 'react';
import { X, User, Camera, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { uploadProfileImage } from '../../services/postingService';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { register, verifyOTP } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otp, setOtp] = useState('');
  const [authError, setAuthError] = useState('');
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('registration_draft');
    return saved ? JSON.parse(saved) : {
      firstName: '',
      lastName: '',
      companyName: '',
      address: '',
      city: '',
      pinCode: '',
      phoneNumber: '',
      email: '',
      password: '',
      reraNumber: '',
      profileImage: '',
      associatedGroup: '',
      agreeWithTerms: false
    };
  });
  
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [dynamicTerms, setDynamicTerms] = useState(null);

  // Fetch dynamic terms
  React.useEffect(() => {
    if (isOpen) {
      const fetchInitialData = async () => {
        try {
          // Fetch Terms
          const termsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/landing-config`);
          const termsJson = await termsRes.json();
          if (termsJson.success && termsJson.data?.sections?.registrationTerms) {
            setDynamicTerms(termsJson.data.sections.registrationTerms);
          }
        } catch (err) {
          console.error('Failed to fetch initial registration data:', err);
        }
      };
      fetchInitialData();
    }
  }, [isOpen]);

  // Persist form data on change
  React.useEffect(() => {
    localStorage.setItem('registration_draft', JSON.stringify(formData));
  }, [formData]);

  if (!isOpen) return null;

  const validateStep1 = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^\d{10}$/;
    const pinRegex = /^\d{6}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName) newErrors.firstName = 'Full name is required';
    else if (!nameRegex.test(formData.firstName)) newErrors.firstName = 'Only alphabetic characters allowed';

    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    
    if (formData.pinCode && !pinRegex.test(formData.pinCode)) newErrors.pinCode = 'Must be exactly 6 digits';

    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    else if (!phoneRegex.test(formData.phoneNumber)) newErrors.phoneNumber = 'Must be exactly 10 digits';

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Min 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Real-time validation for alphabetic fields
    if (name === 'firstName' || name === 'lastName') {
      const cleanValue = value.replace(/[^A-Za-z\s]/g, '');
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
    }
    // Real-time validation for numeric fields
    else if (name === 'phoneNumber' || name === 'pinCode') {
      const cleanValue = value.replace(/\D/g, '');
      if (name === 'phoneNumber' && cleanValue.length > 10) return;
      if (name === 'pinCode' && cleanValue.length > 6) return;
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await uploadProfileImage(file);
      if (result.success) {
        setFormData(prev => ({ ...prev, profileImage: result.data }));
        setErrors(prev => ({ ...prev, profileImage: '' }));
      } else {
        setErrors(prev => ({ ...prev, profileImage: 'Upload failed. Try again.' }));
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, profileImage: 'Error uploading image.' }));
    } finally {
      setUploading(false);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (agreedToTerms) {
      setUploading(true);
      setAuthError('');
      const result = await register({ ...formData, agreeWithTerms: true });
      if (result.success) {
        setStep(3); // Go to OTP verification
      } else {
        setAuthError(result.message);
      }
      setUploading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setAuthError('Please enter a valid 4-digit OTP');
      return;
    }

    setVerifying(true);
    setAuthError('');
    const result = await verifyOTP(formData.email, otp, formData.password);
    if (result.success) {
      localStorage.removeItem('registration_draft');
      onClose();
      navigate('/dashboard');
    } else {
      setAuthError(result.message);
    }
    setVerifying(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm"
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-[580px] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in duration-300 scrollbar-hide">
        <div className="px-8 pb-4">
          {/* Header */}
          <div className="sticky top-0 bg-white z-10 -mx-8 px-8 pt-6 mb-4">
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-[#fdf8f3] text-slate-400 hover:bg-[#f5ebd8] hover:text-slate-600 transition-all z-20"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-serif font-normal text-[#1a365d] mb-1">
              {step === 3 ? 'Verify Your Email' : 'Register as a Broker'}
            </h2>
            <p className="text-slate-500 text-[11px] font-normal">
              {step === 3 ? `Enter the OTP sent to ${formData.phoneNumber}` : 'Join the verified broker network — no brokerage charged'}
            </p>
            <hr className="border-[#ddd6c8] -mx-8 mt-4" />
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={14} />
              {authError}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-2">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* First Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-[#7d7b94] uppercase tracking-widest ml-1">
                    FULL NAME *
                  </label>
                  <input 
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={`w-full px-4 py-2.5 bg-[#faf7f2] border ${errors.firstName ? 'border-red-200' : 'border-[#ddd6c8]'} rounded-lg outline-none focus:bg-white focus:ring-4 focus:ring-[#c8962a]/10 focus:border-[#c8962a]/30 transition-all text-sm font-medium text-slate-900 placeholder:text-[#9f8b91] placeholder:text-xs placeholder:font-normal`}
                  />
                  {errors.firstName && <p className="text-[9px] font-bold text-red-500 ml-1 italic tracking-tight">{errors.firstName}</p>}
                </div>

                {/* Company Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-[#7d7b94] uppercase tracking-widest ml-1">
                    COMPANY / FIRM NAME *
                  </label>
                  <input 
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Your realty firm"
                    className={`w-full px-4 py-2.5 bg-[#faf7f2] border ${errors.companyName ? 'border-red-200' : 'border-[#ddd6c8]'} rounded-lg outline-none focus:bg-white focus:ring-4 focus:ring-[#c8962a]/10 focus:border-[#c8962a]/30 transition-all text-sm font-medium text-slate-900 placeholder:text-[#9f8b91] placeholder:text-xs placeholder:font-normal`}
                  />
                  {errors.companyName && <p className="text-[9px] font-bold text-red-500 ml-1 italic tracking-tight">{errors.companyName}</p>}
                </div>


                {/* Address */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-black text-[#7d7b94] uppercase tracking-widest ml-1">
                    STREET / OFFICE ADDRESS *
                  </label>
                  <input 
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Office address (street, locality)"
                    className={`w-full px-4 py-2.5 bg-[#faf7f2] border ${errors.address ? 'border-red-200' : 'border-[#ddd6c8]'} rounded-lg outline-none focus:bg-white focus:ring-4 focus:ring-[#c8962a]/10 focus:border-[#c8962a]/30 transition-all text-sm font-medium text-slate-900 placeholder:text-[#9f8b91] placeholder:text-xs placeholder:font-normal`}
                  />
                  {errors.address && <p className="text-[9px] font-bold text-red-500 ml-1 italic tracking-tight">{errors.address}</p>}
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-[#7d7b94] uppercase tracking-widest ml-1">
                    CITY *
                  </label>
                  <div className="relative">
                    <select 
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 bg-[#faf7f2] border ${errors.city ? 'border-red-200' : 'border-[#ddd6c8]'} rounded-lg outline-none focus:bg-white focus:ring-4 focus:ring-[#c8962a]/10 focus:border-[#c8962a]/30 transition-all text-xs font-medium text-[#252832] appearance-none`}
                    >
                      <option value="" disabled>— Select City —</option>
                      <option value="Gurugram">Gurugram</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Faridabad">Faridabad</option>
                      <option value="Noida">Noida</option>
                      <option value="Greater Noida">Greater Noida</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronRight size={14} className="rotate-90" />
                    </div>
                  </div>
                  {errors.city && <p className="text-[9px] font-bold text-red-500 ml-1 italic tracking-tight">{errors.city}</p>}
                </div>

                {/* Pin Code */}
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-[#7d7b94] uppercase tracking-widest ml-1">
                    PIN CODE
                  </label>
                  <input 
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    placeholder="6-digit pin code"
                    className={`w-full px-4 py-2.5 bg-[#faf7f2] border ${errors.pinCode ? 'border-red-200' : 'border-[#ddd6c8]'} rounded-lg outline-none focus:bg-white focus:ring-4 focus:ring-[#c8962a]/10 focus:border-[#c8962a]/30 transition-all text-sm font-medium text-slate-900 placeholder:text-[#9f8b91] placeholder:text-xs placeholder:font-normal`}
                  />
                  {errors.pinCode && <p className="text-[9px] font-bold text-red-500 ml-1 italic tracking-tight">{errors.pinCode}</p>}
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-[#7d7b94] uppercase tracking-widest ml-1">
                    PHONE NUMBER *
                  </label>
                  <input 
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className={`w-full px-4 py-2.5 bg-[#faf7f2] border ${errors.phoneNumber ? 'border-red-200' : 'border-[#ddd6c8]'} rounded-lg outline-none focus:bg-white focus:ring-4 focus:ring-[#c8962a]/10 focus:border-[#c8962a]/30 transition-all text-sm font-medium text-slate-900 placeholder:text-[#9f8b91] placeholder:text-xs placeholder:font-normal`}
                  />
                  {errors.phoneNumber && <p className="text-[9px] font-bold text-red-500 ml-1 italic tracking-tight">{errors.phoneNumber}</p>}
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-[#7d7b94] uppercase tracking-widest ml-1">
                    EMAIL ADDRESS *
                  </label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-2.5 bg-[#faf7f2] border ${errors.email ? 'border-red-200' : 'border-[#ddd6c8]'} rounded-lg outline-none focus:bg-white focus:ring-4 focus:ring-[#c8962a]/10 focus:border-[#c8962a]/30 transition-all text-sm font-medium text-slate-900 placeholder:text-[#9f8b91] placeholder:text-xs placeholder:font-normal`}
                  />
                  {errors.email && <p className="text-[9px] font-bold text-red-500 ml-1 italic tracking-tight">{errors.email}</p>}
                </div>

                {/* RERA Number */}
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-[#7d7b94] uppercase tracking-widest ml-1">
                    RERA NUMBER
                  </label>
                  <input 
                    type="text" 
                    name="reraNumber"
                    value={formData.reraNumber}
                    onChange={handleChange}
                    placeholder="Alphanumeric code"
                    className="w-full px-4 py-2.5 bg-[#faf7f2] border border-[#ddd6c8] rounded-lg outline-none focus:bg-white focus:ring-4 focus:ring-[#c8962a]/10 focus:border-[#c8962a]/30 transition-all text-sm font-medium text-slate-900 placeholder:text-[#9f8b91] placeholder:text-xs placeholder:font-normal"
                  />
                </div>


                {/* Password */}
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-[#7d7b94] uppercase tracking-widest ml-1">
                    PASSWORD *
                  </label>
                  <input 
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className={`w-full px-4 py-2.5 bg-[#faf7f2] border ${errors.password ? 'border-red-200' : 'border-[#ddd6c8]'} rounded-lg outline-none focus:bg-white focus:ring-4 focus:ring-[#c8962a]/10 focus:border-[#c8962a]/30 transition-all text-sm font-medium text-slate-900 placeholder:text-[#9f8b91] placeholder:text-xs placeholder:font-normal`}
                  />
                  {errors.password && <p className="text-[9px] font-bold text-red-500 ml-1 italic tracking-tight">{errors.password}</p>}
                </div>
              </div>



              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-10 pb-0">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2.5 rounded-lg border border-[#1a365d] text-xs font-black text-[#1a365d] hover:bg-[#1e3a5f] hover:text-white transition-all"
                >
                  ← Back
                </button>
                <button 
                  type="submit"
                  disabled={uploading}
                  className={`px-4 py-2.5 rounded-lg bg-[#c8962a] text-white text-xs font-black hover:bg-[#b48c35] transition-all shadow-lg shadow-[#c8962a]/20 flex items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Next: Review Terms →
                </button>
              </div>
            </form>
          ) : step === 2 ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Blue Info Box */}
              <div className="px-4 py-3 bg-[#dbeafe] border border-[#8ab4f8] rounded-lg">
                <p className="text-[12px] text-[#2d4eb5] font-normal tracking-tight leading-relaxed">
                  <span className="mr-1.5 text-[12px]">📋</span>
                  Please read and accept our Disclaimer & Terms before proceeding. This is mandatory to use BrokersPost.
                </p>
              </div>

              {/* Scrollable Terms Content */}
              <style>{`
                .terms-scrollbar::-webkit-scrollbar {
                  width: 14px;
                }
                .terms-scrollbar::-webkit-scrollbar-track {
                  background: #faf7f2;
                  border-radius: 8px;
                }
                .terms-scrollbar::-webkit-scrollbar-thumb {
                  background-color: #9ca3af;
                  border-radius: 10px;
                  border: 4px solid #faf7f2;
                }
                .terms-scrollbar::-webkit-scrollbar-button:single-button {
                  background-color: #faf7f2;
                  display: block;
                  height: 14px;
                }
                .terms-scrollbar::-webkit-scrollbar-button:single-button:vertical:decrement {
                  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239ca3af"><path d="M12 8l8 8H4z"/></svg>');
                  background-size: 10px;
                  background-position: center bottom;
                  background-repeat: no-repeat;
                }
                .terms-scrollbar::-webkit-scrollbar-button:single-button:vertical:increment {
                  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239ca3af"><path d="M12 16l-8-8h16z"/></svg>');
                  background-size: 10px;
                  background-position: center top;
                  background-repeat: no-repeat;
                }
              `}</style>
              <div className="p-5 border border-slate-200 rounded-lg bg-[#faf7f2] max-h-[300px] overflow-y-auto space-y-3 terms-scrollbar">
                <h3 className="text-[12px] font-bold text-[#314a6b]">
                  {dynamicTerms?.title || "Important Disclaimer & Terms of Use — BrokersPost"}
                </h3>
                
                <div className="space-y-4">
                  {(dynamicTerms?.items || [
                    { title: "No Liability", content: "BrokersPost is a networking platform that connects verified real estate brokers. We do not participate in any transaction between brokers. This site does not take any responsibility for disputes, financial losses, or any issues arising between brokers during or after a deal." },
                    { title: "Independent Dealing", content: "Brokers are independent professionals. They may call and deal with each other directly. BrokersPost does not mediate, negotiate, or guarantee any transaction. All dealings happen independently between brokers at their own risk and discretion." },
                    { title: "Genuine Listings Only", content: "Brokers must post only genuine, verified inventory that they have the authority to list. Fake, misleading, or unauthorized listings are strictly prohibited and may result in account termination." }
                  ]).map((item, idx) => {
                    const cleanTitle = (item.title || "").replace(/^\d+\.\s*/, '').replace(/:*\s*$/, '');
                    return (
                      <div key={idx} className="flex gap-1.5">
                        <span className="text-[11px] font-bold text-[#314a6b] mt-0.5">{idx + 1}.</span>
                        <p className="text-[11px] font-medium text-[#111827] leading-loose">
                          <span className="font-bold text-[#314a6b]">{cleanTitle}:</span> {item.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Checkbox */}
              <label className="flex items-start gap-3 p-4 border border-[#eeeae3] rounded-lg bg-white cursor-pointer group">
                <div className="relative flex items-center mt-3.5">
                  <input 
                    type="checkbox" 
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-[18px] h-[18px] rounded border-2 border-slate-500 bg-white text-[#c8962a] focus:ring-4 focus:ring-[#c8962a]/10 transition-all cursor-pointer appearance-none checked:bg-[#c8962a] checked:border-[#c8962a]"
                  />
                  {agreedToTerms && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <svg className="w-3 h-3 text-[#0F172A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-slate-600 font-semibold tracking-wide leading-relaxed">
                  {dynamicTerms?.agreementText || "I have read and understood all the above terms. I agree to the Disclaimer & Terms of Use of BrokersPost. I confirm that I am a registered professional broker and all listings I post will be genuine."}
                </span>
              </label>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button 
                  onClick={handleBack}
                  className="px-2 py-2 rounded-lg border border-[#1a365d] text-sm font-black text-[#1a365d] hover:bg-slate-50 transition-all"
                >
                  ← back
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={!agreedToTerms || uploading}
                  className={`px-5 py-3 rounded-lg flex items-center gap-2 text-xs font-black transition-all shadow-xl bg-[#c8962a] text-white shadow-[#c8962a]/20 ${
                    agreedToTerms 
                    ? 'hover:bg-[#b48c35]' 
                    : 'cursor-not-allowed'
                  }`}
                >
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : '✓ Accept & Register'}
                </button>
              </div>
            </div>
          ) : (
            /* Step 3: OTP Verification */
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex gap-3">
                <span className="text-lg">📱</span>
                <p className="text-xs text-amber-700 font-bold leading-relaxed">
                  Check your phone for a 4-digit verification SMS.
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-[#7d7b94] uppercase tracking-widest ml-1">
                    ENTER OTP CODE
                  </label>
                  <input 
                    type="text"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="0000"
                    className="w-full px-4 py-4 bg-[#fdf8f3] border border-transparent rounded-lg outline-none focus:bg-white focus:ring-4 focus:ring-[#c8962a]/10 focus:border-[#c8962a]/30 transition-all text-center text-2xl font-black tracking-[0.5em] text-[#1a365d] placeholder:text-slate-200 placeholder:font-normal"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-4">
                   <button 
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-3 rounded-lg border border-slate-200 text-sm font-black text-slate-400 hover:bg-slate-50 transition-all"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={verifying || otp.length < 4}
                    className={`px-10 py-3 rounded-lg bg-[#c8962a] text-[#0F172A] text-sm font-black hover:bg-[#b48c35] transition-all shadow-lg shadow-[#c8962a]/20 flex items-center gap-2 ${verifying || otp.length < 4 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {verifying ? <Loader2 size={16} className="animate-spin" /> : 'Verify & Finish'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
