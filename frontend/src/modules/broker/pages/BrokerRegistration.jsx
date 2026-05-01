import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Hash, 
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  FileText
} from 'lucide-react';
import Button from '../components/ui/Button';
import { api } from '../services/api';

const BrokerRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('brokerRegistrationData');
    return saved ? JSON.parse(saved) : {
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
      agreedToTerms: false
    };
  });

  // Save to localStorage whenever formData changes
  React.useEffect(() => {
    localStorage.setItem('brokerRegistrationData', JSON.stringify(formData));
  }, [formData]);

  const [otpData, setOtpData] = useState({
    otp: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    // Name validation: Letters only
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.firstName)) {
      newErrors.firstName = 'Invalid characters in name';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.lastName)) {
      newErrors.lastName = 'Invalid characters in name';
    }

    if (!formData.city) newErrors.city = 'Please select a city';
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.officeAddress) newErrors.officeAddress = 'Office address is required';
    if (!formData.officeCity) newErrors.officeCity = 'Office city is required';
    
    // Pin Code: Exactly 6 digits
    if (!formData.pinCode) {
      newErrors.pinCode = 'Pin code is required';
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = 'Must be exactly 6 digits';
    }

    // Phone Number: Exactly 10 digits
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Must be exactly 10 digits';
    }

    // Email Validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    // RERA Number: Alphanumeric
    if (formData.reraNumber && !/^[A-Z0-9]+$/i.test(formData.reraNumber)) {
      newErrors.reraNumber = 'Invalid RERA format (Alphanumeric only)';
    }

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'Agreement required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTP = () => {
    const newErrors = {};
    if (!otpData.otp || otpData.otp.length !== 6) newErrors.otp = 'Enter 6-digit OTP';
    if (!otpData.password || otpData.password.length < 6) newErrors.password = 'Min 6 characters';
    if (otpData.password !== otpData.confirmPassword) newErrors.confirmPassword = 'Passwords mismatch';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNumericInput = (field, value, length) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, length);
    setFormData({ ...formData, [field]: cleanValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        const response = await api.post('/auth/register', formData);
        if (response.success) {
          setShowOTP(true);
          setErrors({});
        } else {
          setErrors({ server: response.message });
        }
      } catch (err) {
        setErrors({ server: 'Connection to server failed' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (validateOTP()) {
      setLoading(true);
      try {
        const response = await api.post('/auth/verify-otp', {
          email: formData.email,
          otp: otpData.otp,
          password: otpData.password
        });
        if (response.success) {
          localStorage.removeItem('brokerRegistrationData');
          navigate('/login');
        } else {
          setErrors({ otp: response.message });
        }
      } catch (err) {
        setErrors({ server: 'Verification failed' });
      } finally {
        setLoading(false);
      }
    }
  };


  if (showOTP) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 p-8 md:p-12 space-y-8 animate-in slide-in-from-bottom-10 duration-500">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mx-auto mb-4">
              <Mail size={32} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Verify Email</h2>
            <p className="text-slate-500 font-medium">Code sent to <span className="text-slate-900 font-bold">{formData.email}</span></p>
          </div>

          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">OTP Code</label>
              <div className="relative">
                <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  maxLength="6"
                  placeholder="000000"
                  className={`w-full pl-12 pr-5 py-4 bg-slate-50 border ${errors.otp ? 'border-red-200' : 'border-slate-100'} rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all font-black text-2xl tracking-[10px] text-center text-slate-900`}
                  value={otpData.otp}
                  onChange={(e) => setOtpData({...otpData, otp: e.target.value.replace(/\D/g, '')})}
                />
              </div>
              {errors.otp && <p className="text-[10px] font-bold text-red-500 ml-2 italic">{errors.otp}</p>}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-4 bg-slate-50 border ${errors.password ? 'border-red-200' : 'border-slate-100'} rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all font-bold text-slate-900`}
                    value={otpData.password}
                    onChange={(e) => setOtpData({...otpData, password: e.target.value})}
                  />
                  <button 
                    type="button"
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] font-bold text-red-500 ml-2 italic">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-5 py-4 bg-slate-50 border ${errors.confirmPassword ? 'border-red-200' : 'border-slate-100'} rounded-2xl outline-none focus:bg-white focus:border-primary-200 transition-all font-bold text-slate-900`}
                    value={otpData.confirmPassword}
                    onChange={(e) => setOtpData({...otpData, confirmPassword: e.target.value})}
                  />
                </div>
                {errors.confirmPassword && <p className="text-[10px] font-bold text-red-500 ml-2 italic">{errors.confirmPassword}</p>}
              </div>
            </div>

            <Button 
              variant="primary" 
              className="w-full py-5 rounded-[24px] text-sm font-black uppercase tracking-[4px] shadow-2xl shadow-primary-600/30"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Complete Setup'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary-600 font-bold text-sm mb-4">
            <ArrowLeft size={16} /> Back
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Broker <span className="text-primary-600">Registration</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200/60 rounded-[40px] shadow-2xl p-8 md:p-12 space-y-10">
          {errors.server && <p className="text-xs font-bold text-red-500 text-center bg-red-50 py-3 rounded-xl">{errors.server}</p>}
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <User className="text-primary-600" size={24} />
              <h2 className="text-xl font-black text-slate-900 uppercase">Identity Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                <input 
                  type="text" 
                  placeholder="John"
                  className={`w-full px-5 py-4 bg-slate-50 border ${errors.firstName ? 'border-red-500' : 'border-slate-100'} rounded-2xl outline-none font-bold`}
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value.replace(/[^A-Za-z\s]/g, '')})}
                />
                {errors.firstName && <p className="text-[10px] font-bold text-red-500 ml-2 italic">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                <input 
                  type="text" 
                  placeholder="Doe"
                  className={`w-full px-5 py-4 bg-slate-50 border ${errors.lastName ? 'border-red-500' : 'border-slate-100'} rounded-2xl outline-none font-bold`}
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value.replace(/[^A-Za-z\s]/g, '')})}
                />
                {errors.lastName && <p className="text-[10px] font-bold text-red-500 ml-2 italic">{errors.lastName}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Operating City</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <select 
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold appearance-none"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  >
                    <option value="">Select city</option>
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

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Building2 className="text-blue-600" size={24} />
              <h2 className="text-xl font-black text-slate-900 uppercase">Business Profile</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
                <input 
                  type="text" 
                  placeholder="Registered company name"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
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
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold resize-none"
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
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
                  value={formData.officeCity}
                  onChange={(e) => setFormData({...formData, officeCity: e.target.value.replace(/[^A-Za-z\s]/g, '')})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Pin No.</label>
                <input 
                  type="text" 
                  placeholder="6-digit PIN"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
                  value={formData.pinCode}
                  onChange={(e) => handleNumericInput('pinCode', e.target.value, 6)}
                />
                {errors.pinCode && <p className="text-[10px] font-bold text-red-500 ml-2 italic">{errors.pinCode}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-purple-600" size={24} />
              <h2 className="text-xl font-black text-slate-900 uppercase">Contact & Compliance</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="10-digit mobile"
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
                    value={formData.phoneNumber}
                    onChange={(e) => handleNumericInput('phoneNumber', e.target.value, 10)}
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
                    placeholder="email@example.com"
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                {errors.email && <p className="text-[10px] font-bold text-red-500 ml-2 italic">{errors.email}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">RERA Number</label>
                <div className="relative">
                  <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="A518000XXXXX"
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
                    value={formData.reraNumber}
                    onChange={(e) => setFormData({...formData, reraNumber: e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <div className="space-y-4 mb-6">
              <label className="flex items-start gap-4 cursor-pointer p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary-200 transition-all">
                <div className="relative flex items-center mt-1">
                  <input 
                    type="checkbox" 
                    className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-300 checked:bg-primary-600 checked:border-primary-600 transition-all"
                    checked={formData.agreedToTerms}
                    onChange={(e) => setFormData({...formData, agreedToTerms: e.target.checked})}
                  />
                  <ShieldCheck className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-700">Terms & Privacy Key Agreement</p>
                  <p className="text-xs text-slate-500">I confirm that all information provided is accurate and I agree to the <span className="text-primary-600 underline">Terms of Service</span>.</p>
                </div>
              </label>
              {errors.agreedToTerms && <p className="text-[10px] font-bold text-red-500 ml-4 italic">{errors.agreedToTerms}</p>}
            </div>

            <Button 
              variant="primary" 
              className="w-full py-5 rounded-[24px] text-sm font-black uppercase tracking-[4px] shadow-2xl shadow-primary-600/30 flex items-center justify-center gap-3"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Submit Registration'}
              {!loading && <ChevronRight size={20} />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrokerRegistration;
