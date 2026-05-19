import React, { useState, useEffect } from 'react';
import { Search, Users, Phone, ArrowUpRight, Loader2 } from 'lucide-react';
import { getGroups } from '../services/groupService';
import { getPostings } from '../services/postingService';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  // Postings states
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [groupSearch, setGroupSearch] = useState('');

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await getGroups();
      if (response.success) {
        setGroups(response.data);
        if (response.data && response.data.length > 0) {
          setSelectedGroup(response.data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupListings = async (groupId) => {
    setListingsLoading(true);
    try {
      const response = await getPostings({ groupId });
      if (response.success) {
        setListings(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch group listings:', err);
    } finally {
      setListingsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupListings(selectedGroup._id);
    }
  }, [selectedGroup]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-[#c8962a]" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synchronizing Groups...</p>
        </div>
      </div>
    );
  }

  // Format Helper Functions
  const renderSubTypeBadge = (subType) => {
    const s = subType ? subType.toUpperCase() : '';
    let bg = 'bg-slate-50 text-slate-600 border-slate-100';
    let label = subType || '';
    if (s.includes('PLOT')) {
      bg = 'bg-[#ecfdf5] text-[#047857] border-[#d1fae5]';
      label = 'Plots';
    } else if (s.includes('APARTMENTS') || s.includes('OFFICE')) {
      bg = 'bg-[#eff6ff] text-[#1d4ed8] border-[#dbeafe]';
      label = 'Apartments';
    } else if (s.includes('LOW_RISE') || s.includes('SHOP') || s.includes('SHOWROOM')) {
      bg = 'bg-[#faf5ff] text-[#7e22ce] border-[#f3e8ff]';
      label = 'Low Rise Floors';
    } else if (s.includes('VILLA') || s.includes('KOTHI') || s.includes('BUILDING')) {
      bg = 'bg-[#e0e7ff] text-[#4338ca] border-[#c7d2fe]';
      label = 'Kothi/Villas';
    }
    return (
      <span className={`px-3 py-1 rounded-full text-[10.5px] font-bold tracking-tight border ${bg}`}>
        {label}
      </span>
    );
  };

  const formatSection = (listing) => {
    const v = listing.vertical === 'RESIDENTIAL' ? 'Residential' : 'Commercial';
    let intentText = '';
    switch (listing.intent) {
      case 'SALE':
        intentText = 'Available for Sale';
        break;
      case 'RENT':
      case 'RENTALS':
        intentText = 'Available for Rental';
        break;
      case 'PURCHASE':
        intentText = 'Wanted on Purchase';
        break;
      case 'LEASE':
        intentText = 'Available for Lease';
        break;
      case 'WANTED_RENT':
        intentText = 'Wanted on Rent';
        break;
      case 'WANTED_LEASE':
        intentText = 'Wanted on Lease';
        break;
      default:
        intentText = listing.intent || '';
    }
    return `${v} · ${intentText}`;
  };

  const formatArea = (listing) => {
    if (!listing.size) return 'N/A';
    const unit = listing.sizeUnit === 'SQ_FT' ? 'Sq.Ft' : (listing.sizeUnit === 'SQ_YD' ? 'Sq.Yd' : (listing.sizeUnit === 'SQ_MT' ? 'Sq.Mt' : listing.sizeUnit));
    return `${listing.size} ${unit}`;
  };

  const formatTotalPrice = (listing) => {
    if (listing.totalAmount) {
      return `₹${Number(listing.totalAmount).toLocaleString('en-IN')}`;
    }
    if (listing.budgetMin || listing.budgetMax) {
      if (listing.budgetMin && listing.budgetMax) {
        return `₹${listing.budgetMin}-${listing.budgetMax} L`;
      }
      return `₹${listing.budgetMin || listing.budgetMax} L`;
    }
    return 'On Request';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Filter listings client side based on the search bar
  const filteredListings = listings.filter(item => {
    const term = groupSearch.toLowerCase().trim();
    if (!term) return true;
    return (
      (item.location && item.location.toLowerCase().includes(term)) ||
      (item.project && item.project.toLowerCase().includes(term)) ||
      (item.subType && item.subType.toLowerCase().includes(term)) ||
      (item.postedBy && (
        (item.postedBy.firstName && item.postedBy.firstName.toLowerCase().includes(term)) ||
        (item.postedBy.lastName && item.postedBy.lastName.toLowerCase().includes(term)) ||
        (item.postedBy.companyName && item.postedBy.companyName.toLowerCase().includes(term))
      ))
    );
  });

  // Calculate dynamic leader from group members or fallback
  const getLeaderInfo = () => {
    if (!selectedGroup || !selectedGroup.members || selectedGroup.members.length === 0) {
      return { name: 'PRIYANK', phone: '9876543210' };
    }
    const lead = selectedGroup.members.find(m => m.firstName?.toUpperCase().includes('PRIYANK')) || selectedGroup.members[0];
    return {
      name: `${lead.firstName} ${lead.lastName || ''}`.toUpperCase().trim(),
      phone: lead.phoneNumber || '9876543210'
    };
  };

  const leader = getLeaderInfo();

  return (
    <div className="-mx-4 md:-mx-6 lg:-mx-10 -my-4 md:-my-6 lg:-my-10 px-4 md:px-6 lg:px-10 py-4 md:py-6 lg:py-10 bg-[#faf7f2] min-h-screen">
      <div className="space-y-6 pb-10">
        
        {/* Title and Subtitle */}
        <div>
          <h1 className="text-2xl font-normal font-serif text-[#0d1b2a]">My Groups</h1>
          <p className="text-sm text-[#718199] mt-1">Live inventory from your assigned broker groups</p>
        </div>

        {/* Group Tab Switcher (if user is in multiple groups) */}
        {groups.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {groups.map((g) => (
              <button
                key={g._id}
                onClick={() => setSelectedGroup(g)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  selectedGroup?._id === g._id
                    ? 'bg-[#c8962a] border-[#c8962a] text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        )}

        {/* Selected Group Card View */}
        {selectedGroup ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                   {/* Card Header (Dynamic Group Metadata & Members) */}
             <div className="card-head flex items-center justify-between border-b border-slate-200 px-[18px] py-[12px] gap-4">
               <div className="space-y-1">
                 <h2 className="text-[13px] font-bold text-[#1e3a5f] uppercase tracking-wide">
                   {selectedGroup.name}
                 </h2>
                 
                 <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 font-medium">
                   <span>{selectedGroup.members?.length || 0} members</span>
                   <span className="text-slate-350">•</span>
                   <span>{listings.length} listings</span>
                   <span className="text-slate-350">•</span>
                   <span>{formatDate(selectedGroup.createdAt)}</span>
                 </div>
 
                 <div className="pt-0.5 flex items-center gap-2 text-[11px] font-bold text-slate-700">
                   <span className="text-slate-400">👤 Leader:</span>
                   <span className="text-[#0d1b2a]">{leader.name}</span>
                   <span className="text-slate-400 ml-2">📞</span>
                   <span className="text-[#c8962a]">{leader.phone}</span>
                 </div>
               </div>
 
               {/* Members Pill list */}
               <div className="flex max-w-full md:max-w-md" style={{ flexWrap: 'wrap', gap: '8px' }}>
                 {selectedGroup.members?.map((member) => (
                   <span 
                     key={member._id}
                     className="px-3.5 py-1 bg-[#eff6ff] border border-[#dbeafe] text-[11px] font-bold text-[#1d4ed8] rounded-full tracking-tight"
                   >
                     {member.firstName}
                   </span>
                 ))}
               </div>
             </div>

            {/* Filter Bar (Search within this group) */}
            <div className="p-4 bg-white border-b border-slate-150">
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="Search listings in this group..."
                  value={groupSearch}
                  onChange={(e) => setGroupSearch(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 bg-[#faf7f2] border border-slate-200 rounded-lg text-[11px] font-medium outline-none focus:border-[#eab308]/30 transition-all text-slate-600 placeholder-[#9c7f84] tracking-tighter"
                />
              </div>
            </div>

            {/* Listings Tabular Inventory */}
            <div className="overflow-x-auto flex-1">
              {listingsLoading ? (
                <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
                  <Loader2 size={40} className="animate-spin text-[#c8962a]" />
                  <p className="text-sm font-bold uppercase tracking-widest">Fetching inventory...</p>
                </div>
              ) : filteredListings.length > 0 ? (
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-[#FAF9F6] border-b border-slate-150 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                      <th className="py-4 px-6 text-center w-12">#</th>
                      <th className="py-4 px-4 w-36">Sub-Type ↕</th>
                      <th className="py-4 px-4">Section ↕</th>
                      <th className="py-4 px-4">Location ↕</th>
                      <th className="py-4 px-4">Project</th>
                      <th className="py-4 px-4">Area</th>
                      <th className="py-4 px-4">Total Price ↕</th>
                      <th className="py-4 px-4">Broker</th>
                      <th className="py-4 px-4">Date ↕</th>
                      <th className="py-4 px-6 text-center w-40">Connect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredListings.map((listing, idx) => {
                      const broker = listing.postedBy || {};
                      const brokerName = `${broker.firstName || ''} ${broker.lastName || ''}`.trim() || 'Anonymous';
                      const brokerPhone = broker.phoneNumber || '';
                      
                      return (
                        <tr key={listing._id} className="hover:bg-slate-50/40 transition-colors text-[12px] text-slate-700">
                          {/* Index */}
                          <td className="py-4 px-6 text-center font-bold text-slate-400">{idx + 1}</td>
                          
                          {/* Sub-type Badge */}
                          <td className="py-4 px-4">{renderSubTypeBadge(listing.subType)}</td>
                          
                          {/* Section */}
                          <td className="py-4 px-4 text-slate-500 font-medium">{formatSection(listing)}</td>

                          {/* Location */}
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-bold text-slate-900">{listing.location || 'N/A'}</div>
                              <div className="text-[10.5px] text-slate-400 mt-0.5 font-medium">{listing.city || 'Gurugram'}</div>
                            </div>
                          </td>
                          
                          {/* Project */}
                          <td className="py-4 px-4 font-semibold text-slate-800">{listing.project || '—'}</td>

                          {/* Area */}
                          <td className="py-4 px-4 font-semibold text-slate-800">{formatArea(listing)}</td>

                          {/* Price */}
                          <td className="py-4 px-4 font-bold text-slate-900">{formatTotalPrice(listing)}</td>

                          {/* Broker Profile */}
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-bold text-slate-900">{brokerName}</div>
                              <div className="text-[10.5px] text-slate-400 mt-0.5 font-medium">{broker.companyName || 'Private Broker'}</div>
                              
                              {/* Extra contact tags matching mockup */}
                              <div className="flex gap-1.5 mt-1.5">
                                <button
                                  onClick={() => {
                                    if (brokerPhone) {
                                      window.open(`https://wa.me/91${brokerPhone.replace(/\D/g, '')}`, '_blank');
                                    }
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#25D366] hover:bg-[#20ba56] text-white text-[9.5px] font-extrabold rounded-full transition-all tracking-tight shadow-sm"
                                >
                                  <span className="w-1 h-1 bg-white rounded-full"></span>
                                  WA
                                </button>
                                <button
                                  onClick={() => {
                                    if (brokerPhone) {
                                      window.open(`tel:${brokerPhone}`, '_self');
                                    }
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#e6f4fe] hover:bg-[#d0ebfe] text-[#0066cc] border border-[#b3dbfc] text-[9.5px] font-extrabold rounded-full transition-all tracking-tight"
                                >
                                  📞 Call
                                </button>
                              </div>
                            </div>
                          </td>

                          {/* Date */}
                          <td className="py-4 px-4 font-medium text-slate-500">{formatDate(listing.createdAt)}</td>

                          {/* Connect Actions */}
                          <td className="py-4 px-6 text-center">
                            <div className="flex flex-col gap-1.5 w-28 mx-auto">
                              {/* WhatsApp Button */}
                              <button 
                                onClick={() => {
                                  if (brokerPhone) {
                                    window.open(`https://wa.me/91${brokerPhone.replace(/\D/g, '')}`, '_blank');
                                  } else {
                                    alert('Phone number missing');
                                  }
                                }}
                                className="w-full py-1.5 bg-[#25D366] hover:bg-[#20ba56] text-white flex items-center justify-center gap-1.5 rounded-full font-bold text-[10.5px] shadow-sm transition-all"
                              >
                                WhatsApp
                              </button>

                              {/* Call Button */}
                              <button 
                                onClick={() => {
                                  if (brokerPhone) {
                                    window.open(`tel:${brokerPhone}`, '_self');
                                  } else {
                                    alert('Phone number missing');
                                  }
                                }}
                                className="w-full py-1.5 bg-[#e6f4fe] hover:bg-[#d0ebfe] text-[#0066cc] border border-[#b3dbfc] flex items-center justify-center gap-1.5 rounded-full font-bold text-[10.5px] transition-all"
                              >
                                Call
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="py-24 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-[#fefce8] rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl opacity-60">📋</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-black">No listings found in this group</h3>
                  <p className="text-slate-400 text-xs mt-2">Try changing your search term or add listings to your profile.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-xl border border-slate-200 shadow-sm mt-6">
            <div className="w-16 h-16 bg-[#e2e8f0] rounded-full flex items-center justify-center mb-4">
              <Users size={32} className="text-[#94a3b8]" />
            </div>
            <h3 className="text-sm font-bold text-[#0f172a]">No groups assigned</h3>
            <p className="text-xs text-[#718199] mt-1">Contact admin to be added to a group</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
