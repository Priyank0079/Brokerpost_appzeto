import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Filter, Search, SlidersHorizontal } from 'lucide-react';
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
};

const MyListings = ({
  title = 'My Listings',
  subtitle = 'Manage your residential posts and requirements.',
}) => {
  const navigate = useNavigate();
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
      const result = await getMyPostings({ postType: 'AVAILABILITY' });
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

  const handleApplyFilters = () => {};

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            variant="primary"
            onClick={() => navigate('/post-property?type=RESIDENTIAL')}
            className="flex-1 sm:flex-initial bg-primary-600 hover:bg-primary-700 text-white shadow-xl shadow-primary-600/20 font-bold"
          >
            Post Residential
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/post-property?type=COMMERCIAL')}
            className="flex-1 sm:flex-initial bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20 font-bold"
          >
            Post Commercial
          </Button>
        </div>
      </div>

      <div className="rounded-[24px] bg-white p-4 md:p-5 shadow-[0_10px_40px_rgba(15,23,42,0.05)] border border-slate-100">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by location, society, broker..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none focus:border-primary-400"
            />
          </div>

          <Button
            variant="primary"
            onClick={handleApplyFilters}
            className="h-[48px] min-w-[220px] bg-orange-500 hover:bg-orange-600 shadow-none text-white font-semibold"
            leftIcon={<Search size={18} />}
          >
            Search
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary-400"
          >
            <option>All Types</option>
            <option>Availability</option>
            <option>Requirement</option>
          </select>

          <select
            value={propertyTypeFilter}
            onChange={(e) => setPropertyTypeFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary-400"
          >
            {propertyTypeOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>

            <select
              value={transactionFilter}
              onChange={(e) => setTransactionFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary-400"
            >
              <option>All Transactions</option>
              <option>Sale</option>
              <option>Rent</option>
            </select>

            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary-400"
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
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary-400"
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
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary-400"
            >
              <option>All Status</option>
              <option>Ready to Move</option>
              <option>Under Construction</option>
            </select>

            <select
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary-400"
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
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary-400"
            >
              <option>All Units</option>
              <option>Sq. Ft.</option>
              <option>Sq. Yd.</option>
              <option>Sq. Mt.</option>
            </select>

            <Button
              variant="outline"
              onClick={handleApplyFilters}
              className="h-[48px] border-primary-200 text-primary-600 font-semibold"
              leftIcon={<Filter size={16} />}
            >
              Apply Filters
            </Button>
          </div>
      </div>

      <Card noPadding className="overflow-hidden border-slate-200 shadow-[0_14px_50px_rgba(15,23,42,0.06)]">
        <div className="hidden lg:block">
          <table className="w-full border-collapse">
            <thead className="bg-slate-700 text-white">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-bold">Type</th>
                <th className="px-4 py-4 text-left text-sm font-bold">Property Type</th>
                <th className="px-4 py-4 text-left text-sm font-bold">Transaction</th>
                <th className="px-4 py-4 text-left text-sm font-bold">Location</th>
                <th className="px-4 py-4 text-left text-sm font-bold">Society Name</th>
                <th className="px-4 py-4 text-left text-sm font-bold">Broker Name</th>
                <th className="px-4 py-4 text-left text-sm font-bold">Phone No.</th>
                <th className="px-4 py-4 text-left text-sm font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <tr><td colSpan="8" className="px-4 py-8 text-center text-slate-400">Loading your listings...</td></tr>
              ) : filteredListings.length === 0 ? (
                <tr><td colSpan="8" className="px-4 py-8 text-center text-slate-400">No listings found</td></tr>
              ) : (
                filteredListings.map((item) => (
                  <tr key={item._id} className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-4">
                      <Badge variant="success" className="rounded-full px-3 py-1 text-[11px] font-bold">AVAILABILITY</Badge>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-slate-700">{SUBTYPE_DISPLAY_MAP[item.subType]}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{INTENT_MAP[item.intent]}</td>
                    <td className="px-4 py-4 text-sm text-slate-600 truncate max-w-[150px]">{item.location}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-900">{item.project || '-'}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">Me</td>
                    <td className="px-4 py-4 text-sm text-slate-600">Locked</td>
                    <td className="px-4 py-4">
                      <Link to={`/property/${item._id}`}>
                        <Button
                          variant="primary"
                          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-xs font-bold shadow-none"
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

          {filteredListings.length === 0 && (
            <div className="p-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                <SlidersHorizontal size={28} />
              </div>
              <h3 className="text-lg font-black text-slate-900">No posts found</h3>
              <p className="mt-1 text-sm text-slate-500">Try adjusting the filters or search terms.</p>
            </div>
          )}
        </div>

        <div className="space-y-4 p-4 lg:hidden">
          {loading ? (
            <div className="py-10 text-center text-slate-400 font-bold">Syncing your inventory...</div>
          ) : filteredListings.length === 0 ? (
            <div className="py-10 text-center text-slate-400 font-bold">No postings found</div>
          ) : (
            filteredListings.map((item) => (
              <div key={item._id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge variant="success" className="rounded-full px-3 py-1 text-[11px] font-bold">AVAILABILITY</Badge>
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
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Price</p>
                    <p className="font-medium text-slate-700">₹{item.totalAmount} {item.totalAmountUnit}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <div className="flex items-center justify-center gap-2 pt-2">
        <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500">
          Previous
        </button>
        <button className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-bold text-white">1</button>
        <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500">
          Next
        </button>
      </div>
    </div>
  );
};

export default MyListings;
