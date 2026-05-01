import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  Trash2,
  Loader2,
  Briefcase,
  Globe,
  FileText
} from 'lucide-react';
import { api } from '../../broker/services/api';
import Card from '../../broker/components/ui/Card';
import Button from '../../broker/components/ui/Button';

const BrokerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [broker, setBroker] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBroker = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/auth/brokers/${id}`);
      if (response.success) {
        setBroker(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch broker:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBroker();
  }, [id]);

  const handleAction = async (action) => {
    if (action === 'delete') {
      if (!window.confirm('Are you sure you want to delete this account?')) return;
      const response = await api.delete(`/auth/brokers/${id}`);
      if (response.success) navigate('/admin/brokers');
    } else if (action === 'approve') {
      const response = await api.patch(`/auth/brokers/${id}/status`, { isVerified: true });
      if (response.success) fetchBroker();
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Profile...</p>
      </div>
    );
  }

  if (!broker) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">Broker not found</h2>
        <Button onClick={() => navigate('/admin/brokers')} className="mt-4">Back to List</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors group"
      >
        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:border-slate-300 shadow-sm">
          <ArrowLeft size={16} />
        </div>
        Back to Directory
      </button>

      {/* Header Profile Card */}
      <Card className="p-8 border-slate-100 shadow-xl shadow-slate-200/20">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="w-32 h-32 rounded-[40px] bg-primary-50 border-4 border-white shadow-xl flex items-center justify-center text-4xl font-black text-primary-600 relative shrink-0">
            {broker.firstName?.charAt(0)}
            <div className={`absolute -bottom-1 -right-1 w-10 h-10 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg ${broker.isVerified ? 'bg-emerald-500' : 'bg-amber-500'}`}>
              {broker.isVerified ? <CheckCircle2 size={18} className="text-white" /> : <ShieldCheck size={18} className="text-white" />}
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">{broker.firstName} {broker.lastName}</h1>
                <p className="text-slate-400 font-bold uppercase tracking-[2px] text-xs mt-1 flex items-center gap-2">
                  <Briefcase size={14} className="text-primary-500" />
                  {broker.role} • Registered Since {new Date(broker.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {!broker.isVerified && (
                  <Button variant="primary" onClick={() => handleAction('approve')} className="shadow-lg shadow-primary-500/20">Approve Broker</Button>
                )}
                <Button variant="danger" onClick={() => handleAction('delete')} className="bg-red-50 text-red-500 border-red-100 hover:bg-red-500 hover:text-white">Delete</Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <ContactBadge icon={<Mail />} value={broker.email} />
              <ContactBadge icon={<Phone />} value={broker.phoneNumber} />
              <ContactBadge icon={<MapPin />} value={broker.operatingCity} />
            </div>
          </div>
        </div>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <Building2 size={20} className="text-primary-600" />
              Professional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <InfoItem label="Company Name" value={broker.companyName} />
              <InfoItem label="Operating City" value={broker.operatingCity} />
              <InfoItem label="RERA Registration" value={broker.reraNumber || 'Not Registered'} isCopyable />
              <InfoItem label="Employee ID / Key" value={broker._id} isCopyable />
            </div>
          </Card>

          <Card className="p-8 border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <FileText size={20} className="text-primary-600" />
              Office & Location
            </h3>
            <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Registered Office Address</p>
                <p className="text-lg font-bold text-slate-700 leading-relaxed italic">
                  "{broker.officeAddress}, {broker.officeCity} - {broker.pinCode}"
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoItem label="Office City" value={broker.officeCity} />
                <InfoItem label="Pin Code" value={broker.pinCode} />
                <InfoItem label="State/Region" value="Maharashtra" />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="p-6 border-slate-100 bg-slate-900 text-white">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-4">Account Status</h4>
             <div className="flex items-center justify-between mb-6">
               <span className="text-sm font-bold">Email Verified</span>
               {broker.isEmailVerified ? <CheckCircle2 size={18} className="text-emerald-400" /> : <ShieldCheck size={18} className="text-amber-400" />}
             </div>
             <div className="flex items-center justify-between mb-8">
               <span className="text-sm font-bold">Profile Verified</span>
               {broker.isVerified ? <CheckCircle2 size={18} className="text-emerald-400" /> : <ShieldCheck size={18} className="text-amber-400" />}
             </div>
             <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 border-none">Send Login Link</Button>
          </Card>

          <Card className="p-6 border-slate-100">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-6">Active Subscriptions</h4>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                 <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-amber-700 uppercase tracking-widest">Gold Plan</p>
                    <span className="text-[10px] font-black bg-white px-2 py-1 rounded-lg text-amber-600 shadow-sm">ACTIVE</span>
                 </div>
                 <p className="text-xs text-amber-600 mt-2 font-medium">Expires in 28 days</p>
              </div>
              <button className="w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors">Manage Subscriptions</button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ContactBadge = ({ icon, value }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
    {React.cloneElement(icon, { size: 14, className: "text-slate-400" })}
    <span className="text-xs font-bold text-slate-600">{value}</span>
  </div>
);

const InfoItem = ({ label, value, isCopyable }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <div className="flex items-center justify-between">
      <p className="text-sm font-bold text-slate-900">{value}</p>
      {isCopyable && <button className="text-[10px] font-black text-primary-600 hover:underline">COPY</button>}
    </div>
  </div>
);

export default BrokerDetail;
