import React, { useState } from 'react';
import { Search, X, Check, UserPlus } from 'lucide-react';
import Modal from '../../../broker/components/ui/Modal';
import Button from '../../../broker/components/ui/Button';
import { getAllBrokers } from '../../services/brokerService';

const CreateGroupModal = ({ isOpen, onClose, onCreate }) => {
  const [groupName, setGroupName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrokers, setSelectedBrokers] = useState([]);
  const [brokersList, setBrokersList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBrokers = async () => {
    setLoading(true);
    try {
      const result = await getAllBrokers();
      if (result.success) {
        setBrokersList(result.data);
      }
    } catch (error) {
      console.error('Fetch brokers error:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) fetchBrokers();
  }, [isOpen]);

  const filteredBrokers = brokersList.filter(b => 
    `${b.firstName} ${b.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.operatingCity && b.operatingCity.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleBroker = (broker) => {
    if (selectedBrokers.find(b => b._id === broker._id)) {
      setSelectedBrokers(selectedBrokers.filter(b => b._id !== broker._id));
    } else {
      setSelectedBrokers([...selectedBrokers, broker]);
    }
  };


  const handleCreate = () => {
    if (!groupName.trim()) {
      alert('Please enter a group name');
      return;
    }
    if (selectedBrokers.length === 0) {
      alert('Please select at least one broker');
      return;
    }
    onCreate({
      name: groupName,
      members: selectedBrokers,
      createdAt: new Date().toISOString(),
    });
    setGroupName('');
    setSelectedBrokers([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Official Group"
    >
      <div className="space-y-6">
        {/* Group Name */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Group Name</label>
          <input 
            type="text" 
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g. South Mumbai Luxury Network"
            className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-8 focus:ring-primary-500/5 focus:border-primary-200 outline-none font-bold text-slate-900 transition-all"
          />
        </div>

        {/* Broker Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Brokers</label>
            <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">
              {selectedBrokers.length} Selected
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search brokers by name or location..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary-500/5 outline-none text-sm font-medium transition-all"
            />
          </div>

          {/* Selected Pills */}
          {selectedBrokers.length > 0 && (
            <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2">
              {selectedBrokers.map(b => (
                <div key={b._id} className="flex items-center gap-1 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                  {b.firstName}
                  <button onClick={() => toggleBroker(b)} className="hover:text-red-400 transition-colors">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* List */}
          <div className="max-h-[300px] overflow-y-auto border border-slate-50 rounded-2xl divide-y divide-slate-50 custom-scrollbar">
            {loading ? (
              <div className="p-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Brokers...</div>
            ) : filteredBrokers.length > 0 ? (
              filteredBrokers.map(b => {
                const isSelected = selectedBrokers.find(sb => sb._id === b._id);
                return (
                  <div 
                    key={b._id} 
                    onClick={() => toggleBroker(b)}
                    className={`p-4 flex items-center justify-between cursor-pointer transition-all ${isSelected ? 'bg-primary-50/50' : 'hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs shadow-sm">
                        {b.firstName?.[0]}{b.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{b.firstName} {b.lastName}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{b.operatingCity || 'No Location'} • {b.companyName || 'Independent'}</p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-600/20' : 'border-slate-100 bg-white'}`}>
                      {isSelected && <Check size={14} />}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-400 font-medium">No brokers found matching "{searchTerm}"</p>
              </div>
            )}
          </div>

        </div>

        <div className="pt-4 flex gap-3">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="flex-1 py-4 font-black uppercase tracking-widest text-[11px]"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCreate}
            className="flex-2 py-4 px-12 bg-primary-600 text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary-600/20"
          >
            Create Group
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateGroupModal;
