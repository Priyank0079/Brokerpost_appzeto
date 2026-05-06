import React, { useState } from 'react';
import { X, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterModal = ({ isOpen, onClose }) => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    address: '',
    city: '',
    pinCode: '',
    phoneNumber: '',
    email: '',
    password: ''
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (agreedToTerms) {
      const result = await register(formData);
      if (result.success) {
        onClose();
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-[540px] max-h-[90vh] overflow-y-auto bg-white rounded-[24px] shadow-2xl animate-in fade-in zoom-in duration-300 scrollbar-hide">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-[#fdf8f3] text-slate-400 hover:bg-[#f5ebd8] hover:text-slate-600 transition-all z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-serif text-[#1a365d] mb-1">Register as a Broker</h2>
            <p className="text-slate-500 text-sm">Join the verified broker network — no brokerage charged</p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-6">
              {/* Photo Upload Area */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                  PROFILE PHOTO / LOGO (Optional)
                </label>
                <div className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-4 flex items-center gap-4 hover:border-[#C59D3F]/50 transition-colors cursor-pointer bg-white">
                  <div className="w-12 h-12 rounded-full bg-[#fdf8f3] flex items-center justify-center text-[#1a365d]">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1a365d]">Click to upload photo</p>
                    <p className="text-[10px] text-slate-400 font-medium">JPG or PNG • Max 2MB</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    FULL NAME *
                  </label>
                  <input 
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full px-4 py-2.5 bg-[#fdf8f3] border border-transparent rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#C59D3F]/20 focus:border-[#C59D3F]/30 transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Company / Firm Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    COMPANY / FIRM NAME *
                  </label>
                  <input 
                    type="text"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Your realty firm"
                    className="w-full px-4 py-2.5 bg-[#fdf8f3] border border-transparent rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#C59D3F]/20 focus:border-[#C59D3F]/30 transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Street / Office Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    STREET / OFFICE ADDRESS *
                  </label>
                  <input 
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Office address (street, locality)"
                    className="w-full px-4 py-2.5 bg-[#fdf8f3] border border-transparent rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#C59D3F]/20 focus:border-[#C59D3F]/30 transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* City */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    CITY *
                  </label>
                  <select 
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#fdf8f3] border border-transparent rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#C59D3F]/20 focus:border-[#C59D3F]/30 transition-all text-sm font-medium text-slate-900 text-slate-900 appearance-none"
                  >
                    <option value="" disabled>— Select City —</option>
                    <option value="Gurugram">Gurugram</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Faridabad">Faridabad</option>
                    <option value="Noida">Noida</option>
                    <option value="Greater Noida">Greater Noida</option>
                  </select>
                </div>

                {/* Pin Code */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    PIN CODE *
                  </label>
                  <input 
                    type="text"
                    name="pinCode"
                    required
                    value={formData.pinCode}
                    onChange={handleChange}
                    placeholder="6-digit pin code"
                    className="w-full px-4 py-2.5 bg-[#fdf8f3] border border-transparent rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#C59D3F]/20 focus:border-[#C59D3F]/30 transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    PHONE NUMBER *
                  </label>
                  <input 
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-2.5 bg-[#fdf8f3] border border-transparent rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#C59D3F]/20 focus:border-[#C59D3F]/30 transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    EMAIL ADDRESS *
                  </label>
                  <input 
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2.5 bg-[#fdf8f3] border border-transparent rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#C59D3F]/20 focus:border-[#C59D3F]/30 transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    PASSWORD *
                  </label>
                  <input 
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="w-full px-4 py-2.5 bg-[#fdf8f3] border border-transparent rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#C59D3F]/20 focus:border-[#C59D3F]/30 transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 pb-2">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 rounded-xl border border-[#1a365d] text-sm font-bold text-[#1a365d] hover:bg-slate-50 transition-all"
                >
                  ← Back
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-[#c0922e] text-white text-sm font-bold hover:bg-[#a67d26] transition-all"
                >
                  Next: Review Terms →
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Blue Info Box */}
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                <span className="text-lg">📋</span>
                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                  Please read and accept our Disclaimer & Terms before proceeding. This is mandatory to use BrokersPost.
                </p>
              </div>

              {/* Scrollable Terms Content */}
              <div className="p-5 border border-slate-200 rounded-xl bg-[#FAF9F6] max-h-[300px] overflow-y-auto space-y-5">
                <h3 className="text-sm font-bold text-[#1a365d]">Important Disclaimer & Terms of Use — BrokersPost</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <span className="text-xs font-bold text-[#1a365d]">1.</span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <span className="font-bold text-[#1a365d]">No Liability:</span> BrokersPost is a networking platform that connects verified real estate brokers. We do not participate in any transaction between brokers. This site does not take any responsibility for disputes, financial losses, or any issues arising between brokers during or after a deal.
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <span className="text-xs font-bold text-[#1a365d]">2.</span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <span className="font-bold text-[#1a365d]">Independent Dealing:</span> Brokers are independent professionals. They may call and deal with each other directly. BrokersPost does not mediate, negotiate, or guarantee any transaction. All dealings happen independently between brokers at their own risk and discretion.
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <span className="text-xs font-bold text-[#1a365d]">3.</span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <span className="font-bold text-[#1a365d]">Genuine Listings Only:</span> Brokers must post only genuine, verified inventory that they have the authority to list. Fake, misleading, or unauthorized listings are strictly prohibited and may result in account termination.
                    </p>
                  </div>
                </div>
              </div>

              {/* Checkbox */}
              <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl bg-white cursor-pointer hover:border-[#C59D3F]/30 transition-colors">
                <input 
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-[#C59D3F] focus:ring-[#C59D3F]/20"
                />
                <span className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  I have read and understood all the above terms. I agree to the Disclaimer & Terms of Use of BrokersPost. I confirm that I am a registered professional broker and all listings I post will be genuine.
                </span>
              </label>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button 
                  onClick={handleBack}
                  className="px-8 py-3 rounded-xl border border-[#1a365d] text-sm font-bold text-[#1a365d] hover:bg-slate-50 transition-all"
                >
                  ← Back
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={!agreedToTerms}
                  className={`px-8 py-3 rounded-xl flex items-center gap-2 text-sm font-bold transition-all ${
                    agreedToTerms 
                    ? 'bg-[#c0922e] text-white hover:bg-[#a67d26]' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  ✔ Accept & Register
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
