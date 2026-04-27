import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Hash, 
  Users, 
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import Button from '../components/ui/Button';

const BrokerRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    city: '',
    companyName: '',
    officeAddress: '',
    officeCity: '',
    pinCode: '',
    phoneNumber: '',
    email: '',
    reraNumber: '',
    associatedGroup: '',
    agreedToTerms: false
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.city) newErrors.city = 'Please select a city';
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.officeAddress) newErrors.officeAddress = 'Office address is required';
    if (!formData.officeCity) newErrors.officeCity = 'Office city is required';
    if (!formData.pinCode) {
      newErrors.pinCode = 'Pin code is required';
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = 'Invalid pin code (6 digits)';
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number (10 digits)';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    // RERA is optional but we can validate format if provided
    if (formData.reraNumber && formData.reraNumber.length < 5) {
      newErrors.reraNumber = 'Invalid RERA number format';
    }

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setIsSubmitted(true);
      }, 1500);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 p-10 text-center space-y-6 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-emerald-500" size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900">Registration Received!</h2>
          <p className="text-slate-500 font-medium">
            Your application has been submitted successfully. Our team will review your details and contact you shortly.
          </p>
          <div className="pt-4">
            <Button 
              variant="primary" 
              className="w-full py-4 rounded-2xl font-black uppercase tracking-widest"
              onClick={() => navigate('/login')}
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 selection:bg-primary-100">
      {/* Background Accents */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="space-y-1">
            <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary-600 transition-colors font-bold text-sm mb-4">
              <ArrowLeft size={16} />
              Back to Login
            </Link>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Broker <span className="text-primary-600">Registration</span>
            </h1>
            <p className="text-slate-500 font-medium">Complete your profile to join India's premium broker network.</p>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200/60 rounded-[40px] shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="p-8 md:p-12 space-y-10">
            
            {/* Section 1: Basic Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                  <User size={18} />
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Identity Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter first name"
                    className={`w-full px-5 py-4 bg-slate-50 border ${errors.firstName ? 'border-red-200 focus:ring-red-500/5' : 'border-slate-100 focus:ring-primary-500/5'} rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all font-bold text-slate-900`}
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                  {errors.firstName && <p className="text-[10px] font-bold text-red-500 ml-2 italic">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter last name"
                    className={`w-full px-5 py-4 bg-slate-50 border ${errors.lastName ? 'border-red-200 focus:ring-red-500/5' : 'border-slate-100 focus:ring-primary-500/5'} rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all font-bold text-slate-900`}
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                  {errors.lastName && <p className="text-[10px] font-bold text-red-500 ml-2 italic">{errors.lastName}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Operating City</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <select 
                      className={`w-full pl-12 pr-5 py-4 bg-slate-50 border ${errors.city ? 'border-red-200' : 'border-slate-100'} rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all font-bold text-slate-900 appearance-none`}
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    >
                      <option value="">Select a city</option>
                      <option value="Gurgaon">Gurgaon</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Noida">Noida</option>
                      <option value="Faridabad">Faridabad</option>
                      <option value="Ghaziabad">Ghaziabad</option>
                      <option value="Greater Noida">Greater Noida</option>
                    </select>
                  </div>
                  {errors.city && <p className="text-[10px] font-bold text-red-500 ml-2 italic">{errors.city}</p>}
                </div>
              </div>
            </div>

            {/* Section 2: Business Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Building2 size={18} />
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Business Profile</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your registered company name"
                    className={`w-full px-5 py-4 bg-slate-50 border ${errors.companyName ? 'border-red-200' : 'border-slate-100'} rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all font-bold text-slate-900`}
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  />
                  {errors.companyName && <p className="text-[10px] font-bold text-red-500 ml-2 italic">{errors.companyName}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Office Address</label>
                  <textarea 
                    rows="2"
                    placeholder="Complete office address"
                    className={`w-full px-5 py-4 bg-slate-50 border ${errors.officeAddress ? 'border-red-200' : 'border-slate-100'} rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all font-bold text-slate-900 resize-none`}
                    value={formData.officeAddress}
                    onChange={(e) => setFormData({...formData, officeAddress: e.target.value})}
                  />
                  {errors.officeAddress && <p className="text-[10px] font-bold text-red-500 ml-2 italic">{errors.officeAddress}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Office City</label>
                  <input 
                    type="text" 
                    placeholder="City"
                    className={`w-full px-5 py-4 bg-slate-50 border ${errors.officeCity ? 'border-red-200' : 'border-slate-100'} rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all font-bold text-slate-900`}
                    value={formData.officeCity}
                    onChange={(e) => setFormData({...formData, officeCity: e.target.value})}
                  />
                  {errors.officeCity && <p className="text-[10px] font-bold text-red-500 ml-2 italic">{errors.officeCity}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Pin No.</label>
                  <input 
                    type="text" 
                    placeholder="6-digit PIN"
                    className={`w-full px-5 py-4 bg-slate-50 border ${errors.pinCode ? 'border-red-200' : 'border-slate-100'} rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all font-bold text-slate-900`}
                    value={formData.pinCode}
                    onChange={(e) => setFormData({...formData, pinCode: e.target.value})}
                  />
                  {errors.pinCode && <p className="text-[10px] font-bold text-red-500 ml-2 italic">{errors.pinCode}</p>}
                </div>
              </div>
            </div>

            {/* Section 3: Contact & Legal */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                  <ShieldCheck size={18} />
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Contact & Compliance</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      placeholder="10-digit mobile"
                      className={`w-full pl-12 pr-5 py-4 bg-slate-50 border ${errors.phoneNumber ? 'border-red-200' : 'border-slate-100'} rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all font-bold text-slate-900`}
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    />
                  </div>
                  {errors.phoneNumber && <p className="text-[10px] font-bold text-red-500 ml-2 italic">{errors.phoneNumber}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="email" 
                      placeholder="professional@email.com"
                      className={`w-full pl-12 pr-5 py-4 bg-slate-50 border ${errors.email ? 'border-red-200' : 'border-slate-100'} rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all font-bold text-slate-900`}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  {errors.email && <p className="text-[10px] font-bold text-red-500 ml-2 italic">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">RERA Registration Number</label>
                  <div className="relative">
                    <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      placeholder="A518000XXXXX"
                      className={`w-full pl-12 pr-5 py-4 bg-slate-50 border ${errors.reraNumber ? 'border-red-200' : 'border-slate-100'} rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all font-bold text-slate-900`}
                      value={formData.reraNumber}
                      onChange={(e) => setFormData({...formData, reraNumber: e.target.value})}
                    />
                  </div>
                  {errors.reraNumber && <p className="text-[10px] font-bold text-red-500 ml-2 italic">{errors.reraNumber}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Associated Group</label>
                  <div className="relative">
                    <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      placeholder="e.g. NAR-India, CREDAI"
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all font-bold text-slate-900"
                      value={formData.associatedGroup}
                      onChange={(e) => setFormData({...formData, associatedGroup: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <div className="space-y-4 mb-6">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center mt-1">
                    <input 
                      type="checkbox" 
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:bg-primary-600 checked:border-primary-600 focus:outline-none"
                      checked={formData.agreedToTerms}
                      onChange={(e) => setFormData({...formData, agreedToTerms: e.target.checked})}
                    />
                    <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-xs font-medium text-slate-500 group-hover:text-slate-700 transition-colors leading-relaxed">
                    I agree to the <span className="text-primary-600 font-bold hover:underline">Terms of Service</span> and <span className="text-primary-600 font-bold hover:underline">Privacy Policy</span>. I understand that my information will be used to process my broker application.
                  </span>
                </label>
                {errors.agreedToTerms && <p className="text-[10px] font-bold text-red-500 ml-8 italic">{errors.agreedToTerms}</p>}
              </div>

              <Button 
                variant="primary" 
                className="w-full py-5 rounded-[24px] text-sm font-black uppercase tracking-[4px] shadow-2xl shadow-primary-600/30 flex items-center justify-center gap-3"
                type="submit"
                disabled={loading}
                rightIcon={!loading && <ChevronRight size={20} />}
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing Application...
                  </div>
                ) : (
                  'Submit Registration'
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-12 text-center pb-10">
          <p className="text-xs font-black text-slate-300 uppercase tracking-[4px]">© 2026 Brokerpost Network • Verified Professional Gateway</p>
        </div>
      </div>
    </div>
  );
};

export default BrokerRegistration;
