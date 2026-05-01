import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Filter, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { listings as staticListings } from '../data/listings';
import { getMyPostings } from '../services/postingService';

const INTENT_MAP = {
  'PURCHASE': 'Sale',
  'RENT': 'Rent',
  'SALE': 'Sale',
  'RENTALS': 'Rent',
  'LEASE': 'Lease'
};

const SUBTYPE_DISPLAY_MAP = {
  'APARTMENTS': 'Apartments',
  'LOW_RISE_FLOORS': 'Low Rise Floors',
  'KOTHI_VILLAS': 'Kothi / Villas',
  'PLOTS': 'Plots',
  'SHOP_SHOWROOM': 'Shop / Showroom',
  'OFFICE': 'Office',
  'WAREHOUSE': 'Warehouse',
  'STANDALONE_BUILDING': 'Standalone Building',
  'PLOT': 'Plot',
  'COMMERCIAL_APARTMENTS': 'Apartments (Com)'
};

const phoneByBroker = {
  'John Doe': '9876543210',
  'Jane Smith': '8765432109',
  'Amit Sharma': '9123456780',
  'Priya Verma': '9988776655',
  'Suresh Raina': '8899776655',
  'Rajesh Malhotra': '9876501122',
  'Neha Gupta': '9822334455',
  'Mike Wilson': '9001122334',
};

const MyRequirements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('All Property Types');
  const [transactionFilter, setTransactionFilter] = useState('All Transactions');
  const [groupFilter, setGroupFilter] = useState('All Groups');
  const [bhkFilter, setBhkFilter] = useState('All BHK');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [budgetFilter, setBudgetFilter] = useState('All Budgets');
  const [unitFilter, setUnitFilter] = useState('All Units');

  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getMyPostings({ postType: 'REQUIREMENT' });
      if (result.success) {
        setPostings(result.data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const propertyTypeOptions = useMemo(() => {
    return ['All Property Types', ...Object.values(SUBTYPE_DISPLAY_MAP)];
  }, []);

  const filteredListings = useMemo(() => {
    return postings.filter((item) => {
      const matchesSearch =
        (item.project || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = 
        typeFilter === 'All Types' || 
        (typeFilter === 'Availability' && item.postType === 'AVAILABILITY') ||
        (typeFilter === 'Requirement' && item.postType === 'REQUIREMENT');

      const matchesPropertyType =
        propertyTypeFilter === 'All Property Types' || SUBTYPE_DISPLAY_MAP[item.subType] === propertyTypeFilter;
      
      const matchesTransaction =
        transactionFilter === 'All Transactions' || INTENT_MAP[item.intent] === transactionFilter;
      
      const matchesBHK = 
        bhkFilter === 'All BHK' || (item.bedrooms === bhkFilter.split(' ')[0]);

      const matchesStatus = 
        statusFilter === 'All Status' || 
        (statusFilter === 'Ready to Move' && item.constructionStatus === 'READY') ||
        (statusFilter === 'Under Construction' && item.constructionStatus === 'UNDER_CONSTRUCTION');
      
      return matchesSearch && matchesType && matchesPropertyType && matchesTransaction && matchesBHK && matchesStatus;
    });
  }, [postings, searchTerm, typeFilter, propertyTypeFilter, transactionFilter, bhkFilter, statusFilter]);

  return (
    <div className="space-y-6 bg-[#f8fafc]">
      <div className="rounded-[28px] bg-white p-4 md:p-5 shadow-[0_12px_45px_rgba(15,23,42,0.06)] border border-slate-100">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by location, society, broker..."
              className="w-full rounded-2xl border border-[#dbe4f0] bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#ff7a00] focus:ring-4 focus:ring-[#ff7a00]/10"
            />
          </div>

          <Button
            variant="primary"
            className="h-[60px] min-w-[280px] bg-[#ff7a00] hover:bg-[#ef6f00] shadow-[0_12px_24px_rgba(255,122,0,0.22)] text-white font-semibold rounded-2xl"
            leftIcon={<Search size={18} />}
          >
            Search
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-4 text-[16px] text-slate-700 outline-none focus:border-[#ff7a00] focus:ring-4 focus:ring-[#ff7a00]/10"
          >
            <option>All Types</option>
            <option>Availability</option>
            <option>Requirement</option>
          </select>

          <select
            value={propertyTypeFilter}
            onChange={(e) => setPropertyTypeFilter(e.target.value)}
            className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-4 text-[16px] text-slate-700 outline-none focus:border-[#ff7a00] focus:ring-4 focus:ring-[#ff7a00]/10"
          >
            {propertyTypeOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>

          <select
            value={transactionFilter}
            onChange={(e) => setTransactionFilter(e.target.value)}
            className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-4 text-[16px] text-slate-700 outline-none focus:border-[#ff7a00] focus:ring-4 focus:ring-[#ff7a00]/10"
          >
            <option>All Transactions</option>
            <option>Sale</option>
            <option>Rent</option>
          </select>

          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-4 text-[16px] text-slate-700 outline-none focus:border-[#ff7a00] focus:ring-4 focus:ring-[#ff7a00]/10"
          >
            <option value="All Groups">All Groups</option>
            <option value="Mumbai Luxury Brokers">Mumbai Luxury Brokers</option>
            <option value="South Delhi Top Agents">South Delhi Top Agents</option>
            <option value="Bangalore Tech Park Deals">Bangalore Tech Park Deals</option>
          </select>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
          <select
            value={bhkFilter}
            onChange={(e) => setBhkFilter(e.target.value)}
            className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-4 text-[16px] text-slate-700 outline-none focus:border-[#ff7a00] focus:ring-4 focus:ring-[#ff7a00]/10"
          >
            <option>All BHK</option>
            <option>1 BHK</option>
            <option>2 BHK</option>
            <option>3 BHK</option>
            <option>4 BHK</option>
            <option>5 BHK</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-4 text-[16px] text-slate-700 outline-none focus:border-[#ff7a00] focus:ring-4 focus:ring-[#ff7a00]/10"
          >
            <option>All Status</option>
            <option>Ready to Move</option>
            <option>Under Construction</option>
          </select>

          <select
            value={budgetFilter}
            onChange={(e) => setBudgetFilter(e.target.value)}
            className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-4 text-[16px] text-slate-700 outline-none focus:border-[#ff7a00] focus:ring-4 focus:ring-[#ff7a00]/10"
          >
            <option>All Budgets</option>
            <option>Under 50L</option>
            <option>50L - 1Cr</option>
            <option>1Cr - 5Cr</option>
            <option>Above 5Cr</option>
          </select>

          <select
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-4 text-[16px] text-slate-700 outline-none focus:border-[#ff7a00] focus:ring-4 focus:ring-[#ff7a00]/10"
          >
            <option>All Units</option>
            <option>Sq. Ft.</option>
            <option>Sq. Yd.</option>
            <option>Sq. Mt.</option>
          </select>

          <Button
            variant="outline"
            className="h-[60px] rounded-2xl border-[#dbe4f0] text-slate-700 font-semibold hover:border-[#ff7a00]/30 hover:text-slate-900"
            leftIcon={<Filter size={16} />}
          >
            Apply Filters
          </Button>
        </div>
      </div>

      <Card noPadding className="overflow-hidden border-[#dbe4f0] shadow-[0_14px_50px_rgba(15,23,42,0.06)]">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-[#f8fafc] text-slate-500">
              <tr className="border-b border-[#e5edf6]">
                <th className="px-5 py-5 text-left text-[13px] font-semibold uppercase tracking-wider">Type</th>
                <th className="px-5 py-5 text-left text-[13px] font-semibold uppercase tracking-wider">Property Type</th>
                <th className="px-5 py-5 text-left text-[13px] font-semibold uppercase tracking-wider">Transaction</th>
                <th className="px-5 py-5 text-left text-[13px] font-semibold uppercase tracking-wider">Location</th>
                <th className="px-5 py-5 text-left text-[13px] font-semibold uppercase tracking-wider">Society/Project</th>
                <th className="px-5 py-5 text-left text-[13px] font-semibold uppercase tracking-wider">Broker</th>
                <th className="px-5 py-5 text-left text-[13px] font-semibold uppercase tracking-wider">Phone</th>
                <th className="px-5 py-5 text-left text-[13px] font-semibold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <tr><td colSpan="8" className="px-5 py-10 text-center text-slate-400 font-bold">Fetching requirements...</td></tr>
              ) : filteredListings.length === 0 ? (
                <tr><td colSpan="8" className="px-5 py-10 text-center text-slate-400">No requirements found</td></tr>
              ) : (
                filteredListings.map((item) => (
                  <tr key={item._id} className="border-b border-slate-100 last:border-b-0 transition-colors hover:bg-slate-50/50">
                    <td className="px-5 py-6">
                      <Badge variant="warning" className="rounded-full px-4 py-1.5 text-[11px] font-bold border-[#fde68a] bg-[#fffbeb] text-amber-600 uppercase tracking-tighter">REQUIREMENT</Badge>
                    </td>
                    <td className="px-5 py-6 text-[14px] font-bold text-slate-700">{SUBTYPE_DISPLAY_MAP[item.subType]}</td>
                    <td className="px-5 py-6 text-[14px] font-medium text-slate-600">{INTENT_MAP[item.intent]}</td>
                    <td className="px-5 py-6 text-[14px] text-slate-600 truncate max-w-[150px]">{item.location}</td>
                    <td className="px-5 py-6 text-[14px] font-bold text-slate-900">{item.project || '-'}</td>
                    <td className="px-5 py-6 text-[14px] font-medium text-slate-600">Me</td>
                    <td className="px-5 py-6 text-[14px] text-slate-400 italic">Locked</td>
                    <td className="px-5 py-6">
                      <Link to={`/property/${item._id}`}>
                        <Button
                          variant="primary"
                          className="bg-[#ff7a00] hover:bg-[#ef6f00] text-white px-4 py-2 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 rounded-xl"
                          leftIcon={<Eye size={14} />}
                        >
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="space-y-4 p-4 lg:hidden">
          {loading ? (
            <div className="py-10 text-center text-slate-400 font-bold">Fetching your requirements...</div>
          ) : filteredListings.length === 0 ? (
            <div className="py-10 text-center text-slate-400 font-bold">No requirements found</div>
          ) : (
            filteredListings.map((item) => (
              <div key={item._id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge variant="warning" className="rounded-full px-4 py-1.5 text-[11px] font-bold border-[#fde68a] bg-[#fffbeb] text-amber-600">REQUIREMENT</Badge>
                    <h3 className="mt-3 text-base font-bold text-slate-900">{item.project || 'No Project'}</h3>
                    <p className="text-sm text-slate-500">{item.location}</p>
                  </div>
                  <Link to={`/property/${item._id}`}>
                    <Button variant="outline" className="px-3 py-2 text-xs font-bold">
                      View
                    </Button>
                  </Link>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Property Type</p>
                    <p className="font-medium text-slate-700">{SUBTYPE_DISPLAY_MAP[item.subType]}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Intent</p>
                    <p className="font-medium text-slate-700">{INTENT_MAP[item.intent]}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Size</p>
                    <p className="font-medium text-slate-700">{item.size} {item.sizeUnit === 'SQ_FT' ? 'sq.ft' : 'sq.yd'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Budget</p>
                    <p className="font-medium text-slate-700">₹{item.budgetMin}-{item.budgetMax} {item.budgetUnit}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredListings.length === 0 && (
          <div className="p-16 text-center">
            <h3 className="text-lg font-black text-slate-900">No posts found</h3>
            <p className="mt-1 text-sm text-slate-500">Try adjusting the filters or search terms.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MyRequirements;
