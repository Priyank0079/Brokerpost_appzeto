import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle, 
  Ban, 
  Eye, 
  Trash2,
  Phone,
  Mail,
  MapPin,
  Users,
  Building2,
  ShieldCheck,
  Calendar,
  X,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../broker/components/ui/Card';
import { AdminTable, AdminTableRow, AdminTableCell, StatusBadge, ActionButton } from '../components/common/AdminUI';
import { api } from '../../broker/services/api';
import Button from '../../broker/components/ui/Button';

const Brokers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [brokerList, setBrokerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { id, action, name }

  const fetchBrokers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/brokers');
      if (response.success) {
        setBrokerList(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch brokers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrokers();
  }, []);

  // Prevent scroll when any modal is open
  useEffect(() => {
    if (selectedBroker || confirmAction) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedBroker, confirmAction]);

  const handleProcessAction = async () => {
    if (!confirmAction) return;
    const { id, action } = confirmAction;

    try {
      if (action === 'delete') {
        const response = await api.delete(`/auth/brokers/${id}`);
        if (response.success) {
          setBrokerList(prev => prev.filter(b => b._id !== id));
        }
      } else if (action === 'approve' || action === 'reject') {
        const response = await api.patch(`/auth/brokers/${id}/status`, {
          isVerified: action === 'approve'
        });
        if (response.success) {
          setBrokerList(prev => prev.map(b => 
            b._id === id ? { ...b, isVerified: action === 'approve' } : b
          ));
        }
      }
      setConfirmAction(null);
      setSelectedBroker(null);
    } catch (err) {
      alert('Action failed. Please try again.');
    }
  };

  const filteredBrokers = brokerList.filter(b => {
    const fullName = `${b.firstName} ${b.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || (b.email && b.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const status = b.isVerified ? 'Approved' : 'Pending';
    const matchesFilter = filterStatus === 'All' || status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Broker Management</h1>
           <p className="text-slate-500 text-sm mt-1">Review, approve, and manage registered broker accounts.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600" size={16} />
              <input 
                type="text" 
                placeholder="Search name or email..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
              {['All', 'Approved', 'Pending', 'Blocked'].map(s => (
                <button 
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filterStatus === s ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  {s}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Main Table Card */}
      <Card noPadding className="border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
         <AdminTable headers={["Broker Details", "Contact Information", "Office Info", "Status", "Actions"]}>
             {filteredBrokers.map(b => (
                <AdminTableRow 
                  key={b._id} 
                  className="cursor-pointer" 
                  onClick={() => navigate(`/admin/brokers/${b._id}`)}
                >
                   <AdminTableCell>
                     <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm font-black border border-slate-200 shadow-sm transition-transform group-hover:scale-105">
                           {b.firstName?.charAt(0) || 'B'}
                        </div>
                        <div>
                           <p className="text-sm font-black text-slate-900">{b.firstName} {b.lastName}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-1">
                              <MapPin size={10} className="text-primary-500" />
                              {b.operatingCity}
                           </p>
                        </div>
                     </div>
                  </AdminTableCell>
                  <AdminTableCell>
                      <div className="space-y-1">
                         <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                            <Phone size={12} className="text-slate-400" />
                            {b.phoneNumber}
                         </div>
                         <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                            <Mail size={12} className="text-slate-400" />
                            {b.email}
                         </div>
                      </div>
                  </AdminTableCell>
                  <AdminTableCell>
                    <div className="space-y-1 text-xs text-slate-600 font-medium">
                      <p className="font-bold text-slate-900">{b.companyName}</p>
                      <p>{b.officeCity}</p>
                    </div>
                  </AdminTableCell>
                  <AdminTableCell>
                    <StatusBadge type={b.isVerified ? 'Approved' : 'Pending'} />
                  </AdminTableCell>
                  <AdminTableCell>
                     <div className="flex items-center gap-1">
                        <ActionButton 
                          icon={<Eye size={16} />} 
                          label="View Details" 
                          variant="primary" 
                          onClick={() => navigate(`/admin/brokers/${b._id}`)}
                        />
                        {!b.isVerified ? (
                           <>
                              <ActionButton 
                                icon={<CheckCircle2 size={16} />} 
                                label="Approve" 
                                variant="success" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmAction({ id: b._id, action: 'approve', name: `${b.firstName} ${b.lastName}` });
                                }}
                              />
                              <ActionButton 
                                icon={<Trash2 size={16} />} 
                                label="Reject / Delete" 
                                variant="danger" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmAction({ id: b._id, action: 'delete', name: `${b.firstName} ${b.lastName}` });
                                }}
                              />
                           </>
                        ) : (
                          <ActionButton 
                            icon={<Trash2 size={16} />} 
                            label="Delete Account" 
                            variant="danger" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmAction({ id: b._id, action: 'delete', name: `${b.firstName} ${b.lastName}` });
                            }}
                          />
                        )}
                     </div>
                  </AdminTableCell>
               </AdminTableRow>
            ))}
         </AdminTable>

         {loading ? (
            <div className="p-20 text-center space-y-4">
              <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Brokers...</p>
            </div>
         ) : filteredBrokers.length === 0 && (
           <div className="p-20 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-200">
                 <Users size={40} />
              </div>
              <div>
                 <h4 className="text-lg font-bold text-slate-900">No brokers found</h4>
                 <p className="text-sm text-slate-400">Try adjusting your search or filters.</p>
              </div>
           </div>
         )}
         
         <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Showing {filteredBrokers.length} Brokers</p>
            <div className="flex items-center gap-2">
               <button className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-all">Previous</button>
               <button className="px-3 py-1.5 text-[10px] font-black uppercase bg-white border border-slate-200 rounded-lg shadow-sm text-slate-900">1</button>
               <button className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-all">Next</button>
            </div>
         </div>
      </Card>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-6" onClick={() => setConfirmAction(null)}>
          <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200 text-center space-y-6" onClick={e => e.stopPropagation()}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${confirmAction.action === 'delete' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
              {confirmAction.action === 'delete' ? <AlertTriangle size={40} /> : <CheckCircle2 size={40} />}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Confirm {confirmAction.action}</h3>
              <p className="text-sm text-slate-500 font-medium">Are you sure you want to {confirmAction.action} <span className="font-bold text-slate-900">{confirmAction.name}</span>?</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={() => setConfirmAction(null)}
                className="flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleProcessAction}
                className={`flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-xl transition-all ${confirmAction.action === 'delete' ? 'bg-red-500 shadow-red-500/20 hover:bg-red-600' : 'bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600'}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Broker Details Modal */}
      {selectedBroker && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-900">Broker Profile</h2>
              <button onClick={() => setSelectedBroker(null)} className="p-2 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-100">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            
            <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-3xl bg-primary-50 flex items-center justify-center text-3xl font-black text-primary-600 border-2 border-primary-100">
                  {selectedBroker.firstName?.charAt(0) || 'B'}
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">{selectedBroker.firstName} {selectedBroker.lastName}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                      <ShieldCheck size={12} className="text-primary-500" />
                      {selectedBroker.role}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${selectedBroker.isVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {selectedBroker.isVerified ? 'Verified Account' : 'Verification Pending'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] border-b border-slate-50 pb-2">Business Information</h4>
                  <div className="space-y-3">
                    <DetailItem icon={<Building2 />} label="Company" value={selectedBroker.companyName} />
                    <DetailItem icon={<MapPin />} label="Operating City" value={selectedBroker.operatingCity} />
                    <DetailItem icon={<ShieldCheck />} label="RERA Number" value={selectedBroker.reraNumber || 'Not Provided'} />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] border-b border-slate-50 pb-2">Contact Details</h4>
                  <div className="space-y-3">
                    <DetailItem icon={<Mail />} label="Email" value={selectedBroker.email} />
                    <DetailItem icon={<Phone />} label="Mobile" value={selectedBroker.phoneNumber} />
                    <DetailItem icon={<Calendar />} label="Joined Date" value={new Date(selectedBroker.createdAt).toLocaleDateString()} />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] border-b border-slate-50 pb-2">Office Address</h4>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">
                      {selectedBroker.officeAddress}, {selectedBroker.officeCity} - {selectedBroker.pinCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={() => setSelectedBroker(null)} className="text-xs font-black uppercase tracking-widest">Close</Button>
              {!selectedBroker.isVerified && (
                <Button variant="primary" className="text-xs font-black uppercase tracking-widest" onClick={() => setConfirmAction({ id: selectedBroker._id, action: 'approve', name: `${selectedBroker.firstName} ${selectedBroker.lastName}` })}>Approve Broker</Button>
              )}
              <Button variant="danger" className="text-xs font-black uppercase tracking-widest" onClick={() => setConfirmAction({ id: selectedBroker._id, action: 'delete', name: `${selectedBroker.firstName} ${selectedBroker.lastName}` })}>Delete Account</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400">
      {React.cloneElement(icon, { size: 14 })}
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

export default Brokers;
