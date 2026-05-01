import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Filter, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { listings } from '../data/listings';

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

  const propertyTypeOptions = useMemo(() => {
    const options = new Set(listings.map((item) => item.type));
    return ['All Property Types', ...Array.from(options)];
  }, []);

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.broker.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'All Types' || item.flow === typeFilter;
      const matchesPropertyType =
        propertyTypeFilter === 'All Property Types' || item.type === propertyTypeFilter;
      const matchesTransaction =
        transactionFilter === 'All Transactions' || item.transaction === transactionFilter;
      const matchesGroup = groupFilter === 'All Groups' || item.group === groupFilter;
      const matchesBhk = bhkFilter === 'All BHK' || `${item.beds} BHK` === bhkFilter;
      const matchesStatus = statusFilter === 'All Status' || 
                           (statusFilter === 'Ready to Move' && item.status === 'Active') ||
                           (statusFilter === 'Under Construction' && item.status === 'Pending');
      
      let matchesBudget = true;
      if (budgetFilter !== 'All Budgets') {
        const price = item.price;
        if (budgetFilter === 'Under 50L') matchesBudget = price < 5000000;
        else if (budgetFilter === '50L - 1Cr') matchesBudget = price >= 5000000 && price <= 10000000;
        else if (budgetFilter === '1Cr - 5Cr') matchesBudget = price > 10000000 && price <= 50000000;
        else if (budgetFilter === 'Above 5Cr') matchesBudget = price > 50000000;
      }

      return matchesSearch && matchesType && matchesPropertyType && matchesTransaction && matchesGroup && matchesBhk && matchesStatus && matchesBudget;
    });
  }, [searchTerm, typeFilter, propertyTypeFilter, transactionFilter, groupFilter, bhkFilter, statusFilter, budgetFilter]);

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
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-[#f8fafc] text-slate-500">
              <tr className="border-b border-[#e5edf6]">
                <th className="px-5 py-5 text-left text-[13px] font-semibold">Type ↑↓</th>
                <th className="px-5 py-5 text-left text-[13px] font-semibold">Property Type ↑↓</th>
                <th className="px-5 py-5 text-left text-[13px] font-semibold">Transaction ↑↓</th>
                <th className="px-5 py-5 text-left text-[13px] font-semibold">Location ↑↓</th>
                <th className="px-5 py-5 text-left text-[13px] font-semibold">Society Name ↑</th>
                <th className="px-5 py-5 text-left text-[13px] font-semibold">Broker Name ↑↓</th>
                <th className="px-5 py-5 text-left text-[13px] font-semibold">Phone No. ↑↓</th>
                <th className="px-5 py-5 text-left text-[13px] font-semibold uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredListings.map((item, index) => (
                <tr key={item.id} className={`border-b border-slate-100 last:border-b-0 transition-colors ${index % 2 === 1 ? 'bg-white' : 'bg-white'}`}>
                  <td className="px-5 py-6">
                    <Badge
                      variant={item.flow === 'Availability' ? 'success' : 'warning'}
                      className={`rounded-full px-4 py-1.5 text-[11px] font-bold ${
                        item.flow === 'Availability'
                          ? 'border-[#86efac] bg-[#ecfdf5] text-emerald-700'
                          : 'border-[#fde68a] bg-[#fffbeb] text-amber-600'
                      }`}
                    >
                      {item.flow}
                    </Badge>
                  </td>
                  <td className="px-5 py-6 text-[15px] font-semibold text-slate-700">{item.type}</td>
                  <td className="px-5 py-6 text-[15px] text-slate-700">{item.transaction}</td>
                  <td className="px-5 py-6 text-[15px] text-slate-700">{item.location.split(',')[0]}</td>
                  <td className="px-5 py-6 text-[15px] font-semibold text-slate-900">{item.title}</td>
                  <td className="px-5 py-6 text-[15px] text-slate-700">{item.broker}</td>
                  <td className="px-5 py-6 text-[15px] text-slate-700">
                    {(() => {
                      const phone = phoneByBroker[item.broker];
                      if (!phone) return '-';
                      return `${phone.slice(0, 2)}******${phone.slice(-2)}`;
                    })()}
                  </td>
                  <td className="px-5 py-6">
                    <Link to={`/property/${item.id}`}>
                      <Button
                        variant="primary"
                        className="bg-[#ff7a00] hover:bg-[#ef6f00] text-white px-4 py-2.5 text-[13px] font-bold shadow-[0_8px_18px_rgba(255,122,0,0.22)] rounded-xl"
                        leftIcon={<Eye size={14} />}
                      >
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
